import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import TriggerList from '@/components/trigger-list'

export default function TriggersPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trigger Management</h1>
        <Button variant="primary">
          <Plus className="mr-2 h-4 w-4" />
          Create New Trigger
        </Button>
      </div>
      <TriggerList />
    </div>
  )
}