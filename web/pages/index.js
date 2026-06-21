import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiSearch, FiArrowRight, FiShield, FiZap, FiBriefcase, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../lib/api';

export default function Home({ initialProducts, pagination, categoryParam, searchParam }) {
  const router = useRouter();
  const [search, setSearch] = useState(searchParam || '');
  const [activeCategory, setActiveCategory] = useState(categoryParam || '');

  const categories = ['All', 'Design', 'Development', 'Marketing', 'Templates'];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQuery({ search, page: 1 });
  };

  const handleCategoryClick = (category) => {
    const value = category === 'All' ? '' : category;
    setActiveCategory(value);
    updateQuery({ category: value, page: 1 });
  };

  const updateQuery = (newParams) => {
    const query = { ...router.query, ...newParams };
    
    // Clean up empty params
    Object.keys(query).forEach((key) => {
      if (query[key] === '' || query[key] === undefined) {
        delete query[key];
      }
    });

    router.push({
      pathname: '/',
      query,
    });
  };

  return (
    <>
      <Head>
        <title>Creatoria | Premium Multi-Vendor Digital Marketplace</title>
        <meta name="description" content="Explore state-of-the-art developer themes, digital designs, and creator templates in dark mode." />
      </Head>

      <div className="flex-grow flex flex-col">
        {/* Premium Hero Banner */}
        <section className="relative py-24 lg:py-36 overflow-hidden">
          {/* Radial glow background with custom pulsing animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full blur-[120px] -z-10 animate-hero-glow" />

          {/* Background Grid Pattern Accent */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none -z-20" />

          <div className="max-w-5xl mx-auto text-center px-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-primary"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Next-Gen Creator Economy</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[1.1]"
            >
              Unleash Elite <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Digital Engineering Assets
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium"
            >
              Curated digital libraries, premium boilerplates, templates, and subscription modules. Powered by secure S3 delivery & instant Stripe transfers.
            </motion.p>

            {/* Search Bar Form */}
            <motion.form
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto pt-6"
            >
              <div className="relative glassmorphism rounded-2xl p-1.5 flex items-center shadow-2xl border-slate-800 focus-within:border-slate-700 transition-all">
                <FiSearch className="w-5 h-5 text-slate-500 ml-4 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search elite UI kits, templates, configurations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-slate-500 text-sm sm:text-base px-4 py-3.5 outline-none"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-primary hover:bg-indigo-600 font-bold text-white shadow-lg shadow-primary/25 transition-all text-sm sm:text-base flex items-center space-x-1.5 glow-effect"
                >
                  <span>Search</span>
                </button>
              </div>
            </motion.form>
          </div>
        </section>

        {/* Dynamic Stats Bar with Scroll Reveal */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="border-y border-slate-900 bg-slate-950/20 backdrop-blur-sm py-10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">50k+</p>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase mt-1">Digital Assets</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">$2.4M</p>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase mt-1">Creator Earnings</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">99.9%</p>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase mt-1">Delivery Uptime</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">24/7</p>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase mt-1">Instant Support</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Value Proposition Grid with Scroll Reveals */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider">Engineered For Excellence</h2>
            <p className="text-3xl sm:text-4xl font-black text-white">Platform Infrastructure Features</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glassmorphism p-8 rounded-3xl border-slate-900 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <div className="p-4 bg-primary/10 rounded-2xl w-fit text-primary border border-primary/20 mb-6">
                <FiZap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Delivery Infrastructure</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Guarded assets are delivered instantly upon purchase via AWS S3 secured presigned URL routes. Fast downloads, zero wait.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glassmorphism p-8 rounded-3xl border-slate-900 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />
              <div className="p-4 bg-secondary/10 rounded-2xl w-fit text-secondary border border-secondary/20 mb-6">
                <FiShield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Payment Splits</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Stripe Connect routes payments directly to creator banks with configured revenue sharing metrics. Completely automated, clear audits.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glassmorphism p-8 rounded-3xl border-slate-900 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
              <div className="p-4 bg-accent/10 rounded-2xl w-fit text-accent border border-accent/20 mb-6">
                <FiBriefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Elite Creator Verification</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every single developer or designer application is manually vetted by admins before approvals. Quality control at its highest.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Catalog Section with Scroll Reveal */}
        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 flex-grow flex flex-col space-y-8 border-t border-slate-900/60 pt-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-900"
          >
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = (cat === 'All' && !activeCategory) || (cat === activeCategory);
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-5 py-2.5 text-xs font-bold rounded-full border transition-all ${
                      isSelected
                        ? 'bg-primary border-primary text-white shadow-md shadow-primary/10'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white bg-slate-900/40'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Metadata Info */}
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Showing {initialProducts.length} of {pagination.total} Results
            </div>
          </motion.div>

          {/* Products Grid */}
          {initialProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {initialProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glassmorphism rounded-3xl border-slate-800">
              <p className="text-slate-400 font-bold text-lg">No assets match your search parameters</p>
              <p className="text-slate-500 text-sm mt-2">Try clearing your filters or testing new keywords.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex justify-center space-x-2 pt-12">
              {Array.from({ length: pagination.pages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = pageNum === pagination.page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateQuery({ page: pageNum })}
                    className={`w-12 h-12 rounded-xl font-bold transition-all text-sm border ${
                      isCurrent
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-darkCard hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const page = query.page || 1;
  const category = query.category || '';
  const search = query.search || '';

  try {
    const productsData = await getProducts({ page, category, search });
    return {
      props: {
        initialProducts: productsData.data.products || [],
        pagination: productsData.data.pagination || { page: 1, limit: 12, total: 0, pages: 1 },
        categoryParam: category,
        searchParam: search,
      },
    };
  } catch (error) {
    console.error('getServerSideProps Home error:', error.message);
    
    const fallbackProducts = [
      {
        _id: 'mock-1',
        title: 'Premium Next.js Boilerplate Template',
        description: 'Complete boilerplate layout in Tailwind CSS with dark mode config, custom login cards, and stripe payment links integrated.',
        price: 49,
        type: 'one-time',
        category: 'Development',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        vendorId: { storeName: 'NextDev Systems' }
      },
      {
        _id: 'mock-2',
        title: 'Glassmorphism UI Icons Library',
        description: 'A set of over 200 high-quality vector components and glass widgets. Includes Figma workspaces and react files.',
        price: 29,
        type: 'one-time',
        category: 'Design',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        vendorId: { storeName: 'Studio Pixel' }
      },
      {
        _id: 'mock-3',
        title: 'AI Copywriting Assistant Module',
        description: 'Access premium backend logic APIs and automated prompts. Billed monthly for consistent updates.',
        price: 19,
        type: 'subscription',
        category: 'Templates',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        vendorId: { storeName: 'BrainAI Corp' }
      }
    ];

    return {
      props: {
        initialProducts: fallbackProducts,
        pagination: { page: 1, limit: 12, total: 3, pages: 1 },
        categoryParam: category,
        searchParam: search,
      },
    };
  }
}
