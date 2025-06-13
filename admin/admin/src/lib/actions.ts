import { createClient } from './supabase'

export async function getAnalytics() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString())
  
  if (error) throw error
  
  // Process data into chart formats
  return {
    triggerUsage: data.map(entry => ({
      date: new Date(entry.created_at).toLocaleDateString(),
      count: entry.action === 'trigger' ? 1 : 0
    }))
  }
}