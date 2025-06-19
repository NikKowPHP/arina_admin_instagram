import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TriggerList from '@/components/trigger-list';
import CreateTriggerForm, { TriggerFormData } from '@/components/create-trigger-form';
import EditTriggerForm from '@/components/edit-trigger-form';
import useSWR from 'swr';
import { Trigger } from '@/types/database';

export default function TriggersPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);
  const { data: triggers = [], mutate } = useSWR<Trigger[]>('/api/triggers');

  const handleCreateTrigger = async (data: TriggerFormData) => {
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
      mutate();
    } catch (error) {
      console.error('Error creating trigger:', error);
    }
  };

  const handleUpdateTrigger = async (data: TriggerFormData) => {
    if (!editingTrigger) return;
    
    try {
      const response = await fetch(`/api/triggers/${editingTrigger.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update trigger');
      
      setEditingTrigger(null);
      mutate();
    } catch (error) {
      console.error('Error updating trigger:', error);
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

      {editingTrigger && (
        <div className="mb-6 p-4 border rounded-lg bg-background">
          <EditTriggerForm 
            initialData={editingTrigger}
            onSubmit={handleUpdateTrigger} 
            onCancel={() => setEditingTrigger(null)}
          />
        </div>
      )}

      <TriggerList 
        triggers={triggers}
        onEdit={(trigger) => setEditingTrigger(trigger)}
      />
    </div>
  );
}