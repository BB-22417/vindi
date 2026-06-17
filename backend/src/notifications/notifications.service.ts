import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, unreadOnly: boolean = false) {
    const where: any = { userId };
    if (unreadOnly) where.read = false;

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async setReminder(userId: string, type: NotificationType, scheduledFor: string, title: string, message: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        scheduledFor: new Date(scheduledFor),
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.prisma.notification.deleteMany({
      where: { id, userId },
    });
    return { message: 'Notification deleted' };
  }

  async createNotification(userId: string, type: NotificationType, title: string, message: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        sentAt: new Date(),
      },
    });
  }

  @Cron('0 9 * * *')
  async sendDailyCheckInReminders() {
    this.logger.log('Sending daily check-in reminders...');

    const users = await this.prisma.user.findMany({
      where: { emailVerified: true },
      select: { id: true, email: true, name: true },
    });

    for (const user of users) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existing = await this.prisma.dailyLog.findUnique({
        where: { userId_date: { userId: user.id, date: today } },
      });

      if (!existing) {
        await this.createNotification(
          user.id,
          'DAILY_CHECKIN',
          'Daily Check-in Reminder',
          `Hi ${user.name}! Don't forget to log your symptoms for today. Regular tracking helps you spot patterns and trends.`,
        );
        this.logger.log(`Reminder sent to ${user.email}`);
      }
    }
  }
}
