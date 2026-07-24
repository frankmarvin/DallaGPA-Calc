import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import studentRoutes from './routes/student';
import lectureRoutes from './routes/lecture';
import adminRoutes from './routes/admin';
import courseRoutes from './routes/course';
import resultRoutes from './routes/result';
import semesterRoutes from './routes/semester';
import transcriptRoutes from './routes/transcript';
import analyticsRoutes from './routes/analytics';
import notificationRoutes from './routes/notification';
import settingRoutes from './routes/setting';
import { errorHandler } from './middlewares/error';
import { authenticate } from './middlewares/auth';

// Initialize Prisma Client
export const prisma = new PrismaClient();

const app = express();

// ========== Security & Middleware ==========
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// ========== Routes ==========
app.use('/api/auth', authRoutes);
app.use('/api/students', authenticate, studentRoutes);
app.use('/api/lecturers', authenticate, lectureRoutes);
app.use('/api/admins', authenticate, adminRoutes);
app.use('/api/courses', authenticate, courseRoutes);
app.use('/api/results', authenticate, resultRoutes);
app.use('/api/semesters', authenticate, semesterRoutes);
app.use('/api/transcript', authenticate, transcriptRoutes);
app.use('/api/analytics', authenticate, analyticsRoutes);
app.use('/api/notifications', authenticate, notificationRoutes);
app.use('/api/settings', authenticate, settingRoutes);

// ========== Health Check ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ========== Error Handling ==========
app.use(errorHandler);

export default app;
