import { NextResponse } from 'next/server'
import { WebSocket, WebSocketServer } from 'ws'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create a WebSocket server
const wss = new WebSocketServer({ port: 8082 })

// Broadcast function to send data to all connected clients
function broadcast(data: string) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

// Handle new WebSocket connections
wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected')

  // Send initial data
  async function sendInitialData() {
    try {
      // Get trigger activations
      const triggerActivations = await prisma.trigger.count({
        where: { isActive: true }
      })

      // Get user activity metrics
      const totalUsers = await prisma.user.count()
      const activityLogEntries = await prisma.activityLog.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 86400000) // Last 7 days
          }
        }
      })

      // Get DMs sent count
      const dmsSent = await prisma.activityLog.count({
        where: {
          action: 'sent_dm',
          createdAt: {
            gte: new Date(Date.now() - 7 * 86400000) // Last 7 days
          }
        }
      })

      // Get template usage stats
      const templateUsage = await prisma.template.findMany({
        select: {
          content: true,
          _count: {
            select: { triggers: true }
          }
        },
        orderBy: {
          triggers: {
            _count: 'desc'
          }
        },
        take: 5
      })

      // Send initial data
      ws.send(
        JSON.stringify({
          type: 'initial',
          data: {
            triggerActivations,
            userActivity: {
              totalUsers,
              activityLogEntries,
              dmsSent
            },
            templateUsage: templateUsage.map((t: { content: string; _count: { triggers: number } }) => ({
              content: t.content,
              count: t._count.triggers
            }))
          }
        })
      )
    } catch (error) {
      console.error('Error sending initial data:', error)
    }
  }

  sendInitialData()

  // Handle messages from client
  ws.on('message', (message) => {
    console.log('Received:', message)
  })

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

// Handle HTTP requests to this route
export async function GET() {
  return NextResponse.json({ message: 'WebSocket server is running on ws://localhost:8082' })
}

export async function POST() {
  return NextResponse.json({ message: 'WebSocket server is running on ws://localhost:8082' })
}