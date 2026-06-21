import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload, FiStar } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const thumbnailSrc = product.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60';
  const displayPrice = product.price === 0 ? 'Free' : `$${product.price}`;

  // Fake random rating and downloads for visual polish
  const rating = (4.5 + Math.random() * 0.5).toFixed(1);
  const fakeDownloads = Math.floor(100 + Math.random() * 900);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700/85 transition-all flex flex-col h-full shadow-lg hover:shadow-2xl hover:shadow-primary/5"
    >
      {/* Outer glow hover outline */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-secondary/0 to-accent/0 group-hover:from-primary/10 group-hover:via-secondary/10 group-hover:to-accent/10 opacity-30 transition-all pointer-events-none -z-10" />

      {/* Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={thumbnailSrc}
          alt={product.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category tag */}
        <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-bold text-primary bg-primary/10 backdrop-blur-md rounded-full border border-primary/20 tracking-wider uppercase">
          {product.category}
        </span>
        {/* Product billing type badge */}
        <span className="absolute top-3 right-3 px-3 py-1 text-[10px] font-bold text-slate-300 bg-black/50 backdrop-blur-md rounded-full tracking-wider uppercase">
          {product.type === 'subscription' ? 'Monthly' : 'Lifetime'}
        </span>
      </div>

      {/* Info Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow space-y-2">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            By {product.vendorId?.storeName || 'Verified Creator'}
          </p>
          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed font-medium">
            {product.description}
          </p>
        </div>

        {/* Dynamic Ratings and Downloads Stats */}
        <div className="flex items-center space-x-4 mt-4 text-xs text-slate-500 font-bold">
          <div className="flex items-center space-x-1">
            <FiStar className="text-amber-500 fill-amber-500" />
            <span className="text-slate-300">{rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiDownload className="text-slate-400" />
            <span className="text-slate-300">{fakeDownloads} DLs</span>
          </div>
        </div>

        {/* Footer info & action */}
        <div className="mt-6 pt-5 border-t border-slate-950/80 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">Price</p>
            <p className="text-2xl font-black text-white">
              {displayPrice}
            </p>
          </div>

          <Link href={`/product/${product._id}`} className="flex items-center space-x-1.5 py-2.5 px-5 rounded-xl bg-primary hover:bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all glow-effect">
            <span>Details</span>
            <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
