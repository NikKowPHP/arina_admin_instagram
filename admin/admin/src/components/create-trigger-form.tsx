import React from 'react';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { createTrigger } from '@/lib/actions';

interface CreateTriggerFormValues {
  postId: string;
  keyword: string;
  userId: string;
  templateId: string;
}

const CreateTriggerForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTriggerFormValues>();

  const onSubmit = async (data: CreateTriggerFormValues) => {
    try {
      const formData = new FormData();
      formData.append('postId', data.postId);
      formData.append('keyword', data.keyword);
      formData.append('userId', data.userId); // Placeholder: In a real app, this would come from auth context
      formData.append('templateId', data.templateId); // Placeholder: In a real app, this would be selected from existing templates
      await createTrigger(formData);
      // Handle success (e.g., show notification, reset form)
    } catch (error) {
      console.error('Failed to create trigger:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Input
          label="Post ID"
          {...register('postId', { required: 'Post ID is required' })}
        />
        {errors.postId && <p>{errors.postId.message}</p>}
      </div>
      <div>
        <Input
          label="Keyword"
          {...register('keyword', { required: 'Keyword is required' })}
        />
        {errors.keyword && <p>{errors.keyword.message}</p>}
      </div>
      <div>
        <Input
          label="User ID"
          {...register('userId', { required: 'User ID is required' })}
        />
        {errors.userId && <p>{errors.userId.message}</p>}
      </div>
      <div>
        <Input
          label="Template ID"
          {...register('templateId', { required: 'Template ID is required' })}
        />
        {errors.templateId && <p>{errors.templateId.message}</p>}
      </div>
      <button type="submit">Create Trigger</button>
    </form>
  );
};

export default CreateTriggerForm;