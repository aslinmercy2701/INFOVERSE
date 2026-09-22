import React from 'react';

const GlobalBackground = () => {
  return (
    <>
      {/* Main INFOVERSE Background */}
      <div
        className="fixed inset-0 -z-50 bg-black"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(0, 0, 0, 0.38),
              rgba(0, 0, 0, 0.38)
            ),
            url('/infoverse-bg.png')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Dark readability overlay */}
      <div
        className="fixed inset-0 -z-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </>
  );
};

export default GlobalBackground;