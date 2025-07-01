'use client';

import React, { useState, useEffect } from 'react';
import TriggerList from '@/components/trigger-list';
import CreateTriggerForm from '@/components/create-trigger-form';
import EditTriggerForm from '@/components/edit-trigger-form';
import Modal from '@/components/ui/modal';
import { getTriggers, deleteTrigger } from '@/lib/actions';
import { Trigger } from '@/types/database';
const TriggersPage: React.FC = () => {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchTriggers = async () => {
    const data = await getTriggers(currentPage);
    setTriggers(data.triggers);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchTriggers();
  }, [currentPage, sortField, sortDirection]);

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (trigger: Trigger) => {
    setSelectedTrigger(trigger);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTrigger(id);
    fetchTriggers(); // Refresh list after delete
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSort = (field: string) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const sortedTriggers = React.useMemo(() => {
    if (!sortField) return triggers;

    return [...triggers].sort((a, b) => {
      const aValue = a[sortField as keyof Trigger] as string;
      const bValue = b[sortField as keyof Trigger] as string;

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [triggers, sortField, sortDirection]);

  return (
    <div>
      <h1>Triggers</h1>
      <button onClick={handleCreate}>Create Trigger</button>
      <div style={{ margin: '10px 0' }}>
        <button onClick={handlePrevPage} disabled={currentPage <= 1}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
          Next
        </button>
      </div>
      <TriggerList
        triggers={sortedTriggers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
        currentSort={{ field: sortField, direction: sortDirection }}
      />
      <Modal isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); fetchTriggers(); }}>
        <CreateTriggerForm />
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); fetchTriggers(); }}>
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
  );
};

export default TriggersPage;