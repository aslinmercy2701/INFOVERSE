import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages - Public
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';

// Pages - Protected User
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import RegistrationPage from './pages/RegistrationPage';
import MyRegistrationPage from './pages/MyRegistrationPage';
import ContactPage from './pages/ContactPage';

// Pages - Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminRegistrationsPage from './pages/admin/AdminRegistrationsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Common
import ErrorPage from './components/common/ErrorPage';
import GlobalBackground from './components/common/GlobalBackground';
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/admin/login" element={<AdminLoginPage />} />

    {/* Protected User */}
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
    <Route path="/registration" element={<ProtectedRoute><RegistrationPage /></ProtectedRoute>} />
    <Route path="/my-registration" element={<ProtectedRoute><MyRegistrationPage /></ProtectedRoute>} />
    <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />

    {/* Admin */}
    <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
    <Route path="/admin/registrations" element={<AdminRoute><AdminRegistrationsPage /></AdminRoute>} />
    <Route path="/admin/events" element={<AdminRoute><AdminEventsPage /></AdminRoute>} />
    <Route path="/admin/payments" element={<AdminRoute><AdminPaymentsPage /></AdminRoute>} />
    <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
    <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />

    {/* 404 */}
    <Route path="*" element={<ErrorPage />} />
  </Routes>
);
const App = () => (
  <BrowserRouter>
    <AuthProvider>

      <GlobalBackground />

      <div className="relative z-10">
        <AppRoutes />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111111',
            color: '#ffffff',
            border: '1px solid rgba(255,0,34,0.3)',
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#ff0022',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff0022',
              secondary: '#fff',
            },
          },
        }}
      />

    </AuthProvider>
  </BrowserRouter>
);
export default App;
