import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Tag, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Package, 
  MessageSquare 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/services', icon: Dumbbell, label: 'Services' },
    { path: '/admin/categories', icon: Tag, label: 'Categories' },
    { path: '/admin/products', icon: ShoppingBag, label: 'Products' },
    { path: '/admin/trainers', icon: Users, label: 'Trainers' },
    { path: '/admin/membership', icon: CreditCard, label: 'Membership' },
    { path: '/admin/orders', icon: Package, label: 'Orders' },
    { path: '/admin/contact-message', icon: MessageSquare, label: 'Contact Message' }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700">
        <Link to="/admin/dashboard" className="flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="NeonFit Logo" 
            className="w-24 h-24 rounded-full object-cover" 
          />
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg shadow-primary/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
