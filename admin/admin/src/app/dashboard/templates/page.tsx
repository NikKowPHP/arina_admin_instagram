// ROO-AUDIT-TAG :: plan-006-template-management.md :: Implement template management UI
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
  const [formData, setFormData] = useState({ name: '', content: '' });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMediaFile(file);
    if (file) {
      setMediaPreviewUrl(URL.createObjectURL(file));
    } else {
      setMediaPreviewUrl(null);
    }
  };

  const uploadMedia = async (file: File) => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const response = await fetch('/api/storage/upload', {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload media');
    }
    const data = await response.json();
    return data.publicUrl;
  };

  const handleCreate = async () => {
    try {
      let mediaUrl = '';
      if (mediaFile) {
        mediaUrl = await uploadMedia(mediaFile);
      }

      const form = new FormData();
      form.append('name', formData.name);
      form.append('content', formData.content);
      if (mediaUrl) {
        form.append('media_url', mediaUrl);
      }
      const newTemplate = await createTemplate(form);
      setTemplates([...templates, newTemplate]);
      setFormData({ name: '', content: '' });
      setMediaFile(null);
      setMediaPreviewUrl(null);
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleEdit = (template: Template) => {
    setFormData({ name: template.name, content: template.content });
    setMediaFile(null); // Clear file input when editing
    setMediaPreviewUrl(template.media_url || null);
    setIsEditing(true);
    setCurrentId(template.id);
  };

  const handleUpdate = async () => {
    try {
      let mediaUrl = mediaPreviewUrl; // Keep existing URL if no new file is selected
      if (mediaFile) {
        mediaUrl = await uploadMedia(mediaFile);
      }

      const form = new FormData();
      form.append('name', formData.name);
      form.append('content', formData.content);
      if (mediaUrl) {
        form.append('media_url', mediaUrl);
      } else {
        form.append('media_url', ''); // Explicitly clear if no media
      }
      const updatedTemplate = await updateTemplate(currentId, form);
      setTemplates(
        templates.map(template =>
          template.id === currentId ? updatedTemplate : template
        )
      );
      setFormData({ name: '', content: '' });
      setMediaFile(null);
      setMediaPreviewUrl(null);
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
    return <div className="p-8 mt-16 text-white">Loading templates...</div>;
  }

  return (
    <div className="p-8 mt-16"> {/* Added mt-16 for spacing from fixed sidebar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Templates</h1>
      </div>

      {/* Form for creating/editing templates */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">{isEditing ? 'Edit' : 'Create'} Template</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Media URL</label>
          <input
            type="file"
            name="media_file"
            onChange={handleFileChange}
            className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
            accept="image/*,video/*"
          />
        </div>
        {mediaPreviewUrl && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Media Preview</label>
            {mediaPreviewUrl.startsWith('blob:') || mediaPreviewUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
              <img
                src={mediaPreviewUrl}
                alt="Preview"
                className="mt-1 w-full rounded-md border border-gray-700"
                style={{ maxHeight: '200px', objectFit: 'contain' }}
              />
            ) : (
              <video
                src={mediaPreviewUrl}
                controls
                className="mt-1 w-full rounded-md border border-gray-700"
                style={{ maxHeight: '200px', objectFit: 'contain' }}
              />
            )}
          </div>
        )}
        <div className="flex space-x-2">
          <Button
            onClick={isEditing ? handleUpdate : handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
          {isEditing && (
            <Button
              onClick={() => { setIsEditing(false); setFormData({ name: '', content: '' }); setMediaFile(null); setMediaPreviewUrl(null); }}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Table to display templates */}
      <Table className="min-w-full bg-gray-900 border border-gray-800 rounded-lg shadow-md">
        <TableHeader className="bg-gray-800">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Content</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-800">
          {templates.map(template => (
            <TableRow key={template.id} className="hover:bg-gray-850">
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{template.name}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{template.content}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Button
                  onClick={() => handleEdit(template)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-colors"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(template.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
// ROO-AUDIT-TAG :: plan-006-template-management.md :: END