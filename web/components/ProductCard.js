import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight, FiActivity } from 'react-icons/fi';

export default function ProductCard({ product }) {
  // Use fallback thumbnail or unsplash design templates
  const thumbnailSrc = product.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60';
  const displayPrice = product.price === 0 ? 'Free' : `$${product.price}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="group relative bg-darkSurface/40 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all flex flex-col h-full shadow-md hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={thumbnailSrc}
          alt={product.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category tag */}
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-primary bg-primary/10 backdrop-blur-md rounded-full border border-primary/20">
          {product.category}
        </span>
        {/* Product billing type badge */}
        <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-slate-300 bg-black/40 backdrop-blur-md rounded-full">
          {product.type === 'subscription' ? 'Monthly' : 'Lifetime'}
        </span>
      </div>

      {/* Info Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-xs text-slate-400 font-medium mb-1">
            By {product.vendorId?.storeName || 'Verified Creator'}
          </p>
          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer info & action */}
        <div className="mt-6 pt-4 border-t border-slate-950/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Price</p>
            <p className="text-xl font-black text-white bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              {displayPrice}
            </p>
          </div>

          <Link href={`/product/${product._id}`} className="flex items-center space-x-1 py-2 px-4 rounded-xl bg-primary hover:bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all">
            <span>Details</span>
            <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
