import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff, Zap } from 'lucide-react';
import Section from '../components/Section';
import { login } from '../src/constant/authAPI';
import { toast } from '../components/Toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await login({ email, password });
      
      if (response.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast.success(response.message);
        
        // Dispatch custom event to notify Navbar and other components
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('userLoggedIn', { 
            detail: response.data.user 
          }));
        }, 0);
        
        // Redirect based on user role
        setTimeout(() => {
          if (response.data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
         <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop&blur=4" alt="bg" className="w-full h-full object-cover opacity-10" />
         <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>
         {/* Animated circles */}
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Section className="relative z-10 w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 p-8 md:p-10 rounded-3xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-3xl font-black italic tracking-tighter text-slate-800 mb-4">
              <Dumbbell className="text-primary w-8 h-8" />
              NEON<span className="text-primary">FIT</span>
            </Link>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-600">Sign in to continue your fitness journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <Button type="submit" variant="primary" className="px-8" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <div className="text-sm text-slate-600 mb-4">
              Don't have an account? <Link to="/register" className="text-primary hover:underline font-bold">Join Now</Link>
            </div>
            <div className="flex items-center gap-2 justify-center text-xs text-slate-500">
              <Zap size={14} className="text-primary" />
              <span>Start your transformation today</span>
            </div>
          </div>
        </motion.div>
      </Section>
    </div>
  );
};

export default Login;