import type { BotHealthStatus } from '@/bot-monitor/types'

export function BotHealthStatusCard({ status }: { status: BotHealthStatus }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Bot Health Status</h3>
      <div className="space-y-1">
        <p>Last ping: {status.lastPing.toLocaleString()}</p>
        <p>Status: {status.isHealthy ?
          <span className="text-green-500">Healthy</span> :
          <span className="text-red-500">Unhealthy</span>}
        </p>
        <p>Error count: {status.errorCount}</p>
        {status.storageUsage !== undefined && (
          <p>Storage usage: {status.storageUsage.toFixed(2)} MB</p>
        )}
        {status.authBreaches !== undefined && (
          <p>Auth breaches: {status.authBreaches}</p>
        )}
      </div>
    </div>
  )
}