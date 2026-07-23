/**
 * Convert a string to title case (e.g. "hello world" → "Hello World")
 */
export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

/**
 * Generate a random alphanumeric string of given length
 */
export const generateRandomString = (length: number): string => {
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Format a date to a readable string (e.g. "Jan 1, 2025")
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Check if a value is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Truncate a string to a maximum length and add ellipsis
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Safely parse JSON without throwing errors
 */
export const safeJsonParse = (json: string): any => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

/**
 * Get the current academic year based on date (e.g. "2024/2025")
 */
export const getAcademicYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based (Jan = 0)
  // Kenyan academic year typically starts in September
  const startYear = month >= 8 ? year : year - 1;
  return `${startYear}/${startYear + 1}`;
};

/**
 * Generate a registration number (e.g., "UON/2024/001")
 */
export const generateRegNo = (universityCode: string, year: number, sequence: number): string => {
  const padded = sequence.toString().padStart(3, '0');
  return `${universityCode}/${year}/${padded}`;
};
