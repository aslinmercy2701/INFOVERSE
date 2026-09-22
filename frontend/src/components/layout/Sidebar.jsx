import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Calendar, ClipboardList, FileText,
  Phone, LogOut, Settings, Users, CreditCard, Menu, X,
  ChevronRight, Zap, Shield
} from 'lucide-react';

const userNav = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Events', path: '/events', icon: Calendar },
  { label: 'Registration', path: '/registration', icon: ClipboardList },
  { label: 'My Registrations', path: '/my-registration', icon: FileText },
  { label: 'Contact', path: '/contact', icon: Phone },
];

const adminNav = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Registrations', path: '/admin/registrations', icon: ClipboardList },
  { label: 'Events', path: '/admin/events', icon: Calendar },
  { label: 'Payments', path: '/admin/payments', icon: CreditCard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const Sidebar = ({ isAdmin = false }) => {
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = isAdmin ? adminNav : userNav;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-red-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center shadow-neon">
            {isAdmin ? (
              <Shield className="w-5 h-5 text-red-400" />
            ) : (
              <Zap className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div>
            <h1 className="font-orbitron text-base font-bold text-white tracking-wider leading-none">
              INFOVERSE
            </h1>
            <p className="text-xs text-red-400 font-mono-tech tracking-widest mt-0.5">
              {isAdmin ? 'ADMIN PANEL' : '2026'}
            </p>
          </div>
        </div>
        {user && (
          <div className="mt-4 p-3 rounded-lg bg-red-900/10 border border-red-900/20">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="text-sm text-white font-semibold truncate">{user.name || user.email}</p>
            {isAdmin && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-red-600/30 text-red-400 border border-red-500/30">
                ADMIN
              </span>
            )}
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-rajdhani font-semibold tracking-wide transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? 'bg-red-600/20 text-red-400 border border-red-500/40 shadow-neon-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-red-900/30'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500 rounded-full" />
                )}
                <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-red-400' : 'text-gray-500 group-hover:text-red-400'}`} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-red-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-red-900/30">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-rajdhani font-semibold text-gray-400 hover:text-red-400 hover:bg-red-600/10 border border-transparent hover:border-red-900/30 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-black/80 border border-red-900/40 text-white backdrop-blur-sm"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50 transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} bg-black border-r border-red-900/30`}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-900/20 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-red-900/30 z-30">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
