import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiUser, FiBriefcase, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  const [showLeadPopup, setShowLeadPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [projectInterest, setProjectInterest] = useState('Development');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if the user has already submitted or dismissed the popup
    const popupDismissed = localStorage.getItem('creatoria_lead_dismissed');
    
    if (!popupDismissed) {
      const timer = setTimeout(() => {
        setShowLeadPopup(true);
      }, 10000); // 10 seconds delay

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowLeadPopup(false);
    localStorage.setItem('creatoria_lead_dismissed', 'true');
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name) {
      return toast.error('Please enter name and email.');
    }

    setSubmitting(true);
    // Simulate API lead ingestion
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success('Thank you! You are now subscribed to elite creator updates.');
    setSubmitting(false);
    setShowLeadPopup(false);
    localStorage.setItem('creatoria_lead_dismissed', 'true');
  };

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

      {/* 10-Second Lead Generation Pop-up (Worth of a 500k site) */}
      <AnimatePresence>
        {showLeadPopup && (
          <div className="fixed bottom-6 right-6 z-50 p-1 w-full max-w-sm sm:max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl"
            >
              {/* Mesh Gradient Inside Popup */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition-all"
              >
                <FiX className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Exclusive Access</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">Join the Elite Club</h3>
                  <p className="text-xs text-slate-400">
                    Get updates on high-end boilerplates, Figma templates, and early-bird vendor discount codes.
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-3 pt-2">
                  <div className="relative flex items-center">
                    <FiUser className="absolute left-3 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-darkCard/80 border border-slate-800 focus:border-primary rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-all"
                    />
                  </div>

                  <div className="relative flex items-center">
                    <FiMail className="absolute left-3 text-slate-500 w-4 h-4" />
                    <input
                      type="email"
                      required
                      placeholder="email@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-darkCard/80 border border-slate-800 focus:border-primary rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-all"
                    />
                  </div>

                  <div className="relative flex items-center">
                    <FiBriefcase className="absolute left-3 text-slate-500 w-4 h-4" />
                    <select
                      value={projectInterest}
                      onChange={(e) => setProjectInterest(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-darkCard/80 border border-slate-800 focus:border-primary rounded-xl text-xs text-white outline-none"
                    >
                      <option value="Development">Building Products</option>
                      <option value="Design">UI/UX Design Projects</option>
                      <option value="Marketing">Marketing Assets</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-2 py-3 bg-primary hover:bg-indigo-600 text-xs font-bold text-white rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center space-x-1.5 glow-effect"
                  >
                    <span>{submitting ? 'Submitting...' : 'Join Club'}</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
