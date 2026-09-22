import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import ParticlesBackground from '../../components/common/ParticlesBackground';

const AdminLoginPage = () => {
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
      const res = await api.post('/auth/admin-login', form);
      login(res.data.user, res.data.token);
      toast.success('Admin access granted!');
      navigate('/admin/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid admin credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black circuit-bg flex items-center justify-center p-4 relative overflow-hidden">
      <ParticlesBackground />

      {/* Dark red glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-orbitron text-[16vw] font-black text-red-900/[0.04] whitespace-nowrap">
          ADMIN
        </span>
      </div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="rounded-2xl p-8 border border-red-500/20"
          style={{
            background: 'rgba(8,0,0,0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 60px rgba(255,0,34,0.15), inset 0 0 40px rgba(255,0,34,0.02)',
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-900/30 border border-red-500/50 mb-4"
              style={{ boxShadow: '0 0 30px rgba(255,0,34,0.4)' }}
            >
              <Shield className="w-8 h-8 text-red-400" />
            </motion.div>
            <h1 className="font-orbitron text-2xl font-black text-white tracking-wider">
              ADMIN LOGIN
            </h1>
            <p className="text-red-500 font-mono-tech text-xs tracking-widest mt-1">
              INFOVERSE ADMIN PANEL
            </p>
            <div className="mt-2 h-px bg-gradient-to-r from-transparent via-red-800 to-transparent" />
          </div>

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
            <div>
              <label className="block text-xs text-red-400/70 font-mono-tech tracking-wider mb-1.5">ADMIN EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-800" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@dmi.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/70 border border-red-900/40 text-white font-rajdhani placeholder-gray-700 focus:outline-none focus:border-red-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-red-400/70 font-mono-tech tracking-wider mb-1.5">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-800" />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-black/70 border border-red-900/40 text-white font-rajdhani placeholder-gray-700 focus:outline-none focus:border-red-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-400 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-orbitron font-bold text-white tracking-wider transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #cc0000, #ff0022, #cc0000)',
                boxShadow: loading ? 'none' : '0 0 25px rgba(255,0,34,0.5)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  VERIFYING...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  ACCESS ADMIN PANEL
                </span>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600 text-xs font-mono-tech">
            <Link to="/login" className="hover:text-red-400 transition-colors">
              ← Back to Participant Login
            </Link>
          </p>
        </div>

        <p className="text-center mt-4 text-red-900/50 font-mono-tech text-xs">
          RESTRICTED ACCESS · AUTHORIZED PERSONNEL ONLY
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
