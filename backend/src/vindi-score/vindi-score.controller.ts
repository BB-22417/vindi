import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VindiScoreService } from './vindi-score.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('vindi-score')
@UseGuards(AuthGuard('jwt'))
export class VindiScoreController {
  constructor(private vindiScoreService: VindiScoreService) {}

  @Get('current')
  getCurrent(@CurrentUser('id') userId: string) {
    return this.vindiScoreService.getCurrent(userId);
  }

  @Get('history')
  getHistory(
    @CurrentUser('id') userId: string,
    @Query('days') days?: number,
  ) {
    return this.vindiScoreService.getHistory(userId, days || 30);
  }

  @Post('calculate')
  calculate(@CurrentUser('id') userId: string) {
    return this.vindiScoreService.calculate(userId);
  }
}
