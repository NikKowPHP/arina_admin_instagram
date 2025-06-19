import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Trigger } from '@/types/database';
import { Edit, Trash2 } from 'lucide-react';

interface TriggerListProps {
  triggers: Trigger[];
  onEdit: (trigger: Trigger) => void;
  onDelete: (trigger: Trigger) => void;
}

export default function TriggerList({ triggers, onEdit, onDelete }: TriggerListProps) {
  return (
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
        {triggers.map((trigger) => (
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
  );
}