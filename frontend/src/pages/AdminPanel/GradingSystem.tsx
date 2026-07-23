import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../components/Button';

export function GradingSystems() {
  const { data: systems, isLoading } = useQuery({
    queryKey: ['gradingSystems'],
    queryFn: () => api.get('/admins/grading-systems').then(res => res.data),
  });
  const queryClient = useQueryClient();

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: { name: '', description: '', grades: [{ minMarks: 0, maxMarks: 100, grade: '', gradePoint: 0 }] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'grades' });

  const addSystem = useMutation({
    mutationFn: (data: any) => api.post('/admins/grading-systems', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradingSystems'] });
      toast.success('Grading system added');
      reset();
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to add'),
  });

  const setDefault = useMutation({
    mutationFn: (id: string) => api.patch(`/admins/grading-systems/${id}/default`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradingSystems'] });
      toast.success('Default set');
    },
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Grading Systems</h2>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Add New System</h3>
        <form onSubmit={handleSubmit((data) => addSystem.mutate(data))} className="space-y-3">
          <input {...register('name')} placeholder="Name (e.g., UoN)" className="w-full p-2 border rounded" />
          <input {...register('description')} placeholder="Description" className="w-full p-2 border rounded" />
          <div className="space-y-2">
            <p className="font-medium">Grade Scales</p>
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap gap-2 items-center">
                <input {...register(`grades.${index}.minMarks`)} placeholder="Min" type="number" className="p-1 border rounded w-20" />
                <input {...register(`grades.${index}.maxMarks`)} placeholder="Max" type="number" className="p-1 border rounded w-20" />
                <input {...register(`grades.${index}.grade`)} placeholder="Grade" className="p-1 border rounded w-16" />
                <input {...register(`grades.${index}.gradePoint`)} placeholder="GP" type="number" step="0.1" className="p-1 border rounded w-20" />
                <button type="button" onClick={() => remove(index)} className="text-red-500">×</button>
              </div>
            ))}
            <button type="button" onClick={() => append({ minMarks: 0, maxMarks: 100, grade: '', gradePoint: 0 })} className="text-indigo-600">+ Add Grade</button>
          </div>
          <Button type="submit">Create System</Button>
        </form>
      </div>

      {isLoading ? <p>Loading...</p> : (
        <ul className="space-y-2">
          {systems?.map((s: any) => (
            <li key={s.id} className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded shadow">
              <span><span className="font-semibold">{s.name}</span> {s.isDefault && '(Default)'}</span>
              <div className="space-x-2">
                {!s.isDefault && (
                  <button onClick={() => setDefault.mutate(s.id)} className="text-indigo-600 hover:underline">Set Default</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
