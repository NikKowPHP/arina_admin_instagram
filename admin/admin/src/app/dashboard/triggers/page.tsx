import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TriggerList from '@/components/trigger-list';
import CreateTriggerForm from '@/components/create-trigger-form';

export default function TriggersPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateTrigger = async (data) => {
    try {
      const response = await fetch('/api/triggers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create trigger');
      
      setShowCreateForm(false);
      // TODO: Refresh trigger list
    } catch (error) {
      console.error('Error creating trigger:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trigger Management</h1>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Trigger
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 border rounded-lg bg-background">
          <CreateTriggerForm
            onSubmit={handleCreateTrigger}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      <TriggerList />
    </div>
  );
}