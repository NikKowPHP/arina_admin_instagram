// ROO-AUDIT-TAG :: plan-005-trigger-management.md :: Implement trigger management UI
'use client';

import React, { useEffect, useState } from 'react';
import { Trigger } from '@prisma/client';
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
    <table>
      <thead>
        <tr>
          <th onClick={() => onSort?.('postId')}>
            Post ID {getSortIcon('postId')}
          </th>
          <th onClick={() => onSort?.('keyword')}>
            Keyword {getSortIcon('keyword')}
          </th>
          <th onClick={() => onSort?.('isActive')}>
            Active {getSortIcon('isActive')}
          </th>
          <th onClick={() => onSort?.('userId')}>
            User ID {getSortIcon('userId')}
          </th>
          <th onClick={() => onSort?.('templateId')}>
            Template ID {getSortIcon('templateId')}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {triggerData.map((trigger: Trigger) => (
          <tr key={trigger.id}>
            <td>{trigger.postId}</td>
            <td>{trigger.keyword}</td>
            <td>{trigger.isActive ? 'Yes' : 'No'}</td>
            <td>{trigger.userId}</td>
            <td>{trigger.templateId}</td>
            <td>
              <button onClick={() => onEdit(trigger)}>Edit</button>
              <button onClick={() => onDelete(trigger.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TriggerList;
// ROO-AUDIT-TAG :: plan-005-trigger-management.md :: END