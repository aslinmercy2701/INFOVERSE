import React from 'react';

const ParticlesBackground = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() > 0.7 ? 3 : 2,
    delay: `${Math.random() * 6}s`,
    duration: `${4 + Math.random() * 6}s`,
    opacity: 0.2 + Math.random() * 0.5,
    isRed: Math.random() > 0.6,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.isRed ? '#ff0022' : '#ffffff',
            opacity: p.opacity,
            boxShadow: p.isRed
              ? '0 0 6px rgba(255,0,34,0.8)'
              : '0 0 4px rgba(255,255,255,0.6)',
            animation: `float ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticlesBackground;
