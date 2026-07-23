import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';

export function Transcript() {
  const { data, isLoading } = useQuery({
    queryKey: ['transcript'],
    queryFn: () => api.get('/transcript').then(res => res.data),
  });

  const downloadPDF = async () => {
    try {
      const response = await api.get('/transcript/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transcript-${data?.regNo || 'student'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Transcript downloaded');
    } catch {
      toast.error('Failed to download PDF');
    }
  };

  if (isLoading) return <div className="p-6">Loading transcript...</div>;
  if (!data) return <div className="p-6 text-red-500">No transcript data found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Academic Transcript</h1>
        <div className="space-x-2">
          <Button onClick={downloadPDF}>Download PDF</Button>
          <Button onClick={() => window.print()} className="bg-gray-600 hover:bg-gray-700">Print</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">DallaGPA University</h2>
          <p className="text-gray-600 dark:text-gray-400">Official Academic Transcript</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 text-sm">
          <p><span className="font-semibold">Name:</span> {data.studentName}</p>
          <p><span className="font-semibold">Registration No:</span> {data.regNo}</p>
          <p><span className="font-semibold">Programme:</span> {data.programme}</p>
          <p><span className="font-semibold">Faculty:</span> {data.faculty}</p>
          <p><span className="font-semibold">Department:</span> {data.department}</p>
          <p><span className="font-semibold">CGPA:</span> {data.cgpa}</p>
          <p><span className="font-semibold">Classification:</span> {data.classification}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-2 text-left">Sem</th>
                <th className="p-2 text-left">Year</th>
                <th className="p-2 text-left">Course Code</th>
                <th className="p-2 text-left">Course Name</th>
                <th className="p-2 text-left">Credits</th>
                <th className="p-2 text-left">Grade</th>
                <th className="p-2 text-left">GP</th>
              </tr>
            </thead>
            <tbody>
              {data.courses.map((c: any) => (
                <tr key={c.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-2">{c.semester}</td>
                  <td className="p-2">{c.year}</td>
                  <td className="p-2">{c.code}</td>
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.credits}</td>
                  <td className="p-2 font-semibold">{c.grade}</td>
                  <td className="p-2">{c.gradePoint?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Generated: {new Date().toLocaleDateString()}</span>
          <div className="flex items-center space-x-4">
            <span>Digital Signature: ****************</span>
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">QR Code</span>
          </div>
        </div>
      </div>
    </div>
  );
}
