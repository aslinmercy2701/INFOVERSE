import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Users, Wifi, WifiOff, Eye, ClipboardList } from 'lucide-react';

const EventCard = ({ event, onViewDetails, onRegister }) => {
  const isTech = event.category === 'technical';

  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 1 }}
      transition={{ duration: 0.2 }}
      className="glass rounded-xl p-5 border border-red-900/20 card-3d flex flex-col h-full"
      style={{ background: 'rgba(17,17,17,0.8)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-xs font-mono-tech tracking-wider ${
            isTech
              ? 'bg-red-600/20 text-red-400 border border-red-500/30'
              : 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
          }`}>
            {isTech ? 'TECHNICAL' : 'NON-TECH'}
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
        {event.isTeamEvent && (
          <span className="flex items-center gap-1 text-xs text-gray-500 font-mono-tech">
            <Users className="w-3 h-3" />
            {event.teamSize?.min === event.teamSize?.max
              ? `${event.teamSize?.min}`
              : `${event.teamSize?.min}-${event.teamSize?.max}`}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-orbitron text-base font-bold text-white mb-2 leading-tight">
        {event.name}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm font-rajdhani leading-relaxed mb-4 flex-1 line-clamp-3">
        {event.description}
      </p>

      {/* Fee */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-red-400" />
          <span className="text-red-400 font-orbitron font-bold text-lg">
            ₹{event.fee}
          </span>
          {event.isTeamEvent && (
            <span className="text-gray-500 text-xs font-rajdhani">/team</span>
          )}
        </div>
        {event.requiresUpload && (
          <span className="text-xs text-yellow-500 font-mono-tech">Upload Req.</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails?.(event)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-900/30 text-gray-400 text-xs font-rajdhani font-semibold hover:text-white hover:border-red-500/50 transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          Details
        </button>
        <button
          onClick={() => onRegister?.(event)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-rajdhani font-bold hover:bg-red-700 transition-all"
          style={{ boxShadow: '0 0 15px rgba(255,0,34,0.3)' }}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          Register Now
        </button>
      </div>
    </motion.div>
  );
};

export default EventCard;
