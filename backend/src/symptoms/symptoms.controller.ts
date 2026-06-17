import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SymptomsService } from './symptoms.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SymptomSeverity } from '@prisma/client';

@Controller('symptoms')
@UseGuards(AuthGuard('jwt'))
export class SymptomsController {
  constructor(private symptomsService: SymptomsService) {}

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() data: { dailyLogId: string; symptomType: string; severity: SymptomSeverity; timeOfDay?: string; duration?: number; notes?: string },
  ) {
    return this.symptomsService.create(userId, data);
  }

  @Get()
  findAll(
    @CurrentUser('id') userId: string,
    @Query('dailyLogId') dailyLogId?: string,
  ) {
    return this.symptomsService.findAll(userId, dailyLogId);
  }

  @Get('heatmap')
  getHeatmap(
    @CurrentUser('id') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.symptomsService.getHeatmap(userId, startDate, endDate);
  }

  @Get('clusters')
  getClusters(
    @CurrentUser('id') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.symptomsService.getClusters(userId, startDate, endDate);
  }

  @Get('trends')
  getTrends(
    @CurrentUser('id') userId: string,
    @Query('days') days?: number,
  ) {
    return this.symptomsService.getTrends(userId, days || 30);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.symptomsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() data: any,
  ) {
    return this.symptomsService.update(id, userId, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.symptomsService.remove(id, userId);
  }
}
