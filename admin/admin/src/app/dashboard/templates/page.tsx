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

const createTemplate = async (formData: FormData) => {
  const response = await fetch('/api/templates', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create template');
  }

  return response.json();
};

const updateTemplate = async (id: string, formData: FormData) => {
  const response = await fetch(`/api/templates/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update template');
  }

  return response.json();
};

const deleteTemplate = async (id: string) => {
  const response = await fetch(`/api/templates/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete template');
  }

  return response.json();
};

interface Template {
  id: string;
  name: string;
  content: string;
  media_url?: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', content: '', media_url: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const supabase = useSupabase();

  useEffect(() => {
    fetchTemplates();
  }, [supabase]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('templates').select('id, name, content, media_url');
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
      const form = new FormData();
      form.append('name', formData.name);
      form.append('content', formData.content);
      if (formData.media_url) {
        form.append('media_url', formData.media_url);
      }
      const newTemplate = await createTemplate(form);
      setTemplates([...templates, newTemplate]);
      setFormData({ name: '', content: '', media_url: '' });
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleEdit = (template: Template) => {
    setFormData({ name: template.name, content: template.content, media_url: template.media_url || '' });
    setIsEditing(true);
    setCurrentId(template.id);
  };

  const handleUpdate = async () => {
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('content', formData.content);
      if (formData.media_url) {
        form.append('media_url', formData.media_url);
      }
      const updatedTemplate = await updateTemplate(currentId, form);
      setTemplates(
        templates.map(template =>
          template.id === currentId ? updatedTemplate : template
        )
      );
      setFormData({ name: '', content: '', media_url: '' });
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
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Media URL</label>
          <input
            type="text"
            name="media_url"
            value={formData.media_url}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        {formData.media_url && (
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Media Preview</label>
            <img
              src={formData.media_url}
              alt="Preview"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
              style={{ maxHeight: '200px', objectFit: 'contain' }}
            />
          </div>
        )}
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