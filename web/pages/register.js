import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { register } from '../lib/api';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Please enter all fields');
    }

    if (password.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }

    setLoading(true);
    try {
      const response = await register({ name, email, password });
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please check the inputs.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Account | Creatoria</title>
      </Head>

      <div className="flex-grow flex items-center justify-center py-20 px-4">
        {/* Glow backdrop overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] -z-10" />

        <div className="w-full max-w-md glassmorphism p-8 rounded-3xl border-slate-800/80 shadow-2xl relative">
          <div className="text-center space-y-2 mb-8">
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Start Journey</span>
            <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
            <p className="text-sm text-slate400">Join the elite hub of digital creators</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Full Name</label>
              <div className="relative flex items-center">
                <FiUser className="absolute left-4 text-slate-500 w-4 h-4" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-darkCard border border-slate-800 rounded-xl focus:border-primary text-sm text-white placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <div className="relative flex items-center">
                <FiMail className="absolute left-4 text-slate-500 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-darkCard border border-slate-800 rounded-xl focus:border-primary text-sm text-white placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Password</label>
              <div className="relative flex items-center">
                <FiLock className="absolute left-4 text-slate-500 w-4 h-4" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-darkCard border border-slate-800 rounded-xl focus:border-primary text-sm text-white placeholder-slate-600 outline-none transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-500">Minimum 8 characters with letters & numbers</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-primary hover:bg-indigo-600 text-sm font-bold text-white rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed glow-effect"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-t-white border-primary/20 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login direct redirect link */}
          <div className="mt-8 text-center text-sm text-slate-400 border-t border-slate-900/60 pt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
