import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { toast } from '../../components/Toast';
import { adminProfileAPI } from '../../src/constant/api/adminProfileAPI';
import { productAPI } from '../../src/constant/api/productAPI';
import { orderAPI } from '../../src/constant/api/orderAPI';
import { contactAPI } from '../../src/constant/api/contactAPI';
import { serviceAPI } from '../../src/constant/api/serviceAPI';
import { categoryAPI } from '../../src/constant/api/categoryAPI';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  DollarSign,
  Eye,
  EyeOff,
  LineChart,
  Lock,
  Mail,
  MessageSquare,
  Package,
  PieChart,
  RefreshCcw,
  Save,
  Settings,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Trash2,
  UserCircle2,
  Users,
  X,
} from 'lucide-react';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);

const getAuthUser = () => {
  const stored = localStorage.getItem('user');
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Unable to parse stored admin profile:', error);
    return null;
  }
};

const safeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const bucketByMonth = (orders) => {
  const bucket = new Map();

  orders.forEach((order) => {
    const createdAt = order.created_at ? new Date(order.created_at) : null;
    const key = createdAt && !Number.isNaN(createdAt.getTime())
      ? createdAt.toLocaleDateString('en-US', { month: 'short' })
      : 'Unknown';
    bucket.set(key, (bucket.get(key) ?? 0) + safeNumber(order.total));
  });

  return Array.from(bucket.entries()).map(([label, value]) => ({ label, value }));
};

const bucketOrderStatuses = (orders) => {
  const labels = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  return labels.map((label) => ({
    label,
    value: orders.filter((order) => (order.order_status || 'pending').toLowerCase() === label).length,
  }));
};

const bucketProductsByCategory = (products) => {
  const bucket = new Map();

  products.forEach((product) => {
    const label = product.category?.name || 'Uncategorized';
    bucket.set(label, (bucket.get(label) ?? 0) + 1);
  });

  return Array.from(bucket.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));
};

