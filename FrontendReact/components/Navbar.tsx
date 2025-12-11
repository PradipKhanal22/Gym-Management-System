import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Dumbbell, ShoppingBag, User, LogOut, UserCircle } from 'lucide-react';
import Button from './Button';
import { logout } from '../src/constant/authAPI';
import { toast } from './Toast';
import { getCart } from '../src/constant/cartUtils';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Load cart count
  const loadCartCount = async () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData.token) {
          const cartItems = await getCart();
          const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(totalCount);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error loading cart count:', error);
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  // Check for logged-in user on component mount
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
        }
      } else {
        setUser(null);
      }
    };

    // Load user on mount
    loadUser();

    // Listen for user login/logout events
    const handleUserChange = (event?: any) => {
      if (event?.detail) {
        // Use user data from event if available
        setUser(event.detail);
      } else {
        // Otherwise, reload from localStorage
        loadUser();
      }
      // Reload cart count when user changes
      loadCartCount();
    };

    window.addEventListener('userLoggedIn', handleUserChange);
    window.addEventListener('userLoggedOut', handleUserChange);
    window.addEventListener('storage', loadUser);

    return () => {
      window.removeEventListener('userLoggedIn', handleUserChange);
      window.removeEventListener('userLoggedOut', handleUserChange);
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  // Load cart count on mount and when cart is updated
  useEffect(() => {
    loadCartCount();

    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (isOpen || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, showUserMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('user');
      setUser(null);
      setCartCount(0);
      setShowUserMenu(false);
      toast.success('Logged out successfully');
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('userLoggedOut'));
      
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-white shadow-xl shadow-primary/10 border-b-2 border-primary/20'
            : 'bg-white shadow-md'
        }`}
      >
        <div className="container mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group transition-all duration-300">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="NeonFit Logo" 
                  className="w-24 h-24 transition-transform group-hover:scale-110 duration-500 rounded-full object-cover" 
                />
                <span className="absolute inset-0 blur-xl bg-primary/30 scale-0 group-hover:scale-100 transition-transform duration-700" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-sm font-extrabold uppercase tracking-widest transition-all duration-300 
                    after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300
                    hover:text-primary hover:after:w-full
                    ${location.pathname === link.path ? 'text-primary after:w-full' : 'text-slate-700'}`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex items-center gap-4 ml-6">
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onMouseEnter={() => setShowUserMenu(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-slate-300 hover:border-primary transition-all duration-300 group"
                    >
                      <UserCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-primary">
                        Hi, {user.name.split(' ')[0]}
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <div
                        onMouseEnter={() => setShowUserMenu(true)}
                        onMouseLeave={() => setShowUserMenu(false)}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-slate-200 overflow-hidden z-50"
                      >
                        <div className="p-2">
                          <Link
                            to="/my-details"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="w-4 h-4 text-slate-600" />
                            <span className="text-sm font-semibold text-slate-700">My Details</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-semibold text-red-600">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login">
                    <Button variant="outline" className="border-slate-300 hover:border-primary hover:text-primary font-bold text-sm px-6 py-2.5 transition-all duration-300">
                      Login
                    </Button>
                  </Link>
                )}

                <Link to="/cart" className="relative group">
                  <ShoppingBag className="w-6 h-6 text-slate-700 group-hover:text-primary transition-colors duration-300" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-primary text-white text-xs font-bold rounded-full animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative z-50 p-3 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
              aria-label="Toggle menu"
            >
              <Menu className={`w-6 h-6 text-white transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100'}`} />
              <X className={`absolute inset-0 m-auto w-6 h-6 text-white transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 -rotate-90'}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Right Side Sliding Menu */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-gradient-to-br from-white via-slate-50 to-white shadow-2xl transform transition-transform duration-500 ease-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={menuRef}
      >
        {/* Menu Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-primary via-primary to-emerald-500 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl animate-pulse delay-150"></div>
          </div>
          
          <Link to="/" className="flex items-center gap-3 relative z-10" onClick={() => setIsOpen(false)}>
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="NeonFit Logo" 
                className="w-14 h-14 rounded-full object-cover border-2 border-white/50 shadow-lg" 
              />
              <div className="absolute inset-0 rounded-full bg-white/20 blur-md"></div>
            </div>
            <span className="text-2xl font-black text-white drop-shadow-lg">
              NEON<span className="text-white/90">FIT</span>
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all hover:rotate-90 duration-300 relative z-10 border border-white/30"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Menu Links */}
        <div className="flex flex-col px-6 py-6 space-y-2" style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 overflow-hidden ${
                location.pathname === link.path 
                  ? 'bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg shadow-primary/30 translate-x-1' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-primary border border-slate-200 hover:border-primary/30 hover:translate-x-1 hover:shadow-md'
              }`}
              style={{ animation: isOpen ? `slideIn 0.4s ease-out ${index * 0.08}s both` : 'none' }}
            >
              {/* Active Indicator */}
              {location.pathname === link.path && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-r-full"></div>
              )}
              
              <span className={`text-lg font-bold tracking-wide ${
                location.pathname === link.path ? 'text-white' : 'group-hover:text-primary'
              }`}>
                {link.name}
              </span>
              
              {/* Hover Arrow */}
              <div className={`ml-auto transition-transform duration-300 ${
                location.pathname === link.path ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
              }`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  location.pathname === link.path ? 'bg-white/20' : 'bg-primary/10'
                }`}>
                  <span className={`text-sm ${location.pathname === link.path ? 'text-white' : 'text-primary'}`}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Action Buttons - Fixed at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent border-t border-slate-200 backdrop-blur-sm">
          {user ? (
            <div className="space-y-3">
              <Link
                to="/my-details"
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white border-2 border-slate-200 hover:border-primary hover:bg-slate-50 transition-all group shadow-sm"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-primary">My Profile</span>
                <span className="ml-auto text-slate-400 group-hover:text-primary transition-colors">→</span>
              </Link>

              <Link
                to="/cart"
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all group shadow-lg shadow-emerald-500/30"
                onClick={() => setIsOpen(false)}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-emerald-500">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-white">Shopping Cart</span>
                <span className="ml-auto px-2.5 py-1 bg-white/20 rounded-lg text-xs font-bold text-white border border-white/30">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </Link>

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-50 hover:bg-red-100 border-2 border-red-100 hover:border-red-200 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 group-hover:bg-red-200 flex items-center justify-center transition-colors">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-bold text-red-600">Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                to="/cart"
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 hover:border-slate-300 transition-all group"
                onClick={() => setIsOpen(false)}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <ShoppingBag className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                  </div>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-primary text-white text-xs font-bold rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-primary">View Cart</span>
                <span className="ml-auto text-xs font-bold text-slate-500">({cartCount})</span>
              </Link>

              <Link to="/login" className="block w-full" onClick={() => setIsOpen(false)}>
                <Button
                  variant="primary"
                  className="w-full py-4 text-base font-bold bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 shadow-lg shadow-primary/30 border-none"
                >
                  Login / Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Accent Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary"></div>
      </div>

      {/* Backdrop (click to close) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Optional: CSS Animation for slide-in links */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;