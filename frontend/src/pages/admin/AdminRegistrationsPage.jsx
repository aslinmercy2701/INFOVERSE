import React, { useEffect, useState } from 'react';
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  Lock,
  Trash2,
  X,
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Users,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Layout from '../../components/layout/Layout';
import api from '../../api/axios';

const AdminRegistrationsPage = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [registrations, setRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [paymentFilter, setPaymentFilter] =
    useState('all');

  const [selectedRegistration, setSelectedRegistration] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);

  // =========================================================
  // FETCH REGISTRATIONS
  // =========================================================

  const fetchRegistrations = async () => {
    try {
      setLoading(true);

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (paymentFilter !== 'all') {
        params.paymentStatus = paymentFilter;
      }

      const response = await api.get(
        '/admin/registrations',
        {
          params,
        }
      );

      if (response.data?.success) {
        setRegistrations(
          response.data.registrations || []
        );
      }
    } catch (error) {
      console.error(
        'Fetch registrations error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to load registrations.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [paymentFilter]);

  // =========================================================
  // SEARCH SUBMIT
  // =========================================================

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRegistrations();
  };

  // =========================================================
  // PAYMENT STATUS UPDATE
  // =========================================================

  const updatePaymentStatus = async (
    registration,
    status
  ) => {
    const action =
      status === 'verified'
        ? 'verify'
        : 'reject';

    const confirmed = window.confirm(
      `Are you sure you want to ${action} payment for ${registration.registrationId || 'this registration'}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(
        `${registration._id}-${status}`
      );

      const response = await api.put(
        `/admin/registrations/${registration._id}/payment`,
        {
          paymentStatus: status,
        }
      );

      if (response.data?.success) {
        toast.success(
          status === 'verified'
            ? 'Payment verified successfully.'
            : 'Payment rejected successfully.'
        );

        setRegistrations((current) =>
          current.map((item) =>
            item._id === registration._id
              ? {
                  ...item,
                  paymentStatus: status,
                }
              : item
          )
        );

        if (
          selectedRegistration?._id ===
          registration._id
        ) {
          setSelectedRegistration(
            (current) =>
              current
                ? {
                    ...current,
                    paymentStatus: status,
                  }
                : current
          );
        }
      }
    } catch (error) {
      console.error(
        'Payment status error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to update payment status.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // DELETE REGISTRATION
  // =========================================================

  const deleteRegistration = async (
    registration
  ) => {
    const confirmed = window.confirm(
      `Delete registration ${registration.registrationId || ''}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(
        `${registration._id}-delete`
      );

      const response = await api.delete(
        `/admin/registrations/${registration._id}`
      );

      if (response.data?.success) {
        toast.success(
          'Registration deleted successfully.'
        );

        setRegistrations((current) =>
          current.filter(
            (item) =>
              item._id !== registration._id
          )
        );

        if (
          selectedRegistration?._id ===
          registration._id
        ) {
          setShowDetails(false);
          setSelectedRegistration(null);
        }
      }
    } catch (error) {
      console.error(
        'Delete registration error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to delete registration.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // DOWNLOAD PDF
  // =========================================================

  const downloadPdf = async (
    registration
  ) => {
    // Frontend protection
    if (
      registration.paymentStatus !==
      'verified'
    ) {
      toast.error(
        'PDF is available only after payment verification.'
      );

      return;
    }

    try {
      setActionLoading(
        `${registration._id}-pdf`
      );

      const response = await api.get(
        `/registrations/${registration._id}/pdf`,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob(
        [response.data],
        {
          type: 'application/pdf',
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      link.download =
        `INFOVERSE-${registration.registrationId || registration._id}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success(
        'Registration PDF downloaded.'
      );
    } catch (error) {
      console.error(
        'PDF download error:',
        error
      );

      toast.error(
        'PDF download failed.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // OPEN DETAILS
  // =========================================================

  const openDetails = async (
    registration
  ) => {
    try {
      const response = await api.get(
        `/admin/registrations/${registration._id}`
      );

      if (response.data?.success) {
        setSelectedRegistration(
          response.data.registration
        );
      } else {
        setSelectedRegistration(
          registration
        );
      }
    } catch (error) {
      console.error(
        'Registration details error:',
        error
      );

      setSelectedRegistration(
        registration
      );
    }

    setShowDetails(true);
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getParticipantName = (
    registration
  ) => {
    return (
      registration.participantName ||
      registration.name ||
      registration.userId?.name ||
      registration.teamName ||
      'Unknown'
    );
  };

  const getEmail = (registration) => {
    return (
      registration.email ||
      registration.userId?.email ||
      '-'
    );
  };

  const getEvents = (registration) => {
    if (
      Array.isArray(
        registration.eventId
      )
    ) {
      return registration.eventId;
    }

    if (registration.eventId) {
      return [registration.eventId];
    }

    if (
      Array.isArray(
        registration.events
      )
    ) {
      return registration.events;
    }

    if (
      Array.isArray(
        registration.selectedEvents
      )
    ) {
      return registration.selectedEvents;
    }

    return [];
  };

  const getEventNames = (
    registration
  ) => {
    const events =
      getEvents(registration);

    return events
      .map((event) => {
        if (
          typeof event === 'string'
        ) {
          return event;
        }

        return event?.name || '-';
      })
      .filter(Boolean);
  };

  const getTeamMembers = (
    registration
  ) => {
    const members =
      registration.teamMembers ||
      registration.members ||
      [];

    return Array.isArray(members)
      ? members
      : [];
  };

  const getStatusClass = (status) => {
    if (status === 'verified') {
      return 'text-green-400 bg-green-500/10 border-green-500/20';
    }

    if (status === 'rejected') {
      return 'text-red-400 bg-red-500/10 border-red-500/20';
    }

    return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Layout isAdmin>

      <div className="max-w-7xl mx-auto">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <p className="text-red-500 text-xs font-mono-tech tracking-[0.3em] mb-2">
              // REGISTRATION MANAGEMENT
            </p>

            <h1 className="text-3xl lg:text-4xl font-bold text-white font-orbitron">
              All{' '}
              <span className="text-red-500">
                Registrations
              </span>
            </h1>

            <p className="text-gray-400 mt-2 font-rajdhani">
              Manage participants and verify
              registration payments.
            </p>

          </div>

          <button
            onClick={fetchRegistrations}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-red-500/40 transition font-rajdhani"
          >

            <RefreshCw
              className={`w-4 h-4 ${
                loading
                  ? 'animate-spin'
                  : ''
              }`}
            />

            Refresh

          </button>

        </div>

        {/* ===================================================
            SEARCH + FILTER
        =================================================== */}

        <div
          className="rounded-xl border border-red-900/30 p-4 mb-6"
          style={{
            background:
              'rgba(17,17,17,0.88)',
          }}
        >

          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-3"
          >

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search name, email, registration ID, college or UTR..."
                className="w-full bg-black/50 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white text-sm font-rajdhani outline-none focus:border-red-500"
              />

            </div>

            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(
                  e.target.value
                )
              }
              className="bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white text-sm font-rajdhani outline-none focus:border-red-500"
            >

              <option value="all">
                All Payments
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="verified">
                Verified
              </option>

              <option value="rejected">
                Rejected
              </option>

            </select>

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-rajdhani font-bold"
            >
              Search
            </button>

          </form>

        </div>

        {/* ===================================================
            TABLE
        =================================================== */}

        <div
          className="rounded-xl border border-red-900/30 overflow-hidden"
          style={{
            background:
              'rgba(17,17,17,0.88)',
          }}
        >

          {loading ? (

            <div className="py-20 text-center">

              <RefreshCw className="w-8 h-8 text-red-500 animate-spin mx-auto mb-3" />

              <p className="text-gray-500 font-rajdhani">
                Loading registrations...
              </p>

            </div>

          ) : registrations.length === 0 ? (

            <div className="py-20 text-center">

              <FileText className="w-10 h-10 text-gray-700 mx-auto mb-3" />

              <p className="text-gray-400 font-rajdhani">
                No registrations found.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

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
                      PAYMENT
                    </th>

                    <th className="text-right px-5 py-4 text-gray-500 text-xs font-mono-tech">
                      ACTIONS
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {registrations.map(
                    (registration) => {

                      const status =
                        registration.paymentStatus ||
                        'pending';

                      const eventNames =
                        getEventNames(
                          registration
                        );

                      return (

                        <tr
                          key={
                            registration._id
                          }
                          className="border-b border-gray-900 hover:bg-white/[0.02] transition"
                        >

                          {/* Registration */}

                          <td className="px-5 py-4">

                            <p className="text-red-400 font-mono-tech text-sm font-bold">
                              {registration.registrationId ||
                                '-'}
                            </p>

                            <p className="text-gray-600 text-xs mt-1">
                              {registration.createdAt
                                ? new Date(
                                    registration.createdAt
                                  ).toLocaleDateString(
                                    'en-IN'
                                  )
                                : '-'}
                            </p>

                          </td>

                          {/* Participant */}

                          <td className="px-5 py-4">

                            <p className="text-white font-rajdhani font-semibold">
                              {getParticipantName(
                                registration
                              )}
                            </p>

                            <p className="text-gray-500 text-xs mt-1">
                              {getEmail(
                                registration
                              )}
                            </p>

                          </td>

                          {/* Event */}

                          <td className="px-5 py-4">

                            <div className="max-w-[230px]">

                              {eventNames.length >
                              0 ? (

                                eventNames
                                  .slice(0, 2)
                                  .map(
                                    (
                                      eventName,
                                      index
                                    ) => (
                                      <p
                                        key={
                                          index
                                        }
                                        className="text-gray-300 text-sm font-rajdhani"
                                      >
                                        {eventName}
                                      </p>
                                    )
                                  )

                              ) : (

                                <p className="text-gray-600 text-sm">
                                  -
                                </p>

                              )}

                              {eventNames.length >
                                2 && (
                                <p className="text-red-400 text-xs mt-1">
                                  +
                                  {eventNames.length -
                                    2}{' '}
                                  more
                                </p>
                              )}

                            </div>

                          </td>

                          {/* Amount */}

                          <td className="px-5 py-4">

                            <p className="text-white font-orbitron">
                              ₹
                              {registration.finalAmount ??
                                registration.amount ??
                                0}
                            </p>

                            {registration.referralDiscount >
                              0 && (
                              <p className="text-green-400 text-xs mt-1">
                                -₹
                                {
                                  registration.referralDiscount
                                }
                              </p>
                            )}

                          </td>

                          {/* Payment */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-mono-tech ${getStatusClass(
                                status
                              )}`}
                            >
                              {status.toUpperCase()}
                            </span>

                            {registration.utr && (
                              <p className="text-gray-600 text-xs mt-2 font-mono-tech">
                                UTR:{' '}
                                {
                                  registration.utr
                                }
                              </p>
                            )}

                          </td>

                          {/* Actions */}

                          <td className="px-5 py-4">

                            <div className="flex items-center justify-end gap-2">

                              {/* View */}

                              <button
                                onClick={() =>
                                  openDetails(
                                    registration
                                  )
                                }
                                title="View Details"
                                className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition"
                              >

                                <Eye className="w-4 h-4" />

                              </button>

                              {/* Verify */}

                              {status !==
                                'verified' && (
                                <button
                                  onClick={() =>
                                    updatePaymentStatus(
                                      registration,
                                      'verified'
                                    )
                                  }
                                  disabled={
                                    actionLoading ===
                                    `${registration._id}-verified`
                                  }
                                  title="Verify Payment"
                                  className="p-2 rounded-lg border border-green-900/50 text-green-400 hover:bg-green-500/10 transition disabled:opacity-40"
                                >

                                  {actionLoading ===
                                  `${registration._id}-verified` ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}

                                </button>
                              )}

                              {/* Reject */}

                              {status !==
                                'rejected' && (
                                <button
                                  onClick={() =>
                                    updatePaymentStatus(
                                      registration,
                                      'rejected'
                                    )
                                  }
                                  disabled={
                                    actionLoading ===
                                    `${registration._id}-rejected`
                                  }
                                  title="Reject Payment"
                                  className="p-2 rounded-lg border border-red-900/50 text-red-400 hover:bg-red-500/10 transition disabled:opacity-40"
                                >

                                  {actionLoading ===
                                  `${registration._id}-rejected` ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <XCircle className="w-4 h-4" />
                                  )}

                                </button>
                              )}

                              {/* PDF */}

                              {status ===
                              'verified' ? (

                                <button
                                  onClick={() =>
                                    downloadPdf(
                                      registration
                                    )
                                  }
                                  disabled={
                                    actionLoading ===
                                    `${registration._id}-pdf`
                                  }
                                  title="Download PDF"
                                  className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-40"
                                >

                                  {actionLoading ===
                                  `${registration._id}-pdf` ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Download className="w-4 h-4" />
                                  )}

                                </button>

                              ) : (

                                <button
                                  disabled
                                  title="PDF available after payment verification"
                                  className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-600 cursor-not-allowed"
                                >

                                  <Lock className="w-4 h-4" />

                                </button>

                              )}

                              {/* Delete */}

                              <button
                                onClick={() =>
                                  deleteRegistration(
                                    registration
                                  )
                                }
                                disabled={
                                  actionLoading ===
                                  `${registration._id}-delete`
                                }
                                title="Delete"
                                className="p-2 rounded-lg border border-gray-800 text-gray-500 hover:text-red-400 hover:border-red-900/50 transition disabled:opacity-40"
                              >

                                {actionLoading ===
                                `${registration._id}-delete` ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}

                              </button>

                            </div>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {showDetails &&
        selectedRegistration && (

          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">

            <div
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-red-900/40"
              style={{
                background: '#111',
              }}
            >

              {/* Modal Header */}

              <div className="sticky top-0 z-10 bg-[#111] border-b border-gray-800 px-6 py-5 flex items-center justify-between">

                <div>

                  <p className="text-red-500 text-[10px] font-mono-tech tracking-[0.25em]">
                    // REGISTRATION DETAILS
                  </p>

                  <h2 className="text-xl text-white font-orbitron font-bold mt-1">

                    {selectedRegistration.registrationId ||
                      'Registration'}

                  </h2>

                </div>

                <button
                  onClick={() => {
                    setShowDetails(
                      false
                    );
                    setSelectedRegistration(
                      null
                    );
                  }}
                  className="w-9 h-9 rounded-lg border border-gray-800 text-gray-500 hover:text-white flex items-center justify-center"
                >

                  <X className="w-4 h-4" />

                </button>

              </div>

              <div className="p-6 space-y-6">

                {/* Payment Status */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-gray-800 bg-black/30">

                  <div>

                    <p className="text-gray-500 text-xs font-mono-tech">
                      PAYMENT STATUS
                    </p>

                    <span
                      className={`inline-flex mt-2 px-3 py-1 rounded-full border text-xs font-mono-tech ${getStatusClass(
                        selectedRegistration.paymentStatus ||
                          'pending'
                      )}`}
                    >
                      {(
                        selectedRegistration.paymentStatus ||
                        'pending'
                      ).toUpperCase()}
                    </span>

                  </div>

                  {selectedRegistration.paymentStatus ===
                    'verified' ? (

                    <button
                      onClick={() =>
                        downloadPdf(
                          selectedRegistration
                        )
                      }
                      disabled={
                        actionLoading ===
                        `${selectedRegistration._id}-pdf`
                      }
                      className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-rajdhani font-bold disabled:opacity-50"
                    >

                      {actionLoading ===
                      `${selectedRegistration._id}-pdf` ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}

                      Download PDF

                    </button>

                  ) : (

                    <div className="flex items-center gap-2 text-gray-600 text-sm font-rajdhani">

                      <Lock className="w-4 h-4" />

                      PDF Locked

                    </div>

                  )}

                </div>

                {/* Participant */}

                <div>

                  <h3 className="text-red-500 text-sm font-orbitron font-bold mb-3">
                    PARTICIPANT
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    <InfoBox
                      icon={User}
                      label="Name"
                      value={getParticipantName(
                        selectedRegistration
                      )}
                    />

                    <InfoBox
                      icon={Mail}
                      label="Email"
                      value={getEmail(
                        selectedRegistration
                      )}
                    />

                    <InfoBox
                      icon={Phone}
                      label="Phone"
                      value={
                        selectedRegistration.phone ||
                        '-'
                      }
                    />

                    <InfoBox
                      icon={Building2}
                      label="Department"
                      value={
                        selectedRegistration.department ||
                        '-'
                      }
                    />

                    <InfoBox
                      icon={Calendar}
                      label="Year"
                      value={
                        selectedRegistration.year ||
                        '-'
                      }
                    />

                    <InfoBox
                      icon={Building2}
                      label="College"
                      value={
                        selectedRegistration.college ||
                        '-'
                      }
                    />

                  </div>

                </div>

                {/* Team */}

                {(selectedRegistration.teamName ||
                  getTeamMembers(
                    selectedRegistration
                  ).length > 0) && (

                  <div>

                    <h3 className="text-red-500 text-sm font-orbitron font-bold mb-3">
                      TEAM DETAILS
                    </h3>

                    <div className="p-4 rounded-xl border border-gray-800 bg-black/30">

                      {selectedRegistration.teamName && (
                        <p className="text-white font-rajdhani mb-3">
                          <span className="text-gray-500">
                            Team:
                          </span>{' '}
                          {
                            selectedRegistration.teamName
                          }
                        </p>
                      )}

                      <div className="space-y-2">

                        {getTeamMembers(
                          selectedRegistration
                        ).map(
                          (
                            member,
                            index
                          ) => (

                            <div
                              key={
                                index
                              }
                              className="flex items-center gap-2 text-gray-300 text-sm"
                            >

                              <Users className="w-4 h-4 text-red-400" />

                              {typeof member ===
                              'string'
                                ? member
                                : member?.name ||
                                  '-'}
                            </div>

                          )
                        )}

                      </div>

                    </div>

                  </div>

                )}

                {/* Events */}

                <div>

                  <h3 className="text-red-500 text-sm font-orbitron font-bold mb-3">
                    SELECTED EVENTS
                  </h3>

                  <div className="space-y-2">

                    {getEventNames(
                      selectedRegistration
                    ).map(
                      (
                        eventName,
                        index
                      ) => (

                        <div
                          key={
                            index
                          }
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-800 bg-black/30"
                        >

                          <span className="w-6 h-6 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xs font-mono-tech">
                            {index + 1}
                          </span>

                          <span className="text-gray-300 font-rajdhani">
                            {eventName}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

                {/* Payment */}

                <div>

                  <h3 className="text-red-500 text-sm font-orbitron font-bold mb-3">
                    PAYMENT DETAILS
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                    <InfoBox
                      icon={CreditCard}
                      label="Base Amount"
                      value={`₹${
                        selectedRegistration.baseAmount ??
                        '-'
                      }`}
                    />

                    <InfoBox
                      icon={CreditCard}
                      label="Referral Discount"
                      value={`₹${
                        selectedRegistration.referralDiscount ??
                        0
                      }`}
                    />

                    <InfoBox
                      icon={CreditCard}
                      label="Final Amount"
                      value={`₹${
                        selectedRegistration.finalAmount ??
                        selectedRegistration.amount ??
                        '-'
                      }`}
                    />

                  </div>

                  <div className="mt-3 p-4 rounded-xl border border-gray-800 bg-black/30">

                    <p className="text-gray-500 text-xs font-mono-tech">
                      UTR / TRANSACTION ID
                    </p>

                    <p className="text-white font-mono-tech mt-1">
                      {selectedRegistration.utr ||
                        selectedRegistration.transactionId ||
                        '-'}
                    </p>

                  </div>

                </div>

                {/* Actions */}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">

                  {selectedRegistration.paymentStatus !==
                    'verified' && (

                    <button
                      onClick={() =>
                        updatePaymentStatus(
                          selectedRegistration,
                          'verified'
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-rajdhani font-bold"
                    >

                      <CheckCircle className="w-4 h-4" />

                      Verify Payment

                    </button>

                  )}

                  {selectedRegistration.paymentStatus !==
                    'rejected' && (

                    <button
                      onClick={() =>
                        updatePaymentStatus(
                          selectedRegistration,
                          'rejected'
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-2 border border-red-900/50 text-red-400 hover:bg-red-500/10 py-3 rounded-lg font-rajdhani font-bold"
                    >

                      <XCircle className="w-4 h-4" />

                      Reject Payment

                    </button>

                  )}

                  <button
                    onClick={() =>
                      deleteRegistration(
                        selectedRegistration
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-800 text-gray-400 hover:text-red-400 hover:border-red-900/50 py-3 rounded-lg font-rajdhani font-bold"
                  >

                    <Trash2 className="w-4 h-4" />

                    Delete

                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

    </Layout>
  );
};

// =========================================================
// INFO BOX
// =========================================================

const InfoBox = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="p-4 rounded-xl border border-gray-800 bg-black/30">

      <div className="flex items-center gap-2">

        <Icon className="w-4 h-4 text-red-400" />

        <p className="text-gray-500 text-xs font-mono-tech">
          {label}
        </p>

      </div>

      <p className="text-white font-rajdhani font-semibold mt-2 break-words">
        {value}
      </p>

    </div>
  );
};

export default AdminRegistrationsPage;