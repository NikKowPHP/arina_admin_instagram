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

    // Get real bot health status from database
    const botStatus = await prisma.botStatus.findUnique({
      where: { serviceName: 'instagram_bot' }
    });

    const systemHealth: BotHealthStatus = {
      isHealthy: botStatus?.isHealthy ?? false,
      lastPing: botStatus?.lastPing ?? new Date(0),
      errorCount: errorCount,
      storageUsage: 0, // Still placeholder as not tracked
      authBreaches: 0, // Still placeholder as not tracked
      lastCheck: botStatus?.lastPing ?? new Date(0),
      mediaCacheCount: 0, // Still placeholder as not tracked
      status: botStatus?.isHealthy ? 'Operational' : 'Degraded',
      uptime: 99.9, // Still placeholder as not tracked
      ...(botStatus?.details ? JSON.parse(JSON.stringify(botStatus.details)) : {})
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