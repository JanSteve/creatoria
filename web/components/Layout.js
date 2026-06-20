import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-darkBg text-slate-100 bg-grid-pattern selection:bg-primary selection:text-white">
      {/* Background radial gradients for premium mesh look */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <Navbar />
      <main className="flex-grow pt-16 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
