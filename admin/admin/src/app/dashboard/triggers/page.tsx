import React, { useState, useEffect } from 'react';
import TriggerList from '@/components/trigger-list';
import CreateTriggerForm from '@/components/create-trigger-form';
import EditTriggerForm from '@/components/edit-trigger-form';
import Modal from '@/components/ui/modal';
import { getTriggers, deleteTrigger } from '@/lib/actions';
import { Trigger } from '@/types/database';
import { WebSocketProvider } from '@/lib/websocket-context';

const TriggersPage: React.FC = () => {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchTriggers = async () => {
      const data = await getTriggers();
      setTriggers(data);
    };
    fetchTriggers();
  }, []);

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (trigger: Trigger) => {
    setSelectedTrigger(trigger);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTrigger(id);
    setTriggers(triggers.filter(t => t.id !== id));
  };

  return (
    <WebSocketProvider>
      <div>
        <h1>Triggers</h1>
        <button onClick={handleCreate}>Create Trigger</button>
        <TriggerList triggers={triggers} onEdit={handleEdit} onDelete={handleDelete} />
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
          <CreateTriggerForm />
        </Modal>
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          {selectedTrigger && (
            <EditTriggerForm
              triggerId={selectedTrigger.id}
              initialData={{
                name: selectedTrigger.name,
                keyword: selectedTrigger.keyword,
                status: selectedTrigger.status,
              }}
            />
          )}
        </Modal>
      </div>
    </WebSocketProvider>
  );
};

export default TriggersPage;