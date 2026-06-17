import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DailyLogService } from './daily-log.service';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { UpdateDailyLogDto } from './dto/update-daily-log.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('daily-logs')
@UseGuards(AuthGuard('jwt'))
export class DailyLogController {
  constructor(private dailyLogService: DailyLogService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateDailyLogDto) {
    return this.dailyLogService.create(userId, dto);
  }

  @Get()
  findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dailyLogService.findAll(userId, page, limit, startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.dailyLogService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateDailyLogDto,
  ) {
    return this.dailyLogService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.dailyLogService.remove(id, userId);
  }
}
