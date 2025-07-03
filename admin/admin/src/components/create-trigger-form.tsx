import React from 'react';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';

interface CreateTriggerFormValues {
  postId: string;
  keyword: string;
  templateId: string;
}

interface CreateTriggerFormProps {
  templates: Array<{ id: string; name: string }>;
  onSubmit: (data: FormData) => Promise<void>;
}

const CreateTriggerForm: React.FC<CreateTriggerFormProps> = ({ templates, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTriggerFormValues>();

  const handleFormSubmit = async (data: CreateTriggerFormValues) => {
    const formData = new FormData();
    formData.append('postId', data.postId);
    formData.append('keyword', data.keyword);
    formData.append('templateId', data.templateId);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">Instagram Post Shortcode</label>
        <Input
          {...register('postId', { required: 'Post shortcode is required' })}
        />
        <p className="text-xs text-gray-400 mt-1">
          Find this in the post&apos;s URL: instagram.com/p/SHORTCODE/
        </p>
        {errors.postId && <p className="text-red-500 text-sm mt-1">{errors.postId.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">Keyword</label>
        <Input
          {...register('keyword', { required: 'Keyword is required' })}
        />
        {errors.keyword && <p className="text-red-500 text-sm mt-1">{errors.keyword.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">Template</label>
        <select
          {...register('templateId', { required: 'Template is required' })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a template</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        {errors.templateId && <p className="text-red-500 text-sm mt-1">{errors.templateId.message}</p>}
      </div>

      <button 
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Create Trigger
      </button>
    </form>
  );
};

export default CreateTriggerForm;