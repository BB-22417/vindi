import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionsService } from './subscriptions.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PlanTier } from '@prisma/client';

@Controller('subscriptions')
@UseGuards(AuthGuard('jwt'))
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('current')
  getCurrent(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.getCurrent(userId);
  }

  @Post('upgrade')
  upgrade(
    @CurrentUser('id') userId: string,
    @Body('plan') plan: PlanTier,
  ) {
    return this.subscriptionsService.upgrade(userId, plan);
  }

  @Post('downgrade')
  downgrade(
    @CurrentUser('id') userId: string,
    @Body('plan') plan: PlanTier,
  ) {
    return this.subscriptionsService.downgrade(userId, plan);
  }

  @Post('cancel')
  cancel(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.cancel(userId);
  }

  @Post('reactivate')
  reactivate(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.reactivate(userId);
  }
}
