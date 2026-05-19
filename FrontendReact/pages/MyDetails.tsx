import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Mail, Phone, Shield, Calendar, Edit2, Save, X } from 'lucide-react';
import Section from '../components/Section';
import Button from '../components/Button';
import { toast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import { adminProfileAPI } from '../src/constant/api/adminProfileAPI';

const MyDetails: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });

      adminProfileAPI.getProfile()
        .then((response) => {
          if (response?.success && response?.data) {
            const latestUser = {
              ...userData,
              ...response.data,
            };

            setUser(latestUser);
            setFormData({
              name: latestUser.name || '',
              email: latestUser.email || '',
              phone: latestUser.phone || '',
            });

            localStorage.setItem('user', JSON.stringify(latestUser));
          }
        })
        .catch((error) => {
          console.error('Error loading profile from API:', error);
        });
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Invalid session. Please login again.');
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    setSaving(true);

    try {
      const response = await adminProfileAPI.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      const updatedUser = {
        ...user,
        ...response.data,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
      });
      setIsEditing(false);
      toast.success('Details updated successfully!');

      // Dispatch events so the rest of the app refreshes immediately
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: updatedUser }));
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to update details');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Section className="bg-white py-16 mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-32 w-32 bg-slate-200 rounded-full mx-auto"></div>
            <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto"></div>
            <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[40vh] mt-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80" 
            alt="Profile Background" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-primary/40 to-slate-900/70"></div>
        </div>
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-2xl">
              <UserCircle className="w-20 h-20 text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black text-white mb-2"
          >
            My Profile
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-white/90"
          >
            Manage your account information
          </motion.p>
        </div>
      </div>

      {/* Profile Details Section */}
      <Section className="bg-gradient-to-b from-white to-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_80px_-35px_rgba(15,23,42,0.45)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-6 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                  <UserCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Account Details</h2>
                  <p className="text-sm text-slate-300">Keep your account information current</p>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <Edit2 className="w-4 h-4 text-white" />
                  <span className="text-white font-bold text-sm">Edit</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Save className="w-4 h-4" />
                    <span className="font-bold text-sm">{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <X className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-sm">Cancel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Details Grid */}
            <div className="space-y-6 p-6 sm:p-8">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-wider">
                  <UserCircle className="w-4 h-4 text-primary" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                ) : (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-lg font-bold text-slate-900">{user.name}</p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-wider">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                ) : (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-lg font-bold text-slate-900">{user.email}</p>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-wider">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                ) : (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-lg font-bold text-slate-900">{user.phone || 'Not provided'}</p>
                  </div>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-primary" />
                  Account Type
                </label>
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      user.role === 'admin' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-primary text-white'
                    }`}>
                      {user.role || 'User'}
                    </span>
                    <p className="text-slate-700 font-semibold">
                      {user.role === 'admin' ? 'Administrator Account' : 'Regular Member'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  <span className="font-bold">Note:</span> Changes are saved to your account.
                </p>
                {!isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="rounded-2xl border-slate-300 hover:border-primary hover:text-primary"
                  >
                    Back to Home
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Additional Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-[0_20px_80px_-30px_rgba(15,23,42,0.8)]"
          >
            <h3 className="text-2xl font-black mb-4">Need Help?</h3>
            <p className="text-white/90 mb-6">
              If you need to update your password or have any account-related questions, please contact our support team.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="secondary"
                onClick={() => navigate('/contact')}
                className="bg-white text-primary hover:bg-white/90"
              >
                Contact Support
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/pricing')}
                className="border-white text-white hover:bg-white/10"
              >
                View Membership Plans
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
};

export default MyDetails;
