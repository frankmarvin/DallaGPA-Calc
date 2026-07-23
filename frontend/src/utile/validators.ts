import { z } from 'zod';

// Validation schemas for forms

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  regNo: z.string().min(3, 'Registration number is required'),
  facultyId: z.string().min(1, 'Please select a faculty'),
  departmentId: z.string().min(1, 'Please select a department'),
  programme: z.string().min(2, 'Programme is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const courseSchema = z.object({
  code: z.string().min(3, 'Course code is required'),
  name: z.string().min(3, 'Course name is required'),
  credits: z.number().min(1, 'Credits must be at least 1').max(6, 'Credits cannot exceed 6'),
  semester: z.number().min(1).max(2),
  year: z.number().min(1).max(4),
  catMarks: z.number().min(0).max(30).optional(),
  examMarks: z.number().min(0).max(70).optional(),
});

export const gradingSystemSchema = z.object({
  name: z.string().min(3, 'System name is required'),
  description: z.string().optional(),
  grades: z.array(
    z.object({
      minMarks: z.number().min(0),
      maxMarks: z.number().max(100),
      grade: z.string().min(1),
      gradePoint: z.number().min(0).max(4),
    })
  ).min(1, 'At least one grade scale is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type GradingSystemInput = z.infer<typeof gradingSystemSchema>;
