import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">DallaGPA</h1>
        <div className="space-x-4">
          <Link to="/login" className="px-4 py-2 rounded bg-white text-gray-800 shadow">Login</Link>
          <Link to="/register" className="px-4 py-2 rounded bg-indigo-600 text-white">Register</Link>
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
        <Link to="/register" className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg shadow hover:bg-indigo-700">
          Get Started
        </Link>
      </section>
    </div>
  );
}
