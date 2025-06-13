import { createClient } from './supabase'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getAnalytics() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString())
  
  if (error) throw error

  // Aggregate data by date
  const groupedData = data.reduce((acc, entry) => {
    const date = new Date(entry.created_at).toLocaleDateString()
    if (!acc[date]) acc[date] = 0
    acc[date] += (entry.action === 'trigger' ? 1 : 0)
    return acc
  }, {})

  // Convert to array format
  const triggerUsage = Object.entries(groupedData).map(([date, count]) => ({
    date,
    count
  }))

  return { triggerUsage }
}

export async function createTrigger(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const triggerData = {
    postId: formData.get('postId') as string,
    keyword: formData.get('keyword') as string,
    isActive: formData.get('isActive') === 'on',
    userId: user.id,
    templateId: formData.get('templateId') as string
  }

  try {
    const newTrigger = await prisma.trigger.create({
      data: triggerData
    })
    return newTrigger
  } catch (error) {
    console.error('Error creating trigger:', error)
    throw error
  }
}