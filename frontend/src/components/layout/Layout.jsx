import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, isAdmin = false }) => {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(0, 0, 0, 0.42),
            rgba(0, 0, 0, 0.42)
          ),
          url('/infoverse-bg.png')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/20 pointer-events-none z-0" />

      {/* Sidebar */}
      <div className="relative z-20">
        <Sidebar isAdmin={isAdmin} />
      </div>

      {/* Content */}
      <div className="relative z-10 lg:ml-64 min-h-screen">
        <main className="p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;