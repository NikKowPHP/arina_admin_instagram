import React from 'react';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
interface EditTriggerFormValues {
  postId: string;
  keyword: string;
  templateId: string;
}

interface EditTriggerFormProps {
  triggerId: string;
  initialData: EditTriggerFormValues;
  onSubmit: (id: string, data: FormData) => Promise<void>;
}

const EditTriggerForm: React.FC<EditTriggerFormProps> = ({ triggerId, initialData, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<EditTriggerFormValues>({
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: EditTriggerFormValues) => {
    const formData = new FormData();
    formData.append('postId', data.postId);
    formData.append('keyword', data.keyword);
    formData.append('templateId', data.templateId);
    await onSubmit(triggerId, formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">Instagram Post Shortcode</label>
        <Input
          {...register('postId', { required: 'Post shortcode is required' })}
        />
        <p className="text-xs text-gray-400 mt-1">
          Find this in the post's URL: instagram.com/p/SHORTCODE/
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
        <label className="block text-sm font-medium text-gray-300 mb-1">Template ID</label>
        <Input
          {...register('templateId', { required: 'Template ID is required' })}
        />
        {errors.templateId && <p className="text-red-500 text-sm mt-1">{errors.templateId.message}</p>}
      </div>

      <button 
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Update Trigger
      </button>
    </form>
  );
};

export default EditTriggerForm;