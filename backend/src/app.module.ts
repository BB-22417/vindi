import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DailyLogModule } from './daily-log/daily-log.module';
import { SymptomsModule } from './symptoms/symptoms.module';
import { CyclesModule } from './cycles/cycles.module';
import { InterventionsModule } from './interventions/interventions.module';
import { VindiScoreModule } from './vindi-score/vindi-score.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiInsightModule } from './ai-insights/ai-insights.module';
import { ReportsModule } from './reports/reports.module';
import { PaymentsModule } from './payments/payments.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CommunityModule } from './community/community.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 10 }],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    DailyLogModule,
    SymptomsModule,
    CyclesModule,
    InterventionsModule,
    VindiScoreModule,
    AnalyticsModule,
    AiInsightModule,
    ReportsModule,
    PaymentsModule,
    SubscriptionsModule,
    NotificationsModule,
    CommunityModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}
