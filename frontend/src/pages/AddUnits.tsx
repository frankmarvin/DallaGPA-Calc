import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';

const courseSelectSchema = z.object({
  courseId: z.string().min(1, 'Please select a course'),
});

const gradeSchema = z.object({
  grade: z.string().min(1, 'Grade is required'),
  semester: z.number().min(1, 'Semester is required'),
  year: z.number().min(1, 'Year is required'),
});

type CourseSelectForm = z.infer<typeof courseSelectSchema>;
type GradeForm = z.infer<typeof gradeSchema>;

export function AddUnits() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const queryClient = useQueryClient();

  // Get available courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['availableCourses'],
    queryFn: () => api.get('/students/available-courses').then(res => res.data),
  });

  // Get enrolled courses
  const { data: enrolledCourses } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: () => api.get('/students/enrolled-courses').then(res => res.data),
  });

  const courseSelectForm = useForm<CourseSelectForm>({
    resolver: zodResolver(courseSelectSchema),
  });

  const gradeForm = useForm<GradeForm>({
    resolver: zodResolver(gradeSchema),
  });

  // Add course enrollment
  const enrollMutation = useMutation({
    mutationFn: (courseId: string) =>
      api.post('/students/enroll-course', { courseId, semester: 1, year: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
      toast.success('Course enrolled successfully');
      moveToGradeStep();
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || 'Failed to enroll course'),
  });

  // Add grade
  const addGradeMutation = useMutation({
    mutationFn: (data: any) =>
      api.post('/students/add-grade', {
        courseId: selectedCourseId,
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
      toast.success('Grade added successfully');
      gradeForm.reset();
      setStep(1);
      setSelectedCourseId('');
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || 'Failed to add grade'),
  });

  const moveToGradeStep = () => {
    const course = courses?.find((c: any) => c.id === selectedCourseId);
    setSelectedCourse(course);
    setStep(2);
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    const course = courses?.find((c: any) => c.id === courseId);
    setSelectedCourse(course);
  };

  const onCourseSelectSubmit = async (data: CourseSelectForm) => {
    handleSelectCourse(data.courseId);
    await enrollMutation.mutateAsync(data.courseId);
  };

  const onGradeSubmit = async (data: GradeForm) => {
    await addGradeMutation.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Add Units & Grades
          </h1>
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-green-600 text-white'}`}>
              {step === 1 ? '1' : '✓'}
            </div>
            <span className="text-gray-600 dark:text-gray-400">Select Course</span>
            <div className={`flex-1 h-1 ${step === 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
            <span className="text-gray-600 dark:text-gray-400">Add Grades</span>
          </div>
        </div>

        {/* Step 1: Select Course */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Choose a Course</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={courseSelectForm.handleSubmit(onCourseSelectSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Course
                  </label>
                  <select
                    {...courseSelectForm.register('courseId')}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    disabled={coursesLoading}
                  >
                    <option value="">
                      {coursesLoading ? 'Loading courses...' : 'Select a course'}
                    </option>
                    {courses?.map((course: any) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.name} ({course.credits} credits)
                      </option>
                    ))}
                  </select>
                  {courseSelectForm.formState.errors.courseId && (
                    <p className="mt-1 text-sm text-red-600">
                      {courseSelectForm.formState.errors.courseId.message}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    ℹ️ Select the course you want to add grades for. You only need to enter the grade/letter grade that you received, not the individual scores.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={coursesLoading || enrollMutation.isPending}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition"
                >
                  {enrollMutation.isPending ? 'Processing...' : 'Continue to Add Grades'}
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Add Grades */}
        {step === 2 && selectedCourse && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Add Grades for {selectedCourse.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={gradeForm.handleSubmit(onGradeSubmit)} className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Course Details</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">{selectedCourse.code}</span> - {selectedCourse.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Credits: <span className="font-semibold">{selectedCourse.credits}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Semester
                    </label>
                    <select
                      {...gradeForm.register('semester', { valueAsNumber: true })}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select semester</option>
                      <option value={1}>Semester 1</option>
                      <option value={2}>Semester 2</option>
                    </select>
                    {gradeForm.formState.errors.semester && (
                      <p className="mt-1 text-sm text-red-600">
                        {gradeForm.formState.errors.semester.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Year
                    </label>
                    <select
                      {...gradeForm.register('year', { valueAsNumber: true })}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select year</option>
                      <option value={1}>Year 1</option>
                      <option value={2}>Year 2</option>
                      <option value={3}>Year 3</option>
                      <option value={4}>Year 4</option>
                    </select>
                    {gradeForm.formState.errors.year && (
                      <p className="mt-1 text-sm text-red-600">
                        {gradeForm.formState.errors.year.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grade Received
                  </label>
                  <select
                    {...gradeForm.register('grade')}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select grade</option>
                    <option value="A">A (Excellent)</option>
                    <option value="B+">B+ (Very Good)</option>
                    <option value="B">B (Good)</option>
                    <option value="B-">B- (Good)</option>
                    <option value="C+">C+ (Satisfactory)</option>
                    <option value="C">C (Satisfactory)</option>
                    <option value="C-">C- (Pass)</option>
                    <option value="D+">D+ (Pass)</option>
                    <option value="D">D (Pass)</option>
                    <option value="E">E (Fail)</option>
                  </select>
                  {gradeForm.formState.errors.grade && (
                    <p className="mt-1 text-sm text-red-600">
                      {gradeForm.formState.errors.grade.message}
                    </p>
                  )}
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    ⚠️ Enter the grade you received for this course. The system will automatically calculate your GPA based on the grade points.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setSelectedCourseId('');
                      setSelectedCourse(null);
                      gradeForm.reset();
                    }}
                    className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={addGradeMutation.isPending}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition"
                  >
                    {addGradeMutation.isPending ? 'Adding Grade...' : 'Add Grade'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
