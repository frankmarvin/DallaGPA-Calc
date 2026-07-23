import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.get('/analytics').then(res => res.data),
  });

  if (isLoading) return <div className="p-6">Loading analytics...</div>;
  if (!data) return <div className="p-6 text-red-500">No analytics data</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>GPA Trend by Semester</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.gpaTrend}>
                <XAxis dataKey="semester" />
                <YAxis domain={[0, 4]} />
                <Tooltip />
                <Line type="monotone" dataKey="gpa" stroke="#4F46E5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Grade Distribution</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.gradeDistribution} dataKey="count" nameKey="grade" cx="50%" cy="50%" outerRadius={80}>
                  {data.gradeDistribution.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Credits Completed per Year</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.creditsByYear}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="credits" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Performance Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-semibold">Current CGPA:</span> {data.cgpa}</p>
              <p><span className="font-semibold">Classification:</span> {data.classification}</p>
              <p><span className="font-semibold">Total Credits:</span> {data.totalCredits}</p>
              <p><span className="font-semibold">Semesters Completed:</span> {data.semestersCompleted}</p>
              <p><span className="font-semibold">Pass Rate:</span> {data.passRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
