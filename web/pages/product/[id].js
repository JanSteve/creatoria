import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiShoppingBag, FiActivity, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getProduct, createCheckoutSession } from '../../lib/api';

export default function ProductDetail({ product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  if (router.isFallback) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-primary border-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  const handlePurchase = async () => {
    // Check if user is authenticated
    const token = localStorage.getItem('creatoria_token');
    if (!token) {
      toast.error('Please sign in to proceed with checkout');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await createCheckoutSession(product._id);
      if (response.success && response.data.url) {
        toast.loading('Redirecting to Stripe checkout...');
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to create payment session. Try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Error processing purchase request.');
    } finally {
      setLoading(false);
    }
  };

  const calculatedYearlyPrice = Math.round(product.price * 10 * 0.85); // 15% discount for yearly billing

  return (
    <>
      <Head>
        <title>{product.title} | Creatoria</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors mb-8">
          <FiArrowLeft />
          <span>Back to Marketplace</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Media & Specs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-2xl">
              <img
                src={product.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {product.title}
              </h1>
              
              <div className="flex flex-wrap gap-3 items-center">
                <span className="px-3 py-1 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full">
                  {product.category}
                </span>
                <span className="px-3 py-1 text-xs font-semibold text-slate-400 bg-slate-900 rounded-full">
                  {product.type === 'subscription' ? 'Monthly Access Plan' : 'Lifetime License'}
                </span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none pt-6 border-t border-slate-900">
              <h2 className="text-xl font-bold text-white mb-3">Product Overview</h2>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>
            </div>
          </div>

          {/* Right Column: Pricing & Purchase Card */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="glassmorphism p-6 sm:p-8 rounded-3xl border-slate-800/80 shadow-2xl space-y-6">
              {product.type === 'subscription' ? (
                // Subscription Toggle Widget
                <div className="space-y-4">
                  <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-900">
                    <button
                      onClick={() => setBillingPeriod('monthly')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        billingPeriod === 'monthly' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingPeriod('yearly')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        billingPeriod === 'yearly' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Yearly (Save 15%)
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Subscription Billing</p>
                    <p className="text-4xl font-black text-white mt-1">
                      ${billingPeriod === 'monthly' ? product.price : calculatedYearlyPrice}
                      <span className="text-sm font-medium text-slate-400">
                        /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                // One-Time Billing View
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase font-semibold">One-Time Payment</p>
                  <p className="text-4xl font-black text-white mt-1">${product.price}</p>
                  <p className="text-xs text-slate-400 mt-2">Lifetime access, free future updates</p>
                </div>
              )}

              {/* Purchase Button Action */}
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full py-4 bg-primary hover:bg-indigo-600 font-bold text-white rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed glow-effect"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-t-white border-primary/20 rounded-full animate-spin" />
                ) : (
                  <>
                    <FiShoppingBag className="w-5 h-5" />
                    <span>{product.type === 'subscription' ? 'Subscribe Now' : 'Purchase Access'}</span>
                  </>
                )}
              </button>

              {/* Secure Transaction Assurances */}
              <div className="space-y-3 pt-6 border-t border-slate-900 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <FiActivity className="text-emerald-400 w-4 h-4 flex-shrink-0" />
                  <span>Secure transactions by Stripe Connect</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiActivity className="text-primary w-4 h-4 flex-shrink-0" />
                  <span>Immediate access code delivery via S3 downloads</span>
                </div>
              </div>

              {/* Vendor Information */}
              <div className="pt-6 border-t border-slate-900">
                <p className="text-xs text-slate-500 uppercase font-semibold">Created By</p>
                <div className="mt-2 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-primary">
                    {product.vendorId?.storeName[0]?.toUpperCase() || 'V'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{product.vendorId?.storeName || 'Verified Vendor'}</h4>
                    <p className="text-xs text-slate-500">Approved Platform Creator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const productData = await getProduct(id);
    return {
      props: {
        product: productData.data.product,
      },
    };
  } catch (error) {
    console.error('getServerSideProps Detail error:', error.message);
    
    // Provide fallback mock product detail if offline/local dev
    const fallbackProduct = {
      _id: id,
      title: 'Premium Next.js Boilerplate Template',
      description: 'Complete boilerplate layout in Tailwind CSS with dark mode config, custom login cards, and stripe payment links integrated. Experience zero setup configuration, fully optimized Web Vitals, pre-coded API endpoints, and clean MongoDB models schemas matching JWT auth specs.',
      price: 49,
      type: 'one-time',
      category: 'Development',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
      vendorId: { storeName: 'NextDev Systems' }
    };

    return {
      props: {
        product: fallbackProduct,
      },
    };
  }
}
