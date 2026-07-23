import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    regNo: '',
    facultyId: '',
    departmentId: '',
    programme: '',
  });
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  // In a real app, fetch faculties/departments from API.
  const faculties = [
    { id: '1', name: 'Faculty of Science & Technology' },
    { id: '2', name: 'Faculty of Business' },
  ];
  const departments = [
    { id: '1', name: 'Computer Science', facultyId: '1' },
    { id: '2', name: 'Mathematics', facultyId: '1' },
    { id: '3', name: 'Accounting', facultyId: '2' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        role: form.role,
        regNo: form.regNo,
        facultyId: form.facultyId,
        departmentId: form.departmentId,
        programme: form.programme,
      });
      toast.success('Registration successful! Please verify your email.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="firstName" placeholder="First Name" className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700" value={form.firstName} onChange={handleChange} required />
          <input name="lastName" placeholder="Last Name" className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700" value={form.lastName} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 col-span-2" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700" value={form.password} onChange={handleChange} required />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700" value={form.confirmPassword} onChange={handleChange} required />

          <select name="role" className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700" value={form.role} onChange={handleChange}>
            <option value="STUDENT">Student</option>
            <option value="LECTURER">Lecturer</option>
          </select>

          {form.role === 'STUDENT' && (
            <>
              <input name="regNo" placeholder="Registration Number" className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700" value={form.regNo} onChange={handleChange} required />
              <select name="facultyId" className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700" value={form.facultyId} onChange={handleChange} required>
                <option value="">Select Faculty</option>
                {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <select name="departmentId" className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700" value={form.departmentId} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.filter(d => d.facultyId === form.facultyId).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <input name="programme" placeholder="Programme (e.g. BSc CS)" className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 col-span-2" value={form.programme} onChange={handleChange} required />
            </>
          )}

          <button type="submit" disabled={loading} className="col-span-2 bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
