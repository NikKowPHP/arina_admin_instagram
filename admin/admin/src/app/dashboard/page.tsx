'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { BarChart } from '@/components/ui/bar-chart'
import { LineChart } from '@/components/ui/line-chart'
import { PieChart } from '@/components/ui/pie-chart'
import { Card } from '@/components/ui/card'
import { ChartControls } from '@/components/chart-controls'
import { BotHealthStatusCard } from '@/components/bot-health-status'
import type { BotHealthStatus } from '@/types/bot-monitor'

type TriggerUsage = Array<{ date: string; count: number }>
export type DashboardAnalytics = {
  triggerActivations: number
  userActivity: {
    totalUsers: number
    activityLogEntries: number
    dmsSent: number
  }
  systemHealth: BotHealthStatus
  templateUsage: Array<{ id: string; count: number }>
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard analytics')
  }
  return res.json()
})

// ROO-AUDIT-TAG :: plan-007-dashboard.md :: Implement analytics dashboard
export default function DashboardPage() {
  const [dateRange, setDateRange] = useState('7d')
  const [chartType, setChartType] = useState('bar')
  const [visibleData, setVisibleData] = useState(['Triggers', 'Users', 'Templates'])

  const { data, error, isLoading } = useSWR<DashboardAnalytics>(
    '/api/dashboard/analytics',
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: false
    }
  )

  const botHealth = {
    status: data?.systemHealth || null,
    error: error ? 'Failed to fetch bot health' : null
  }

  const chartData = {
    triggerUsage: [] as TriggerUsage,
    analytics: data || null
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
        <div className="text-red-500">Error loading dashboard data: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <ChartControls
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          chartType={chartType}
          onChartTypeChange={setChartType}
          visibleData={visibleData}
          onVisibleDataChange={setVisibleData}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border border-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Bot Health Status</h2>
          {botHealth.error ? (
            <p className="text-red-400">Error: {botHealth.error}</p>
          ) : (
            botHealth.status && <BotHealthStatusCard status={botHealth.status} />
          )}
        </Card>

        <Card className="bg-gray-900 border border-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Trigger Activity</h2>
          {chartType === 'bar' && (
            <BarChart
              datasets={chartData.triggerUsage}
              xAxis="date"
              yFields={['count']}
            />
          )}
          {chartType === 'line' && (
            <LineChart
              datasets={chartData.triggerUsage}
              xAxis="date"
              yFields={['count']}
            />
          )}
          {chartType === 'pie' && (
            <PieChart
              datasets={chartData.triggerUsage}
              labelField="date"
              valueField="count"
            />
          )}
        </Card>

        <Card className="bg-gray-900 border border-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">User Activity</h2>
          {data && (
            <LineChart
              datasets={[
                { total: data.userActivity.totalUsers },
                { active: data.userActivity.activityLogEntries }
              ]}
              xAxis="date"
              yFields={['total', 'active']}
              colors={['#3b82f6', '#10b981']}
            />
          )}
        </Card>

        <Card className="bg-gray-900 border border-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">DMs Sent</h2>
          {data && (
            <div className="flex flex-col items-center justify-center h-32 text-white">
              <p className="text-5xl font-bold">{data.userActivity.dmsSent}</p>
              <p className="text-sm text-gray-400">DMs sent in the last 7 days</p>
            </div>
          )}
        </Card>

        <Card className="bg-gray-900 border border-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">System Health</h2>
          {data && (
            <div className="space-y-2 text-gray-300">
              <p><strong>Last Ping:</strong> {new Date(data.systemHealth.lastPing).toLocaleString()}</p>
              <p><strong>Status:</strong> {data.systemHealth.isHealthy ? 'Healthy' : 'Unhealthy'}</p>
              <p><strong>Errors:</strong> {data.systemHealth.errorCount}</p>
              {data.systemHealth.storageUsage !== undefined && (
                <p><strong>Storage:</strong> {data.systemHealth.storageUsage} MB</p>
              )}
              {data.systemHealth.authBreaches !== undefined && (
                <p><strong>Auth Breaches:</strong> {data.systemHealth.authBreaches}</p>
              )}
            </div>
          )}
        </Card>

        <Card className="md:col-span-2 lg:col-span-3 bg-gray-900 border border-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Template Usage</h2>
          {data && (
            <div className="max-w-md mx-auto">
              <PieChart
                datasets={data.templateUsage}
                labelField="name"
                valueField="count"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
// ROO-AUDIT-TAG :: plan-007-dashboard.md :: END