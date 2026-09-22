import React, { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Power,
  Search,
  Users,
  Wifi,
  WifiOff,
  RefreshCw,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';

const emptyForm = {
  name: '',
  category: 'Technical',
  description: '',
  rules: '',
  fee: 200,
  mode: 'Offline',
  teamSize: 1,
  date: '09/10/2026',
  venue: 'DMI Engineering College, Aralvaimozhi',
  isTeamEvent: false,
  requiresUpload: false,
  maxParticipants: '',
  status: 'active',
};

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);

  // =========================================================
  // FETCH EVENTS
  // =========================================================

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await api.get('/admin/events');

      if (response.data?.success) {
        setEvents(response.data.events || []);
      }
    } catch (error) {
      console.error('Fetch events error:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to load events.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredEvents = events.filter((event) =>
    event.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // =========================================================
  // TEAM SIZE DISPLAY
  // =========================================================

  const formatTeamSize = (teamSize) => {
    if (
      typeof teamSize === 'object' &&
      teamSize !== null
    ) {
      const min = teamSize.min;
      const max = teamSize.max;

      if (min === max) {
        return min;
      }

      return `${min}-${max}`;
    }

    return teamSize || 1;
  };

  // =========================================================
  // OPEN ADD FORM
  // =========================================================

  const openAddForm = () => {
    setEditingEvent(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  // =========================================================
  // OPEN EDIT FORM
  // =========================================================

  const openEditForm = (event) => {
    setEditingEvent(event);

    let teamSize = 1;

    if (
      typeof event.teamSize === 'object' &&
      event.teamSize !== null
    ) {
      teamSize =
        event.teamSize.min ||
        event.teamSize.max ||
        1;
    } else {
      teamSize = event.teamSize || 1;
    }

    setForm({
      name: event.name || '',
      category: event.category || 'Technical',
      description: event.description || '',

      rules: Array.isArray(event.rules)
        ? event.rules.join('\n')
        : event.rules || '',

      fee: event.fee ?? 200,
      mode: event.mode || 'Offline',
      teamSize,

      date: event.date || '09/10/2026',

      venue:
        event.venue ||
        'DMI Engineering College, Aralvaimozhi',

      isTeamEvent: Boolean(event.isTeamEvent),
      requiresUpload: Boolean(event.requiresUpload),

      maxParticipants:
        event.maxParticipants || '',

      status: event.status || 'active',
    });

    setShowForm(true);
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));
  };

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Event name is required.');
      return;
    }

    if (!form.description.trim()) {
      toast.error('Event description is required.');
      return;
    }

    if (!form.date.trim()) {
      toast.error('Event date is required.');
      return;
    }

    if (!form.venue.trim()) {
      toast.error('Event venue is required.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),

        category: form.category,

        description:
          form.description.trim(),

        rules: form.rules
          .split('\n')
          .map((rule) => rule.trim())
          .filter(Boolean),

        teamSize: Number(form.teamSize),

        mode: form.mode,

        fee: Number(form.fee),

        date: form.date.trim(),

        venue: form.venue.trim(),

        isTeamEvent:
          Boolean(form.isTeamEvent),

        requiresUpload:
          Boolean(form.requiresUpload),

        maxParticipants:
          form.maxParticipants
            ? Number(form.maxParticipants)
            : undefined,

        status: form.status,
      };

      // UPDATE
      if (editingEvent) {
        const response = await api.put(
          `/admin/events/${editingEvent._id}`,
          payload
        );

        if (response.data?.success) {
          toast.success(
            'Event updated successfully.'
          );
        }
      }

      // CREATE
      else {
        const response = await api.post(
          '/admin/events',
          payload
        );

        if (response.data?.success) {
          toast.success(
            'Event created successfully.'
          );
        }
      }

      setShowForm(false);
      setEditingEvent(null);
      setForm(emptyForm);

      await fetchEvents();
    } catch (error) {
      console.error(
        'Save event error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to save event.'
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // ENABLE / DISABLE
  // =========================================================

  const toggleEvent = async (event) => {
    const newStatus =
      event.status === 'active'
        ? 'inactive'
        : 'active';

    try {
      const response = await api.put(
        `/admin/events/${event._id}`,
        {
          status: newStatus,
        }
      );

      if (response.data?.success) {
        toast.success(
          newStatus === 'active'
            ? `${event.name} enabled.`
            : `${event.name} disabled.`
        );

        setEvents((current) =>
          current.map((item) =>
            item._id === event._id
              ? {
                  ...item,
                  status: newStatus,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error(
        'Toggle event error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to update event status.'
      );
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const deleteEvent = async (event) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.name}"?`
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(
        `/admin/events/${event._id}`
      );

      if (response.data?.success) {
        toast.success(
          'Event deleted successfully.'
        );

        setEvents((current) =>
          current.filter(
            (item) =>
              item._id !== event._id
          )
        );
      }
    } catch (error) {
      console.error(
        'Delete event error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to delete event.'
      );
    }
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingEvent(null);
    setForm(emptyForm);
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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <p className="text-red-500 text-xs font-mono-tech tracking-[0.3em] mb-2">
              // EVENT MANAGEMENT
            </p>

            <h1 className="text-3xl lg:text-4xl font-bold text-white font-orbitron">
              Manage{' '}
              <span className="text-red-500">
                Events
              </span>
            </h1>

            <p className="text-gray-400 mt-2 font-rajdhani">
              Add, edit, enable or disable
              INFOVERSE events.
            </p>

          </div>

          <div className="flex gap-2">

            {/* Refresh */}

            <button
              onClick={fetchEvents}
              disabled={loading}
              className="flex items-center justify-center gap-2 border border-gray-800 hover:border-red-500/40 text-gray-400 hover:text-white px-4 py-3 rounded-lg font-rajdhani transition"
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

            {/* Add */}

            <button
              onClick={openAddForm}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg font-rajdhani font-bold transition"
            >

              <Plus className="w-4 h-4" />

              Add Event

            </button>

          </div>

        </div>

        {/* ===================================================
            SEARCH
        =================================================== */}

        <div
          className="rounded-xl border border-red-900/30 p-4 mb-6"
          style={{
            background:
              'rgba(17,17,17,0.85)',
          }}
        >

          <div className="relative max-w-md">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search events..."
              className="w-full bg-black/50 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white text-sm font-rajdhani outline-none focus:border-red-500"
            />

          </div>

        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="py-16 text-center">

            <RefreshCw className="w-8 h-8 text-red-500 animate-spin mx-auto mb-3" />

            <p className="text-gray-500 font-rajdhani">
              Loading events...
            </p>

          </div>
        )}

        {/* ===================================================
            EMPTY
        =================================================== */}

        {!loading &&
          filteredEvents.length === 0 && (
            <div className="py-16 text-center border border-gray-900 rounded-xl bg-[#0b0b0b]">

              <div className="w-12 h-12 mx-auto rounded-xl border border-gray-800 flex items-center justify-center">

                <CalendarEmptyIcon />

              </div>

              <p className="text-gray-400 font-rajdhani mt-3">
                No events found.
              </p>

            </div>
          )}

        {/* ===================================================
            EVENT CARDS
        =================================================== */}

        {!loading &&
          filteredEvents.length > 0 && (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {filteredEvents.map(
                (event) => {

                  const isActive =
                    event.status ===
                    'active';

                  return (
                    <div
                      key={event._id}
                      className={`rounded-xl border p-5 transition ${
                        isActive
                          ? 'border-red-900/30'
                          : 'border-gray-800 opacity-60'
                      }`}
                      style={{
                        background:
                          'rgba(17,17,17,0.85)',
                      }}
                    >

                      {/* Top */}

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <span
                            className={`inline-block px-2 py-1 rounded text-[10px] font-mono-tech ${
                              event.category ===
                              'Technical'
                                ? 'bg-red-500/10 text-red-400'
                                : 'bg-purple-500/10 text-purple-400'
                            }`}
                          >
                            {event.category?.toUpperCase()}
                          </span>

                          <h3 className="text-white font-orbitron font-bold mt-3">
                            {event.name}
                          </h3>

                        </div>

                        <span
                          className={`text-xs font-mono-tech ${
                            isActive
                              ? 'text-green-400'
                              : 'text-gray-500'
                          }`}
                        >
                          {isActive
                            ? 'ACTIVE'
                            : 'DISABLED'}
                        </span>

                      </div>

                      {/* Description */}

                      {event.description && (
                        <p className="text-gray-500 text-sm font-rajdhani mt-4 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      {/* Details */}

                      <div className="grid grid-cols-2 gap-3 mt-5">

                        {/* Fee */}

                        <div className="p-3 rounded-lg bg-black/30 border border-gray-800">

                          <p className="text-gray-500 text-xs font-rajdhani">
                            Registration Fee
                          </p>

                          <p className="text-white font-orbitron mt-1">
                            ₹{event.fee}
                          </p>

                        </div>

                        {/* Team Size */}

                        <div className="p-3 rounded-lg bg-black/30 border border-gray-800">

                          <p className="text-gray-500 text-xs font-rajdhani">
                            Team Size
                          </p>

                          <p className="text-white font-orbitron mt-1 flex items-center gap-1">

                            <Users className="w-3.5 h-3.5 text-red-400" />

                            {formatTeamSize(
                              event.teamSize
                            )}

                          </p>

                        </div>

                        {/* Mode */}

                        <div className="col-span-2 p-3 rounded-lg bg-black/30 border border-gray-800">

                          <p className="text-gray-500 text-xs font-rajdhani">
                            Mode
                          </p>

                          <p className="text-white font-rajdhani font-semibold mt-1 flex items-center gap-2">

                            {event.mode ===
                            'Online' ? (
                              <Wifi className="w-4 h-4 text-green-400" />
                            ) : (
                              <WifiOff className="w-4 h-4 text-blue-400" />
                            )}

                            {event.mode}

                          </p>

                        </div>

                      </div>

                      {/* Actions */}

                      <div className="flex gap-2 mt-5">

                        {/* Enable / Disable */}

                        <button
                          onClick={() =>
                            toggleEvent(
                              event
                            )
                          }
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-red-500/40 transition text-sm font-rajdhani"
                        >

                          <Power className="w-4 h-4" />

                          {isActive
                            ? 'Disable'
                            : 'Enable'}

                        </button>

                        {/* Edit */}

                        <button
                          onClick={() =>
                            openEditForm(
                              event
                            )
                          }
                          className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-red-500/40 transition"
                        >

                          <Pencil className="w-4 h-4" />

                        </button>

                        {/* Delete */}

                        <button
                          onClick={() =>
                            deleteEvent(
                              event
                            )
                          }
                          className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-red-400 hover:border-red-500/40 transition"
                        >

                          <Trash2 className="w-4 h-4" />

                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        {/* ===================================================
            ADD / EDIT MODAL
        =================================================== */}

        {showForm && (

          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">

            <div
              className="w-full max-w-2xl rounded-2xl border border-red-900/40 p-6 my-8"
              style={{
                background: '#111',
              }}
            >

              {/* Modal Header */}

              <div className="flex items-center justify-between mb-6">

                <div>

                  <p className="text-red-500 text-[10px] font-mono-tech tracking-[0.25em]">

                    //
                    {editingEvent
                      ? ' EDIT EVENT'
                      : ' CREATE EVENT'}

                  </p>

                  <h2 className="text-xl text-white font-orbitron font-bold mt-1">

                    {editingEvent
                      ? 'Edit '
                      : 'Add '}

                    <span className="text-red-500">
                      Event
                    </span>

                  </h2>

                </div>

                <button
                  onClick={closeForm}
                  className="w-9 h-9 rounded-lg border border-gray-800 text-gray-500 hover:text-white hover:border-red-500/40 flex items-center justify-center"
                >

                  <X className="w-4 h-4" />

                </button>

              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* Event Name */}

                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Event Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
                />

                {/* Category + Mode */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
                  >

                    <option value="Technical">
                      Technical
                    </option>

                    <option value="Non-Technical">
                      Non-Technical
                    </option>

                  </select>

                  <select
                    name="mode"
                    value={form.mode}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
                  >

                    <option value="Offline">
                      Offline
                    </option>

                    <option value="Online">
                      Online
                    </option>

                  </select>

                </div>

                {/* Fee + Team Size */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <input
                    required
                    name="fee"
                    type="number"
                    min="0"
                    placeholder="Registration Fee"
                    value={form.fee}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
                  />

                  <input
                    required
                    name="teamSize"
                    type="number"
                    min="1"
                    placeholder="Team Size"
                    value={form.teamSize}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
                  />

                </div>

                {/* Date + Venue */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <input
                    required
                    name="date"
                    type="text"
                    placeholder="Event Date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
                  />

                  <input
                    required
                    name="venue"
                    type="text"
                    placeholder="Venue"
                    value={form.venue}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
                  />

                </div>

                {/* Description */}

                <textarea
                  required
                  name="description"
                  rows="3"
                  placeholder="Event Description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500 resize-none"
                />

                {/* Rules */}

                <textarea
                  name="rules"
                  rows="3"
                  placeholder="Rules (one rule per line)"
                  value={form.rules}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500 resize-none"
                />

                {/* Max Participants */}

                <input
                  name="maxParticipants"
                  type="number"
                  min="1"
                  placeholder="Maximum Participants (optional)"
                  value={form.maxParticipants}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
                />

                {/* Checkboxes */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-800 bg-black/40 cursor-pointer">

                    <input
                      name="isTeamEvent"
                      type="checkbox"
                      checked={
                        form.isTeamEvent
                      }
                      onChange={
                        handleChange
                      }
                      className="accent-red-600"
                    />

                    <span className="text-gray-300 text-sm font-rajdhani">
                      Team Event
                    </span>

                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-800 bg-black/40 cursor-pointer">

                    <input
                      name="requiresUpload"
                      type="checkbox"
                      checked={
                        form.requiresUpload
                      }
                      onChange={
                        handleChange
                      }
                      className="accent-red-600"
                    />

                    <span className="text-gray-300 text-sm font-rajdhani">
                      Requires File Upload
                    </span>

                  </label>

                </div>

                {/* Status */}

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
                >

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                </select>

                {/* Buttons */}

                <div className="flex gap-3 pt-2">

                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="flex-1 border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white py-3 rounded-lg font-rajdhani font-bold disabled:opacity-50"
                  >
                    CANCEL
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-lg font-rajdhani font-bold flex items-center justify-center gap-2"
                  >

                    {saving && (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    )}

                    {editingEvent
                      ? 'UPDATE EVENT'
                      : 'CREATE EVENT'}

                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>

    </Layout>
  );
};

// =========================================================
// EMPTY ICON
// =========================================================

const CalendarEmptyIcon = () => (
  <svg
    className="w-5 h-5 text-gray-700"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="17"
      rx="2"
    />

    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);

export default AdminEventsPage;