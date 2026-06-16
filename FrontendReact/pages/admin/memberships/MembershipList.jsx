import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar';
import { membershipAPI } from '../../../src/constant/api/membershipAPI';
import { toast } from '../../../components/Toast';
import { CreditCard, Search, Calendar, ShieldCheck, Clock, User } from 'lucide-react';

const MembershipList = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const response = await membershipAPI.getAll();
      if (response.success) {
        setMemberships(response.data);
      } else {
        toast.error(response.message || 'Failed to load memberships');
      }
    } catch (error) {
      console.error('Error fetching memberships:', error);
      toast.error('Failed to load memberships');
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (endDateStr) => {
    if (!endDateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(endDateStr);
    endDate.setHours(0, 0, 0, 0);

    const timeDiff = endDate.getTime() - today.getTime();
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredMemberships = memberships.filter((m) => {
    const userName = m.user?.name || '';
    const userEmail = m.user?.email || '';
    const query = searchTerm.toLowerCase();
    return (
      userName.toLowerCase().includes(query) ||
      userEmail.toLowerCase().includes(query) ||
      m.plan_name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64 ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Memberships</h1>
                  <p className="text-slate-600 mt-1">Monitor active and expired gym subscriptions</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Filters & Actions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
              />
            </div>
            <div className="text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-xl">
              Total Members: <span className="text-primary">{filteredMemberships.length}</span>
            </div>
          </div>

          {/* Memberships Table */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg font-bold text-slate-600 animate-pulse">Loading memberships...</div>
            </div>
          ) : filteredMemberships.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 shadow-lg border border-slate-200 text-center">
              <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4 animate-bounce" />
              <p className="text-xl font-bold text-slate-900 mb-2">No memberships found</p>
              <p className="text-slate-600">Active membership plans purchased through eSewa will appear here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Member Details
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Membership Plan
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Started Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Ending Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Days Remained
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-black text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredMemberships.map((membership, index) => {
                      const daysLeft = getDaysRemaining(membership.end_date);
                      const isExpired = daysLeft === 0;

                      return (
                        <motion.tr
                          key={membership.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          {/* Member Details */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                <User className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-base font-black text-slate-900">
                                  {membership.user?.name || 'Unknown User'}
                                </p>
                                <p className="text-xs font-semibold text-slate-500">
                                  {membership.user?.email || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Plan */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                              <p className="text-base font-bold text-slate-800">
                                {membership.plan_name}
                              </p>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4">
                            <p className="text-base font-black text-slate-900">
                              Rs. {membership.price}
                            </p>
                          </td>

                          {/* Started Date */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-sm font-semibold">
                                {formatDate(membership.start_date)}
                              </span>
                            </div>
                          </td>

                          {/* Ending Date */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-sm font-semibold">
                                {formatDate(membership.end_date)}
                              </span>
                            </div>
                          </td>

                          {/* Days Remained */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Clock className={`w-4 h-4 shrink-0 ${isExpired ? 'text-red-500' : 'text-amber-500'}`} />
                              <span className={`text-base font-black ${isExpired ? 'text-red-600' : 'text-slate-800'}`}>
                                {isExpired ? '0 Days' : `${daysLeft} Days`}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                                isExpired
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {isExpired ? 'Expired' : 'Active'}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipList;