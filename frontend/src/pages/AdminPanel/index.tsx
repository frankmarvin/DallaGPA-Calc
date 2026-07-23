import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { GradingSystems } from './GradingSystems';
import { Users } from './Users';
import { Courses } from './Courses';

export function AdminPanel() {
  const location = useLocation();

  const navItems = [
    { path: '/admin/grading', label: 'Grading Systems' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/courses', label: 'Courses' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-2">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block p-2 rounded hover:bg-gray-700 transition ${
              location.pathname === item.path ? 'bg-gray-700' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </aside>
      <div className="flex-1 p-6">
        <Routes>
          <Route path="grading" element={<GradingSystems />} />
          <Route path="users" element={<Users />} />
          <Route path="courses" element={<Courses />} />
          <Route path="*" element={<div className="text-center text-gray-500 mt-20">Select a section from the sidebar</div>} />
        </Routes>
      </div>
    </div>
  );
}
