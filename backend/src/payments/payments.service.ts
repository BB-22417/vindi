import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentProvider, PlanTier, SubscriptionStatus } from '@prisma/client';

const PLAN_PRICES: Record<PlanTier, { stripePriceId: string; amount: number; paypalPlanId: string }> = {
  BASIC: { stripePriceId: 'price_basic', amount: 399, paypalPlanId: 'paypal_basic' },
  PREMIUM: { stripePriceId: 'price_premium', amount: 999, paypalPlanId: 'paypal_premium' },
  PREMIUM_PLUS: { stripePriceId: 'price_premium_plus', amount: 1999, paypalPlanId: 'paypal_premium_plus' },
};

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: any = null;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const stripeKey = this.configService.get('STRIPE_SECRET_KEY');
    if (stripeKey) {
      try {
        this.stripe = new (require('stripe'))(stripeKey);
      } catch (e) {
        this.logger.warn('Stripe initialization failed. Stripe payments will not work.');
      }
    }
  }

  async createCheckoutSession(userId: string, planTier: PlanTier) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    const planConfig = PLAN_PRICES[planTier];
    if (!planConfig) throw new BadRequestException('Invalid plan');

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Vindi ${planTier} Plan` },
            unit_amount: planConfig.amount,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/payment/cancel`,
      metadata: { userId, planTier },
    });

    return { url: session.url, sessionId: session.id };
  }

  async createPayPalOrder(userId: string, planTier: PlanTier) {
    const paypalClientId = this.configService.get('PAYPAL_CLIENT_ID');
    const paypalSecret = this.configService.get('PAYPAL_CLIENT_SECRET');

    if (!paypalClientId || !paypalSecret) {
      throw new BadRequestException('PayPal is not configured');
    }

    const planConfig = PLAN_PRICES[planTier];
    if (!planConfig) throw new BadRequestException('Invalid plan');

    const auth = Buffer.from(`${paypalClientId}:${paypalSecret}`).toString('base64');
    const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: 'USD', value: (planConfig.amount / 100).toFixed(2) },
            custom_id: `${userId}:${planTier}`,
          },
        ],
      }),
    });

    const order = await response.json();
    return { orderId: order.id, status: order.status };
  }

  async handleStripeWebhook(body: any, signature: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    let event;

    try {
      event = this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, planTier } = session.metadata;

        await this.prisma.payment.create({
          data: {
            userId,
            amount: session.amount_total / 100,
            currency: session.currency.toUpperCase(),
            status: 'completed',
            provider: 'STRIPE',
            providerPaymentId: session.payment_intent,
            invoiceUrl: session.invoice,
          },
        });

        await this.prisma.subscription.upsert({
          where: { userId },
          update: {
            plan: planTier,
            status: 'ACTIVE',
            provider: 'STRIPE',
            providerSubscriptionId: session.subscription,
            currentPeriodStart: new Date(session.created * 1000),
            currentPeriodEnd: new Date((session.created + 2592000) * 1000),
          },
          create: {
            userId,
            plan: planTier,
            status: 'ACTIVE',
            provider: 'STRIPE',
            providerSubscriptionId: session.subscription,
            currentPeriodStart: new Date(session.created * 1000),
            currentPeriodEnd: new Date((session.created + 2592000) * 1000),
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const existingSub = await this.prisma.subscription.findFirst({
          where: { providerSubscriptionId: subscription.id },
        });
        if (existingSub) {
          await this.prisma.subscription.update({
            where: { id: existingSub.id },
            data: { status: 'CANCELLED', canceledAt: new Date() },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subId = invoice.subscription;
        const existingSub = await this.prisma.subscription.findFirst({
          where: { providerSubscriptionId: subId },
        });
        if (existingSub) {
          await this.prisma.subscription.update({
            where: { id: existingSub.id },
            data: { status: 'PAST_DUE' },
          });
        }
        break;
      }
    }

    return { received: true };
  }

  async handlePayPalWebhook(body: any) {
    const eventType = body.event_type;

    if (eventType === 'CHECKOUT.ORDER.APPROVED') {
      const resource = body.resource;
      const customId = resource.purchase_units?.[0]?.custom_id || '';

      if (customId) {
        const [userId, planTier] = customId.split(':');

        await this.prisma.payment.create({
          data: {
            userId,
            amount: parseFloat(resource.purchase_units[0].amount.value),
            currency: resource.purchase_units[0].amount.currency_code,
            status: 'completed',
            provider: 'PAYPAL',
            providerPaymentId: resource.id,
          },
        });

        await this.prisma.subscription.upsert({
          where: { userId },
          update: {
            plan: planTier as PlanTier,
            status: 'ACTIVE',
            provider: 'PAYPAL',
            providerSubscriptionId: resource.id,
          },
          create: {
            userId,
            plan: planTier as PlanTier,
            status: 'ACTIVE',
            provider: 'PAYPAL',
            providerSubscriptionId: resource.id,
          },
        });
      }
    }

    return { received: true };
  }

  async getHistory(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
