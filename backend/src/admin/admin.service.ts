import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private async checkAdmin(adminId: string): Promise<void> {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      throw new ForbiddenException('Admin access required');
    }
  }

  async getUsers(adminId: string, page: number = 1, limit: number = 20) {
    await this.checkAdmin(adminId);

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              dailyLogs: true,
              payments: true,
            },
          },
          subscription: {
            select: { plan: true, status: true },
          },
        },
      }),
      this.prisma.user.count(),
    ]);

    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAnalytics(adminId: string) {
    await this.checkAdmin(adminId);

    const [totalUsers, totalLogs, activeSubscriptions, totalRevenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.dailyLog.count(),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.payment.aggregate({ _sum: { amount: true } }),
    ]);

    return {
      totalUsers,
      totalLogs,
      activeSubscriptions,
      totalRevenue: totalRevenue._sum.amount || 0,
      avgLogsPerUser: totalUsers > 0 ? Math.round((totalLogs / totalUsers) * 100) / 100 : 0,
    };
  }

  async getRevenue(adminId: string) {
    await this.checkAdmin(adminId);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [monthlyRevenue, yearlyRevenue, activeSubscriptions, totalRevenue, subscriptions] = await Promise.all([
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: startOfMonth } },
      }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: startOfYear } },
      }),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.payment.aggregate({ _sum: { amount: true } }),
      this.prisma.subscription.findMany({ where: { status: 'ACTIVE' } }),
    ]);

    const mrr = subscriptions.reduce((sum, sub) => {
      const prices = { BASIC: 3.99, PREMIUM: 9.99, PREMIUM_PLUS: 19.99 };
      return sum + (prices[sub.plan] || 0);
    }, 0);

    const churnedSubscriptions = await this.prisma.subscription.count({
      where: { status: 'CANCELLED', canceledAt: { gte: startOfMonth } },
    });

    const totalSubscriptions = await this.prisma.subscription.count();
    const churnRate = totalSubscriptions > 0 ? (churnedSubscriptions / totalSubscriptions) * 100 : 0;

    const ltv = totalRevenue._sum.amount || 0;

    return {
      mrr: Math.round(mrr * 100) / 100,
      arr: Math.round(mrr * 12 * 100) / 100,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      yearlyRevenue: yearlyRevenue._sum.amount || 0,
      totalRevenue: totalRevenue._sum.amount || 0,
      churnRate: Math.round(churnRate * 100) / 100,
      activeSubscriptions,
      churnedThisMonth: churnedSubscriptions,
      ltv: Math.round(ltv * 100) / 100,
    };
  }

  async moderateContent(adminId: string, postId: string, action: string) {
    await this.checkAdmin(adminId);

    if (action === 'delete') {
      await this.prisma.communityPost.delete({ where: { id: postId } });
    } else if (action === 'remove') {
      await this.prisma.communityPost.update({
        where: { id: postId },
        data: { title: '[Removed]', content: '[This content has been removed by moderation]' },
      });
    }

    await this.prisma.adminLog.create({
      data: {
        adminId,
        action: `MODERATE_${action.toUpperCase()}`,
        details: { postId },
      },
    });

    return { message: `Content ${action}d successfully` };
  }
}
