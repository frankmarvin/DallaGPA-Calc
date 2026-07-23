import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email';

export const register = async (req: Request, res: Response) => {
  const { email, password, role, firstName, lastName, regNo, facultyId, departmentId, programme } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role,
        profile: {
          create: { firstName, lastName }
        }
      }
    });

    if (role === 'STUDENT') {
      await prisma.student.create({
        data: {
          userId: user.id,
          regNo,
          facultyId,
          departmentId,
          programme
        }
      });
    }

    await sendVerificationEmail(email, user.id);

    res.status(201).json({ message: 'User registered. Please verify your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.isVerified) return res.status(403).json({ error: 'Please verify your email' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });

    let profile = null;
    if (user.role === 'STUDENT') {
      profile = await prisma.student.findUnique({ where: { userId: user.id }, include: { faculty: true, department: true } });
    } else if (user.role === 'LECTURER') {
      profile = await prisma.lecturer.findUnique({ where: { userId: user.id }, include: { department: true } });
    } else if (user.role === 'ADMIN') {
      profile = await prisma.admin.findUnique({ where: { userId: user.id } });
    }

    res.json({
      user: { id: user.id, email: user.email, role: user.role, profile }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ error: 'Invalid refresh token' });

    const newToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.cookie('token', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.json({ message: 'Token refreshed' });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const me = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { profile: true }
  });
  res.json(user);
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true }
    });
    res.json({ message: 'Email verified successfully' });
  } catch {
    res.status(400).json({ error: 'Invalid verification link' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  await sendPasswordResetEmail(email, token);
  res.json({ message: 'Password reset email sent' });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashed }
    });
    res.json({ message: 'Password updated' });
  } catch {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};
