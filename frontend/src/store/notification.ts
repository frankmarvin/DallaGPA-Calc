import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  fetchNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const newNotif: Notification = {
      ...notification,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

  fetchNotifications: async () => {
    // In a real app, you'd fetch from the API
    // const res = await api.get('/notifications');
    // set({ notifications: res.data, unreadCount: res.data.filter(n => !n.isRead).length });
  },
}));
