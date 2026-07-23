import { useQuery } from '@tanstack/react-query';
import { fetchStudentDashboard } from '../api/student';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Progress } from '../components/Progress';
import { Skeleton } from '../components/Skeleton';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchStudentDashboard,
  });

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div className="p-6 text-red-500">Failed to load dashboard</div>;

  const { student, gpa, cgpa, classification, creditsCompleted, creditsRemaining, trend, recentCourses } = data;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Current GPA" value={gpa.toFixed(2)} color="text-blue-600" />
        <StatCard title="CGPA" value={cgpa.toFixed(2)} color="text-green-600" />
        <StatCard title="Expected Class" value={classification} color="text-purple-600" />
        <StatCard title="Credits Completed" value={`${creditsCompleted} / ${creditsCompleted + creditsRemaining}`} color="text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Performance Trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="semester" />
                <YAxis domain={[0, 4]} />
                <Tooltip />
                <Line type="monotone" dataKey="gpa" stroke="#4F46E5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Graduation Progress</CardTitle></CardHeader>
          <CardContent>
            <Progress value={(creditsCompleted / (creditsCompleted + creditsRemaining)) * 100} className="h-4" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {Math.round((creditsCompleted / (creditsCompleted + creditsRemaining)) * 100)}% Complete
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Courses</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentCourses.map((c: any) => (
              <li key={c.id} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-medium">{c.course.code}</span> – {c.course.name}
                  <span className="ml-4 text-sm text-gray-500">Credits: {c.course.credits}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  c.grade === 'A' ? 'bg-green-100 text-green-800' :
                  c.grade === 'B+' || c.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                  c.grade === 'C+' || c.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {c.grade || '—'}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle></CardHeader>
      <CardContent><p className={`text-3xl font-bold ${color}`}>{value}</p></CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
