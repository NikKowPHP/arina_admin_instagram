'use client'

import { useState, useEffect, useRef } from 'react'
import { BarChart } from '@/components/ui/bar-chart'
import { LineChart } from '@/components/ui/line-chart'
import { PieChart } from '@/components/ui/pie-chart'
import { Card } from '@/components/ui/card'
import { ChartControls } from '@/components/chart-controls'
import { BotHealthStatusCard } from '@/components/bot-health-status'
import { getAnalytics, getDashboardAnalytics, getBotHealth } from '@/lib/actions'
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
  templateUsage: Array<{ name: string; count: number }>
}

// ROO-AUDIT-TAG :: plan-007-dashboard.md :: Implement analytics dashboard
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')
  const [chartType, setChartType] = useState('bar')
  const [visibleData, setVisibleData] = useState(['Triggers', 'Users', 'Templates'])
  const [chartData, setChartData] = useState<{
    triggerUsage: TriggerUsage
    analytics: DashboardAnalytics | null
  }>({
    triggerUsage: [],
    analytics: null
  })
  const [botHealth, setBotHealth] = useState<{ status: BotHealthStatus | null; error: string | null }>({ status: null, error: null })

  // WebSocket ref to persist connection
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = new WebSocket('ws://localhost:8082')

    // Set up WebSocket event handlers
    socket.onopen = () => {
      console.log('WebSocket connected')
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === 'initial') {
        // Handle initial data load
        const { triggerUsage, userActivity, templateUsage, triggerActivations, systemHealth } = message.data

        // Convert triggerUsage counts to numbers
        const typedTriggerUsage = triggerUsage.map((item: { date: string; count: number }) => ({
          date: item.date,
          count: Number(item.count)
        }))

        setChartData({
          triggerUsage: typedTriggerUsage,
          analytics: {
            triggerActivations: triggerActivations,
            userActivity: userActivity,
            systemHealth: systemHealth,
            templateUsage: templateUsage.map((t: { content: string; count: number }) => ({
              name: t.content,
              count: t.count
            }))
          }
        })
      } else if (message.type === 'update') {
        // Handle real-time updates
        setChartData(prevData => {
          if (!prevData.analytics) return prevData

          return {
            ...prevData,
            analytics: {
              ...prevData.analytics,
              userActivity: {
                ...prevData.analytics.userActivity,
                ...message.data.userActivity
              }
            }
          }
        })
      }
    }

    socket.onclose = () => {
      console.log('WebSocket disconnected')
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    // Store WebSocket instance in ref
    ws.current = socket

    // Clean up on component unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [basicAnalytics, dashboardAnalytics, botHealthStatus] = await Promise.all([
          getAnalytics(),
          getDashboardAnalytics(),
          getBotHealth()
        ])
        // Convert triggerUsage counts to numbers
        const typedTriggerUsage = basicAnalytics.triggerUsage.map((item: { date: string; count: number }) => ({
          date: item.date,
          count: Number(item.count)
        }))
        setChartData({
          triggerUsage: typedTriggerUsage,
          analytics: dashboardAnalytics
        })
        setBotHealth({ status: botHealthStatus, error: null })
      } catch (error) {
        console.error('Error fetching analytics:', error)
        setBotHealth({ status: null, error: 'Failed to fetch bot health' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

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
        <Card>
          <h2 className="text-lg mb-4">Bot Health Status</h2>
          {botHealth.error ? (
            <p className="text-red-500">Error: {botHealth.error}</p>
          ) : (
            botHealth.status && <BotHealthStatusCard status={botHealth.status} />
          )}
        </Card>

        <Card>
          <h2 className="text-lg mb-4">Trigger Activity</h2>
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

        <Card>
          <h2 className="text-lg mb-4">User Activity</h2>
          {chartData.analytics && (
            <LineChart
              datasets={[
                { total: chartData.analytics.userActivity.totalUsers },
                { active: chartData.analytics.userActivity.activityLogEntries }
              ]}
              xAxis="date"
              yFields={['total', 'active']}
              colors={['#3b82f6', '#10b981']}
            />
          )}
        </Card>

        <Card>
          <h2 className="text-lg mb-4">DMs Sent</h2>
          {chartData.analytics && (
            <div className="flex flex-col items-center justify-center h-32">
              <p className="text-4xl font-bold">{chartData.analytics.userActivity.dmsSent}</p>
              <p className="text-sm text-gray-500">DMs sent in the last 7 days</p>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg mb-4">System Health</h2>
          {chartData.analytics && (
            <div className="space-y-2">
              <p><strong>Last Ping:</strong> {new Date(chartData.analytics.systemHealth.lastPing).toLocaleString()}</p>
              <p><strong>Status:</strong> {chartData.analytics.systemHealth.isHealthy ? 'Healthy' : 'Unhealthy'}</p>
              <p><strong>Errors:</strong> {chartData.analytics.systemHealth.errorCount}</p>
              {chartData.analytics.systemHealth.storageUsage !== undefined && (
                <p><strong>Storage:</strong> {chartData.analytics.systemHealth.storageUsage} MB</p>
              )}
              {chartData.analytics.systemHealth.authBreaches !== undefined && (
                <p><strong>Auth Breaches:</strong> {chartData.analytics.systemHealth.authBreaches}</p>
              )}
            </div>
          )}
        </Card>

        <Card className="md:col-span-2">
          <h2 className="text-lg mb-4">Template Usage</h2>
          {chartData.analytics && (
            <div className="max-w-md mx-auto">
              <PieChart
                datasets={chartData.analytics.templateUsage}
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