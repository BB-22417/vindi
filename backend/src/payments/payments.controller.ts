import { Controller, Get, Post, Body, Req, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PlanTier } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-checkout-session')
  @UseGuards(AuthGuard('jwt'))
  createCheckoutSession(
    @CurrentUser('id') userId: string,
    @Body('planTier') planTier: PlanTier,
  ) {
    return this.paymentsService.createCheckoutSession(userId, planTier);
  }

  @Post('create-paypal-order')
  @UseGuards(AuthGuard('jwt'))
  createPayPalOrder(
    @CurrentUser('id') userId: string,
    @Body('planTier') planTier: PlanTier,
  ) {
    return this.paymentsService.createPayPalOrder(userId, planTier);
  }

  @Public()
  @Post('stripe-webhook')
  handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleStripeWebhook(req.body, signature);
  }

  @Public()
  @Post('paypal-webhook')
  handlePayPalWebhook(@Req() req: Request) {
    return this.paymentsService.handlePayPalWebhook(req.body);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  getHistory(@CurrentUser('id') userId: string) {
    return this.paymentsService.getHistory(userId);
  }
}
