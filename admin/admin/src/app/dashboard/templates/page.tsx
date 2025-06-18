'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/lib/supabase-provider';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Template {
  id: string;
  name: string;
  content: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useSupabase();

  useEffect(() => {
    fetchTemplates();
  }, [supabase]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('templates').select('*');
    if (error) {
      console.error('Error fetching templates:', error);
    } else {
      setTemplates(data || []);
    }
    setIsLoading(false);
  };

  const handleCreate = () => {
    // Implement create template logic
  };

  const handleEdit = (id: string) => {
    // Implement edit template logic
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('templates').delete().eq('id', id);
    if (error) {
      console.error('Error deleting template:', error);
    } else {
      setTemplates(templates.filter(template => template.id !== id));
    }
  };

  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Button onClick={handleCreate}>Create Template</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map(template => (
            <TableRow key={template.id}>
              <TableCell>{template.name}</TableCell>
              <TableCell>{template.content}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(template.id)}>Edit</Button>
                <Button onClick={() => handleDelete(template.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}