// General helper functions

/**
 * Format a date to locale string
 */
export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date with time
 */
export const formatDateTime = (date: Date | string): string => {
  return new Date(date).toLocaleString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Convert string to title case
 */
export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

/**
 * Truncate a string to a given length
 */
export const truncate = (str: string, length: number = 50): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

/**
 * Generate a random ID (for temporary use)
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Debounce a function
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Get grade point from marks based on a grading system
 */
export const getGradePoint = (marks: number, gradingSystem: any[]): { grade: string; gradePoint: number } => {
  for (const scale of gradingSystem) {
    if (marks >= scale.minMarks && marks <= scale.maxMarks) {
      return { grade: scale.grade, gradePoint: scale.gradePoint };
    }
  }
  return { grade: 'E', gradePoint: 0 };
};

/**
 * Calculate GPA from results
 */
export const calculateGPA = (results: Array<{ creditHours: number; gradePoint: number }>) => {
  let totalQualityPoints = 0;
  let totalCredits = 0;
  for (const r of results) {
    totalQualityPoints += r.creditHours * r.gradePoint;
    totalCredits += r.creditHours;
  }
  if (totalCredits === 0) return 0;
  return totalQualityPoints / totalCredits;
};
