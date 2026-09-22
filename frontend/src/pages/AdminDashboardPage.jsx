import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  CalendarDays,
  IndianRupee,
  Clock3,
  CheckCircle,
  XCircle,
  UserCheck,
  Ticket,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';

const AdminDashboardPage = () => {
  const stats = [
    {
      title: 'Total Registrations',
      value: '0',
      icon: Users,
      description: 'All registrations',
    },
    {
      title: 'Total Events',
      value: '9',
      icon: CalendarDays,
      description: 'Active events',
    },
    {
      title: 'Verified Revenue',
      value: '₹0',
      icon: IndianRupee,
      description: 'Verified payments',
    },
    {
      title: 'Pending Payments',
      value: '0',
      icon: Clock3,
      description: 'Waiting for verification',
    },
  ];

  const paymentStats = [
    {
      title: 'Verified',
      value: '0',
      icon: CheckCircle,
      className: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Pending',
      value: '0',
      icon: Clock3,
      className: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      title: 'Rejected',
      value: '0',
      icon: XCircle,
      className: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      title: 'Referral Registrations',
      value: '0',
      icon: Ticket,
      className: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  const eventStats = [
    { name: 'Paper Preparation', category: 'Technical', count: 0 },
    { name: 'Prompt Battle', category: 'Technical', count: 0 },
    { name: 'Debugging', category: 'Technical', count: 0 },
    { name: 'Project Expo', category: 'Technical', count: 0 },
    { name: 'Website Creation', category: 'Technical', count: 0 },
    { name: 'Memes Creation', category: 'Non-Technical', count: 0 },
    { name: 'Quiz', category: 'Non-Technical', count: 0 },
    { name: 'Imposter', category: 'Non-Technical', count: 0 },
    { name: 'Finding BGM', category: 'Non-Technical', count: 0 },
  ];

  return (
    <Layout isAdmin>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-red-500 font-mono-tech text-xs tracking-[0.3em] mb-2">
            // ADMIN CONTROL CENTER
          </p>

          <h1 className="font-orbitron text-3xl lg:text-4xl font-bold text-white">
            Admin <span className="text-red-500">Dashboard</span>
          </h1>

          <p className="text-gray-400 font-rajdhani mt-2">
            Monitor INFOVERSE registrations, events and payments.
          </p>
        </motion.div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="glass rounded-xl border border-red-900/30 p-5"
                style={{ background: 'rgba(17,17,17,0.85)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-mono-tech uppercase">
                      {stat.title}
                    </p>

                    <h2 className="text-2xl font-orbitron font-bold text-white mt-2">
                      {stat.value}
                    </h2>

                    <p className="text-gray-600 text-xs font-rajdhani mt-1">
                      {stat.description}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-red-500" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Overview */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-4 h-4 text-red-500" />
            <h2 className="font-orbitron text-lg font-bold text-white">
              Registration Overview
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentStats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="glass rounded-xl border border-gray-800 p-4"
                  style={{ background: 'rgba(17,17,17,0.75)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${item.className}`} />
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs font-rajdhani">
                        {item.title}
                      </p>

                      <p className="text-white text-xl font-orbitron font-bold">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl border border-red-900/30 overflow-hidden"
          style={{ background: 'rgba(17,17,17,0.85)' }}
        >
          <div className="p-5 border-b border-gray-800">
            <h2 className="font-orbitron text-lg font-bold text-white">
              Event-wise Registrations
            </h2>

            <p className="text-gray-500 text-sm font-rajdhani mt-1">
              Registration count for each INFOVERSE event
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-5 py-3 text-gray-500 text-xs font-mono-tech">
                    EVENT
                  </th>

                  <th className="text-left px-5 py-3 text-gray-500 text-xs font-mono-tech">
                    CATEGORY
                  </th>

                  <th className="text-right px-5 py-3 text-gray-500 text-xs font-mono-tech">
                    REGISTRATIONS
                  </th>
                </tr>
              </thead>

              <tbody>
                {eventStats.map((event, index) => (
                  <tr
                    key={event.name}
                    className="border-b border-gray-900 last:border-0 hover:bg-red-500/[0.03] transition"
                  >
                    <td className="px-5 py-4">
                      <span className="text-white font-rajdhani font-semibold">
                        {event.name}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono-tech ${
                          event.category === 'Technical'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        {event.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-white font-orbitron font-bold">
                        {event.count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Revenue Note */}
        <div className="mt-6 p-4 rounded-xl border border-yellow-900/30 bg-yellow-500/5">
          <p className="text-yellow-400 text-sm font-rajdhani">
            <strong>Payment rule:</strong>{' '}
            Revenue is calculated only from verified payments.
            Pending and rejected payments are excluded.
          </p>
        </div>

      </div>
    </Layout>
  );
};

export default AdminDashboardPage;