import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CyclesService } from './cycles.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CyclePhase } from '@prisma/client';

@Controller('cycles')
@UseGuards(AuthGuard('jwt'))
export class CyclesController {
  constructor(private cyclesService: CyclesService) {}

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() data: { startDate: string; endDate?: string; spotting?: boolean; flowIntensity?: number; phase: CyclePhase; symptoms?: string; notes?: string },
  ) {
    return this.cyclesService.create(userId, data);
  }

  @Get()
  findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.cyclesService.findAll(userId, page, limit);
  }

  @Get('irregularity')
  getIrregularity(@CurrentUser('id') userId: string) {
    return this.cyclesService.getIrregularity(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.cyclesService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() data: any,
  ) {
    return this.cyclesService.update(id, userId, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.cyclesService.remove(id, userId);
  }
}
