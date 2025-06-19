import React from 'react';
import { Trigger } from '@/types/database';

interface TriggerListProps {
  triggers: Trigger[];
  onEdit: (trigger: Trigger) => void;
  onDelete: (id: string) => void;
}

const TriggerList: React.FC<TriggerListProps> = ({ triggers, onEdit, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Keyword</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {triggers.map(trigger => (
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