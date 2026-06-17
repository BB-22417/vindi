import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard(@CurrentUser('id') userId: string) {
    return this.analyticsService.getDashboard(userId);
  }

  @Get('mood-vs-sleep')
  getMoodVsSleep(
    @CurrentUser('id') userId: string,
    @Query('days') days?: number,
  ) {
    return this.analyticsService.getMoodVsSleep(userId, days || 30);
  }

  @Get('brain-fog')
  getBrainFog(
    @CurrentUser('id') userId: string,
    @Query('days') days?: number,
  ) {
    return this.analyticsService.getBrainFog(userId, days || 30);
  }

  @Get('hot-flashes')
  getHotFlashes(
    @CurrentUser('id') userId: string,
    @Query('days') days?: number,
  ) {
    return this.analyticsService.getHotFlashes(userId, days || 30);
  }

  @Get('weight')
  getWeight(
    @CurrentUser('id') userId: string,
    @Query('days') days?: number,
  ) {
    return this.analyticsService.getWeight(userId, days || 90);
  }

  @Get('summary')
  getSummary(
    @CurrentUser('id') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getSummary(userId, startDate, endDate);
  }
}
