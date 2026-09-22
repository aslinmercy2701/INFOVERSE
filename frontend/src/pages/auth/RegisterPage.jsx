import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import ParticlesBackground from '../../components/common/ParticlesBackground';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let strength = 0;
    if (p.length >= 8) strength++;
    if (/[A-Z]/.test(p)) strength++;
    if (/[0-9]/.test(p)) strength++;
    if (/[^A-Za-z0-9]/.test(p)) strength++;
    return strength;
  };

  const strengthColors = ['', 'bg-red-600', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(res.data.user, res.data.token);
      toast.success('Account created successfully! Welcome to INFOVERSE!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-dark-bg circuit-bg flex items-center justify-center p-4 relative overflow-hidden scanline">
      <ParticlesBackground />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-orbitron text-[15vw] font-black text-white/[0.02] whitespace-nowrap">
          INFOVERSE
        </span>
      </div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="rounded-2xl p-8 border border-red-900/30"
          style={{
            background: 'rgba(10,10,10,0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 40px rgba(255,0,34,0.1)',
          }}
        >
          {/* Logo */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 mb-3"
              style={{ boxShadow: '0 0 20px rgba(255,0,34,0.3)' }}>
              <Zap className="w-7 h-7 text-red-400" />
            </div>
            <h1 className="font-orbitron text-xl font-black text-white tracking-wider">CREATE ACCOUNT</h1>
            <p className="text-red-400 font-mono-tech text-xs tracking-widest mt-1">JOIN INFOVERSE 2026</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs text-gray-400 font-mono-tech tracking-wider mb-1.5">FULL NAME</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/50 border border-red-900/30 text-white font-rajdhani placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all"
                  required
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/50 border border-red-900/30 text-white font-rajdhani placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all"
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
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-black/50 border border-red-900/30 text-white font-rajdhani placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all"
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
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${strength >= i ? strengthColors[strength] : 'bg-gray-800'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-mono-tech">{strengthLabels[strength]}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs text-gray-400 font-mono-tech tracking-wider mb-1.5">CONFIRM PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  name="confirmPassword"
                  type={showPass ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-black/50 border border-red-900/30 text-white font-rajdhani placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all"
                  required
                />
                {form.confirmPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {form.password === form.confirmPassword
                      ? <CheckCircle className="w-4 h-4 text-green-500" />
                      : <AlertCircle className="w-4 h-4 text-red-400" />
                    }
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-orbitron font-bold text-white tracking-wider transition-all disabled:opacity-50 mt-2"
              style={{
                background: 'linear-gradient(135deg, #ff0022, #dc143c)',
                boxShadow: loading ? 'none' : '0 0 20px rgba(255,0,34,0.4)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  CREATING ACCOUNT...
                </span>
              ) : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="text-center mt-5 text-gray-500 text-sm font-rajdhani">
            Already have an account?{' '}
            <Link to="/login" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
              Sign In
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

export default RegisterPage;
