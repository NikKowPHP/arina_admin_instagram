import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Trigger } from '@/types/database';
import { Edit } from 'lucide-react';

interface TriggerListProps {
  triggers: Trigger[];
  onEdit: (trigger: Trigger) => void;
}

export default function TriggerList({ triggers, onEdit }: TriggerListProps) {
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
            <td>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(trigger)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}