import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Trigger } from '@/types/database';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TriggerListProps {
  triggers: Trigger[];
  onEdit: (trigger: Trigger) => void;
  onDelete: (trigger: Trigger) => void;
}

export default function TriggerList({ triggers, onEdit, onDelete }: TriggerListProps) {
  const [sortField, setSortField] = useState<'name' | 'keyword' | 'status' | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedTriggers = [...triggers].sort((a, b) => {
    if (!sortField) return 0;

    let aValue: string | number = '';
    let bValue: string | number = '';

    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'keyword':
        aValue = a.keyword;
        bValue = b.keyword;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedTriggers = sortedTriggers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(triggers.length / itemsPerPage);

  const handleSort = (field: 'name' | 'keyword' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('name')}
            className={sortField === 'name' ? 'bg-gray-100' : ''}
          >
            Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('keyword')}
            className={sortField === 'keyword' ? 'bg-gray-100' : ''}
          >
            Keyword {sortField === 'keyword' && (sortDirection === 'asc' ? '↑' : '↓')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('status')}
            className={sortField === 'status' ? 'bg-gray-100' : ''}
          >
            Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Keyword</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTriggers.map((trigger) => (
            <tr key={trigger.id}>
              <td>{trigger.name}</td>
              <td>{trigger.keyword}</td>
              <td>{trigger.status}</td>
              <td className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(trigger)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete(trigger)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}