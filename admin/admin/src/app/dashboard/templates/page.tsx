// file: admin/admin/src/app/dashboard/templates/page.tsx (CORRECTED)
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());


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
  mediaUrl?: string;
}

export default function TemplatesPage() {
  // Use SWR to fetch data from the API endpoint
  const { data: templates, error, isLoading, mutate: swrMutate } = useSWR<Template[]>('/api/templates/', fetcher);


  const [formData, setFormData] = useState({ name: '', content: '' });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');

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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload media');
    }
    const data = await response.json();
    return data.url; // The upload route returns a 'url' property
  };

  const handleCreate = async () => {
    try {
      let mediaUrl = '';
      if (mediaFile) {
        mediaUrl = await uploadMedia(mediaFile);
      }
      const payload = {
        name: formData.name,
        content: formData.content,
        media_url: mediaUrl || undefined
      };
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const newTemplate = await response.json();
      // Optimistic update
      swrMutate((currentTemplates = []) => [...currentTemplates, newTemplate], false);
      setFormData({ name: '', content: '' });
      setMediaFile(null);
      setMediaPreviewUrl(null);
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleEdit = (template: Template) => {
    setFormData({ name: template.name, content: template.content });
    setMediaFile(null);
    setMediaPreviewUrl(template.mediaUrl || null);
    setIsEditing(true);
    setCurrentId(template.id);
  };

  const handleUpdate = async () => {
    try {
      let mediaUrl = mediaPreviewUrl;
      if (mediaFile) {
        mediaUrl = await uploadMedia(mediaFile);
      }
      const payload = {
        name: formData.name,
        content: formData.content,
        mediaUrl: mediaUrl || undefined
      };
      const response = await fetch(`/api/templates/${currentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const updatedTemplate = await response.json();
      // Optimistic update
      swrMutate((currentTemplates = []) =>
        currentTemplates.map(t => t.id === currentId ? updatedTemplate : t),
        false
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
      // Optimistic update
      swrMutate((currentTemplates = []) =>
        currentTemplates.filter(t => t.id !== id),
        false
      );
      await deleteTemplate(id);
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  if (isLoading) {
    return <div className="p-8 mt-16 text-white">Loading templates...</div>;
  }
  if (error) {
    return <div className="p-8 mt-16 text-red-500">Failed to load templates.</div>;
  }

  return (
    // The JSX part remains the same
    <div className="p-8 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Templates</h1>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">{isEditing ? 'Edit' : 'Create'} Template</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
          <textarea name="content" value={formData.content} onChange={handleInputChange} rows={4} className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Media</label>
          <input type="file" name="media_file" onChange={handleFileChange} className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500" accept="image/*,video/*" />
        </div>
        {mediaPreviewUrl && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Media Preview</label>
            {mediaPreviewUrl.startsWith('blob:') || mediaPreviewUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
              <img src={mediaPreviewUrl} alt="Preview" className="mt-1 w-full rounded-md border border-gray-700" style={{ maxHeight: '200px', objectFit: 'contain' }} />
            ) : (
              <video src={mediaPreviewUrl} controls className="mt-1 w-full rounded-md border border-gray-700" style={{ maxHeight: '200px', objectFit: 'contain' }} />
            )}
          </div>
        )}
        <div className="flex space-x-2">
          <Button onClick={isEditing ? handleUpdate : handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">{isEditing ? 'Update' : 'Create'}</Button>
          {isEditing && (<Button onClick={() => { setIsEditing(false); setFormData({ name: '', content: '' }); setMediaFile(null); setMediaPreviewUrl(null); }} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors">Cancel</Button>)}
        </div>
      </div>
      <Table className="min-w-full bg-gray-900 border border-gray-800 rounded-lg shadow-md">
        <TableHeader className="bg-gray-800">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Content</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-800">
          {templates && templates.length > 0 && templates.map(template => (
            <TableRow key={template.id} className="hover:bg-gray-850">
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{template.name}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{template.content}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Button onClick={() => handleEdit(template)} className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-colors">Edit</Button>
                <Button onClick={() => handleDelete(template.id)} className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
// Added comment line for code modification tracking