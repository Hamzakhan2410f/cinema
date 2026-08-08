import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.js';
import { Footer } from './Footer.js';
import { TrailerModal } from '../common/TrailerModal.js';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#E50914] selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <TrailerModal />
    </div>
  );
};
