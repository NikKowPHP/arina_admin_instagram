import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import useSWR from 'swr';
import { Trigger } from '@/types/database';

export default function TriggerList() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: triggers, error, isLoading } = useSWR<Trigger[]>('/api/triggers');

  const filteredTriggers = triggers?.filter(trigger => 
    trigger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trigger.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <div>Loading triggers...</div>;
  if (error) return <div>Error loading triggers: {error.message}</div>;

  return (
    <div className="space-y-4">
      <Input 
        placeholder="Search triggers..." 
        className="max-w-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
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
          {filteredTriggers.map(trigger => (
            <tr key={trigger.id}>
              <td>{trigger.name}</td>
              <td>{trigger.keyword}</td>
              <td>{trigger.status}</td>
              <td>
                {/* Will add action buttons later */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}