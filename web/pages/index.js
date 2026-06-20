import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiSearch, FiSliders, FiArrowRight } from 'react-icons/fi';
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
        <title>Creatoria | Premium Digital Marketplace</title>
        <meta name="description" content="Explore state-of-the-art developer themes, digital designs, and creator templates in dark mode." />
      </Head>

      <div className="flex-grow flex flex-col">
        {/* Premium Hero Banner */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          {/* Radial glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-primary/10 to-secondary/15 rounded-full blur-[80px] -z-10" />

          <div className="max-w-4xl mx-auto text-center px-4 space-y-6">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Discover Premium <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Digital Assets & Templates
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Unlock a curation of elite development modules, design templates, and subscription libraries. Guarded storage, lifetime accesses.
            </p>

            {/* Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-4">
              <div className="relative glassmorphism rounded-2xl p-1 flex items-center shadow-2xl border-slate-800">
                <FiSearch className="w-5 h-5 text-slate-500 ml-4" />
                <input
                  type="text"
                  placeholder="Search products (e.g. Next.js template, iOS kit)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-slate-500 text-sm px-4 py-3 outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-indigo-600 font-semibold text-white shadow-lg shadow-primary/20 transition-all text-sm flex items-center space-x-1"
                >
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Filter Bar & Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 flex-grow flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-900">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = (cat === 'All' && !activeCategory) || (cat === activeCategory);
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
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
            <div className="text-xs text-slate-500 font-medium">
              Showing {initialProducts.length} of {pagination.total} results
            </div>
          </div>

          {/* Products Grid */}
          {initialProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glassmorphism rounded-2xl border-slate-800">
              <p className="text-slate-400 font-medium text-lg">No products found</p>
              <p className="text-slate-500 text-sm mt-1">Try modifying your query or category filter</p>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex justify-center space-x-2 pt-10">
              {Array.from({ length: pagination.pages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = pageNum === pagination.page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateQuery({ page: pageNum })}
                    className={`w-10 h-10 rounded-xl font-bold transition-all text-sm ${
                      isCurrent
                        ? 'bg-primary text-white shadow-md shadow-primary/10'
                        : 'bg-darkCard hover:bg-slate-800 border border-slate-800 text-slate-300'
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
    
    // Provide offline/dev sandbox mock products in case backend isn't booted up yet
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
