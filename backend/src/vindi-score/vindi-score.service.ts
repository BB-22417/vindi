import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VindiScoreService {
  private readonly severityWeights: Record<string, number> = {
    MILD: 1,
    MODERATE: 2,
    SEVERE: 3,
    VERY_SEVERE: 4,
  };

  constructor(private prisma: PrismaService) {}

  async getCurrent(userId: string) {
    const latestScore = await this.prisma.vindiScore.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    if (!latestScore) {
      return this.calculate(userId);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scoreDate = new Date(latestScore.date);
    scoreDate.setHours(0, 0, 0, 0);

    if (scoreDate.getTime() !== today.getTime()) {
      return this.calculate(userId);
    }

    return latestScore;
  }

  async getHistory(userId: string, days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const scores = await this.prisma.vindiScore.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'asc' },
    });

    return scores;
  }

  async calculate(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recentLogs = await this.prisma.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          lte: today,
        },
      },
      orderBy: { date: 'asc' },
    });

    const monthLogs = await this.prisma.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          lte: today,
        },
      },
      orderBy: { date: 'asc' },
    });

    const dailyScore = this.calculateSegmentScore(recentLogs);
    const weeklyScore = this.calculateSegmentScore(recentLogs);
    const monthlyScore = this.calculateSegmentScore(monthLogs);

    const score = Math.round((dailyScore + weeklyScore + monthlyScore) / 3);
    const clampedScore = Math.max(0, Math.min(100, score));

    const previousScore = await this.prisma.vindiScore.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    let trend = 'STABLE';
    if (previousScore) {
      const diff = clampedScore - previousScore.score;
      if (diff > 3) trend = 'IMPROVING';
      else if (diff < -3) trend = 'WORSENING';
    }

    const vindiScore = await this.prisma.vindiScore.create({
      data: {
        userId,
        date: today,
        score: clampedScore,
        trend,
        dailyScore,
        weeklyScore,
        monthlyScore,
        metadata: {
          logCount: recentLogs.length,
          monthLogCount: monthLogs.length,
        },
      },
    });

    return vindiScore;
  }

  private calculateSegmentScore(logs: any[]): number {
    if (logs.length === 0) return 50;

    let totalScore = 0;
    let metrics = 0;

    for (const log of logs) {
      if (log.moodScore !== null && log.moodScore !== undefined) {
        totalScore += (log.moodScore / 10) * 100;
        metrics++;
      }

      if (log.anxietyScore !== null && log.anxietyScore !== undefined) {
        totalScore += (1 - log.anxietyScore / 10) * 100;
        metrics++;
      }

      if (log.stressScore !== null && log.stressScore !== undefined) {
        totalScore += (1 - log.stressScore / 10) * 100;
        metrics++;
      }

      if (log.energyLevel !== null && log.energyLevel !== undefined) {
        totalScore += (log.energyLevel / 10) * 100;
        metrics++;
      }

      if (log.sleepQuality !== null && log.sleepQuality !== undefined) {
        totalScore += (log.sleepQuality / 10) * 100;
        metrics++;
      }

      if (log.brainFog !== null && log.brainFog !== undefined) {
        totalScore += (1 - log.brainFog / 10) * 100;
        metrics++;
      }

      const severitySymptoms = [
        'hotFlashes', 'jointPain', 'headaches', 'heartPalpitations',
        'breastTenderness', 'bloating', 'lowLibido',
      ];

      for (const symptom of severitySymptoms) {
        const val = (log as any)[symptom];
        if (val) {
          const weight = this.severityWeights[val] || 0;
          totalScore += (1 - weight / 4) * 100;
          metrics++;
        }
      }
    }

    return metrics > 0 ? Math.round(totalScore / metrics) : 50;
  }
}
