import { api } from './client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export const notificationApi = {
  getNotifications: () =>
    api.get('/notifications').then((res) => res.data as Notification[]),

  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`).then((res) => res.data),

  markAllAsRead: () =>
    api.patch('/notifications/read-all').then((res) => res.data),

  deleteNotification: (id: string) =>
    api.delete(`/notifications/${id}`).then((res) => res.data),

  getUnreadCount: () =>
    api.get('/notifications/unread-count').then((res) => res.data.count),
};
