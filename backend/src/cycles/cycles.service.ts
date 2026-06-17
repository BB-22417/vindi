import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CyclePhase } from '@prisma/client';

@Injectable()
export class CyclesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    startDate: string;
    endDate?: string;
    spotting?: boolean;
    flowIntensity?: number;
    phase: CyclePhase;
    symptoms?: string;
    notes?: string;
  }) {
    return this.prisma.cycle.create({
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
    const [cycles, total] = await Promise.all([
      this.prisma.cycle.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
      }),
      this.prisma.cycle.count({ where: { userId } }),
    ]);

    return { cycles, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, userId: string) {
    const cycle = await this.prisma.cycle.findFirst({ where: { id, userId } });
    if (!cycle) throw new NotFoundException('Cycle not found');
    return cycle;
  }

  async update(id: string, userId: string, data: any) {
    const cycle = await this.prisma.cycle.findFirst({ where: { id, userId } });
    if (!cycle) throw new NotFoundException('Cycle not found');

    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    return this.prisma.cycle.update({ where: { id }, data: updateData });
  }

  async remove(id: string, userId: string) {
    const cycle = await this.prisma.cycle.findFirst({ where: { id, userId } });
    if (!cycle) throw new NotFoundException('Cycle not found');

    await this.prisma.cycle.delete({ where: { id } });
    return { message: 'Cycle deleted' };
  }

  async getIrregularity(userId: string) {
    const cycles = await this.prisma.cycle.findMany({
      where: { userId },
      orderBy: { startDate: 'asc' },
    });

    if (cycles.length < 2) {
      return { irregularityScore: null, message: 'Not enough cycle data to analyze', cycleCount: cycles.length };
    }

    const cycleLengths: number[] = [];
    for (let i = 1; i < cycles.length; i++) {
      const diff = (cycles[i].startDate.getTime() - cycles[i - 1].startDate.getTime()) / (1000 * 60 * 60 * 24);
      cycleLengths.push(Math.abs(diff));
    }

    const avgLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
    const variance = cycleLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / cycleLengths.length;
    const stdDev = Math.sqrt(variance);

    let irregularityScore = 0;
    if (stdDev <= 2) irregularityScore = 10;
    else if (stdDev <= 4) irregularityScore = 30;
    else if (stdDev <= 7) irregularityScore = 50;
    else if (stdDev <= 10) irregularityScore = 70;
    else irregularityScore = 90;

    return {
      irregularityScore,
      averageCycleLength: Math.round(avgLength),
      stdDeviation: Math.round(stdDev * 10) / 10,
      cycleCount: cycles.length,
      cycleLengths,
      interpretation: irregularityScore < 30
        ? 'Regular cycles'
        : irregularityScore < 60
          ? 'Mildly irregular'
          : 'Significantly irregular - consider consulting a healthcare provider',
    };
  }
}
