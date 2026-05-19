import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Tag, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Package, 
  MessageSquare,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { logout } from '../../src/constant/authAPI';
import { toast } from '../../components/Toast';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/services', icon: Dumbbell, label: 'Services' },
    { path: '/admin/categories', icon: Tag, label: 'Categories' },
    { path: '/admin/products', icon: ShoppingBag, label: 'Products' },
    { path: '/admin/trainers', icon: Users, label: 'Trainers' },
    { path: '/admin/membership', icon: CreditCard, label: 'Membership' },
    { path: '/admin/orders', icon: Package, label: 'Orders' },
    { path: '/admin/contact-messages', icon: MessageSquare, label: 'Contact Messages' }
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-[80] flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/90 text-white shadow-xl backdrop-blur-sm transition hover:shadow-2xl"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-[70] flex h-screen w-72 flex-col overflow-hidden border-r border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.8)] transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="border-b border-white/10 p-6">
          <Link to="/admin/dashboard" className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-cyan-500/10 ring-1 ring-white/10">
              <img
                src="/logo.png"
                alt="NeonFit Logo"
                className="h-12 w-12 rounded-xl object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-400">NeonFit Gym</p>
              <h2 className="mt-1 text-lg font-black tracking-tight text-white">Admin Panel</h2>
              <p className="text-xs text-slate-400">Management dashboard</p>
            </div>
          </Link>
        </div>

        <div className="px-5 pt-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Navigation</p>
            <p className="mt-1 text-sm font-medium text-slate-300">Access the main admin sections quickly.</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? 'bg-white/10 text-white shadow-lg shadow-black/20 ring-1 ring-white/10'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary to-emerald-400" />}
                <Icon className="h-5 w-5 shrink-0" />
                <span className="font-semibold tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex w-full items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-left font-bold text-rose-100 transition hover:bg-rose-500/20 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
