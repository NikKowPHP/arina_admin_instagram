'use client';

import React, { useState, useEffect } from 'react';
import TriggerList from '@/components/trigger-list';
import CreateTriggerForm from '@/components/create-trigger-form';
import EditTriggerForm from '@/components/edit-trigger-form';
import Modal from '@/components/ui/modal';
import { getTriggers, deleteTrigger, getTemplates, createTrigger, updateTrigger } from '@/lib/actions';
import { Trigger } from '@prisma/client';

interface TemplateOption {
  id: string;
  name: string;
}

const TriggersPage: React.FC = () => {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
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

  const fetchTemplates = async () => {
    const templates = await getTemplates();
    setTemplates(templates);
  };

  useEffect(() => {
    fetchTriggers();
    fetchTemplates();
  }, [currentPage, sortField, sortDirection]);

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (trigger: Trigger) => {
    setSelectedTrigger(trigger);
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (data: FormData) => {
    try {
      await createTrigger(data);
      fetchTriggers();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create trigger:', error);
    }
  };

  const handleEditSubmit = async (id: string, data: FormData) => {
    try {
      await updateTrigger(id, data);
      fetchTriggers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update trigger:', error);
    }
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
    <div className="p-8 mt-16"> {/* Added mt-16 for spacing from fixed sidebar */}
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold text-white mb-4">How Triggers Work</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Create a <strong>Template</strong>: This is the DM you want to send.</li>
          <li>Create a <strong>Trigger</strong>: This links a keyword to a specific Instagram post and your chosen template.</li>
          <li>When a user comments with the <strong>keyword</strong> on that <strong>post</strong>, the bot sends them your <strong>template</strong> message.</li>
        </ol>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Triggers</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Create Trigger
        </button>
      </div>

      <div className="flex justify-center items-center mb-6 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-300 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
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
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <CreateTriggerForm templates={templates} onSubmit={handleCreateSubmit} />
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {selectedTrigger && (
          <EditTriggerForm
            triggerId={selectedTrigger.id}
            initialData={{
              postId: selectedTrigger.postId,
              keyword: selectedTrigger.keyword,
              templateId: selectedTrigger.templateId
            }}
            onSubmit={handleEditSubmit}
          />
        )}
      </Modal>
    </div>
  );
};

export default TriggersPage;