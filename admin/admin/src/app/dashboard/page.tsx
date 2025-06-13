import { BarChart, Card } from '@/components/ui'
import { getAnalytics } from '@/lib/actions'

export default async function DashboardPage() {
  const data = await getAnalytics()
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      
      <Card>
        <h2 className="text-lg mb-4">Trigger Activity</h2>
        <BarChart
          data={data.triggerUsage}
          xAxis="date"
          yAxis="count"
        />
      </Card>

      {/* Add more chart components */}
    </div>
  )
}