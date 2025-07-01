import React from 'react';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { updateTrigger } from '@/lib/actions';

interface EditTriggerFormValues {
  postId: string;
  keyword: string;
  userId: string;
  templateId: string;
}

interface EditTriggerFormProps {
  triggerId: string;
  initialData: EditTriggerFormValues;
}

const EditTriggerForm: React.FC<EditTriggerFormProps> = ({ triggerId, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<EditTriggerFormValues>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: EditTriggerFormValues) => {
    try {
      const formData = new FormData();
      formData.append('postId', data.postId);
      formData.append('keyword', data.keyword);
      formData.append('userId', data.userId);
      formData.append('templateId', data.templateId);
      await updateTrigger(triggerId, formData);
      // Handle success (e.g., show notification, close modal)
    } catch (error) {
      console.error('Failed to update trigger:', error);
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
      <button type="submit">Update Trigger</button>
    </form>
  );
};

export default EditTriggerForm;