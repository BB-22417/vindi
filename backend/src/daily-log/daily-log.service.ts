import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { UpdateDailyLogDto } from './dto/update-daily-log.dto';

@Injectable()
export class DailyLogService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateDailyLogDto) {
    const logDate = new Date(dto.date);
    logDate.setHours(0, 0, 0, 0);

    const existing = await this.prisma.dailyLog.findUnique({
      where: { userId_date: { userId, date: logDate } },
    });

    if (existing) {
      return this.update(existing.id, userId, dto as any);
    }

    return this.prisma.dailyLog.create({
      data: {
        ...dto,
        userId,
        date: logDate,
      },
      include: { symptomEntries: true },
    });
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 30,
    startDate?: string,
    endDate?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      this.prisma.dailyLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: { symptomEntries: true },
      }),
      this.prisma.dailyLog.count({ where }),
    ]);

    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, userId: string) {
    const log = await this.prisma.dailyLog.findFirst({
      where: { id, userId },
      include: { symptomEntries: true },
    });

    if (!log) {
      throw new NotFoundException('Daily log not found');
    }

    return log;
  }

  async update(id: string, userId: string, dto: UpdateDailyLogDto) {
    const log = await this.prisma.dailyLog.findFirst({ where: { id, userId } });
    if (!log) {
      throw new NotFoundException('Daily log not found');
    }

    return this.prisma.dailyLog.update({
      where: { id },
      data: dto,
      include: { symptomEntries: true },
    });
  }

  async remove(id: string, userId: string) {
    const log = await this.prisma.dailyLog.findFirst({ where: { id, userId } });
    if (!log) {
      throw new NotFoundException('Daily log not found');
    }

    await this.prisma.dailyLog.delete({ where: { id } });
    return { message: 'Daily log deleted' };
  }
}
