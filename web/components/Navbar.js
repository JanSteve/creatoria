import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMenu, FiX, FiUser, FiLogOut, FiLayout, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const checkUser = () => {
      const storedUser = localStorage.getItem('creatoria_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    checkUser();

    // Listen to login/logout state changes across pages
    router.events.on('routeChangeComplete', checkUser);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      router.events.off('routeChangeComplete', checkUser);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('creatoria_token');
    localStorage.removeItem('creatoria_user');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glassmorphism shadow-lg' : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-tight">
                Creatoria
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`text-sm font-medium transition-colors ${
              router.pathname === '/' ? 'text-primary' : 'text-slate-300 hover:text-white'
            }`}>
              Marketplace
            </Link>

            {user && (
              <>
                <Link href="/dashboard/user" className={`text-sm font-medium transition-colors ${
                  router.pathname.startsWith('/dashboard/user') ? 'text-primary' : 'text-slate-300 hover:text-white'
                }`}>
                  My Purchases
                </Link>
                {user.role === 'vendor' && (
                  <Link href="/dashboard/vendor" className={`text-sm font-medium transition-colors ${
                    router.pathname.startsWith('/dashboard/vendor') ? 'text-primary' : 'text-slate-300 hover:text-white'
                  }`}>
                    Vendor Portal
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link href="/dashboard/admin" className={`text-sm font-medium transition-colors ${
                    router.pathname.startsWith('/dashboard/admin') ? 'text-primary' : 'text-slate-300 hover:text-white'
                  }`}>
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-300">
                  Hi, <span className="text-white font-semibold">{user.name}</span>
                </span>
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 p-2 bg-darkCard hover:bg-slate-700 rounded-full transition-colors border border-slate-700">
                    <FiUser className="w-5 h-5 text-primary" />
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-darkCard border border-slate-800 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.email}</p>
                    </div>

                    <Link href="/dashboard/user" className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                      <FiShoppingBag className="w-4 h-4" />
                      <span>Purchases</span>
                    </Link>

                    <Link href={user.role === 'vendor' ? '/dashboard/vendor' : (user.role === 'admin' ? '/dashboard/admin' : '/dashboard/user')} className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                      <FiLayout className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors text-left"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-indigo-600 rounded-lg transition-all shadow-md shadow-primary/20 glow-effect">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-darkCard rounded-lg focus:outline-none transition-colors"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden glassmorphism border-t border-slate-800/50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === '/' ? 'bg-primary/20 text-primary' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Marketplace
            </Link>

            {user && (
              <>
                <Link
                  href="/dashboard/user"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    router.pathname.startsWith('/dashboard/user') ? 'bg-primary/20 text-primary' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  My Purchases
                </Link>
                {user.role === 'vendor' && (
                  <Link
                    href="/dashboard/vendor"
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      router.pathname.startsWith('/dashboard/vendor') ? 'bg-primary/20 text-primary' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Vendor Portal
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    href="/dashboard/admin"
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      router.pathname.startsWith('/dashboard/admin') ? 'bg-primary/20 text-primary' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="pt-4 pb-3 border-t border-slate-800/80 px-4">
            {user ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-900/30 border border-red-800 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-indigo-600 rounded-lg transition-all shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