const buildLinePath = (values, width = 560, height = 220, padding = 24) => {
  if (!values.length) {
    return '';
  }

  const maxValue = Math.max(...values, 1);
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const step = values.length > 1 ? usableWidth / (values.length - 1) : 0;

  return values
    .map((value, index) => {
      const x = padding + index * step;
      const y = height - padding - (value / maxValue) * usableHeight;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
};

const getStoredIds = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminProfile, setAdminProfile] = useState(getAuthUser());
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', password: '', confirmPassword: '' });
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState(() => getStoredIds('adminDismissedNotificationIds'));
  const [readNotificationIds, setReadNotificationIds] = useState(() => getStoredIds('adminReadNotificationIds'));

  useEffect(() => {
    if (adminProfile) {
      setProfileForm({
        name: adminProfile.name || '',
        email: adminProfile.email || '',
        phone: adminProfile.phone || '',
      });
    }
  }, [adminProfile]);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      const [productResult, orderResult, messageResult, serviceResult, categoryResult, profileResult] = await Promise.allSettled([
        productAPI.getAll(),
        orderAPI.getAllOrders(),
        contactAPI.getAll(),
        serviceAPI.getAll(),
        categoryAPI.getAll(),
        adminProfileAPI.getProfile(),
      ]);

      const unwrap = (result) =>
        result.status === 'fulfilled' ? result.value : null;

      const productPayload = unwrap(productResult);
      const orderPayload = unwrap(orderResult);
      const messagePayload = unwrap(messageResult);
      const servicePayload = unwrap(serviceResult);
      const categoryPayload = unwrap(categoryResult);
      const profilePayload = unwrap(profileResult);

      setProducts(Array.isArray(productPayload?.data) ? productPayload.data : []);
      setOrders(Array.isArray(orderPayload?.data) ? orderPayload.data : []);
      setMessages(Array.isArray(messagePayload?.data) ? messagePayload.data : []);
      setServices(Array.isArray(servicePayload?.data) ? servicePayload.data : []);
      setCategories(Array.isArray(categoryPayload?.data) ? categoryPayload.data : []);

      if (profilePayload?.data) {
        const storedUser = getAuthUser();
        const mergedProfile = {
          ...(storedUser || {}),
          ...profilePayload.data,
        };

        setAdminProfile(mergedProfile);
        localStorage.setItem('user', JSON.stringify(mergedProfile));
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: mergedProfile }));
      }

      const failures = [productResult, orderResult, messageResult, serviceResult, categoryResult, profileResult].filter(
        (result) => result.status === 'rejected'
      );

      if (failures.length === 6) {
        setError('Unable to load dashboard data. Check that the backend API is running.');
      }

      setLoading(false);
    };

    void loadDashboard();
  }, []);

  const lowStockProducts = useMemo(
    () => products.filter((product) => safeNumber(product.stock) <= 5),
    [products]
  );

  const unreadMessages = useMemo(
    () => messages.filter((message) => !message.is_read),
    [messages]
  );

  const pendingOrders = useMemo(
    () => orders.filter((order) => ['pending', 'processing'].includes((order.order_status || 'pending').toLowerCase())),
    [orders]
  );

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + safeNumber(order.total), 0),
    [orders]
  );

  const membershipSignals = useMemo(
    () => messages.filter((message) => /membership|plan|subscription/i.test(message.message)),
    [messages]
  );

  const notifications = useMemo(() => {
    const lowStockAlerts = lowStockProducts.slice(0, 4).map((product) => ({
      id: `stock-${product.id}`,
      title: `Low stock: ${product.name}`,
      description: `${product.stock ?? 0} items left${product.category?.name ? ` in ${product.category.name}` : ''}`,
      tone: 'product',
      source: 'product',
      sourceId: product.id,
    }));

    const orderAlerts = pendingOrders.slice(0, 4).map((order) => ({
      id: `order-${order.id}`,
      title: `Order #${order.id} needs attention`,
      description: `${order.full_name} · ${order.order_status || 'pending'}`,
      tone: 'order',
      source: 'order',
      sourceId: order.id,
    }));

    const messageAlerts = unreadMessages.slice(0, 4).map((message) => ({
      id: `message-${message.id}`,
      title: `Unread message from ${message.name}`,
      description: message.message.slice(0, 80),
      tone: 'message',
      source: 'message',
      sourceId: message.id,
    }));

    const membershipAlerts = membershipSignals.slice(0, 2).map((message) => ({
      id: `membership-${message.id}`,
      title: `Membership enquiry from ${message.name}`,
      description: message.message.slice(0, 80),
      tone: 'membership',
      source: 'membership',
      sourceId: message.id,
    }));

    const pricingAlert = {
      id: 'membership-pricing-plan',
      title: 'Pricing plan snapshot',
      description: 'Day Pass, Pro Member, and Elite are the active membership tiers.',
      tone: 'membership',
      source: 'membership',
    };

    return [...lowStockAlerts, ...orderAlerts, ...messageAlerts, ...membershipAlerts, pricingAlert];
  }, [lowStockProducts, membershipSignals, pendingOrders, unreadMessages]);

  const visibleNotifications = useMemo(
    () => notifications.filter((notification) => !dismissedNotificationIds.includes(notification.id) && !readNotificationIds.includes(notification.id)),
    [dismissedNotificationIds, notifications, readNotificationIds]
  );

  const revenueSeries = useMemo(() => bucketByMonth(orders), [orders]);
  const orderStatusSeries = useMemo(() => bucketOrderStatuses(orders), [orders]);
  const categorySeries = useMemo(() => bucketProductsByCategory(products), [products]);
  const activitySeries = useMemo(() => {
    const bucket = new Map();

    const bump = (dateValue, key) => {
      if (!dateValue) return;

      const date = new Date(dateValue);
      if (Number.isNaN(date.getTime())) return;

      const label = date.toLocaleDateString('en-US', { month: 'short' });
      const current = bucket.get(label) || { label, orders: 0, products: 0, messages: 0 };
      current[key] += 1;
      bucket.set(label, current);
    };

    orders.forEach((order) => bump(order.created_at, 'orders'));
    products.forEach((product) => bump(product.created_at, 'products'));
    messages.forEach((message) => bump(message.created_at, 'messages'));

    return Array.from(bucket.values());
  }, [messages, orders, products]);

  const statCards = [
    {
      title: 'Products',
      value: String(products.length),
      detail: `${lowStockProducts.length} need restock`,
      icon: ShoppingBag,
      gradient: 'from-sky-500 to-cyan-500',
    },
    {
      title: 'Orders',
      value: String(orders.length),
      detail: `${pendingOrders.length} awaiting action`,
      icon: Package,
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      title: 'Revenue',
      value: formatCurrency(totalRevenue),
      detail: 'from completed orders',
      icon: DollarSign,
      gradient: 'from-violet-500 to-fuchsia-500',
    },
    {
      title: 'Unread messages',
      value: String(unreadMessages.length),
      detail: `${membershipSignals.length} mention memberships`,
      icon: MessageSquare,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Services',
      value: String(services.length),
      detail: 'service catalog active',
      icon: Users,
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Categories',
      value: String(categories.length),
      detail: 'category groups configured',
      icon: Sparkles,
      gradient: 'from-rose-500 to-red-500',
    },
  ];

  const recentOrders = orders.slice(0, 6);
  const recentMessages = messages.slice(0, 5);

  useEffect(() => {
    localStorage.setItem('adminDismissedNotificationIds', JSON.stringify(dismissedNotificationIds));
  }, [dismissedNotificationIds]);

  useEffect(() => {
    localStorage.setItem('adminReadNotificationIds', JSON.stringify(readNotificationIds));
  }, [readNotificationIds]);

  const markNotificationAsRead = async (notification) => {
    if (notification.source === 'message' && notification.sourceId) {
      try {
        await contactAPI.markAsRead(notification.sourceId);
        const response = await contactAPI.getAll();
        if (response.success) {
          setMessages(response.data);
        }
      } catch (error) {
        toast.error('Failed to mark notification as read');
        return;
      }
    }

    setReadNotificationIds((previous) => [...new Set([...previous, notification.id])]);
    toast.success('Notification marked as read');
  };

  const deleteNotification = async (notification) => {
    if (notification.source === 'message' && notification.sourceId) {
      try {
        const response = await contactAPI.delete(notification.sourceId);
        if (response.success) {
          const refreshedMessages = await contactAPI.getAll();
          if (refreshedMessages.success) {
            setMessages(refreshedMessages.data);
          }
        }
      } catch (error) {
        toast.error('Failed to delete notification');
        return;
      }
    }

    setDismissedNotificationIds((previous) => [...new Set([...previous, notification.id])]);
    toast.success('Notification deleted successfully');
  };

  const handleProfileSave = async () => {
    setSaving(true);

    try {
      const profileResponse = await adminProfileAPI.updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
      });

      const updatedProfile = {
        ...(adminProfile || {}),
        ...profileResponse.data,
      };

      setAdminProfile(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedProfile }));

      if (passwordForm.currentPassword || passwordForm.password || passwordForm.confirmPassword) {
        if (!passwordForm.currentPassword || !passwordForm.password || !passwordForm.confirmPassword) {
          throw new Error('Fill all password fields before saving the password change.');
        }

        await adminProfileAPI.updatePassword({
          current_password: passwordForm.currentPassword,
          password: passwordForm.password,
          password_confirmation: passwordForm.confirmPassword,
        });

        setPasswordForm({ currentPassword: '', password: '', confirmPassword: '' });
      }

      toast.success('Admin profile updated successfully');
      setSettingsOpen(false);
    } catch (saveError) {
      toast.error(saveError.message || 'Unable to update admin profile');
    } finally {
      setSaving(false);
    }
  };

  const statusToneClass = (tone) => {
    switch (tone) {
      case 'product':
        return 'bg-sky-100 text-sky-700';
      case 'order':
        return 'bg-emerald-100 text-emerald-700';
      case 'message':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-violet-100 text-violet-700';
    }
  };

  const chartPath = buildLinePath(revenueSeries.map((item) => item.value));
  const maxStatusValue = Math.max(...orderStatusSeries.map((item) => item.value), 1);
  const maxCategoryValue = Math.max(...categorySeries.map((item) => item.value), 1);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 lg:ml-72 ml-0">
        <header className="relative overflow-visible border-b border-slate-200/80 bg-white/90 text-slate-900 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.5)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.06),transparent_35%,rgba(59,130,246,0.06))]" />
          <div className="relative px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.32em] text-slate-500">
                  <LineChart className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                  <span className="truncate">Admin control center</span>
                </div>
                <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight text-slate-950">Dashboard</h1>
                <p className="mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm lg:text-base leading-5 sm:leading-6 text-slate-600">
                  Monitor products, orders, memberships, and messages from a calm, high-signal command center.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Calendar className="h-4 w-4 text-primary" />
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen((prev) => !prev)}
                    className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-600"
                  >
                    <Bell className="h-5 w-5" />
                    {visibleNotifications.length > 0 && (
                      <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-lg">
                        {visibleNotifications.length}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 z-[80] mt-3 w-[calc(100vw-2rem)] max-w-[380px] overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                          <div>
                            <p className="text-sm font-black uppercase tracking-wider text-slate-500">Notifications</p>
                            <h3 className="text-lg font-black text-slate-900">Products and membership alerts</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotificationsOpen(false)}
                            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="max-h-[420px] overflow-y-auto p-4 space-y-3">
                          {visibleNotifications.length === 0 ? (
                            <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
                              No alerts right now. The dashboard will surface stock, order, and membership changes here.
                            </div>
                          ) : (
                            visibleNotifications.map((notification) => (
                              <div key={notification.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${statusToneClass(notification.tone)}`}>
                                      {notification.tone}
                                    </span>
                                    <h4 className="mt-2 text-sm font-black text-slate-900">{notification.title}</h4>
                                    <p className="mt-1 text-sm text-slate-600">{notification.description}</p>
                                  </div>
                                  <div className="flex shrink-0 items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => void markNotificationAsRead(notification)}
                                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600"
                                      title="Mark as read"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => void deleteNotification(notification)}
                                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
                                      title="Delete notification"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-primary/30 hover:text-primary"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-sm font-black text-white">
                    {adminProfile?.name ? adminProfile.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{adminProfile?.name || 'Admin'}</p>
                    <p className="text-xs text-slate-500">{adminProfile?.email || 'admin@gmail.com'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-8 p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {statCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg shadow-slate-200`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Live
                    </div>
                  </div>
                  <div className="mt-5">
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">{card.title}</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">{card.value}</p>
                    <p className="mt-1 text-sm text-slate-600">{card.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {loading ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-96 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="h-full animate-pulse rounded-2xl bg-slate-100" />
              </div>
              <div className="h-96 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="h-full animate-pulse rounded-2xl bg-slate-100" />
              </div>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-black">Dashboard data could not be loaded</p>
                  <p className="mt-1 text-sm">{error}</p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-800"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Retry
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                <motion.section
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">Revenue trend</p>
                      <h2 className="mt-2 text-2xl font-black text-slate-900">Monthly order revenue</h2>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total revenue</p>
                      <p className="text-xl font-black text-slate-900">{formatCurrency(totalRevenue)}</p>
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-3xl bg-slate-950 p-4">
                    {revenueSeries.length === 0 ? (
                      <div className="flex h-[260px] items-center justify-center text-sm text-slate-400">
                        No revenue data yet.
                      </div>
                    ) : (
                      <svg viewBox="0 0 600 260" className="h-[260px] w-full">
                        <defs>
                          <linearGradient id="revenueStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                          <linearGradient id="revenueFill" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(34,197,94,0.35)" />
                            <stop offset="100%" stopColor="rgba(34,197,94,0.02)" />
                          </linearGradient>
                        </defs>
                        {[0.25, 0.5, 0.75].map((line) => (
                          <line
                            key={line}
                            x1="28"
                            x2="572"
                            y1={52 + 160 * line}
                            y2={52 + 160 * line}
                            stroke="rgba(148,163,184,0.18)"
                            strokeDasharray="6 8"
                          />
                        ))}
                        <path d={`${chartPath} L 576 236 L 24 236 Z`} fill="url(#revenueFill)" />
                        <path d={chartPath} fill="none" stroke="url(#revenueStroke)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        {revenueSeries.map((point, index) => {
                          const x = revenueSeries.length > 1 ? 24 + (index * 552) / (revenueSeries.length - 1) : 280;
                          const maxValue = Math.max(...revenueSeries.map((item) => item.value), 1);
                          const y = 236 - (point.value / maxValue) * 160;

                          return (
                            <g key={`${point.label}-${index}`}>
                              <circle cx={x} cy={y} r="6" fill="#0f172a" stroke="#34d399" strokeWidth="3" />
                              <text x={x} y="252" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="700">
                                {point.label}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    )}
                  </div>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">Activity</p>
                      <h2 className="mt-2 text-2xl font-black text-slate-900">Live content activity</h2>
                    </div>
                    <BarChart3 className="h-6 w-6 text-slate-400" />
                  </div>

                  <div className="mt-6 overflow-hidden rounded-3xl bg-slate-950 p-4">
                    {activitySeries.length === 0 ? (
                      <div className="flex h-[260px] items-center justify-center text-sm text-slate-400">No activity data yet.</div>
                    ) : (
                      <svg viewBox="0 0 600 260" className="h-[260px] w-full">
                        {activitySeries.map((entry, index) => {
                          const segmentWidth = 500 / Math.max(activitySeries.length, 1);
                          const baseX = 48 + index * segmentWidth;
                          const total = Math.max(entry.orders + entry.products + entry.messages, 1);
                          const ordersHeight = (entry.orders / total) * 160;
                          const productsHeight = (entry.products / total) * 160;
                          const messagesHeight = (entry.messages / total) * 160;

                          return (
                            <g key={entry.label}>
                              <rect x={baseX} y={232 - ordersHeight} width={segmentWidth * 0.24} height={ordersHeight} rx="8" fill="#22c55e" />
                              <rect x={baseX + segmentWidth * 0.28} y={232 - productsHeight} width={segmentWidth * 0.24} height={productsHeight} rx="8" fill="#38bdf8" />
                              <rect x={baseX + segmentWidth * 0.56} y={232 - messagesHeight} width={segmentWidth * 0.24} height={messagesHeight} rx="8" fill="#f59e0b" />
                              <text x={baseX + segmentWidth * 0.36} y="252" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="700">
                                {entry.label}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-bold text-slate-600">
                    <div className="rounded-2xl bg-slate-50 p-3">Orders</div>
                    <div className="rounded-2xl bg-slate-50 p-3">Products</div>
                    <div className="rounded-2xl bg-slate-50 p-3">Messages</div>
                  </div>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">Orders split</p>
                      <h2 className="mt-2 text-2xl font-black text-slate-900">Order statuses</h2>
                    </div>
                    <PieChart className="h-6 w-6 text-slate-400" />
                  </div>

                  <div className="mt-6 space-y-4">
                    {orderStatusSeries.map((item, index) => {
                      const palette = ['from-sky-500 to-cyan-500', 'from-emerald-500 to-lime-500', 'from-violet-500 to-fuchsia-500', 'from-amber-500 to-orange-500', 'from-rose-500 to-red-500'];
                      const widthPercent = `${(item.value / maxStatusValue) * 100}%`;

                      return (
                        <div key={item.label}>
                          <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700">
                            <span className="capitalize">{item.label}</span>
                            <span>{item.value}</span>
                          </div>
                          <div className="h-4 rounded-full bg-slate-100">
                            <div
                              className={`h-4 rounded-full bg-gradient-to-r ${palette[index % palette.length]}`}
                              style={{ width: widthPercent }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">Membership overview</p>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                      {[
                        { label: 'Day Pass', color: 'bg-sky-500' },
                        { label: 'Pro Member', color: 'bg-emerald-500' },
                        { label: 'Elite', color: 'bg-violet-500' },
                      ].map((plan) => (
                        <div key={plan.label} className="rounded-2xl border border-slate-200 bg-white p-3">
                          <div className={`mx-auto h-3 w-3 rounded-full ${plan.color}`} />
                          <p className="mt-2 text-sm font-black text-slate-900">{plan.label}</p>
                          <p className="mt-1 text-xs text-slate-500">pricing active</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.section>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr_1fr]">
                <motion.section
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">Stock mix</p>
                      <h2 className="mt-2 text-2xl font-black text-slate-900">Products by category</h2>
                    </div>
                    <BarChart3 className="h-6 w-6 text-slate-400" />
                  </div>

                  <div className="mt-6 space-y-4">
                    {categorySeries.length === 0 ? (
                      <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">No category data yet.</div>
                    ) : (
                      categorySeries.map((item) => {
                        const widthPercent = `${(item.value / maxCategoryValue) * 100}%`;

                        return (
                          <div key={item.label}>
                            <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700">
                              <span>{item.label}</span>
                              <span>{item.value}</span>
                            </div>
                            <div className="h-4 rounded-full bg-slate-100">
                              <div className="h-4 rounded-full bg-gradient-to-r from-sky-500 via-emerald-500 to-cyan-500" style={{ width: widthPercent }} />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">Orders</p>
                      <h2 className="mt-2 text-2xl font-black text-slate-900">Latest orders</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/admin/orders')}
                      className="text-sm font-bold text-primary transition hover:text-primary/80"
                    >
                      View all
                    </button>
                  </div>

                  <div className="space-y-4">
                    {recentOrders.length === 0 ? (
                      <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">No orders yet.</div>
                    ) : (
                      recentOrders.map((order) => (
                        <div key={order.id} className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-black text-slate-900">Order #{order.id}</p>
                              <p className="mt-1 text-sm text-slate-600">{order.full_name}</p>
                              <p className="mt-1 text-xs text-slate-500">{order.user?.email || 'guest checkout'}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-slate-900">{formatCurrency(safeNumber(order.total))}</p>
                              <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusToneClass(
                                order.order_status === 'delivered'
                                  ? 'membership'
                                  : order.order_status === 'pending'
                                    ? 'order'
                                    : order.order_status === 'processing'
                                      ? 'message'
                                      : 'product'
                              )}`}>
                                {order.order_status || 'pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">Alerts</p>
                      <h2 className="mt-2 text-2xl font-black text-slate-900">Latest messages</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/admin/contact-messages')}
                      className="text-sm font-bold text-primary transition hover:text-primary/80"
                    >
                      View all
                    </button>
                  </div>

                  <div className="space-y-4">
                    {recentMessages.length === 0 ? (
                      <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">No messages yet.</div>
                    ) : (
                      recentMessages.map((message) => (
                        <div key={message.id} className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-sm font-black text-white">
                            {message.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-black text-slate-900">{message.name}</p>
                              <span className="text-xs text-slate-500">{message.is_read ? 'read' : 'unread'}</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-600 line-clamp-2">{message.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.section>
              </div>

              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">Actions</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">Quick links</h2>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: 'Add Product', icon: Package, action: () => navigate('/admin/products/add'), gradient: 'from-sky-500 to-cyan-500' },
                    { label: 'Manage Services', icon: Users, action: () => navigate('/admin/services'), gradient: 'from-emerald-500 to-green-500' },
                    { label: 'Open Settings', icon: Settings, action: () => setSettingsOpen(true), gradient: 'from-violet-500 to-fuchsia-500' },
                    { label: 'Check Messages', icon: Mail, action: () => navigate('/admin/contact-messages'), gradient: 'from-amber-500 to-orange-500' },
                  ].map((action) => {
                    const Icon = action.icon;

                    return (
                      <button
                        key={action.label}
                        type="button"
                        onClick={action.action}
                        className={`group rounded-2xl bg-gradient-to-br ${action.gradient} p-4 text-left text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <Icon className="h-6 w-6" />
                          <span className="text-sm font-bold opacity-80 transition group-hover:translate-x-1">Open</span>
                        </div>
                        <p className="mt-8 text-lg font-black">{action.label}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.section>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 py-4 backdrop-blur-sm"
            onClick={() => setSettingsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">Account settings</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">Update admin profile</h2>
                  <p className="mt-1 text-sm text-slate-600">Edit your account details and password in one clean dialog.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-xl font-black text-white">
                      {profileForm.name ? profileForm.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">Profile preview</p>
                      <h3 className="mt-1 text-xl font-black text-slate-900">{profileForm.name || 'Admin'}</h3>
                      <p className="text-sm text-slate-600">{profileForm.email || 'admin@gmail.com'}</p>
                      <p className="text-sm text-slate-600">{profileForm.phone || 'Phone not set'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Name</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-primary">
                      <UserCircle2 className="h-5 w-5 text-slate-400" />
                      <input
                        value={profileForm.name}
                        onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
                        className="w-full bg-transparent text-slate-900 outline-none"
                        placeholder="Admin name"
                      />
                    </div>
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Email</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-primary">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
                        className="w-full bg-transparent text-slate-900 outline-none"
                        placeholder="admin@example.com"
                      />
                    </div>
                  </label>
                </div>

                <label className="mt-4 block space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Phone</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-primary">
                    <MessageSquare className="h-5 w-5 text-slate-400" />
                    <input
                      value={profileForm.phone}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))}
                      className="w-full bg-transparent text-slate-900 outline-none"
                      placeholder="Phone number"
                    />
                  </div>
                </label>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">Password</p>
                      <h3 className="mt-2 text-lg font-black text-slate-900">Update your password</h3>
                    </div>
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="mt-4 space-y-4">
                    <label className="block space-y-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500">Current password</span>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-primary">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                          className="w-full bg-transparent text-slate-900 outline-none"
                          placeholder="Current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword((prev) => !prev)}
                          className="text-slate-400 transition hover:text-slate-700"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </label>

                    <label className="block space-y-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500">New password</span>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-primary">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.password}
                          onChange={(event) => setPasswordForm((prev) => ({ ...prev, password: event.target.value }))}
                          className="w-full bg-transparent text-slate-900 outline-none"
                          placeholder="New password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="text-slate-400 transition hover:text-slate-700"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </label>

                    <label className="block space-y-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500">Confirm new password</span>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-primary"
                        placeholder="Confirm password"
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 md:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Profile syncs to the account.
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Password change uses current password.
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Alerts stay in the bell menu.
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-white px-6 py-5">
                <button
                  type="button"
                  onClick={handleProfileSave}
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-emerald-500 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving changes...' : 'Save settings'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;