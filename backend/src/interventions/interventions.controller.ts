import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InterventionsService } from './interventions.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InterventionType } from '@prisma/client';

@Controller('interventions')
@UseGuards(AuthGuard('jwt'))
export class InterventionsController {
  constructor(private interventionsService: InterventionsService) {}

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() data: { type: InterventionType; name: string; startDate: string; endDate?: string; cost?: number; dosage?: string; frequency?: string; notes?: string },
  ) {
    return this.interventionsService.create(userId, data);
  }

  @Get()
  findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.interventionsService.findAll(userId, page, limit);
  }

  @Get('analysis')
  getAnalysis(@CurrentUser('id') userId: string) {
    return this.interventionsService.getAnalysis(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.interventionsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() data: any,
  ) {
    return this.interventionsService.update(id, userId, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.interventionsService.remove(id, userId);
  }
}
