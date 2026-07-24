import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAuthStore } from '../store/auth';

export function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">DallaGPA</h1>
        <div className="space-x-4">
          <Link to="/login" className="px-4 py-2 rounded bg-white text-gray-800 shadow hover:bg-gray-100">Login</Link>
          <Link to="/register" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Register</Link>
        </div>
      </nav>
      <section className="flex flex-col items-center justify-center h-[80vh] text-center">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl font-extrabold text-gray-800 dark:text-white"
        >
          Calculate. Track. Graduate.
        </motion.h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          The ultimate GPA & CGPA management system for Kenyan universities.
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/login" className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg shadow hover:bg-indigo-700">
            Login
          </Link>
          <Link to="/register" className="px-8 py-4 bg-white text-indigo-600 rounded-lg text-lg shadow hover:bg-gray-100 border-2 border-indigo-600">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
