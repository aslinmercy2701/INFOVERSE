import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className={`relative ${sizes[size]}`}>
        <div className={`absolute inset-0 rounded-full border-2 border-red-900/30`} />
        <div
          className={`absolute inset-0 rounded-full border-2 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin`}
          style={{ boxShadow: '0 0 10px rgba(255,0,34,0.5)' }}
        />
        <div className="absolute inset-2 rounded-full border border-red-800/20 animate-pulse" />
      </div>
      {text && (
        <p className="text-sm text-gray-400 font-mono-tech tracking-widest animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen bg-dark-bg circuit-bg flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-red-900/30" />
        <div className="absolute inset-0 rounded-full border-2 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"
          style={{ boxShadow: '0 0 20px rgba(255,0,34,0.4)' }} />
        <div className="absolute inset-3 rounded-full border border-red-700/20 animate-pulse" />
        <div className="absolute inset-6 rounded-full bg-red-600/20 animate-pulse" />
      </div>
      <h2 className="font-orbitron text-xl font-bold text-white tracking-widest mb-2">
        INFOVERSE
      </h2>
      <p className="text-red-400 text-sm font-mono-tech tracking-widest animate-pulse">
        INITIALIZING...
      </p>
    </div>
  </div>
);

export default LoadingSpinner;
