import React, { useState } from 'react';
import {
  Search,
  Users,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';

const AdminUsersPage = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);

  const filteredUsers = users.filter((user) => {
    const text = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(text) ||
      user.email?.toLowerCase().includes(text) ||
      user.phone?.toLowerCase().includes(text) ||
      user.college?.toLowerCase().includes(text)
    );
  });

  const toggleUserStatus = (id) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? { ...user, active: !user.active }
          : user
      )
    );
  };

  return (
    <Layout isAdmin>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-red-500 text-xs font-mono-tech tracking-[0.3em] mb-2">
            // USER MANAGEMENT
          </p>

          <h1 className="text-3xl lg:text-4xl font-bold text-white font-orbitron">
            Registered <span className="text-red-500">Users</span>
          </h1>

          <p className="text-gray-400 mt-2 font-rajdhani">
            Manage INFOVERSE participant accounts.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          <StatCard
            title="Total Users"
            value={users.length}
            icon={Users}
          />

          <StatCard
            title="Active Users"
            value={users.filter((user) => user.active).length}
            icon={UserCheck}
          />

          <StatCard
            title="Inactive Users"
            value={users.filter((user) => !user.active).length}
            icon={UserX}
          />

        </div>

        {/* Search */}
        <div
          className="rounded-xl border border-red-900/30 p-4 mb-6"
          style={{ background: 'rgba(17,17,17,0.85)' }}
        >
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone or college..."
              className="w-full bg-black/50 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white text-sm font-rajdhani outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div
          className="rounded-xl border border-red-900/30 overflow-hidden"
          style={{ background: 'rgba(17,17,17,0.85)' }}
        >
          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>
                <tr className="border-b border-gray-800">

                  <th className="text-left px-5 py-4 text-gray-500 text-xs font-mono-tech">
                    USER
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-xs font-mono-tech">
                    COLLEGE
                  </th>

                  <th className="text-left px-5 py-4 text-gray-500 text-xs font-mono-tech">
                    CONTACT
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

                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">

                      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-red-500" />
                      </div>

                      <p className="text-white font-orbitron text-sm">
                        No users found
                      </p>

                      <p className="text-gray-500 text-sm font-rajdhani mt-1">
                        Registered users will appear here.
                      </p>

                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-900 hover:bg-red-500/[0.03]"
                    >

                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <span className="text-red-400 font-orbitron font-bold">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>

                          <div>
                            <p className="text-white font-rajdhani font-semibold">
                              {user.name}
                            </p>

                            <p className="text-gray-500 text-xs">
                              {user.year || 'Student'}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* College */}
                      <td className="px-5 py-4">
                        <p className="text-gray-300 font-rajdhani">
                          {user.college}
                        </p>

                        <p className="text-gray-600 text-xs">
                          {user.department}
                        </p>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Mail className="w-3.5 h-3.5" />
                          {user.email}
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                          <Phone className="w-3.5 h-3.5" />
                          {user.phone}
                        </div>

                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-rajdhani ${
                            user.active
                              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                              : 'bg-gray-500/10 border border-gray-500/20 text-gray-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.active
                                ? 'bg-green-400'
                                : 'bg-gray-500'
                            }`}
                          />
                          {user.active ? 'Active' : 'Inactive'}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-red-500/50 transition"
                            title="View user"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`p-2 rounded-lg border transition ${
                              user.active
                                ? 'border-red-900/40 text-red-400 hover:bg-red-500/10'
                                : 'border-green-900/40 text-green-400 hover:bg-green-500/10'
                            }`}
                            title={
                              user.active
                                ? 'Deactivate user'
                                : 'Activate user'
                            }
                          >
                            {user.active ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 rounded-xl border border-yellow-900/30 bg-yellow-500/5">
          <p className="text-yellow-400 text-sm font-rajdhani">
            <strong>Note:</strong> User data will be loaded from the backend
            database after API integration.
          </p>
        </div>

      </div>
    </Layout>
  );
};

const StatCard = ({ title, value, icon: Icon }) => {
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

export default AdminUsersPage;