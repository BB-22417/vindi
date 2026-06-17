import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [logs, scores, cycles, symptomsEntries] = await Promise.all([
      this.prisma.dailyLog.findMany({
        where: { userId, date: { gte: thirtyDaysAgo, lte: today } },
        orderBy: { date: 'asc' },
      }),
      this.prisma.vindiScore.findMany({
        where: { userId, date: { gte: thirtyDaysAgo, lte: today } },
        orderBy: { date: 'asc' },
      }),
      this.prisma.cycle.findMany({
        where: { userId, startDate: { gte: thirtyDaysAgo } },
      }),
      this.prisma.symptomEntry.findMany({
        where: { dailyLog: { userId, date: { gte: thirtyDaysAgo, lte: today } } },
      }),
    ]);

    const avg = (field: string) => {
      const vals = logs.map((l) => (l as any)[field]).filter((v) => v !== null && v !== undefined);
      return vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 0;
    };

    return {
      logCount: logs.length,
      checkInRate: Math.round((logs.length / 30) * 100),
      currentScore: scores.length > 0 ? scores[scores.length - 1].score : null,
      scoreHistory: scores,
      averages: {
        moodScore: Math.round(avg('moodScore') * 10) / 10,
        anxietyScore: Math.round(avg('anxietyScore') * 10) / 10,
        energyLevel: Math.round(avg('energyLevel') * 10) / 10,
        sleepQuality: Math.round(avg('sleepQuality') * 10) / 10,
        sleepHours: Math.round(avg('sleepHours') * 10) / 10,
        stressScore: Math.round(avg('stressScore') * 10) / 10,
        brainFog: Math.round(avg('brainFog') * 10) / 10,
      },
      cycleCount: cycles.length,
      symptomEntryCount: symptomsEntries.length,
      period: { start: thirtyDaysAgo, end: today },
    };
  }

  async getMoodVsSleep(userId: string, days: number = 30) {
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

    const data = logs
      .filter((l) => l.moodScore !== null && l.sleepQuality !== null)
      .map((l) => ({
        date: l.date,
        moodScore: l.moodScore,
        sleepQuality: l.sleepQuality,
        sleepHours: l.sleepHours,
      }));

    let correlation = 0;
    if (data.length > 1) {
      const moodVals = data.map((d) => d.moodScore!);
      const sleepVals = data.map((d) => d.sleepQuality!);
      correlation = this.pearsonCorrelation(moodVals, sleepVals);
    }

    return { data, correlation, interpretation: this.interpretCorrelation(correlation, 'mood', 'sleep quality') };
  }

  async getBrainFog(userId: string, days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.prisma.dailyLog.findMany({
      where: { userId, date: { gte: startDate, lte: endDate } },
      orderBy: { date: 'asc' },
    });

    const brainFogData = logs
      .filter((l) => l.brainFog !== null)
      .map((l) => ({
        date: l.date,
        brainFog: l.brainFog,
        sleepQuality: l.sleepQuality,
        stressScore: l.stressScore,
        anxietyScore: l.anxietyScore,
      }));

    const avgBrainFog = brainFogData.length > 0
      ? brainFogData.reduce((a, b) => a + b.brainFog!, 0) / brainFogData.length
      : 0;

    return { data: brainFogData, average: Math.round(avgBrainFog * 10) / 10, dataPoints: brainFogData.length };
  }

  async getHotFlashes(userId: string, days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.prisma.dailyLog.findMany({
      where: { userId, date: { gte: startDate, lte: endDate } },
      orderBy: { date: 'asc' },
    });

    const severityMap: Record<string, number> = { MILD: 1, MODERATE: 2, SEVERE: 3, VERY_SEVERE: 4 };
    const hotFlashLogs = logs
      .filter((l) => l.hotFlashes !== null)
      .map((l) => ({
        date: l.date,
        severity: l.hotFlashes,
        severityScore: severityMap[l.hotFlashes!] || 0,
      }));

    const frequency = hotFlashLogs.length;
    const avgSeverity = frequency > 0
      ? hotFlashLogs.reduce((a, b) => a + b.severityScore, 0) / frequency
      : 0;

    return { data: hotFlashLogs, frequency, avgSeverity: Math.round(avgSeverity * 10) / 10, daysTracked: logs.length };
  }

  async getWeight(userId: string, days: number = 90) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.prisma.dailyLog.findMany({
      where: { userId, date: { gte: startDate, lte: endDate }, weight: { not: null } },
      orderBy: { date: 'asc' },
    });

    const weightData = logs.map((l) => ({
      date: l.date,
      weight: l.weight,
    }));

    const weights = weightData.map((d) => d.weight!).filter(Boolean);
    const avgWeight = weights.length > 0
      ? weights.reduce((a, b) => a + b, 0) / weights.length
      : null;

    const minWeight = weights.length > 0 ? Math.min(...weights) : null;
    const maxWeight = weights.length > 0 ? Math.max(...weights) : null;

    return { data: weightData, average: avgWeight, min: minWeight, max: maxWeight, dataPoints: weights.length };
  }

  async getSummary(userId: string, startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const logs = await this.prisma.dailyLog.findMany({
      where: { userId, date: { gte: start, lte: end } },
      orderBy: { date: 'asc' },
    });

    const avg = (field: string) => {
      const vals = logs.map((l) => (l as any)[field]).filter((v) => v !== null && v !== undefined);
      return vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : null;
    };

    const severityFields = ['hotFlashes', 'jointPain', 'headaches', 'heartPalpitations', 'breastTenderness', 'bloating', 'lowLibido'];
    const severityMap: Record<string, number> = { MILD: 1, MODERATE: 2, SEVERE: 3, VERY_SEVERE: 4 };

    const topSymptoms = severityFields
      .map((field) => {
        const vals = logs.filter((l) => (l as any)[field] !== null);
        const avgSeverity = vals.length > 0
          ? vals.reduce((a, b) => a + (severityMap[(b as any)[field]] || 0), 0) / vals.length
          : 0;
        return { symptom: field, frequency: vals.length, avgSeverity: Math.round(avgSeverity * 10) / 10 };
      })
      .filter((s) => s.frequency > 0)
      .sort((a, b) => b.frequency - a.frequency);

    return {
      period: { start, end },
      totalLogs: logs.length,
      checkInRate: logs.length > 0 ? Math.round((logs.length / Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) * 100) : 0,
      averages: {
        moodScore: avg('moodScore'),
        anxietyScore: avg('anxietyScore'),
        stressScore: avg('stressScore'),
        energyLevel: avg('energyLevel'),
        sleepQuality: avg('sleepQuality'),
        sleepHours: avg('sleepHours'),
        brainFog: avg('brainFog'),
      },
      topSymptoms,
    };
  }

  private pearsonCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n < 2) return 0;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((a, b, i) => a + b * y[i], 0);
    const sumX2 = x.reduce((a, b) => a + b * b, 0);
    const sumY2 = y.reduce((a, b) => a + b * b, 0);

    const num = n * sumXY - sumX * sumY;
    const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return den === 0 ? 0 : Math.round((num / den) * 100) / 100;
  }

  private interpretCorrelation(r: number, var1: string, var2: string): string {
    const abs = Math.abs(r);
    if (abs < 0.1) return `No meaningful correlation between ${var1} and ${var2}`;
    if (abs < 0.3) return `Weak ${r > 0 ? 'positive' : 'negative'} correlation between ${var1} and ${var2}`;
    if (abs < 0.5) return `Moderate ${r > 0 ? 'positive' : 'negative'} correlation between ${var1} and ${var2}`;
    return `Strong ${r > 0 ? 'positive' : 'negative'} correlation between ${var1} and ${var2}`;
  }
}
