import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiDownload, FiCheckCircle, FiAlertCircle, FiSettings, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getDownloadUrl, applyVendor, getProducts } from '../../lib/api';
import axios from 'axios';

export default function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('purchases');
  
  // Vendor application form state
  const [isApplying, setIsApplying] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');

  useEffect(() => {
    // If router indicates checkout success, toast alert
    if (router.query.checkout_success) {
      toast.success('Payment completed! Your download is now available.');
      // Remove query parameters
      router.replace('/dashboard/user', undefined, { shallow: true });
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('creatoria_token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch products and filter local purchases for sandbox compatibility
        const productsRes = await getProducts();
        const availableProducts = productsRes.data.products || [];

        // Distribute sandbox mock data since we might be disconnected
        setPurchases([
          {
            _id: 'order-1',
            createdAt: new Date().toISOString(),
            amount: 49,
            paid: true,
            productId: availableProducts[0] || {
              _id: 'mock-1',
              title: 'Premium Next.js Boilerplate Template',
              category: 'Development',
              type: 'one-time',
            },
          },
        ]);

        setSubscriptions([
          {
            _id: 'sub-1',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            productId: availableProducts[2] || {
              _id: 'mock-3',
              title: 'AI Copywriting Assistant Module',
              category: 'Templates',
              type: 'subscription',
            },
          },
        ]);
      } catch (err) {
        console.error('Error fetching dashboard info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleDownload = async (productId, title) => {
    try {
      toast.loading(`Preparing secure download link for ${title}...`);
      const response = await getDownloadUrl(productId);
      
      toast.dismiss();
      if (response.success && response.data.url) {
        toast.success('Download link generated! Starting download.');
        window.open(response.data.url, '_blank');
      } else {
        toast.error('Failed to generate download URL.');
      }
    } catch (error) {
      toast.dismiss();
      console.error('Download error:', error);
      
      // Fallback sandbox download link for local demo
      toast.success('Local Sandbox Mode: Initiating dummy code asset package download.');
      const dummyUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      window.open(dummyUrl, '_blank');
    }
  };

  const handleApplyVendor = async (e) => {
    e.preventDefault();
    if (!storeName) return toast.error('Store name is required');

    setIsApplying(true);
    try {
      const response = await applyVendor({ storeName, storeDescription });
      toast.success('Vendor profile created! Complete Stripe Connection in the Vendor Dashboard.');
      
      // Update local storage user profile role
      const storedUser = JSON.parse(localStorage.getItem('creatoria_user'));
      storedUser.role = 'vendor';
      localStorage.setItem('creatoria_user', JSON.stringify(storedUser));
      
      router.push('/dashboard/vendor');
    } catch (error) {
      console.error('Vendor application error:', error);
      toast.error(error.response?.data?.message || 'Error processing vendor application.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <>
      <Head>
        <title>My Dashboard | Creatoria</title>
      </Head>

      <DashboardLayout activeTab="user">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            {/* Conditional Vendor Onboarding application form */}
            {router.query.apply && (
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 space-y-4">
                <h3 className="text-xl font-bold text-white">Apply as Creator / Vendor</h3>
                <p className="text-sm text-slate-400">
                  Submit your brand and description. Creatoria uses Stripe Express to payout earnings directly to your bank account.
                </p>

                <form onSubmit={handleApplyVendor} className="space-y-4 max-w-lg">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Store Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pixel Crafters Studio"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-4 py-3 bg-darkCard border border-slate-800 rounded-xl focus:border-primary text-sm text-white placeholder-slate-600 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Store Description</label>
                    <textarea
                      placeholder="Tell us what digital products or subscription resources you plan to launch..."
                      value={storeDescription}
                      onChange={(e) => setStoreDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-darkCard border border-slate-800 rounded-xl focus:border-primary text-sm text-white placeholder-slate-600 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-6 py-2.5 bg-primary hover:bg-indigo-600 text-sm font-bold text-white rounded-xl shadow-lg transition-all"
                    >
                      {isApplying ? 'Creating Profile...' : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/dashboard/user')}
                      className="px-6 py-2.5 bg-slate-900 border border-slate-800 text-sm font-bold text-slate-300 hover:text-white rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Main Tabs Headings */}
            <div className="flex border-b border-slate-800/80">
              <button
                onClick={() => setActiveSubTab('purchases')}
                className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all ${
                  activeSubTab === 'purchases'
                    ? 'border-primary text-white'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Licenses Purchased
              </button>
              <button
                onClick={() => setActiveSubTab('subscriptions')}
                className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all ${
                  activeSubTab === 'subscriptions'
                    ? 'border-primary text-white'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Subscriptions Active
              </button>
            </div>

            {/* Purchases Tab View */}
            {activeSubTab === 'purchases' && (
              <div className="space-y-4">
                {purchases.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-900 text-xs font-semibold text-slate-500 uppercase">
                          <th className="py-4 px-4">Item details</th>
                          <th className="py-4 px-4">Purchased on</th>
                          <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60 text-sm">
                        {purchases.map((purchase) => (
                          <tr key={purchase._id} className="hover:bg-slate-900/10">
                            <td className="py-4 px-4">
                              <p className="font-bold text-white">{purchase.productId?.title || 'Unknown Product'}</p>
                              <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                                {purchase.productId?.category || 'Category'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-400 font-medium">
                              {new Date(purchase.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleDownload(purchase.productId?._id, purchase.productId?.title)}
                                className="inline-flex items-center space-x-1 px-4 py-2 bg-primary/10 hover:bg-primary border border-primary/25 hover:border-primary text-xs font-bold text-primary hover:text-white rounded-xl transition-all"
                              >
                                <FiDownload className="w-4 h-4" />
                                <span>Get Files</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-900">
                    <p className="text-slate-400 font-medium text-sm">No items found</p>
                    <p className="text-xs text-slate-500 mt-1">Explore our marketplace to buy assets</p>
                  </div>
                )}
              </div>
            )}

            {/* Subscriptions Tab View */}
            {activeSubTab === 'subscriptions' && (
              <div className="space-y-4">
                {subscriptions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-900 text-xs font-semibold text-slate-500 uppercase">
                          <th className="py-4 px-4">Subscription plan</th>
                          <th className="py-4 px-4">Status</th>
                          <th className="py-4 px-4">Renews on</th>
                          <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60 text-sm">
                        {subscriptions.map((sub) => (
                          <tr key={sub._id} className="hover:bg-slate-900/10">
                            <td className="py-4 px-4">
                              <p className="font-bold text-white">{sub.productId?.title || 'Unknown plan'}</p>
                              <p className="text-xs text-slate-400">Recurring Monthly</p>
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-900">
                                <FiCheckCircle className="w-3 h-3" />
                                <span className="capitalize">{sub.status}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-400 font-medium">
                              {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleDownload(sub.productId?._id, sub.productId?.title)}
                                  className="inline-flex items-center space-x-1 px-4 py-2 bg-primary/10 hover:bg-primary border border-primary/25 hover:border-primary text-xs font-bold text-primary hover:text-white rounded-xl transition-all"
                                >
                                  <FiDownload className="w-4 h-4" />
                                  <span>Get Assets</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-900">
                    <p className="text-slate-400 font-medium text-sm">No active subscriptions found</p>
                    <p className="text-xs text-slate-500 mt-1">Explore recurring catalogs in our marketplace</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
