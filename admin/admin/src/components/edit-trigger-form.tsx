import { useForm, FieldErrors } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TriggerFormData } from './create-trigger-form';

interface EditTriggerFormProps {
  initialData: TriggerFormData;
  onSubmit: (data: TriggerFormData) => void;
  onCancel: () => void;
}

export default function EditTriggerForm({ initialData, onSubmit, onCancel }: EditTriggerFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TriggerFormData>({
    defaultValues: initialData
  });

  const getErrorMessage = (errors: FieldErrors<TriggerFormData>, field: keyof TriggerFormData) => {
    return errors[field]?.message?.toString() || '';
  };

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
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors, 'name')}</p>
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
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors, 'keyword')}</p>
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
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors, 'status')}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          Save Changes
        </Button>
      </div>
    </form>
  );
}