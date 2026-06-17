import { Controller, Get, Post, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiInsightService } from './ai-insights.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('ai-insights')
@UseGuards(AuthGuard('jwt'))
export class AiInsightController {
  constructor(private aiInsightService: AiInsightService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.aiInsightService.findAll(userId);
  }

  @Post('generate')
  generate(@CurrentUser('id') userId: string) {
    return this.aiInsightService.generate(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.aiInsightService.remove(id, userId);
  }
}
