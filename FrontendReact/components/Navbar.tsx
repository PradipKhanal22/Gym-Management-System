import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Dumbbell, ShoppingBag } from 'lucide-react';
import Button from './Button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

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
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
                <Link to="/login">
                  <Button variant="outline" className="border-slate-300 hover:border-primary hover:text-primary font-bold text-sm px-6 py-2.5 transition-all duration-300">
                    Login
                  </Button>
                </Link>

                <Link to="/cart" className="relative group">
                  <ShoppingBag className="w-6 h-6 text-slate-700 group-hover:text-primary transition-colors duration-300" />
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-primary text-white text-xs font-bold rounded-full animate-pulse">
                    0
                  </span>
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
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-500 ease-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={menuRef}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-primary/20 bg-gradient-to-r from-primary to-primary/90">
          <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <Dumbbell className="w-10 h-10 text-white" />
            <span className="text-2xl font-black text-white">
              NEON<span className="text-white/90">FIT</span>
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Menu Links */}
        <div className="flex flex-col px-8 py-10 space-y-6">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-3xl font-bold text-slate-700 hover:text-primary transition-all duration-300 hover:translate-x-4 border-l-4 border-transparent hover:border-primary pl-4 ${
                location.pathname === link.path ? 'text-primary border-primary' : ''
              }`}
              style={{ animation: isOpen ? `slideIn 0.5s ease-out ${index * 0.1}s both` : 'none' }}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-50 to-transparent border-t border-slate-200">
          <Link to="/login" className="block w-full" onClick={() => setIsOpen(false)}>
            <Button
              variant="primary"
              className="w-full py-5 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              Login Now
            </Button>
          </Link>

          <Link
            to="/cart"
            className="flex items-center justify-center gap-3 mt-6 text-slate-600 hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <ShoppingBag className="w-7 h-7" />
            <span className="text-lg font-bold">View Cart</span>
          </Link>
        </div>

        {/* Primary Color Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary shadow-lg shadow-primary/50" />
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