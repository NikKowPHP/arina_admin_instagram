import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { DashboardAnalytics } from '@/app/dashboard/page';
import type { BotHealthStatus } from '@/types/bot-monitor';

export async function GET() {
  try {
    const [
      triggerActivations,
      totalUsers,
      activityLogEntries,
      dmsSent,
      templateUsage,
      errorCount,
    ] = await Promise.all([
      prisma.trigger.count(),
      prisma.user.count(),
      prisma.activityLog.count(),
      prisma.activityLog.count({ where: { action: 'dm_sent' } }), // Assuming 'dm_sent' action for DMs
      prisma.template.findMany({
        select: {
          id: true, // Use id instead of name
          _count: {
            select: {
              triggers: true,
            },
          },
        },
      }),
      prisma.deadLetterQueue.count(),
    ]);

    // Placeholder for systemHealth as there's no direct model in schema.prisma for all fields
    const systemHealth: BotHealthStatus = {
      isHealthy: true, // Placeholder
      lastPing: new Date(), // Placeholder
      errorCount: errorCount,
      storageUsage: 0, // Placeholder
      authBreaches: 0, // Placeholder
      lastCheck: new Date(), // Placeholder
      mediaCacheCount: 0, // Placeholder
      status: 'Operational', // Placeholder
      uptime: 99.9, // Placeholder
    };

    const analytics: DashboardAnalytics = {
      triggerActivations,
      userActivity: {
        totalUsers,
        activityLogEntries,
        dmsSent,
      },
      systemHealth: systemHealth,
      templateUsage: templateUsage.map((template: { id: string; _count: { triggers: number } }) => ({
        id: template.id, // Use id as name for display
        count: template._count.triggers,
      })),
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard analytics' }, { status: 500 });
  }
}