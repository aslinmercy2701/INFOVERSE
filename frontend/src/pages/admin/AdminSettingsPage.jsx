import React, { useState } from 'react';
import {
  Save,
  Settings,
  CreditCard,
  Link,
  Shield,
  CalendarDays,
  CheckCircle,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    symposiumName: 'INFOVERSE',
    collegeName: 'DMI Engineering College',
    department: 'Information Technology',
    eventDate: '09/10/2026',
    eventTime: '09:30 AM onwards',
    upiId: '',
    paymentName: '',
    referralDiscount: 10,
    individualFee: 200,
    paperFee: 600,
    registrationOpen: true,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Demo only — backend/database integration later
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <Layout isAdmin>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-red-500 text-xs font-mono-tech tracking-[0.3em] mb-2">
            // SYSTEM CONFIGURATION
          </p>

          <h1 className="text-3xl lg:text-4xl font-bold text-white font-orbitron">
            Admin <span className="text-red-500">Settings</span>
          </h1>

          <p className="text-gray-400 mt-2 font-rajdhani">
            Configure symposium, registration and payment settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Symposium Settings */}
          <section
            className="rounded-xl border border-red-900/30 p-6"
            style={{ background: 'rgba(17,17,17,0.85)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-red-500" />
              </div>

              <div>
                <h2 className="text-lg text-white font-orbitron font-bold">
                  Symposium Information
                </h2>

                <p className="text-gray-500 text-sm font-rajdhani">
                  Basic event information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <InputField
                label="Symposium Name"
                name="symposiumName"
                value={settings.symposiumName}
                onChange={handleChange}
              />

              <InputField
                label="College Name"
                name="collegeName"
                value={settings.collegeName}
                onChange={handleChange}
              />

              <InputField
                label="Department"
                name="department"
                value={settings.department}
                onChange={handleChange}
              />

              <InputField
                label="Event Date"
                name="eventDate"
                value={settings.eventDate}
                onChange={handleChange}
              />

              <InputField
                label="Event Time"
                name="eventTime"
                value={settings.eventTime}
                onChange={handleChange}
              />

            </div>
          </section>

          {/* Registration Settings */}
          <section
            className="rounded-xl border border-red-900/30 p-6"
            style={{ background: 'rgba(17,17,17,0.85)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-red-500" />
              </div>

              <div>
                <h2 className="text-lg text-white font-orbitron font-bold">
                  Registration Settings
                </h2>

                <p className="text-gray-500 text-sm font-rajdhani">
                  Configure registration fees and availability
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <InputField
                label="Individual Event Fee"
                name="individualFee"
                type="number"
                value={settings.individualFee}
                onChange={handleChange}
                prefix="₹"
              />

              <InputField
                label="Paper Preparation Fee"
                name="paperFee"
                type="number"
                value={settings.paperFee}
                onChange={handleChange}
                prefix="₹"
              />

              <InputField
                label="Referral Discount"
                name="referralDiscount"
                type="number"
                value={settings.referralDiscount}
                onChange={handleChange}
                prefix="₹"
              />

            </div>

            {/* Registration Toggle */}
            <div className="mt-6 flex items-center justify-between p-4 rounded-lg bg-black/30 border border-gray-800">

              <div>
                <p className="text-white font-rajdhani font-semibold">
                  Registration Status
                </p>

                <p className="text-gray-500 text-sm">
                  Allow participants to register for events
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="registrationOpen"
                  checked={settings.registrationOpen}
                  onChange={handleChange}
                  className="sr-only peer"
                />

                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-red-600 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:w-5 after:h-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
              </label>

            </div>
          </section>

          {/* Payment Settings */}
          <section
            className="rounded-xl border border-red-900/30 p-6"
            style={{ background: 'rgba(17,17,17,0.85)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-red-500" />
              </div>

              <div>
                <h2 className="text-lg text-white font-orbitron font-bold">
                  Payment Settings
                </h2>

                <p className="text-gray-500 text-sm font-rajdhani">
                  Configure UPI payment information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <InputField
                label="UPI ID"
                name="upiId"
                value={settings.upiId}
                onChange={handleChange}
                placeholder="example@upi"
              />

              <InputField
                label="Payment Name"
                name="paymentName"
                value={settings.paymentName}
                onChange={handleChange}
                placeholder="Account holder name"
              />

            </div>

            <div className="mt-5 p-4 rounded-lg border border-yellow-900/30 bg-yellow-500/5">
              <p className="text-yellow-400 text-sm font-rajdhani">
                Add your actual UPI ID before accepting registrations.
                Payment verification should be performed by the admin.
              </p>
            </div>
          </section>

          {/* Referral Settings */}
          <section
            className="rounded-xl border border-red-900/30 p-6"
            style={{ background: 'rgba(17,17,17,0.85)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Link className="w-5 h-5 text-red-500" />
              </div>

              <div>
                <h2 className="text-lg text-white font-orbitron font-bold">
                  Referral Settings
                </h2>

                <p className="text-gray-500 text-sm font-rajdhani">
                  Referral code configuration
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-black/30 border border-gray-800">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-white font-rajdhani font-semibold">
                    Referral Discount
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    Valid referral code gives ₹{settings.referralDiscount}{' '}
                    discount.
                  </p>
                </div>

                <span className="text-red-400 font-orbitron font-bold">
                  ₹{settings.referralDiscount}
                </span>

              </div>

              <div className="mt-4 text-xs text-gray-500 font-rajdhani">
                Individual: ₹200 → ₹190
                <br />
                Paper Preparation Team: ₹600 → ₹590
              </div>

            </div>
          </section>

          {/* Security */}
          <section
            className="rounded-xl border border-red-900/30 p-6"
            style={{ background: 'rgba(17,17,17,0.85)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-red-500" />

              <h2 className="text-lg text-white font-orbitron font-bold">
                Security
              </h2>
            </div>

            <p className="text-gray-500 text-sm font-rajdhani">
              Admin authentication, password management and API security
              should be handled through the backend.
            </p>
          </section>

          {/* Save */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3">

            {saved && (
              <div className="flex items-center gap-2 text-green-400 text-sm font-rajdhani">
                <CheckCircle className="w-4 h-4" />
                Settings saved successfully
              </div>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-rajdhani font-bold transition"
              style={{
                boxShadow: '0 0 20px rgba(255,0,34,0.2)',
              }}
            >
              <Save className="w-4 h-4" />
              SAVE SETTINGS
            </button>

          </div>

        </form>

      </div>
    </Layout>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  prefix = '',
}) => {
  return (
    <div>
      <label className="block text-gray-400 text-sm font-rajdhani mb-2">
        {label}
      </label>

      <div className="relative">

        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-black/50 border border-gray-800 rounded-lg py-3 text-white font-rajdhani outline-none focus:border-red-500 transition ${
            prefix ? 'pl-8 pr-4' : 'px-4'
          }`}
        />

      </div>
    </div>
  );
};

export default AdminSettingsPage;