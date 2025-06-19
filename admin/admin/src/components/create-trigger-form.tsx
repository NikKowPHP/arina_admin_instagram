import React from 'react';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { createTrigger } from '@/lib/actions';

interface CreateTriggerFormValues {
  name: string;
  keyword: string;
  status: string;
}

const CreateTriggerForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTriggerFormValues>();

  const onSubmit = async (data: CreateTriggerFormValues) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('keyword', data.keyword);
      formData.append('status', data.status);
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
          label="Trigger Name"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p>{errors.name.message}</p>}
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
          label="Status"
          {...register('status', { required: 'Status is required' })}
        />
        {errors.status && <p>{errors.status.message}</p>}
      </div>
      <button type="submit">Create Trigger</button>
    </form>
  );
};

export default CreateTriggerForm;