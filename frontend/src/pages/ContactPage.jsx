import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Instagram,
  Globe,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import api from "../api/axios";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    await api.post('/contact', form);

    alert('Message sent successfully!');

    setForm({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  } catch (error) {
    console.error('Contact error:', error);

    alert(
      error.response?.data?.message ||
      'Failed to send message'
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-red-500 font-mono-tech text-xs tracking-[0.3em] mb-2">
            // GET IN TOUCH
          </p>

          <h1 className="font-orbitron text-3xl lg:text-4xl font-bold text-white">
            Contact <span className="text-red-500">INFOVERSE</span>
          </h1>

          <p className="text-gray-400 font-rajdhani mt-2">
            Have questions about the symposium? Contact our team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl border border-red-900/30 p-6"
            style={{ background: 'rgba(17,17,17,0.85)' }}
          >
            <h2 className="font-orbitron text-xl font-bold text-white mb-6">
              Contact Information
            </h2>

            <div className="space-y-5">

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>

                <div>
                  <p className="text-gray-500 text-xs font-mono-tech">
                    VENUE
                  </p>
                  <p className="text-white font-rajdhani font-semibold">
                    DMI Engineering College
                  </p>
                  <p className="text-gray-400 text-sm font-rajdhani">
                    Aralvaimozhi, Tamil Nadu
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-red-500" />
                </div>

                <div>
                  <p className="text-gray-500 text-xs font-mono-tech">
                    EMAIL
                  </p>
                  <p className="text-white font-rajdhani font-semibold">
                    info@infoverse.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-red-500" />
                </div>

                <div>
                  <p className="text-gray-500 text-xs font-mono-tech">
                    PHONE
                  </p>
                  <p className="text-white font-rajdhani font-semibold">
                    +91 63698 57409
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-red-500" />
                </div>

                <div>
                  <p className="text-gray-500 text-xs font-mono-tech">
                    EVENT
                  </p>
                  <p className="text-white font-rajdhani font-semibold">
                    INFOVERSE 2026
                  </p>
                  <p className="text-gray-400 text-sm font-rajdhani">
                    09 October 2026 • 09:30 AM onwards
                  </p>
                </div>
              </div>

            </div>

            {/* Social */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <p className="text-gray-500 text-xs font-mono-tech mb-4">
                FOLLOW US
              </p>

              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/bench_.mates/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-800 text-gray-400 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Message Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl border border-red-900/30 p-6"
            style={{ background: 'rgba(17,17,17,0.85)' }}
          >
            <h2 className="font-orbitron text-xl font-bold text-white mb-6">
              Send a Message
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Name */}
              <div>
                <label className="block text-gray-400 text-sm font-rajdhani mb-2">
                  Your Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-red-500 transition-all font-rajdhani"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-400 text-sm font-rajdhani mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-red-500 transition-all font-rajdhani"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-gray-400 text-sm font-rajdhani mb-2">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is your question?"
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-red-500 transition-all font-rajdhani"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-400 text-sm font-rajdhani mb-2">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-red-500 transition-all font-rajdhani resize-none"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-rajdhani font-bold transition-all"
                style={{
                  boxShadow: '0 0 20px rgba(255,0,34,0.25)',
                }}
              >
                <Send className="w-4 h-4" />

                {loading ? 'SENDING...' : 'SEND MESSAGE'}
              </button>

            </form>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;