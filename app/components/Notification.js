'use client';

import { useEffect, useState } from 'react';

export default function Notification({ 
  message, 
  type = 'success', 
  duration = 3000,
  onClose 
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); 
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: {
      bg: 'bg-green-500/20 border-green-500/30',
      text: 'text-green-400',
      icon: '✓',
    },
    error: {
      bg: 'bg-red-500/20 border-red-500/30',
      text: 'text-red-400',
      icon: '✕',
    },
    info: {
      bg: 'bg-blue-500/20 border-blue-500/30',
      text: 'text-blue-400',
      icon: 'ℹ',
    },
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div className={`${style.bg} border ${style.text} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slideUp`}>
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-current/20 flex items-center justify-center">
        <span className="text-sm font-bold">{style.icon}</span>
      </div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 300);
          }}
          className="flex-shrink-0 text-current hover:opacity-70 transition-opacity"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function NotificationContainer({ notifications, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
}
