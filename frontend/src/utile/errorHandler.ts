import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

/**
 * Extract error message from Axios error response
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.error || error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Handle API error and show toast notification
 */
export const handleApiError = (error: unknown, fallbackMessage?: string): void => {
  const message = getErrorMessage(error);
  toast.error(fallbackMessage || message);
  console.error('API Error:', error);
};

/**
 * Check if error is a validation error (400)
 */
export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 400;
  }
  return false;
};

/**
 * Check if error is authentication error (401)
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
};

/**
 * Check if error is forbidden (403)
 */
export const isForbidden = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 403;
  }
  return false;
};

/**
 * Check if error is not found (404)
 */
export const isNotFound = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 404;
  }
  return false;
};

/**
 * Check if error is server error (500+)
 */
export const isServerError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return (error.response?.status || 0) >= 500;
  }
  return false;
};

/**
 * Handle specific HTTP status codes
 */
export const handleStatus = (error: unknown, onUnauthorized?: () => void): void => {
  if (isAuthError(error)) {
    toast.error('Your session has expired. Please log in again.');
    onUnauthorized?.();
  } else if (isForbidden(error)) {
    toast.error('You do not have permission to perform this action.');
  } else if (isNotFound(error)) {
    toast.error('Resource not found.');
  } else if (isServerError(error)) {
    toast.error('Server error. Please try again later.');
  }
};
