'use client'

import { useState, useEffect } from 'react'
import { BarChart } from '@/components/ui/bar-chart'
import { LineChart } from '@/components/ui/line-chart'
import { PieChart } from '@/components/ui/pie-chart'
import { Card } from '@/components/ui/card'
import { getAnalytics, getDashboardAnalytics } from '@/lib/actions'

type TriggerUsage = Array<{ date: string; count: number }>
type DashboardAnalytics = {
  triggerActivations: number
  userActivity: {
    totalUsers: number
    activeUsers: number
  }
  templateUsage: Array<{ name: string; count: number }>
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')
  const [chartData, setChartData] = useState<{
    triggerUsage: TriggerUsage
    analytics: DashboardAnalytics | null
  }>({
    triggerUsage: [],
    analytics: null
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [basicAnalytics, dashboardAnalytics] = await Promise.all([
          getAnalytics(),
          getDashboardAnalytics()
        ])
        // Convert triggerUsage counts to numbers
        const typedTriggerUsage = basicAnalytics.triggerUsage.map(item => ({
          date: item.date,
          count: Number(item.count)
        }))
        setChartData({
          triggerUsage: typedTriggerUsage,
          analytics: dashboardAnalytics
        })
      } catch (error) {
        console.error('Error fetching analytics:', error)
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg mb-4">Trigger Activity</h2>
          <BarChart
            datasets={chartData.triggerUsage}
            xAxis="date"
            yFields={['count']}
          />
        </Card>

        <Card>
          <h2 className="text-lg mb-4">User Activity</h2>
          {chartData.analytics && (
            <LineChart
              datasets={[
                { total: chartData.analytics.userActivity.totalUsers },
                { active: chartData.analytics.userActivity.activeUsers }
              ]}
              xAxis="date"
              yFields={['total', 'active']}
              colors={['#3b82f6', '#10b981']}
            />
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