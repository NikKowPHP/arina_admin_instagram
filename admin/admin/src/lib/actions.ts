import type { DashboardAnalytics } from '@/app/dashboard/page';

export async function getTriggers(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;
  const [triggers, totalCount] = await Promise.all([
    prisma.trigger.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' } // Assuming triggers are ordered by creation date
    }),
    prisma.trigger.count()
  ]);

  return {
    triggers,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page
  };
}

export async function createTrigger(data: FormData) {
  return prisma.trigger.create({
    data: {
      name: data.get('name') as string,
      keyword: data.get('keyword') as string,
      status: data.get('status') as string,
    },
  });
}

export async function updateTrigger(id: string, data: FormData) {
  return prisma.trigger.update({
    where: { id },
    data: {
      name: data.get('name') as string,
      keyword: data.get('keyword') as string,
      status: data.get('status') as string,
    },
  });
}

export async function deleteTrigger(id: string) {
  return prisma.trigger.delete({ where: { id } });
}

export async function getAnalytics() {
  return prisma.analytics.findMany();
}

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const [triggerActivations, userActivity, systemHealth, templateUsage] = await Promise.all([
    prisma.trigger.count(),
    prisma.userActivity.findFirst().then((activity: { totalUsers?: number; logEntries?: number; dmsSent?: number } | null) => ({
      totalUsers: activity?.totalUsers ?? 0,
      activityLogEntries: activity?.logEntries ?? 0,
      dmsSent: activity?.dmsSent ?? 0
    })),
    prisma.botHealth.findFirst({
      orderBy: { createdAt: 'desc' }
    }),
    prisma.templateUsage.findMany()
  ]);

  return {
    triggerActivations,
    userActivity,
    systemHealth: systemHealth || { isHealthy: false, lastPing: new Date(), errorCount: 0 },
    templateUsage: templateUsage.map((t: { name: string; count: number }) => ({
      name: t.name,
      count: t.count
    }))
  };
}

export async function getBotHealth() {
  return prisma.botHealth.findFirst({
    orderBy: { createdAt: 'desc' }
  });
}