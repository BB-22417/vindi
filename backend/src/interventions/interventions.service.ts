import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InterventionType } from '@prisma/client';

@Injectable()
export class InterventionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    type: InterventionType;
    name: string;
    startDate: string;
    endDate?: string;
    cost?: number;
    dosage?: string;
    frequency?: string;
    notes?: string;
  }) {
    return this.prisma.intervention.create({
      data: {
        ...data,
        userId,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });
  }

  async findAll(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [interventions, total] = await Promise.all([
      this.prisma.intervention.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.intervention.count({ where: { userId } }),
    ]);

    return { interventions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, userId: string) {
    const intervention = await this.prisma.intervention.findFirst({ where: { id, userId } });
    if (!intervention) throw new NotFoundException('Intervention not found');
    return intervention;
  }

  async update(id: string, userId: string, data: any) {
    const intervention = await this.prisma.intervention.findFirst({ where: { id, userId } });
    if (!intervention) throw new NotFoundException('Intervention not found');

    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    return this.prisma.intervention.update({ where: { id }, data: updateData });
  }

  async remove(id: string, userId: string) {
    const intervention = await this.prisma.intervention.findFirst({ where: { id, userId } });
    if (!intervention) throw new NotFoundException('Intervention not found');

    await this.prisma.intervention.delete({ where: { id } });
    return { message: 'Intervention deleted' };
  }

  async getAnalysis(userId: string) {
    const interventions = await this.prisma.intervention.findMany({
      where: { userId },
    });

    const analysis = [];

    for (const intervention of interventions) {
      const beforeDate = new Date(intervention.startDate);
      const afterDate = new Date(intervention.startDate);
      afterDate.setDate(afterDate.getDate() + 14);

      const beforeLogs = await this.prisma.dailyLog.findMany({
        where: {
          userId,
          date: {
            gte: new Date(beforeDate.getTime() - 14 * 24 * 60 * 60 * 1000),
            lt: beforeDate,
          },
        },
        orderBy: { date: 'asc' },
      });

      const afterLogs = await this.prisma.dailyLog.findMany({
        where: {
          userId,
          date: {
            gte: beforeDate,
            lte: afterDate,
          },
        },
        orderBy: { date: 'asc' },
      });

      const avg = (logs: any[], field: string) => {
        const vals = logs.map((l) => (l as any)[field]).filter((v) => v !== null && v !== undefined);
        return vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : null;
      };

      analysis.push({
        interventionId: intervention.id,
        name: intervention.name,
        type: intervention.type,
        startDate: intervention.startDate,
        before: {
          moodScore: avg(beforeLogs, 'moodScore'),
          anxietyScore: avg(beforeLogs, 'anxietyScore'),
          energyLevel: avg(beforeLogs, 'energyLevel'),
          sleepQuality: avg(beforeLogs, 'sleepQuality'),
          brainFog: avg(beforeLogs, 'brainFog'),
          hotFlashes: avg(beforeLogs, 'hotFlashes'),
        },
        after: {
          moodScore: avg(afterLogs, 'moodScore'),
          anxietyScore: avg(afterLogs, 'anxietyScore'),
          energyLevel: avg(afterLogs, 'energyLevel'),
          sleepQuality: avg(afterLogs, 'sleepQuality'),
          brainFog: avg(afterLogs, 'brainFog'),
          hotFlashes: avg(afterLogs, 'hotFlashes'),
        },
        dailyLogsBefore: beforeLogs.length,
        dailyLogsAfter: afterLogs.length,
      });
    }

    return analysis;
  }
}
