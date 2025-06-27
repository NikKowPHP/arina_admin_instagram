// ROO-AUDIT-TAG :: plan-005-trigger-management.md :: Implement trigger management UI
'use client';

import React, { useEffect, useState } from 'react';
import { Trigger } from '@/types/database';
import { useWebSocket } from '@/lib/websocket-context';

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
  const { socket } = useWebSocket();
  const [triggerData, setTriggerData] = useState(triggers);

  useEffect(() => {
    setTriggerData(triggers);
  }, [triggers]);

  /**
   * Handles trigger update events from the websocket
   * @param {{triggerId: string}} data - Update event data containing trigger ID
   */
  const handleTriggerUpdate = (data: { triggerId: string }) => {
    console.log(`Trigger updated received: ${data.triggerId}`);
    // Refresh the trigger list
    // In a real implementation, you would fetch the updated trigger data from the server
    // For now, we'll just log the event
  };

  // ROO-AUDIT-TAG :: plan-002-code-quality.md :: Refactoring
  /**
   * Sets up websocket listeners for trigger updates
   * @returns {Function} Cleanup function to remove listeners
   */
  const setupSocketListeners = () => {
    if (socket) {
      socket.on('trigger_updated', handleTriggerUpdate);
    }
    return () => {
      if (socket) {
        socket.off('trigger_updated', handleTriggerUpdate);
      }
    };
  };

  useEffect(setupSocketListeners, [socket]);
  // ROO-AUDIT-TAG :: plan-002-code-quality.md :: END

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
          <th onClick={() => onSort?.('name')}>
            Name {getSortIcon('name')}
          </th>
          <th onClick={() => onSort?.('keyword')}>
            Keyword {getSortIcon('keyword')}
          </th>
          <th onClick={() => onSort?.('status')}>
            Status {getSortIcon('status')}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {triggerData.map((trigger: Trigger) => (
          <tr key={trigger.id}>
            <td>{trigger.name}</td>
            <td>{trigger.keyword}</td>
            <td>{trigger.status}</td>
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