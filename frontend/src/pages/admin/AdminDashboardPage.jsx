import React, { useEffect, useState } from 'react';
import {
  Users,
  CalendarDays,
  IndianRupee,
  Clock3,
  CheckCircle2,
  XCircle,
  Activity,
  CreditCard,
  UserPlus,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/admin/stats');

      if (response.data?.success) {
        setStats(response.data.stats);
      } else {
        setError('Unable to load dashboard data.');
      }
    } catch (err) {
      console.error('Dashboard stats error:', err);
      setError(
        err.response?.data?.message ||
        'Unable to load dashboard data.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalRegistrations = stats?.totalRegistrations || 0;
  const totalRevenue = stats?.totalRevenue || 0;
  const pendingPayments = stats?.pendingPayments || 0;
  const verifiedPayments = stats?.verifiedPayments || 0;
  const rejectedPayments = stats?.rejectedPayments || 0;

  const events = stats?.eventWiseCounts || [];

  const eventNames = {
    'Paper Preparation': 'Paper Preparation',
    'Prompt Battle': 'Prompt Battle',
    Debugging: 'Debugging',
    'Project Expo': 'Project Expo',
    'Website Creation': 'Website Creation',
    'Memes Creation': 'Memes Creation',
    Quiz: 'Quiz',
    Imposter: 'Imposter',
    'Finding BGM': 'Finding BGM',
  };

  const getEventCount = (eventName) => {
    const event = events.find(
      (item) => item.eventName === eventName
    );

    return event?.count || 0;
  };

  const statsCards = [
    {
      title: 'TOTAL REGISTRATIONS',
      value: totalRegistrations,
      subtitle: 'All registrations',
      icon: Users,
    },
    {
      title: 'TOTAL EVENTS',
      value: 9,
      subtitle: '5 Technical · 4 Non-Tech',
      icon: CalendarDays,
    },
    {
      title: 'VERIFIED REVENUE',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      subtitle: 'Verified payments',
      icon: IndianRupee,
    },
    {
      title: 'PENDING PAYMENTS',
      value: pendingPayments,
      subtitle: 'Needs verification',
      icon: Clock3,
    },
  ];

  return (
    <Layout isAdmin>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

              <p className="text-red-500 text-xs font-mono-tech tracking-[0.3em]">
                SYSTEM ONLINE
              </p>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-white font-orbitron">
              Admin <span className="text-red-500">Control Center</span>
            </h1>

            <p className="text-gray-500 mt-2 font-rajdhani">
              Monitor registrations, payments and event activity.
            </p>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-900/40 bg-black/40 text-red-400 text-xs font-mono-tech hover:border-red-500/50 transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            />
            REFRESH
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-red-400 text-sm font-rajdhani">
            {error}
          </div>
        )}

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {statsCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-xl border border-red-900/30 bg-[#0b0b0b] p-5 hover:border-red-500/40 transition-all"
              >
                <div className="absolute -right-10 -top-10 w-28 h-28 bg-red-600/10 rounded-full blur-3xl" />

                <div className="relative flex items-start justify-between">

                  <div>
                    <p className="text-gray-600 text-[10px] font-mono-tech tracking-wider">
                      {stat.title}
                    </p>

                    <h2 className="text-2xl lg:text-3xl text-white font-bold font-orbitron mt-2">
                      {loading ? '...' : stat.value}
                    </h2>

                    <p className="text-gray-600 text-xs font-rajdhani mt-2">
                      {stat.subtitle}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-red-500" />
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* Payment + Registration Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Payment Status */}
          <div className="lg:col-span-1 rounded-xl border border-red-900/30 bg-[#0b0b0b] p-5">

            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-red-500" />

              <h2 className="text-white font-orbitron font-bold text-sm">
                Payment Status
              </h2>
            </div>

            <p className="text-gray-600 text-xs font-rajdhani mb-5">
              Current payment verification
            </p>

            <PaymentRow
              icon={CheckCircle2}
              label="Verified"
              value={verifiedPayments}
            />

            <PaymentRow
              icon={Clock3}
              label="Pending"
              value={pendingPayments}
            />

            <PaymentRow
              icon={XCircle}
              label="Rejected"
              value={rejectedPayments}
            />

            <div className="mt-5 pt-4 border-t border-gray-900">
              <p className="text-[10px] text-gray-600 font-mono-tech">
                VERIFIED REVENUE
              </p>

              <p className="text-2xl text-white font-orbitron font-bold mt-1">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </p>
            </div>

          </div>

          {/* Registration Breakdown */}
          <div className="lg:col-span-2 rounded-xl border border-red-900/30 bg-[#0b0b0b] p-5">

            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-red-500" />

              <h2 className="text-white font-orbitron font-bold text-sm">
                Registration Breakdown
              </h2>
            </div>

            <p className="text-gray-600 text-xs font-rajdhani mb-6">
              Current registration statistics
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <BreakdownCard
                label="TOTAL"
                value={stats?.totalRegistrations || 0}
              />

              <BreakdownCard
                label="INDIVIDUAL"
                value={stats?.individualRegistrations || 0}
              />

              <BreakdownCard
                label="TEAM"
                value={stats?.teamRegistrations || 0}
              />

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

              <div className="p-4 rounded-lg bg-red-500/5 border border-red-900/20">
                <p className="text-[10px] text-gray-600 font-mono-tech">
                  TECHNICAL
                </p>

                <p className="text-xl text-red-400 font-orbitron font-bold mt-1">
                  {stats?.technicalRegistrations || 0}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-900/20">
                <p className="text-[10px] text-gray-600 font-mono-tech">
                  NON-TECHNICAL
                </p>

                <p className="text-xl text-purple-400 font-orbitron font-bold mt-1">
                  {stats?.nonTechnicalRegistrations || 0}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

          <QuickAction
            icon={UserPlus}
            title="Registrations"
            subtitle="Manage participants"
          />

          <QuickAction
            icon={CreditCard}
            title="Payments"
            subtitle="Verify UTR"
          />

          <QuickAction
            icon={CalendarDays}
            title="Events"
            subtitle="Manage events"
          />

          <QuickAction
            icon={FileCheck2}
            title="Reports"
            subtitle="View registration data"
          />

        </div>

        {/* Event Overview */}
        <div className="rounded-xl border border-red-900/30 bg-[#0b0b0b] overflow-hidden">

          <div className="p-5 border-b border-gray-900">

            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-red-500" />

              <h2 className="text-lg font-bold text-white font-orbitron">
                Event Overview
              </h2>
            </div>

            <p className="text-gray-600 text-xs font-rajdhani mt-1">
              Live registration count for each event
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[650px]">

              <thead>
                <tr className="border-b border-gray-900 bg-black/30">

                  <th className="text-left px-5 py-3 text-gray-600 text-[10px] font-mono-tech">
                    EVENT
                  </th>

                  <th className="text-left px-5 py-3 text-gray-600 text-[10px] font-mono-tech">
                    CATEGORY
                  </th>

                  <th className="text-right px-5 py-3 text-gray-600 text-[10px] font-mono-tech">
                    REGISTRATIONS
                  </th>

                </tr>
              </thead>

              <tbody>

                {Object.keys(eventNames).map((eventName, index) => {

                  const count = getEventCount(eventName);
                  const technical = index < 5;

                  return (
                    <tr
                      key={eventName}
                      className="border-b border-gray-900/70 last:border-0 hover:bg-red-500/[0.02]"
                    >

                      <td className="px-5 py-4">
                        <span className="text-white text-sm font-rajdhani font-semibold">
                          {eventName}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-2 py-1 rounded text-[9px] font-mono-tech ${
                            technical
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-purple-500/10 text-purple-400'
                          }`}
                        >
                          {technical
                            ? 'TECHNICAL'
                            : 'NON-TECHNICAL'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="text-white font-orbitron">
                          {count}
                        </span>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        </div>

        {/* Recent Registrations */}
        <div className="rounded-xl border border-red-900/30 bg-[#0b0b0b] overflow-hidden">

          <div className="p-5 border-b border-gray-900">

            <h2 className="text-lg font-bold text-white font-orbitron">
              Recent Registrations
            </h2>

            <p className="text-gray-600 text-xs font-rajdhani mt-1">
              Latest participant registrations
            </p>

          </div>

          {stats?.recentRegistrations?.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead>
                  <tr className="border-b border-gray-900">

                    <th className="text-left px-5 py-3 text-gray-600 text-[10px] font-mono-tech">
                      REGISTRATION
                    </th>

                    <th className="text-left px-5 py-3 text-gray-600 text-[10px] font-mono-tech">
                      PARTICIPANT
                    </th>

                    <th className="text-left px-5 py-3 text-gray-600 text-[10px] font-mono-tech">
                      EVENT
                    </th>

                    <th className="text-right px-5 py-3 text-gray-600 text-[10px] font-mono-tech">
                      STATUS
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {stats.recentRegistrations.map((registration) => (

                    <tr
                      key={registration._id}
                      className="border-b border-gray-900/70 last:border-0"
                    >

                      <td className="px-5 py-4 text-red-400 font-mono-tech text-xs">
                        {registration.registrationId || 'N/A'}
                      </td>

                      <td className="px-5 py-4">

                        <p className="text-white text-sm font-rajdhani font-semibold">
                          {registration.participantName ||
                            registration.teamName ||
                            registration.userId?.name ||
                            'Participant'}
                        </p>

                        <p className="text-gray-600 text-xs mt-0.5">
                          {registration.email ||
                            registration.userId?.email ||
                            ''}
                        </p>

                      </td>

                      <td className="px-5 py-4 text-gray-400 text-sm font-rajdhani">
                        {registration.eventId?.name || 'Event'}
                      </td>

                      <td className="px-5 py-4 text-right">

                        <span
                          className={`px-2 py-1 rounded text-[9px] font-mono-tech ${
                            registration.paymentStatus === 'verified'
                              ? 'bg-green-500/10 text-green-400'
                              : registration.paymentStatus === 'rejected'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-yellow-500/10 text-yellow-400'
                          }`}
                        >
                          {(
                            registration.paymentStatus ||
                            'pending'
                          ).toUpperCase()}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="p-10 text-center">

              <Users className="w-8 h-8 text-gray-800 mx-auto mb-3" />

              <p className="text-gray-600 font-rajdhani text-sm">
                {loading
                  ? 'Loading registrations...'
                  : 'No registrations yet.'}
              </p>

            </div>

          )}

        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1 pb-4">

          <p className="text-[10px] text-gray-700 font-mono-tech">
            INFOVERSE ADMIN SYSTEM · 2026
          </p>

          <p className="text-[10px] text-gray-700 font-mono-tech">
            DMI ENGINEERING COLLEGE · ARALVAIMOZHI
          </p>

        </div>

      </div>
    </Layout>
  );
};

/* =============================================================
   COMPONENTS
============================================================= */

const PaymentRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 mb-4">

    <div className="w-9 h-9 rounded-lg bg-red-500/5 border border-red-900/30 flex items-center justify-center">
      <Icon className="w-4 h-4 text-red-500" />
    </div>

    <div className="flex-1">
      <p className="text-xs text-gray-400 font-rajdhani">
        {label}
      </p>
    </div>

    <span className="text-white font-orbitron text-sm">
      {value}
    </span>

  </div>
);

const BreakdownCard = ({ label, value }) => (
  <div className="p-4 rounded-lg bg-black/30 border border-red-900/20">

    <p className="text-[10px] text-gray-600 font-mono-tech">
      {label}
    </p>

    <p className="text-xl text-white font-orbitron font-bold mt-1">
      {value}
    </p>

  </div>
);

const QuickAction = ({ icon: Icon, title, subtitle }) => (
  <button
    type="button"
    className="group text-left rounded-xl border border-red-900/30 bg-[#0b0b0b] p-4 hover:border-red-500/40 hover:bg-red-500/[0.02] transition-all"
  >

    <div className="flex items-center gap-3">

      <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-red-500" />
      </div>

      <div>
        <p className="text-white text-sm font-orbitron">
          {title}
        </p>

        <p className="text-gray-600 text-[10px] font-rajdhani mt-0.5">
          {subtitle}
        </p>
      </div>

    </div>

  </button>
);

export default AdminDashboardPage;