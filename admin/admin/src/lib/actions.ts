import { createClient } from './supabase'

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