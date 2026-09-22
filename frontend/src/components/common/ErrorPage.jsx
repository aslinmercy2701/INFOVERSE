import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const ErrorPage = ({ code = 404, message = 'Page Not Found' }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-bg circuit-bg flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-[20vw] font-orbitron font-black text-red-900/5 select-none">
          {code}
        </div>
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-900/20 border border-red-500/30 flex items-center justify-center"
            style={{ boxShadow: '0 0 30px rgba(255,0,34,0.3)' }}>
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
        </div>

        <div className="mb-2 font-mono-tech text-red-500 text-sm tracking-widest">
          ERROR_{code}
        </div>
        <h1 className="font-orbitron text-4xl font-black text-white mb-4 tracking-wide">
          {message}
        </h1>
        <p className="text-gray-400 font-rajdhani text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg border border-red-500/30 text-red-400 font-rajdhani font-semibold hover:bg-red-600/10 transition-all"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 justify-center px-6 py-3 rounded-lg bg-red-600 text-white font-rajdhani font-semibold hover:bg-red-700 transition-all"
            style={{ boxShadow: '0 0 20px rgba(255,0,34,0.4)' }}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>

        <div className="mt-12 font-orbitron text-xs text-gray-600 tracking-widest">
          INFOVERSE 2026 · DMI Engineering College
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
