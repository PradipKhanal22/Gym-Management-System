import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Home, Package, Frown } from 'lucide-react';

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasSuccess, setHasSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Check if we have order data from successful checkout
    if (location.state && location.state.success) {
      setHasSuccess(true);
      setOrderData(location.state);
    } else {
      setHasSuccess(false);
    }
  }, [location]);

  if (!hasSuccess) {
    // No success session - user accessed directly
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white px-4 py-20 mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-12 text-center"
        >
          {/* Sad Icon */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <Frown className="w-16 h-16 text-slate-400" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-slate-800 mb-6"
          >
            Oops!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 mb-8 text-xl"
          >
            It seems you've reached this page by mistake. No order was placed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/">
              <button className="bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto text-lg">
                <Home className="w-6 h-6" />
                Go to Homepage
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Success view
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white px-4 py-20 mt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center overflow-hidden">
          {/* Animated Success Icon */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2
              }}
              className="relative"
            >
              <svg className="w-32 h-32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                {/* Background Circle */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                
                {/* Animated Fill Circle */}
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="3"
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />

                {/* Left Eye */}
                <motion.circle 
                  cx="35" 
                  cy="40" 
                  r="3" 
                  fill="#10b981"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                />

                {/* Right Eye */}
                <motion.circle 
                  cx="65" 
                  cy="40" 
                  r="3" 
                  fill="#10b981"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                />

                {/* Smile Path */}
                <motion.path 
                  d="M 30 60 Q 50 80 70 60" 
                  stroke="#10b981" 
                  strokeWidth="3"
                  fill="none" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                />
              </svg>
            </motion.div>
          </div>

          {/* Thank You Message */}
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-5xl font-bold text-slate-800"
            >
              Thank You! 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-2xl text-slate-600"
            >
              Your order has been placed successfully!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6"
            >
              <p className="text-green-800 font-medium text-lg">
                {orderData?.message || 'Order placed successfully! Thank you for your purchase.'}
              </p>
            </motion.div>

            {/* Order Info */}
            {orderData?.orderId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="bg-slate-50 border border-slate-200 rounded-lg p-6 mt-6"
              >
                <p className="text-base text-slate-600 mb-2">Order ID</p>
                <p className="text-3xl font-bold text-slate-800">#{orderData.orderId}</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6"
            >
              <p className="text-blue-800 text-base">
                📧 A confirmation email has been sent to your registered email address with all the order details.
              </p>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <Link to="/order-history" className="flex-1">
              <button className="w-full bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-lg">
                <Package className="w-6 h-6" />
                View Orders
              </button>
            </Link>
            
            <Link to="/" className="flex-1">
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-lg">
                <Home className="w-6 h-6" />
                Homepage
              </button>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-8 pt-8 border-t border-slate-200"
          >
            <p className="text-base text-slate-500">
              Need help? Contact us at{' '}
              <a href="mailto:khanalpradip66@gmail.com" className="text-primary hover:underline font-semibold">
                khanalpradip66@gmail.com
              </a>
            </p>
          </motion.div>
        </div>

        {/* Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                y: -20, 
                x: Math.random() * window.innerWidth,
                opacity: 1,
                rotate: 0
              }}
              animate={{ 
                y: window.innerHeight + 20,
                rotate: 360
              }}
              transition={{
                duration: Math.random() * 2 + 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYou;
