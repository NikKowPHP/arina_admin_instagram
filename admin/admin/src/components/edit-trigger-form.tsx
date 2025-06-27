import React from 'react';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { updateTrigger } from '@/lib/actions';

interface EditTriggerFormValues {
  name: string;
  keyword: string;
  status: string;
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
      formData.append('name', data.name);
      formData.append('keyword', data.keyword);
      formData.append('status', data.status);
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
      <button type="submit">Update Trigger</button>
    </form>
  );
};

export default EditTriggerForm;