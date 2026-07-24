import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Navigation } from '../components/Navigation';

const courseSchema = z.object({
  code: z.string().min(3, 'Course code required'),
  name: z.string().min(3, 'Course name required'),
  credits: z.number().min(1, 'At least 1 credit'),
  semester: z.number().min(1).max(2),
  year: z.number().min(1).max(4),
  catMarks: z.number().optional(),
  examMarks: z.number().optional(),
});

type CourseForm = z.infer<typeof courseSchema>;

export function Courses() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.get('/students/courses').then(res => res.data),
  });
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
  });

  const addCourse = useMutation({
    mutationFn: (data: CourseForm) => api.post('/students/courses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course added');
      reset();
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to add course'),
  });

  const deleteCourse = useMutation({
    mutationFn: (id: string) => api.delete(`/students/courses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted');
    },
  });

  return (
    <>
      <Navigation />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <Link to="/add-units" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Add Units & Grades
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Course (Legacy)</h2>
          <form onSubmit={handleSubmit((data) => addCourse.mutate(data))} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register('code')} placeholder="Course Code (e.g., CSC101)" className="p-2 border rounded" />
            {errors.code && <p className="text-red-500 text-sm col-span-2">{errors.code.message}</p>}
            <input {...register('name')} placeholder="Course Name" className="p-2 border rounded" />
            <input {...register('credits', { valueAsNumber: true })} placeholder="Credits" type="number" className="p-2 border rounded" />
            <input {...register('semester', { valueAsNumber: true })} placeholder="Semester (1 or 2)" type="number" className="p-2 border rounded" />
            <input {...register('year', { valueAsNumber: true })} placeholder="Year (1-4)" type="number" className="p-2 border rounded" />
            <input {...register('catMarks', { valueAsNumber: true })} placeholder="CAT Marks (optional)" type="number" className="p-2 border rounded" />
            <input {...register('examMarks', { valueAsNumber: true })} placeholder="Exam Marks (optional)" type="number" className="p-2 border rounded" />
            <button type="submit" className="md:col-span-2 bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition" disabled={addCourse.isPending}>
              {addCourse.isPending ? 'Adding...' : 'Add Course'}
            </button>
          </form>
        </div>

        {isLoading ? (
          <p>Loading courses...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow rounded-lg">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Credits</th>
                  <th className="p-3 text-left">Semester</th>
                  <th className="p-3 text-left">Year</th>
                  <th className="p-3 text-left">Grade</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses?.map((c: any) => (
                  <tr key={c.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3">{c.course.code}</td>
                    <td className="p-3">{c.course.name}</td>
                    <td className="p-3">{c.course.credits}</td>
                    <td className="p-3">{c.semester}</td>
                    <td className="p-3">{c.year}</td>
                    <td className="p-3 font-semibold">{c.grade || '—'}</td>
                    <td className="p-3">
                      <button onClick={() => deleteCourse.mutate(c.id)} className="text-red-500 hover:text-red-700">
                        Delete
                      </button>
                    </td>
                  </tr>
                )}
                {courses?.length === 0 && (
                  <tr><td colSpan={7} className="p-6 text-center text-gray-500">No courses added yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
