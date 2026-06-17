import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlanTier, SubscriptionStatus } from '@prisma/client';

const PLAN_FEATURES: Record<PlanTier, { name: string; price: number; features: string[] }> = {
  BASIC: {
    name: 'Basic',
    price: 3.99,
    features: [
      'Daily symptom tracking',
      'Basic analytics',
      'Vindi Score',
      'Cycle tracking',
    ],
  },
  PREMIUM: {
    name: 'Premium',
    price: 9.99,
    features: [
      'Everything in Basic',
      'AI-powered insights',
      'PDF/CSV reports',
      'Symptom heatmap & trends',
      'Intervention analysis',
    ],
  },
  PREMIUM_PLUS: {
    name: 'Premium Plus',
    price: 19.99,
    features: [
      'Everything in Premium',
      'Community access',
      'Priority support',
      'Advanced analytics',
      'Data export (all formats)',
      'Custom report generation',
    ],
  },
};

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    return PLAN_FEATURES;
  }

  async getCurrent(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return {
        plan: 'FREE',
        status: 'ACTIVE',
        features: [],
        trialEnd: null,
      };
    }

    return {
      ...subscription,
      planDetails: PLAN_FEATURES[subscription.plan],
    };
  }

  async upgrade(userId: string, newPlan: PlanTier) {
    const currentSub = await this.prisma.subscription.findUnique({ where: { userId } });

    if (currentSub && currentSub.status === 'ACTIVE') {
      const planOrder = { BASIC: 0, PREMIUM: 1, PREMIUM_PLUS: 2 };
      if (planOrder[newPlan] <= planOrder[currentSub.plan]) {
        throw new BadRequestException('New plan must be higher than current plan');
      }
    }

    return {
      message: `Upgrade to ${newPlan} initiated. Please complete payment.`,
      plan: newPlan,
      price: PLAN_FEATURES[newPlan].price,
    };
  }

  async downgrade(userId: string, newPlan: PlanTier) {
    const currentSub = await this.prisma.subscription.findUnique({ where: { userId } });

    if (!currentSub || currentSub.status !== 'ACTIVE') {
      throw new BadRequestException('No active subscription to downgrade');
    }

    const planOrder = { BASIC: 0, PREMIUM: 1, PREMIUM_PLUS: 2 };
    if (planOrder[newPlan] >= planOrder[currentSub.plan]) {
      throw new BadRequestException('New plan must be lower than current plan');
    }

    const subscription = await this.prisma.subscription.update({
      where: { userId },
      data: { plan: newPlan },
    });

    return { message: `Downgraded to ${newPlan}`, subscription };
  }

  async cancel(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { userId } });

    if (!subscription) {
      throw new NotFoundException('No subscription found');
    }

    const updated = await this.prisma.subscription.update({
      where: { userId },
      data: {
        status: 'CANCELLED',
        canceledAt: new Date(),
      },
    });

    return { message: 'Subscription cancelled. You will have access until the end of the billing period.', subscription: updated };
  }

  async reactivate(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { userId } });

    if (!subscription || subscription.status !== 'CANCELLED') {
      throw new BadRequestException('No cancelled subscription to reactivate');
    }

    const updated = await this.prisma.subscription.update({
      where: { userId },
      data: {
        status: 'ACTIVE',
        canceledAt: null,
      },
    });

    return { message: 'Subscription reactivated', subscription: updated };
  }
}
