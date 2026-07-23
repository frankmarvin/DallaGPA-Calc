interface ProgressProps {
  value: number; // 0–100
  className?: string;
}

export function Progress({ value, className = '' }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden ${className}`}>
      <div
        className="bg-indigo-600 h-full transition-all duration-300 ease-in-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
