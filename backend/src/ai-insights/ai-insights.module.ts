import { Module } from '@nestjs/common';
import { AiInsightController } from './ai-insights.controller';
import { AiInsightService } from './ai-insights.service';

@Module({
  controllers: [AiInsightController],
  providers: [AiInsightService],
  exports: [AiInsightService],
})
export class AiInsightModule {}
