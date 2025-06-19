import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WebSocketProvider } from '@/lib/websocket-context';
import TriggerList from '@/components/trigger-list';
import CreateTriggerForm from '@/components/create-trigger-form';
import EditTriggerForm from '@/components/edit-trigger-form';
import Modal from '@/components/ui/modal';
import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import { Trigger } from '@/types/database';

interface TriggerFormData {
  name: string;
  keyword: string;
  status: 'active' | 'inactive';
}

export default function TriggersPage() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTrigger, setCurrentTrigger] = useState<Trigger | null>(null);

  const handleCreate = (newTrigger: TriggerFormData) => {
    const trigger: Trigger = {
      ...newTrigger,
      id: (triggers.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTriggers([...triggers, trigger]);
    setIsCreateModalOpen(false);
  };

  const handleEdit = (updatedTrigger: TriggerFormData) => {
    if (currentTrigger) {
      const trigger: Trigger = {
        ...currentTrigger,
        ...updatedTrigger,
        updatedAt: new Date().toISOString(),
      };
      setTriggers(triggers.map(t => (t.id === trigger.id ? trigger : t)));
      setIsEditModalOpen(false);
    }
  };

  const handleDelete = (trigger: Trigger) => {
    setCurrentTrigger(trigger);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentTrigger) {
      // In a real application, you would make an API call here
      setTriggers(triggers.filter(t => t.id !== currentTrigger.id));
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <WebSocketProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Triggers</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Trigger</Button>
        </div>
        <TriggerList
          triggers={triggers}
          onEdit={setCurrentTrigger}
          onDelete={handleDelete}
        />
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        >
          <CreateTriggerForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>
        <Modal
          isOpen={isEditModalOpen && currentTrigger !== null}
          onClose={() => setIsEditModalOpen(false)}
        >
          {currentTrigger && (
            <EditTriggerForm
              initialData={{
                name: currentTrigger.name,
                keyword: currentTrigger.keyword,
                status: currentTrigger.status,
              }}
              onSubmit={handleEdit}
              onCancel={() => setIsEditModalOpen(false)}
            />
          )}
        </Modal>
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          triggerName={currentTrigger?.name || ''}
        />
      </div>
    </WebSocketProvider>
  );
}