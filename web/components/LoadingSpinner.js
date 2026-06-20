import React from 'react';

export default function LoadingSpinner({ size = 'medium' }) {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex items-center justify-center py-10">
      <div className={`animate-spin rounded-full border-t-primary border-slate-800 ${sizeClasses[size]}`} />
    </div>
  );
}
