import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trigger } from '@/types/database';

interface CreateTriggerFormProps {
  onSubmit: (data: Omit<Trigger, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function CreateTriggerForm({ onSubmit }: CreateTriggerFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Trigger Name
        </label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="keyword" className="block text-sm font-medium mb-1">
          Keyword
        </label>
        <Input
          id="keyword"
          {...register('keyword', { required: 'Keyword is required' })}
        />
        {errors.keyword && (
          <p className="text-red-500 text-sm mt-1">{errors.keyword.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          {...register('status', { required: 'Status is required' })}
          className="w-full p-2 border rounded-md"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
        )}
      </div>

      <Button type="submit" variant="primary" className="w-full">
        Create Trigger
      </Button>
    </form>
  );
}