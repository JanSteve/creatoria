import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiShoppingBag, FiDollarSign, FiUser, FiActivity, FiBriefcase, FiKey } from 'react-icons/fi';

export default function DashboardLayout({ children, activeTab = 'user' }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('creatoria_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        
        // Security check: Redirect users trying to access unauthorized dashboard views
        if (activeTab === 'vendor' && parsed.role !== 'vendor' && parsed.role !== 'admin') {
          router.push('/dashboard/user?unauthorized=true');
        }
        if (activeTab === 'admin' && parsed.role !== 'admin') {
          router.push('/dashboard/user?unauthorized=true');
        }
      } catch (e) {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [activeTab, router]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col md:flex-row gap-8">
      {/* Sidebar Panel */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="glassmorphism p-5 rounded-2xl space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account</h2>
            <div className="mt-3 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                {user.name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              href="/dashboard/user"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'user'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <FiShoppingBag className="w-4 h-4" />
              <span>Purchases & Subs</span>
            </Link>

            {/* Vendor Portal link */}
            {(user.role === 'vendor' || user.role === 'admin') ? (
              <Link
                href="/dashboard/vendor"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'vendor'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <FiBriefcase className="w-4 h-4" />
                <span>Vendor Manager</span>
              </Link>
            ) : (
              <Link
                href="/dashboard/user?apply=true"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all"
              >
                <FiActivity className="w-4 h-4" />
                <span>Apply as Vendor</span>
              </Link>
            )}

            {/* Admin view links */}
            {user.role === 'admin' && (
              <Link
                href="/dashboard/admin"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'admin'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <FiKey className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>
        </div>
      </aside>

      {/* Main View Container */}
      <main className="flex-1 min-w-0">
        <div className="glassmorphism p-6 sm:p-8 rounded-2xl h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
