import React from 'react';
import Link from 'next/link';
import { FiGithub, FiTwitter, FiGlobe, FiDatabase } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-darkBg border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4 md:col-span-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Creatoria
            </span>
            <p className="text-sm text-slate400 max-w-sm">
              Discover and purchase state-of-the-art developer themes, digital designs, and creator templates. Secure transactions powered by Stripe, stored assets guarded by S3.
            </p>
          </div>

          {/* Shortcuts */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Marketplace</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate400 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/?category=Design" className="text-sm text-slate400 hover:text-white transition-colors">
                  Design Templates
                </Link>
              </li>
              <li>
                <Link href="/?category=Development" className="text-sm text-slate400 hover:text-white transition-colors">
                  Development Kits
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Follow Us</h3>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-slate400 hover:text-white transition-colors" aria-label="GitHub">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate400 hover:text-white transition-colors" aria-label="Twitter">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate400 hover:text-white transition-colors" aria-label="Website">
                <FiGlobe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Creatoria Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
