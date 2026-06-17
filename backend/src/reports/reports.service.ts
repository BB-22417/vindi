import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
  private readonly reportsDir: string;

  constructor(private prisma: PrismaService) {
    this.reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  async findAll(userId: string) {
    return this.prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generate(userId: string, format: 'PDF' | 'CSV', dateRange?: { start: string; end: string }) {
    if (format === 'PDF') {
      return this.generatePdf(userId, dateRange);
    } else if (format === 'CSV') {
      return this.generateCsv(userId, dateRange);
    }
    throw new BadRequestException('Invalid format. Use PDF or CSV.');
  }

  async download(id: string, userId: string) {
    const report = await this.prisma.report.findFirst({
      where: { id, userId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const filePath = path.join(this.reportsDir, path.basename(report.url));
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Report file not found on disk');
    }

    return { report, filePath };
  }

  private async generatePdf(userId: string, dateRange?: { start: string; end: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const where: any = { userId };
    if (dateRange) {
      where.date = {
        gte: new Date(dateRange.start),
        lte: new Date(dateRange.end),
      };
    }

    const logs = await this.prisma.dailyLog.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    const insights = await this.prisma.aiInsight.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const filename = `vindi-report-${Date.now()}.pdf`;
    const filePath = path.join(this.reportsDir, filename);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.font('Helvetica-Bold').fontSize(24).text('Vindi Health Report', { align: 'center' });
    doc.moveDown();
    doc.font('Helvetica').fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.fontSize(10).text(`User: ${user.name} (${user.email})`, { align: 'center' });
    doc.moveDown(2);

    if (dateRange) {
      doc.fontSize(12).text(`Period: ${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`, { align: 'center' });
      doc.moveDown();
    }

    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(16).text('Summary');
    doc.moveDown();
    doc.font('Helvetica').fontSize(11);
    doc.text(`Total check-ins: ${logs.length}`);
    if (logs.length > 0) {
      const avgMood = logs.reduce((a, b) => a + (b.moodScore || 0), 0) / logs.length;
      const avgSleep = logs.reduce((a, b) => a + (b.sleepQuality || 0), 0) / logs.length;
      const avgEnergy = logs.reduce((a, b) => a + (b.energyLevel || 0), 0) / logs.length;
      doc.text(`Average Mood: ${avgMood.toFixed(1)}/10`);
      doc.text(`Average Sleep Quality: ${avgSleep.toFixed(1)}/10`);
      doc.text(`Average Energy Level: ${avgEnergy.toFixed(1)}/10`);
    }
    doc.moveDown(2);

    doc.font('Helvetica-Bold').fontSize(16).text('Symptom Tracking');
    doc.moveDown();
    doc.font('Helvetica').fontSize(11);

    const severityFields = ['hotFlashes', 'jointPain', 'headaches', 'heartPalpitations', 'breastTenderness', 'bloating', 'lowLibido'];
    const friendlyNames: Record<string, string> = {
      hotFlashes: 'Hot Flashes', jointPain: 'Joint Pain', headaches: 'Headaches',
      heartPalpitations: 'Heart Palpitations', breastTenderness: 'Breast Tenderness',
      bloating: 'Bloating', lowLibido: 'Low Libido',
    };

    for (const field of severityFields) {
      const occurrences = logs.filter((l) => (l as any)[field] !== null).length;
      if (occurrences > 0) {
        doc.text(`${friendlyNames[field]}: Reported ${occurrences} time(s)`);
      }
    }

    doc.moveDown(2);

    if (insights.length > 0) {
      doc.font('Helvetica-Bold').fontSize(16).text('AI Insights');
      doc.moveDown();
      doc.font('Helvetica').fontSize(10);
      for (const insight of insights) {
        doc.text(`• ${insight.title}: ${insight.description}`);
        doc.moveDown(0.5);
      }
      doc.moveDown();

      doc.font('Helvetica-Oblique').fontSize(8).fillColor('#666')
        .text('These insights are for informational purposes only and do not constitute medical advice. Always consult with a healthcare provider.', { align: 'center' });
    }

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', async () => {
        const reportUrl = `/reports/download/${filename}`;
        const report = await this.prisma.report.create({
          data: {
            userId,
            title: `Health Report ${new Date().toLocaleDateString()}`,
            format: 'PDF',
            dateRange: dateRange ? `${dateRange.start} - ${dateRange.end}` : null,
            url: reportUrl,
          },
        });
        resolve(report);
      });
      stream.on('error', reject);
    });
  }

  private async generateCsv(userId: string, dateRange?: { start: string; end: string }) {
    const where: any = { userId };
    if (dateRange) {
      where.date = {
        gte: new Date(dateRange.start),
        lte: new Date(dateRange.end),
      };
    }

    const logs = await this.prisma.dailyLog.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    const filename = `vindi-data-export-${Date.now()}.csv`;
    const filePath = path.join(this.reportsDir, filename);

    const headers = [
      'Date', 'Sleep Hours', 'Sleep Quality', 'Night Awakenings', 'Night Sweats',
      'Mood Score', 'Anxiety Score', 'Stress Score', 'Irritability Score',
      'Energy Level', 'Brain Fog', 'Focus Level', 'Memory Issues',
      'Hot Flashes', 'Joint Pain', 'Headaches', 'Heart Palpitations',
      'Breast Tenderness', 'Bloating', 'Low Libido',
      'Weight', 'Exercise', 'Alcohol Intake', 'Water Intake', 'Caffeine Intake',
      'Nutrition Score', 'Notes',
    ];

    let csvContent = headers.join(',') + '\n';

    for (const log of logs) {
      const row = [
        log.date.toISOString().split('T')[0],
        log.sleepHours ?? '',
        log.sleepQuality ?? '',
        log.nightAwakenings ?? '',
        log.nightSweats ?? '',
        log.moodScore ?? '',
        log.anxietyScore ?? '',
        log.stressScore ?? '',
        log.irritabilityScore ?? '',
        log.energyLevel ?? '',
        log.brainFog ?? '',
        log.focusLevel ?? '',
        log.memoryIssues ?? '',
        log.hotFlashes ?? '',
        log.jointPain ?? '',
        log.headaches ?? '',
        log.heartPalpitations ?? '',
        log.breastTenderness ?? '',
        log.bloating ?? '',
        log.lowLibido ?? '',
        log.weight ?? '',
        log.exercise ?? '',
        log.alcoholIntake ?? '',
        log.waterIntake ?? '',
        log.caffeineIntake ?? '',
        log.nutritionScore ?? '',
        `"${(log.notes || '').replace(/"/g, '""')}"`,
      ];
      csvContent += row.join(',') + '\n';
    }

    fs.writeFileSync(filePath, csvContent);

    const reportUrl = `/reports/download/${filename}`;
    const report = await this.prisma.report.create({
      data: {
        userId,
        title: `Data Export ${new Date().toLocaleDateString()}`,
        format: 'CSV',
        dateRange: dateRange ? `${dateRange.start} - ${dateRange.end}` : null,
        url: reportUrl,
      },
    });

    return report;
  }
}
