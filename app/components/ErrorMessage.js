'use client';

export function ErrorMessage({ error, onRetry, className = '' }) {
  if (!error) return null;

  return (
    <div className={`bg-red-500/10 border border-red-500/20 rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-bold text-red-400 mb-1">Something went wrong</h3>
          <p className="text-sm text-muted mb-4">
            {typeof error === 'string' 
              ? error 
              : error?.data?.message || error?.error || error?.message || 'An unknown error occurred'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ message = 'No data available', icon = '📭', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-muted text-sm">{message}</p>
    </div>
  );
}
