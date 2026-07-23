import { api } from './client';
import { User, LoginCredentials, RegisterData } from '../types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post('/auth/login', credentials).then((res) => res.data),

  register: (data: RegisterData) =>
    api.post('/auth/register', data).then((res) => res.data),

  logout: () => api.post('/auth/logout'),

  refresh: () => api.post('/auth/refresh'),

  getCurrentUser: () =>
    api.get('/auth/me').then((res) => res.data as User),
};
