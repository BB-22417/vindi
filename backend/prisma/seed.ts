import { PrismaClient, UserRole, SymptomSeverity, PlanTier, SubscriptionStatus, CyclePhase, InsightType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const superAdminPassword = await bcrypt.hash('SuperAdmin123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@vindi.app' },
    update: {},
    create: {
      email: 'admin@vindi.app',
      password: adminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
      emailVerified: true,
      profile: {
        create: {
          timezone: 'America/New_York',
        },
      },
    },
  });
  console.log(`Created admin: ${admin.email}`);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@vindi.app' },
    update: {},
    create: {
      email: 'superadmin@vindi.app',
      password: superAdminPassword,
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
      profile: {
        create: {
          timezone: 'UTC',
        },
      },
    },
  });
  console.log(`Created super admin: ${superAdmin.email}`);

  const testUser = await prisma.user.upsert({
    where: { email: 'test@vindi.app' },
    update: {},
    create: {
      email: 'test@vindi.app',
      password: await bcrypt.hash('Test1234!', 12),
      name: 'Test User',
      role: UserRole.USER,
      emailVerified: true,
      dateOfBirth: new Date('1980-06-15'),
      profile: {
        create: {
          timezone: 'America/Chicago',
          height: 165,
          weight: 70,
          birthYear: 1980,
          menopauseStatus: 'perimenopause',
          symptomsStartedAt: new Date('2024-01-01'),
        },
      },
    },
  });

  await prisma.subscription.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      plan: PlanTier.PREMIUM,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const severityOptions: SymptomSeverity[] = ['MILD', 'MODERATE', 'SEVERE'];
  const phases: CyclePhase[] = ['MENSTRUAL', 'FOLLICULAR', 'OVULATORY', 'LUTEAL'];

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const moodBase = Math.random() > 0.3 ? 5 + Math.random() * 4 : 2 + Math.random() * 3;
    const hasHotFlash = Math.random() > 0.4;
    const hasJointPain = Math.random() > 0.5;
    const hasHeadache = Math.random() > 0.6;
    const hasBloating = Math.random() > 0.5;

    await prisma.dailyLog.upsert({
      where: { userId_date: { userId: testUser.id, date } },
      update: {},
      create: {
        userId: testUser.id,
        date,
        sleepHours: 6 + Math.random() * 3,
        sleepQuality: Math.round(4 + Math.random() * 5),
        nightAwakenings: Math.round(Math.random() * 3),
        nightSweats: Math.random() > 0.5,
        moodScore: Math.round(moodBase),
        anxietyScore: Math.round(3 + Math.random() * 5),
        stressScore: Math.round(3 + Math.random() * 5),
        irritabilityScore: Math.round(3 + Math.random() * 5),
        energyLevel: Math.round(3 + Math.random() * 6),
        brainFog: Math.round(2 + Math.random() * 6),
        focusLevel: Math.round(3 + Math.random() * 5),
        memoryIssues: Math.round(2 + Math.random() * 5),
        hotFlashes: hasHotFlash ? severityOptions[Math.floor(Math.random() * severityOptions.length)] : null,
        jointPain: hasJointPain ? severityOptions[Math.floor(Math.random() * severityOptions.length)] : null,
        headaches: hasHeadache ? severityOptions[Math.floor(Math.random() * severityOptions.length)] : null,
        bloating: hasBloating ? severityOptions[Math.floor(Math.random() * severityOptions.length)] : null,
        lowLibido: Math.random() > 0.6 ? severityOptions[Math.floor(Math.random() * severityOptions.length)] : null,
        exercise: Math.random() > 0.4,
        alcoholIntake: Math.random() > 0.7 ? Math.round(Math.random() * 2) : 0,
        waterIntake: Math.round(3 + Math.random() * 5),
        caffeineIntake: Math.round(Math.random() * 3),
        nutritionScore: Math.round(4 + Math.random() * 5),
        notes: i === 0 ? 'Felt quite tired today. Hot flash in the afternoon.' : null,
      },
    });
  }

  console.log('Created 30 days of sample daily logs');

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const scoreBase = Math.random() > 0.3 ? 50 + Math.random() * 30 : 20 + Math.random() * 30;
    const prevScore = i > 0 ? 50 + Math.random() * 30 : 50;
    const diff = scoreBase - prevScore;

    let trend = 'STABLE';
    if (diff > 5) trend = 'IMPROVING';
    else if (diff < -5) trend = 'WORSENING';

    await prisma.vindiScore.create({
      data: {
        userId: testUser.id,
        date,
        score: Math.round(Math.max(0, Math.min(100, scoreBase))),
        trend,
        dailyScore: Math.round(40 + Math.random() * 40),
        weeklyScore: Math.round(45 + Math.random() * 35),
        monthlyScore: Math.round(50 + Math.random() * 30),
        metadata: {
          logCount: 1 + Math.round(Math.random() * 3),
          monthLogCount: 20 + Math.round(Math.random() * 10),
        },
      },
    });
  }

  console.log('Created 30 days of sample Vindi scores');

  const insights = [
    {
      type: InsightType.CORRELATION,
      title: 'Sleep Quality and Mood Connection',
      description: 'Your data shows that when sleep quality is low, your mood tends to also be lower. Improving sleep may help improve your overall mood.',
      severity: 'MODERATE',
      relatedSymptoms: ['poor_sleep', 'low_mood'],
      recommendation: 'Try establishing a consistent bedtime routine and avoiding screens before bed.',
    },
    {
      type: InsightType.TREND,
      title: 'Gradual Mood Improvement Detected',
      description: 'Your mood scores have been trending upward over the past week compared to earlier data. This is a positive sign!',
      severity: 'MILD',
      relatedSymptoms: ['mood'],
      recommendation: 'Keep up whatever you have been doing! Consider noting what activities or habits may be contributing to your improved wellbeing.',
    },
    {
      type: InsightType.PATTERN,
      title: 'Hot Flash Pattern Detected',
      description: 'Hot flashes appeared in 60% of your recent logs. Track if these occur at specific times of day or in relation to your cycle phase.',
      severity: 'MODERATE',
      relatedSymptoms: ['hot_flashes'],
      recommendation: 'Consider keeping a detailed log of when hot flashes occur. Avoiding triggers like caffeine and spicy foods may help.',
    },
  ];

  for (const insight of insights) {
    await prisma.aiInsight.create({
      data: {
        userId: testUser.id,
        ...insight,
      },
    });
  }

  console.log('Created sample AI insights');

  for (let i = 0; i < 3; i++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 60 + i * 28);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 5);

    await prisma.cycle.create({
      data: {
        userId: testUser.id,
        startDate,
        endDate,
        phase: phases[i % phases.length],
        flowIntensity: Math.round(1 + Math.random() * 4),
        spotting: Math.random() > 0.7,
        notes: null,
      },
    });
  }

  console.log('Created sample cycles');

  const samplePosts = [
    {
      title: 'Tips for managing hot flashes at work',
      content: 'I have been struggling with hot flashes during meetings. I found that wearing layers and keeping a small fan at my desk helps a lot. Anyone else have tips?',
      anonymous: true,
      tags: 'hot-flashes,work',
    },
    {
      title: 'Three months on magnesium supplement - my experience',
      content: 'I started taking magnesium glycinate three months ago and noticed a significant reduction in my night sweats and better sleep quality. Highly recommend talking to your doctor about it!',
      anonymous: false,
      tags: 'supplements,magnesium,sleep',
    },
  ];

  for (const post of samplePosts) {
    await prisma.communityPost.create({
      data: {
        userId: testUser.id,
        ...post,
      },
    });
  }

  console.log('Created sample community posts');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
