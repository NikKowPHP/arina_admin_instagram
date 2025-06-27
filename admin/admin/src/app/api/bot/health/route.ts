import { NextResponse } from 'next/server'
import { BotMonitor } from '@/bot-monitor/service'

// Initialize the bot monitor with the appropriate endpoint
const botMonitor = new BotMonitor('/api/bot/healthcheck', '/path/to/media/cache')

export async function GET() {
  // Start the monitor if it's not already running
  if (!botMonitor.storageCheckInterval) {
    botMonitor.start()
  }

  // Return the current health status
  const healthStatus = botMonitor.getCurrentHealth()

  return NextResponse.json(healthStatus, { status: 200 })
}