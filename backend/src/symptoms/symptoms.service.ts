import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SymptomSeverity } from '@prisma/client';

@Injectable()
export class SymptomsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    dailyLogId: string;
    symptomType: string;
    severity: SymptomSeverity;
    timeOfDay?: string;
    duration?: number;
    notes?: string;
  }) {
    const dailyLog = await this.prisma.dailyLog.findFirst({
      where: { id: data.dailyLogId, userId },
    });
    if (!dailyLog) {
      throw new NotFoundException('Daily log not found');
    }

    return this.prisma.symptomEntry.create({
      data,
    });
  }

  async findAll(userId: string, dailyLogId?: string) {
    const where: any = {
      dailyLog: { userId },
    };
    if (dailyLogId) where.dailyLogId = dailyLogId;

    return this.prisma.symptomEntry.findMany({
      where,
      include: { dailyLog: { select: { date: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const symptom = await this.prisma.symptomEntry.findFirst({
      where: { id, dailyLog: { userId } },
    });
    if (!symptom) {
      throw new NotFoundException('Symptom entry not found');
    }
    return symptom;
  }

  async update(id: string, userId: string, data: any) {
    const symptom = await this.prisma.symptomEntry.findFirst({
      where: { id, dailyLog: { userId } },
    });
    if (!symptom) {
      throw new NotFoundException('Symptom entry not found');
    }

    return this.prisma.symptomEntry.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const symptom = await this.prisma.symptomEntry.findFirst({
      where: { id, dailyLog: { userId } },
    });
    if (!symptom) {
      throw new NotFoundException('Symptom entry not found');
    }

    await this.prisma.symptomEntry.delete({ where: { id } });
    return { message: 'Symptom entry deleted' };
  }

  async getHeatmap(userId: string, startDate: string, endDate: string) {
    const logs = await this.prisma.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { date: 'asc' },
    });

    const heatmapData = logs.map((log) => {
      const severityValues = [
        log.hotFlashes, log.jointPain, log.headaches,
        log.heartPalpitations, log.breastTenderness, log.bloating, log.lowLibido,
      ].filter(Boolean);

      const severityScore = severityValues.reduce((sum, s) => {
        const map: Record<string, number> = { MILD: 1, MODERATE: 2, SEVERE: 3, VERY_SEVERE: 4 };
        return sum + (map[s as string] || 0);
      }, 0);

      return {
        date: log.date,
        severityScore,
        symptomCount: severityValues.length,
        sleepQuality: log.sleepQuality,
        moodScore: log.moodScore,
        energyLevel: log.energyLevel,
      };
    });

    return heatmapData;
  }

  async getClusters(userId: string, startDate?: string, endDate?: string) {
    const where: any = { userId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const logs = await this.prisma.dailyLog.findMany({ where });

    const symptomCounts: Record<string, number[]> = {};
    const symptomFields = [
      'hotFlashes', 'jointPain', 'headaches', 'heartPalpitations',
      'breastTenderness', 'bloating', 'lowLibido',
    ];

    for (const log of logs) {
      for (const field of symptomFields) {
        const value = (log as any)[field];
        if (value) {
          if (!symptomCounts[field]) symptomCounts[field] = [];
          symptomCounts[field].push(1);
        }
      }
    }

    const clusters = Object.entries(symptomCounts)
      .map(([symptom, occurrences]) => ({
        symptom,
        frequency: occurrences.length,
        percentage: logs.length > 0 ? (occurrences.length / logs.length) * 100 : 0,
      }))
      .sort((a, b) => b.frequency - a.frequency);

    return clusters;
  }

  async getTrends(userId: string, days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.prisma.dailyLog.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'asc' },
    });

    const trends: Record<string, { dates: Date[]; values: number[] }> = {};
    const severityMap: Record<string, number> = {
      MILD: 1, MODERATE: 2, SEVERE: 3, VERY_SEVERE: 4,
    };

    const numericFields = [
      'moodScore', 'anxietyScore', 'stressScore', 'energyLevel',
      'brainFog', 'sleepQuality', 'sleepHours',
    ];
    const severityFields = [
      'hotFlashes', 'jointPain', 'headaches', 'heartPalpitations',
      'breastTenderness', 'bloating', 'lowLibido',
    ];

    for (const field of [...numericFields, ...severityFields]) {
      const trend = { dates: [] as Date[], values: [] as number[] };
      for (const log of logs) {
        const val = (log as any)[field];
        if (val !== null && val !== undefined) {
          trend.dates.push(log.date);
          trend.values.push(severityFields.includes(field) ? (severityMap[val] || 0) : val);
        }
      }
      trends[field] = trend;
    }

    return trends;
  }
}
