import { Request, Response } from 'express';
import { prisma } from '../app';

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(notifications);
};

export const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const notification = await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });
  res.json(notification);
};

export const markAllRead = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
  res.json({ message: 'All notifications marked as read' });
};
