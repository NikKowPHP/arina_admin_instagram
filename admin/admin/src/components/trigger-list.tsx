// ROO-AUDIT-TAG :: plan-005-trigger-management.md :: Implement trigger management UI
'use client';

import React, { useEffect, useState } from 'react';
import { Trigger } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Assuming these are the correct imports

interface TriggerListProps {
  triggers: Trigger[];
  onEdit: (trigger: Trigger) => void;
  onDelete: (id: string) => void;
  onSort?: (field: string) => void;
  currentSort?: { field: string; direction: 'asc' | 'desc' };
}

/**
 * Component that displays a list of triggers with sorting and action capabilities
 * @param {TriggerListProps} props - Component props
 * @returns {React.ReactElement} The rendered trigger list component
 */
const TriggerList: React.FC<TriggerListProps> = ({
  triggers,
  onEdit,
  onDelete,
  onSort,
  currentSort
}) => {
  const [triggerData, setTriggerData] = useState(triggers);

  useEffect(() => {
    setTriggerData(triggers);
  }, [triggers]);

  /**
   * Gets the sort direction icon for a given field
   * @param {string} field - The field name to check
   * @returns {string|null} The sort icon or null if not active
   */
  const getSortIcon = (field: string) => {
    if (!currentSort) return null;
    if (currentSort.field !== field) return null;
    return currentSort.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => onSort?.('postId')} className="cursor-pointer">
              Post ID {getSortIcon('postId')}
            </TableHead>
            <TableHead onClick={() => onSort?.('keyword')} className="cursor-pointer">
              Keyword {getSortIcon('keyword')}
            </TableHead>
            <TableHead onClick={() => onSort?.('isActive')} className="cursor-pointer">
              Active {getSortIcon('isActive')}
            </TableHead>
            <TableHead onClick={() => onSort?.('userId')} className="cursor-pointer">
              User ID {getSortIcon('userId')}
            </TableHead>
            <TableHead onClick={() => onSort?.('templateId')} className="cursor-pointer">
              Template ID {getSortIcon('templateId')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {triggerData.map((trigger: Trigger) => (
            <TableRow key={trigger.id}>
              <TableCell>{trigger.postId}</TableCell>
              <TableCell>{trigger.keyword}</TableCell>
              <TableCell>{trigger.isActive ? 'Yes' : 'No'}</TableCell>
              <TableCell>{trigger.userId}</TableCell>
              <TableCell>{trigger.templateId}</TableCell>
              <TableCell>
                <button
                  onClick={() => onEdit(trigger)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(trigger.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TriggerList;
// ROO-AUDIT-TAG :: plan-005-trigger-management.md :: END