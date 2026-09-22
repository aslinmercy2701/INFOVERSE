import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Tag, CheckCircle, ClipboardList, Wifi, WifiOff, MapPin, Calendar } from 'lucide-react';

const EventModal = ({ event, isOpen, onClose, onRegister }) => {
  if (!event) return null;

  const isTech = event.category === 'technical';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-red-900/40"
            style={{
              background: 'rgba(10,10,10,0.95)',
              boxShadow: '0 0 40px rgba(255,0,34,0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between p-6 border-b border-red-900/30"
              style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)' }}>
              <div>
                <div className="flex gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono-tech ${
                    isTech
                      ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                      : 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                  }`}>
                    {isTech ? 'TECHNICAL' : 'NON-TECHNICAL'}
                  </span>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono-tech ${
                    event.mode === 'online'
                      ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                      : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {event.mode === 'online' ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
                    {event.mode?.toUpperCase() || 'OFFLINE'}
                  </span>
                </div>
                <h2 className="font-orbitron text-xl font-bold text-white tracking-wide">{event.name}</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg bg-red-900/20 text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Fee', value: `₹${event.fee}${event.isTeamEvent ? '/team' : ''}`, icon: Tag, color: 'red' },
                  { label: 'Team Size', value: event.isTeamEvent ? `${event.teamSize?.min}-${event.teamSize?.max} members` : 'Individual', icon: Users, color: 'blue' },
                  { label: 'Venue', value: event.venue || 'DMI College', icon: MapPin, color: 'green' },
                  { label: 'Date', value: event.date || '09 Oct 2026', icon: Calendar, color: 'yellow' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="p-3 rounded-lg bg-white/3 border border-white/5 text-center">
                    <Icon className={`w-4 h-4 mx-auto mb-1 text-${color}-400`} />
                    <p className="text-xs text-gray-500 font-mono-tech mb-1">{label}</p>
                    <p className={`text-sm font-bold ${color === 'red' ? 'text-red-400 font-orbitron' : 'text-white'}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-orbitron text-sm font-bold text-red-400 mb-2 tracking-wider">ABOUT THIS EVENT</h3>
                <p className="text-gray-300 font-rajdhani leading-relaxed">{event.description}</p>
              </div>

              {/* Rules */}
              {event.rules?.length > 0 && (
                <div>
                  <h3 className="font-orbitron text-sm font-bold text-red-400 mb-3 tracking-wider">RULES & GUIDELINES</h3>
                  <ul className="space-y-2">
                    {event.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-gray-300 font-rajdhani">
                        <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Upload note */}
              {event.requiresUpload && (
                <div className="p-3 rounded-lg bg-yellow-900/10 border border-yellow-500/20">
                  <p className="text-yellow-400 text-sm font-rajdhani">
                    ⚠️ This event requires file upload (.ppt/.pptx/.pdf, max 10MB)
                  </p>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={() => { onRegister?.(event); onClose(); }}
                className="w-full py-3 rounded-xl bg-red-600 text-white font-orbitron font-bold tracking-wider hover:bg-red-700 transition-all"
                style={{ boxShadow: '0 0 20px rgba(255,0,34,0.4)' }}
              >
                <ClipboardList className="w-4 h-4 inline mr-2" />
                REGISTER NOW · ₹{event.fee}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventModal;
