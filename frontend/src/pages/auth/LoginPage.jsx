import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Zap, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import ParticlesBackground from '../../components/common/ParticlesBackground';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name || 'User'}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg circuit-bg flex items-center justify-center p-4 relative overflow-hidden scanline">
      <ParticlesBackground />

      {/* Background INFOVERSE text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-orbitron text-[18vw] font-black text-white/[0.02] whitespace-nowrap">
          INFOVERSE
        </span>
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-red-900/8 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div
          className="rounded-2xl p-8 border border-red-900/30"
          style={{
            background: 'rgba(10,10,10,0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 40px rgba(255,0,34,0.1)',
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 mb-4"
              style={{ boxShadow: '0 0 20px rgba(255,0,34,0.3)' }}
            >
              <Zap className="w-8 h-8 text-red-400" />
            </motion.div>
            <h1 className="font-orbitron text-2xl font-black text-white tracking-wider">
              INFOVERSE
            </h1>
            <p className="text-red-400 font-mono-tech text-xs tracking-widest mt-1">
              PARTICIPANT LOGIN
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/30 mb-4"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm font-rajdhani">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs text-gray-400 font-mono-tech tracking-wider mb-1.5">EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/50 border border-red-900/30 text-white font-rajdhani placeholder-gray-600 focus:outline-none focus:border-red-500 focus:shadow-neon-sm transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-400 font-mono-tech tracking-wider mb-1.5">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-black/50 border border-red-900/30 text-white font-rajdhani placeholder-gray-600 focus:outline-none focus:border-red-500 focus:shadow-neon-sm transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <button type="button" className="text-xs text-gray-500 hover:text-red-400 font-mono-tech transition-colors">
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-orbitron font-bold text-white tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #ff0022, #dc143c)',
                boxShadow: loading ? 'none' : '0 0 20px rgba(255,0,34,0.4)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AUTHENTICATING...
                </span>
              ) : 'LOGIN'}
            </button>

            {/* Google */}
            <button
              type="button"
              className="w-full py-3 rounded-lg border border-red-900/30 text-gray-300 font-rajdhani font-semibold hover:bg-white/5 hover:border-red-500/40 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                <path fill="#4A90D9" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500 text-sm font-rajdhani">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
              Create Account
            </Link>
          </p>

          <p className="text-center mt-3 text-gray-600 text-xs font-mono-tech">
            <Link to="/admin/login" className="hover:text-red-400 transition-colors">
              Admin Login →
            </Link>
          </p>
        </div>

        <p className="text-center mt-4 text-gray-600 font-mono-tech text-xs">
          INFOVERSE 2026 · DMI Engineering College · Dept of IT
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
