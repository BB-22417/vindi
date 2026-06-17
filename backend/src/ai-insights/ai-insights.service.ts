import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InsightType } from '@prisma/client';

@Injectable()
export class AiInsightService {
  private readonly logger = new Logger(AiInsightService.name);
  private readonly medicalDisclaimer = 'This insight is for informational purposes only and does not constitute medical advice. Always consult with a healthcare provider about your symptoms and treatment options.';

  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const insights = await this.prisma.aiInsight.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      insights,
      disclaimer: this.medicalDisclaimer,
    };
  }

  async generate(userId: string) {
    const insights: any[] = [];

    const correlationInsight = await this.generateCorrelationInsight(userId);
    if (correlationInsight) insights.push(correlationInsight);

    const trendInsight = await this.generateTrendInsight(userId);
    if (trendInsight) insights.push(trendInsight);

    const patternInsight = await this.generatePatternInsight(userId);
    if (patternInsight) insights.push(patternInsight);

    const saved = await Promise.all(
      insights.map((insight) =>
        this.prisma.aiInsight.create({
          data: {
            userId,
            type: insight.type,
            title: insight.title,
            description: insight.description,
            severity: insight.severity,
            relatedSymptoms: insight.relatedSymptoms || [],
            recommendation: insight.recommendation,
          },
        }),
      ),
    );

    return {
      insights: saved,
      disclaimer: this.medicalDisclaimer,
    };
  }

  private async generateCorrelationInsight(userId: string) {
    const logs = await this.prisma.dailyLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30,
    });

    if (logs.length < 5) return null;

    const sleepAndMood = logs.filter((l) => l.sleepQuality !== null && l.moodScore !== null);
    if (sleepAndMood.length >= 5) {
      const moodAvg = sleepAndMood.reduce((a, b) => a + b.moodScore!, 0) / sleepAndMood.length;
      const sleepAvg = sleepAndMood.reduce((a, b) => a + b.sleepQuality!, 0) / sleepAndMood.length;

      if (sleepAvg < 5 && moodAvg < 5) {
        return {
          type: InsightType.CORRELATION,
          title: 'Sleep Quality and Mood Connection',
          description: `Your data shows that when sleep quality is low (avg ${sleepAvg.toFixed(1)}/10), your mood tends to also be lower (avg ${moodAvg.toFixed(1)}/10). Improving sleep may help improve your overall mood.`,
          severity: 'MODERATE',
          relatedSymptoms: ['poor_sleep', 'low_mood'],
          recommendation: 'Try establishing a consistent bedtime routine. Avoid screens 1 hour before bed, and consider relaxation techniques like deep breathing or meditation before sleep.',
        };
      }
    }

    const stressAndBrainFog = logs.filter((l) => l.stressScore !== null && l.brainFog !== null);
    if (stressAndBrainFog.length >= 5) {
      const stressAvg = stressAndBrainFog.reduce((a, b) => a + b.stressScore!, 0) / stressAndBrainFog.length;
      const brainFogAvg = stressAndBrainFog.reduce((a, b) => a + b.brainFog!, 0) / stressAndBrainFog.length;

      if (stressAvg > 6 && brainFogAvg > 5) {
        return {
          type: InsightType.CORRELATION,
          title: 'Stress and Brain Fog Pattern',
          description: `We noticed a pattern: on days when your stress levels are elevated (avg ${stressAvg.toFixed(1)}/10), your brain fog scores also tend to be higher (avg ${brainFogAvg.toFixed(1)}/10).`,
          severity: 'MODERATE',
          relatedSymptoms: ['stress', 'brain_fog'],
          recommendation: 'Consider incorporating stress-reduction techniques such as mindfulness, gentle exercise, or journaling into your daily routine.',
        };
      }
    }

    return null;
  }

  private async generateTrendInsight(userId: string) {
    const logs = await this.prisma.dailyLog.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      take: 60,
    });

    if (logs.length < 7) return null;

    const recent = logs.slice(-7);
    const older = logs.slice(0, 7);

    const avgRecent = (field: string) => {
      const vals = recent.map((l) => (l as any)[field]).filter((v) => v !== null);
      return vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 0;
    };

    const avgOlder = (field: string) => {
      const vals = older.map((l) => (l as any)[field]).filter((v) => v !== null);
      return vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 0;
    };

    const moodChange = avgRecent('moodScore') - avgOlder('moodScore');
    const energyChange = avgRecent('energyLevel') - avgOlder('energyLevel');

    if (Math.abs(moodChange) > 1 || Math.abs(energyChange) > 1) {
      const direction = moodChange > 0 ? 'improving' : 'declining';
      return {
        type: InsightType.TREND,
        title: `${moodChange > 0 ? 'Positive' : 'Gradual'} Mood Trend Detected`,
        description: moodChange > 0
          ? `Your mood scores have been trending upward over the past week (avg ${avgRecent('moodScore').toFixed(1)}/10) compared to earlier data (avg ${avgOlder('moodScore').toFixed(1)}/10). This is a positive sign!`
          : `Your mood scores have been ${direction} (avg ${avgRecent('moodScore').toFixed(1)}/10 vs ${avgOlder('moodScore').toFixed(1)}/10 previously). Track what might be contributing to this change.`,
        severity: moodChange > 0 ? 'MILD' : 'MODERATE',
        relatedSymptoms: ['mood', 'energy'],
        recommendation: moodChange > 0
          ? 'Keep up whatever you have been doing! Consider noting what activities or habits may be contributing to your improved wellbeing.'
          : 'Consider reviewing recent changes in your routine, diet, exercise, or stress levels that may be affecting your mood.',
      };
    }

    return null;
  }

  private async generatePatternInsight(userId: string) {
    const logs = await this.prisma.dailyLog.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    if (logs.length < 14) return null;

    const severityFields = ['hotFlashes', 'jointPain', 'headaches', 'bloating', 'lowLibido'];
    const severityMap: Record<string, number> = { MILD: 1, MODERATE: 2, SEVERE: 3, VERY_SEVERE: 4 };

    const symptomFrequency: Record<string, number> = {};
    for (const log of logs) {
      for (const field of severityFields) {
        const val = (log as any)[field];
        if (val) {
          symptomFrequency[field] = (symptomFrequency[field] || 0) + severityMap[val] || 0;
        }
      }
    }

    const sorted = Object.entries(symptomFrequency)
      .sort(([, a], [, b]) => b - a);

    if (sorted.length > 0) {
      const topSymptom = sorted[0][0];
      const friendlyNames: Record<string, string> = {
        hotFlashes: 'hot flashes',
        jointPain: 'joint pain',
        headaches: 'headaches',
        bloating: 'bloating',
        lowLibido: 'low libido',
      };

      const recentSymptomLogs = logs.filter((l) => (l as any)[topSymptom] !== null).slice(-10);
      const recentSymptoms = recentSymptomLogs.filter((l) => (l as any)[topSymptom] !== null);
      const frequency = recentSymptoms.length > 0 ? (recentSymptoms.length / Math.min(logs.length, 30)) * 100 : 0;

      if (frequency > 30) {
        return {
          type: InsightType.PATTERN,
          title: `${friendlyNames[topSymptom] || topSymptom} Pattern Detected`,
          description: `${friendlyNames[topSymptom] || topSymptom} appeared in ${Math.round(frequency)}% of your recent logs. Track if these occur at specific times of day, after certain foods, or in relation to your cycle phase.`,
          severity: frequency > 60 ? 'SEVERE' : 'MODERATE',
          relatedSymptoms: [topSymptom],
          recommendation: `Keep a detailed log of when ${friendlyNames[topSymptom] || topSymptom} occur to identify triggers. Consider discussing this pattern with your healthcare provider.`,
        };
      }
    }

    return null;
  }

  async remove(id: string, userId: string) {
    await this.prisma.aiInsight.deleteMany({
      where: { id, userId },
    });
    return { message: 'Insight deleted' };
  }
}
