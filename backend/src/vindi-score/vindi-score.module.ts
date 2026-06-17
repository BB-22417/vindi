import { Module } from '@nestjs/common';
import { VindiScoreController } from './vindi-score.controller';
import { VindiScoreService } from './vindi-score.service';

@Module({
  controllers: [VindiScoreController],
  providers: [VindiScoreService],
  exports: [VindiScoreService],
})
export class VindiScoreModule {}
