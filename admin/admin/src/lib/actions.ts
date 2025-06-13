// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createClient } from './supabase'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaClient } from '@prisma/client'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { templateSchema } from './validators'

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

export async function createTemplate(formData: FormData) {
  const validated = templateSchema.parse(Object.fromEntries(formData));
  try {
    return await prisma.template.create({ data: validated });
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
}

export async function updateTemplate(id: string, formData: FormData) {
  const validated = templateSchema.parse(Object.fromEntries(formData));
  try {
    return await prisma.template.update({
      where: { id },
      data: validated
    });
  } catch (error) {
    console.error('Error updating template:', error);
    throw error;
  }
}

export async function deleteTemplate(id: string) {
  try {
    return await prisma.template.delete({ where: { id } });
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
}

export async function getDashboardAnalytics() {
  try {
    // Get trigger activation counts
    const triggerActivations = await prisma.trigger.count({
      where: { isActive: true }
    })

    // Get user activity metrics
    const totalUsers = await prisma.user.count()
    const activeUsers = await prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 7 * 86400000) // Last 7 days
        }
      }
    })

    // Get template usage stats
    const templateUsage = await prisma.template.findMany({
      select: {
        name: true,
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

    return {
      triggerActivations,
      userActivity: {
        totalUsers,
        activeUsers
      },
      templateUsage: templateUsage.map((t: { name: string; _count: { triggers: number } }) => ({
        name: t.name,
        count: t._count.triggers
      }))
    }
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error)
    throw error
  }
}