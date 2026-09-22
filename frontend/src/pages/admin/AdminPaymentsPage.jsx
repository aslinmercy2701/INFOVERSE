import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock3,
  Eye,
  IndianRupee,
  CreditCard,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';

const AdminPaymentsPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  // Demo data — backend connect செய்த பிறகு database data வரும்
  const [payments, setPayments] = useState([]);

  const filteredPayments = payments.filter((payment) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      payment.registrationId?.toLowerCase().includes(searchText) ||
      payment.name?.toLowerCase().includes(searchText) ||
      payment.utr?.toLowerCase().includes(searchText);

    const matchesStatus =
      status === 'all' || payment.status === status;

    return matchesSearch && matchesStatus;
  });

  const updatePaymentStatus = (id, newStatus) => {
    setPayments((current) =>
      current.map((payment) =>
        payment.id === id
          ? { ...payment, status: newStatus }
          : payment
      )
    );
  };

  return (
    <Layout isAdmin>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-red-500 text-xs font-mono-tech tracking-[0.3em] mb-2">
            // PAYMENT VERIFICATION
          </p>

          <h1 className="text-3xl lg:text-4xl font-bold text-white font-orbitron">
            Payment <span className="text-red-500">Management</span>
          </h1>

          <p className="text-gray-400 mt-2 font-rajdhani">
            Verify participant payments and transaction details.
          </p>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <SummaryCard
            title="Total Payments"
            value={payments.length}
            icon={CreditCard}
          />

          <SummaryCard
            title="Verified"
            value={payments.filter((p) => p.status === 'verified').length}
            icon={CheckCircle}
          />

          <SummaryCard
            title="Pending"
            value={payments.filter((p) => p.status === 'pending').length}
            icon={Clock3}
          />

          <SummaryCard
            title="Revenue"
            value={`₹${payments
              .filter((p) => p.status === 'verified')
              .reduce((total, p) => total + Number(p.amount || 0), 0)}`}
            icon={IndianRupee}
          />

        </div>

        {/* Search + Filter */}
        <div
          className="rounded-xl border border-red-900/30 p-4 mb-6"
          style={{ background: 'rgba(17,17,17,0.85)' }}
        >
          <div className="flex flex-col md:flex-row gap-3">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search registration ID, name or UTR..."
                className="w-full bg-black/50 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white text-sm font-rajdhani outline-none focus:border-red-500"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-gray-300 text-sm font-rajdhani outline-none focus:border-red-500"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>

          </div>
        </div>

        {/* Payments Table */}
        <div
          className="rounded-xl border border-red-900/30 overflow-hidden"
          style={{ background: 'rgba(17,17,17,0.85)' }}
        >
          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px]">

              <thead>
                <tr className="border-b border-gray-800">

                  <th className="text-left px-5 py-4 text-gray-500 text-xs font-mono-tech">
                    REGISTRATION
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-xs font-mono-tech">
                    PARTICIPANT
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-xs font-mono-tech">
                    EVENT
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-xs font-mono-tech">
                    AMOUNT
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-xs font-mono-tech">
                    UTR / TRANSACTION ID
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-xs font-mono-tech">
                    STATUS
                  </th>

                  <th className="text-right px-5 py-4 text-gray-500 text-xs font-mono-tech">
                    ACTION
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">

                      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-6 h-6 text-red-500" />
                      </div>

                      <p className="text-white font-orbitron text-sm">
                        No payment records found
                      </p>

                      <p className="text-gray-500 text-sm font-rajdhani mt-1">
                        Payment records will appear after registrations.
                      </p>

                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-900 hover:bg-red-500/[0.03]"
                    >

                      <td className="px-5 py-4">
                        <span className="text-red-400 font-mono-tech text-sm">
                          {payment.registrationId}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-white font-rajdhani font-semibold">
                          {payment.name}
                        </p>

                        <p className="text-gray-500 text-xs">
                          {payment.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-300 font-rajdhani">
                        {payment.event}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-white font-orbitron">
                          ₹{payment.amount}
                        </span>

                        {payment.discount > 0 && (
                          <p className="text-green-400 text-xs font-rajdhani">
                            ₹{payment.discount} discount
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-gray-300 font-mono-tech text-xs">
                          {payment.utr}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <PaymentStatus status={payment.status} />
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-red-500/50"
                            title="View payment"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {payment.status === 'pending' && (
                            <>
                              <button
                                onClick={() =>
                                  updatePaymentStatus(
                                    payment.id,
                                    'verified'
                                  )
                                }
                                className="p-2 rounded-lg border border-green-900/40 text-green-400 hover:bg-green-500/10"
                                title="Verify payment"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() =>
                                  updatePaymentStatus(
                                    payment.id,
                                    'rejected'
                                  )
                                }
                                className="p-2 rounded-lg border border-red-900/40 text-red-400 hover:bg-red-500/10"
                                title="Reject payment"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                        </div>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>
          </div>
        </div>

        {/* Important Rule */}
        <div className="mt-6 p-4 rounded-xl border border-yellow-900/30 bg-yellow-500/5">
          <p className="text-yellow-400 text-sm font-rajdhani">
            <strong>Revenue rule:</strong> Only verified payments are included
            in total revenue. Pending and rejected payments are excluded.
          </p>
        </div>

      </div>
    </Layout>
  );
};

/* Summary Card */
const SummaryCard = ({ title, value, icon: Icon }) => {
  return (
    <div
      className="rounded-xl border border-red-900/30 p-5"
      style={{ background: 'rgba(17,17,17,0.85)' }}
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-gray-500 text-xs font-mono-tech">
            {title}
          </p>

          <p className="text-white text-2xl font-orbitron font-bold mt-2">
            {value}
          </p>
        </div>

        <div className="w-11 h-11 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-red-500" />
        </div>

      </div>
    </div>
  );
};

/* Payment Status */
const PaymentStatus = ({ status }) => {
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-rajdhani">
        <CheckCircle className="w-3.5 h-3.5" />
        Verified
      </span>
    );
  }

  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-rajdhani">
        <XCircle className="w-3.5 h-3.5" />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-rajdhani">
      <Clock3 className="w-3.5 h-3.5" />
      Pending
    </span>
  );
};

export default AdminPaymentsPage;