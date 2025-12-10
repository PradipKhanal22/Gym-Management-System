import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Package, 
  MessageSquare,
  Calendar,
  Award
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Members',
      value: '1,234',
      change: '+12.5%',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Orders',
      value: '856',
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'from-primary to-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+23.1%',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Trainers',
      value: '24',
      change: '+4.3%',
      icon: Award,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentOrders = [
    { id: '#ORD001', customer: 'John Doe', product: 'Whey Protein', amount: '$49.99', status: 'Completed' },
    { id: '#ORD002', customer: 'Jane Smith', product: 'Yoga Mat', amount: '$29.99', status: 'Pending' },
    { id: '#ORD003', customer: 'Mike Johnson', product: 'Dumbbell Set', amount: '$89.99', status: 'Processing' },
    { id: '#ORD004', customer: 'Sarah Wilson', product: 'Resistance Bands', amount: '$19.99', status: 'Completed' }
  ];

  const recentMessages = [
    { id: 1, name: 'Alex Brown', message: 'Inquiry about membership plans', time: '2 hours ago' },
    { id: 2, name: 'Emma Davis', message: 'Request for personal training', time: '5 hours ago' },
    { id: 3, name: 'Chris Taylor', message: 'Product availability question', time: '1 day ago' }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
                <p className="text-slate-600 mt-1">Welcome back! Here's what's happening today.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-slate-100 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <span className="text-sm font-bold text-slate-900">
                      {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-bold">{stat.change}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-1">{stat.title}</h3>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Recent Orders & Messages */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900">Recent Orders</h2>
                <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-bold text-slate-900">{order.id}</p>
                      <p className="text-sm text-slate-600">{order.customer}</p>
                      <p className="text-xs text-slate-500 mt-1">{order.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900">{order.amount}</p>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900">Recent Messages</h2>
                <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white font-bold shrink-0">
                      {message.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-slate-900">{message.name}</p>
                        <span className="text-xs text-slate-500">{message.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 truncate">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200"
          >
            <h2 className="text-xl font-black text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Add Product', icon: Package, color: 'from-blue-500 to-blue-600' },
                { label: 'New Member', icon: Users, color: 'from-primary to-emerald-500' },
                { label: 'Add Service', icon: Award, color: 'from-purple-500 to-purple-600' },
                { label: 'View Messages', icon: MessageSquare, color: 'from-orange-500 to-orange-600' }
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-2`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-bold">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
