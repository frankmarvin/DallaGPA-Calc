import { useAuthStore } from '../store/auth';

/**
 * Custom hook for authentication state and actions.
 * Provides access to user, login, logout, register, and checkAuth.
 */
export const useAuth = () => {
  const { user, isAuthenticated, login, logout, register, checkAuth } = useAuthStore();
  return { user, isAuthenticated, login, logout, register, checkAuth };
};
