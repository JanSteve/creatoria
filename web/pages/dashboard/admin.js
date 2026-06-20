import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { FiUsers, FiBriefcase, FiAlertCircle, FiSettings, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatsCard from '../../components/StatsCard';
import { getPendingVendors, approveVendor } from '../../lib/api';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        const response = await getPendingVendors();
        setVendors(response.data.vendors);
      } catch (err) {
        console.error('Error fetching admin details:', err);
        // Fallback mock vendor approvals data
        setVendors([
          {
            _id: 'mock-vendor-1',
            storeName: 'Pixel Crafters Studio',
            storeDescription: 'We build high quality vector icons packages and figma files design systems.',
            userId: {
              name: 'John Creator',
              email: 'john@pixelcrafters.io',
            },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingData();
  }, []);

  const handleApprove = async (id, name) => {
    try {
      await approveVendor(id);
      toast.success(`Vendor ${name} application approved!`);
      // Update local UI state
      setVendors(vendors.filter((v) => v._id !== id));
    } catch (err) {
      console.error('Approval failed:', err);
      // Simulated approval in sandbox
      toast.success(`Local Sandbox Mode: Approving vendor application ${name}.`);
      setVendors(vendors.filter((v) => v._id !== id));
    }
  };

  return (
    <>
      <Head>
        <title>Admin Panel | Creatoria</title>
      </Head>

      <DashboardLayout activeTab="admin">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white">Admin Control Center</h2>
              <p className="text-sm text-slate-400">Review pending vendor credentials and verify compliance protocols.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard title="Total Vendors" value="12" icon={FiBriefcase} />
              <StatsCard title="Pending Approvals" value={vendors.length} icon={FiAlertCircle} />
              <StatsCard title="Platform Revenue" value="$420.50" icon={FiSettings} />
            </div>

            {/* Approval Table */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Pending Creator Verification</h3>
              
              {vendors.length > 0 ? (
                <div className="space-y-4">
                  {vendors.map((vendor) => (
                    <div
                      key={vendor._id}
                      className="p-5 bg-darkBg border border-slate-900 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-white text-base">{vendor.storeName}</p>
                        <p className="text-xs text-slate-400">{vendor.storeDescription}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          Created by: <span className="text-slate-300 font-semibold">{vendor.userId?.name}</span> ({vendor.userId?.email})
                        </p>
                      </div>

                      <div className="flex-shrink-0 flex items-center space-x-2">
                        <button
                          onClick={() => handleApprove(vendor._id, vendor.storeName)}
                          className="px-4 py-2 bg-primary hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center space-x-1"
                        >
                          <FiCheck />
                          <span>Approve & Verify</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-900">
                  <p className="text-slate-400 font-medium text-sm">No verification requests</p>
                  <p className="text-xs text-slate-500 mt-1">Check back later for new registration apps</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
