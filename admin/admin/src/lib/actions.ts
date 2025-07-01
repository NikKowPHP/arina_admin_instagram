// file: src/lib/actions.ts

'use server';

import prisma from './prisma'; // Make sure the prisma client is imported
import type { DashboardAnalytics } from '@/app/dashboard/page';
import type { BotHealthStatus } from '@/types/bot-monitor'; // Import this type if needed

export async function getTriggers(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;
  // NOTE: You don't have a `trigger` model in your schema with `name` and `status` fields.
  // This will cause a type error. I'm assuming the model should be `Trigger`.
  const [triggers, totalCount] = await Promise.all([
    prisma.trigger.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
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
  // Assuming 'name', 'keyword', 'status' are not the actual fields.
  // Based on your schema, it should be something like this:
  return prisma.trigger.create({
    data: {
      postId: data.get('postId') as string,
      keyword: data.get('keyword') as string,
      user: {
        connect: {
          id: data.get('userId') as string,
        },
      },
      template: {
        connect: {
          id: data.get('templateId') as string,
        },
      },
    },
  });
}

export async function updateTrigger(id: string, data: FormData) {
  return prisma.trigger.update({
    where: { id },
    data: {
      postId: data.get('postId') as string,
      keyword: data.get('keyword') as string,
      user: {
        connect: {
          id: data.get('userId') as string,
        },
      },
      template: {
        connect: {
          id: data.get('templateId') as string,
        },
      },
    },
  });
}

export async function deleteTrigger(id: string) {
  return prisma.trigger.delete({ where: { id } });
}

// THIS IS A PLACEHOLDER. You don't have an `analytics` table.
// export async function getAnalytics() {
//   // You don't have an `analytics` model in your schema.
//   // This will fail. You should probably remove or implement this.
//   // For now, returning an empty array to prevent crashes.
//   return [];
// }

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  // NOTE: You don't have `userActivity`, `botHealth`, or `templateUsage` tables.
  // These queries will fail. I am providing mock data to prevent the app from crashing.
  const [triggerActivations, userActivity, systemHealth, templateUsage] = await Promise.all([
    prisma.trigger.count(),
    Promise.resolve({ totalUsers: 10, activityLogEntries: 100, dmsSent: 50 }), // Mock data
    Promise.resolve({ isHealthy: true, lastPing: new Date(), errorCount: 0, storageUsage: 123, authBreaches: 0, lastCheck: new Date(), mediaCacheCount: 0, status: 'Operational', uptime: 99.9 }), // Mock data
    Promise.resolve([{ name: 'Welcome DM', count: 25 }, { name: 'Promo DM', count: 15 }]) // Mock data
  ]);

  return {
    triggerActivations,
    userActivity,
    systemHealth: systemHealth as BotHealthStatus,
    templateUsage,
  };
}

export async function getBotHealth() {
  // NOTE: You don't have a `botHealth` table.
  // Returning mock data.
  return Promise.resolve({ isHealthy: true, lastPing: new Date(), errorCount: 0, storageUsage: 123, authBreaches: 0, lastCheck: new Date(), mediaCacheCount: 0, status: 'Operational', uptime: 99.9 });
}