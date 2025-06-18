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
  const [formData, setFormData] = useState({ name: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async () => {
    try {
      const newTemplate = await createTemplate(new FormData(new FormData().append('name', formData.name).append('content', formData.content)));
      setTemplates([...templates, newTemplate]);
      setFormData({ name: '', content: '' });
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleEdit = (template: Template) => {
    setFormData({ name: template.name, content: template.content });
    setIsEditing(true);
    setCurrentId(template.id);
  };

  const handleUpdate = async () => {
    try {
      const updatedTemplate = await updateTemplate(currentId, new FormData().append('name', formData.name).append('content', formData.content));
      setTemplates(
        templates.map(template =>
          template.id === currentId ? updatedTemplate : template
        )
      );
      setFormData({ name: '', content: '' });
      setIsEditing(false);
      setCurrentId('');
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id);
      setTemplates(templates.filter(template => template.id !== id));
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Templates</h1>
      </div>

      {/* Form for creating/editing templates */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">{isEditing ? 'Edit' : 'Create'} Template</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <Button onClick={isEditing ? handleUpdate : handleCreate}>
          {isEditing ? 'Update' : 'Create'}
        </Button>
        {isEditing && (
          <Button onClick={() => setIsEditing(false)} className="ml-2">
            Cancel
          </Button>
        )}
      </div>

      {/* Table to display templates */}
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
                <Button onClick={() => handleEdit(template)}>Edit</Button>
                <Button onClick={() => handleDelete(template.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}