'use client';

/**
 * Loading Spinner Component
 * Reusable loading indicator following DRY principle
 */
export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-muted border-t-primary rounded-full animate-spin`}
      ></div>
    </div>
  );
}

/**
 * Skeleton Loader Component
 * For better perceived performance
 */
export function Skeleton({ className = '', variant = 'default' }) {
  const variants = {
    default: 'bg-card-border',
    card: 'bg-card-border rounded-xl',
    text: 'bg-card-border rounded h-4',
    circle: 'bg-card-border rounded-full',
  };

  return (
    <div
      className={`${variants[variant]} animate-pulse ${className}`}
    ></div>
  );
}

/**
 * Card Skeleton Loader
 */
export function CardSkeleton() {
  return (
    <div className="bg-card p-5 rounded-xl border border-card-border flex-1 min-w-[200px]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton variant="text" className="w-24 mb-2" />
          <Skeleton variant="text" className="w-16 h-8" />
        </div>
        <Skeleton variant="circle" className="w-10 h-10" />
      </div>
      <Skeleton variant="text" className="w-32" />
    </div>
  );
}

/**
 * Table Skeleton Loader
 */
export function TableSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <Skeleton variant="circle" className="w-8 h-8" />
          <Skeleton variant="text" className="flex-1" />
          <Skeleton variant="text" className="w-24" />
          <Skeleton variant="text" className="w-20" />
        </div>
      ))}
    </div>
  );
}
