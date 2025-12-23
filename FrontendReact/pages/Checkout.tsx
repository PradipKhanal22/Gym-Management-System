import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from '../components/Section';
import { CreditCard, Lock, User, Mail, Phone, MapPin, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, CartItem } from '../src/constant/cartUtils';
import { orderAPI } from '../src/constant/api/orderAPI';
import { toast } from '../components/Toast';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Esewa'>('COD');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const cart = await getCart();
    setCartItems(cart);
    setLoading(false);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.product.price.toString()) * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (paymentMethod === 'Esewa') {
      toast.error('Esewa payment integration coming soon!');
      return;
    }

    // Handle Cash on Delivery
    setSubmitting(true);
    try {
      const orderData = {
        full_name: formData.firstName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        payment_method: paymentMethod,
        subtotal: subtotal,
        shipping: shipping,
        tax: 0,
        total: total,
        notes: ''
      };

      const response = await orderAPI.create(orderData);

      if (response.success) {
        toast.success('Order placed successfully! Thank you for your purchase.');
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: ''
        });
        // Redirect to orders page or home after a delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error(response.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error('An error occurred while placing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[40vh] mt-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80" 
            alt="Checkout" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-primary/40 to-slate-900/80"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mx-auto shadow-2xl">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black uppercase text-white mb-4"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
          >
            Secure Checkout 
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white font-medium flex items-center justify-center gap-2"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
          >
             Secure Payment
          </motion.p>
        </div>
      </div>

      {loading ? (
        <Section className="bg-gradient-to-b from-slate-50 to-white py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-slate-600 font-semibold">Loading checkout...</p>
          </div>
        </Section>
      ) : cartItems.length === 0 ? (
        <Section className="bg-gradient-to-b from-slate-50 to-white py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-16 h-16 text-slate-400" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">Your Cart is Empty</h2>
            <p className="text-slate-600 text-lg mb-8">Add some products to your cart before checking out!</p>
            <Link to="/products">
              <button className="bg-gradient-to-r from-primary to-emerald-500 text-white px-8 py-3 rounded-xl font-black hover:shadow-xl transition-all">
                Shop Now
              </button>
            </Link>
          </motion.div>
        </Section>
      ) : (
        <Section className="bg-gradient-to-b from-slate-50 to-white py-16">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Contact Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                      Delivery Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all"
                        placeholder="Street Address, City, Province"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  {/* COD Option */}
                  <label className={`flex items-center gap-4 p-5 bg-slate-50 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'COD' | 'Esewa')}
                      className="w-5 h-5 text-primary focus:ring-0 focus:ring-offset-0"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                        <span className="text-2xl">💵</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Cash on Delivery</p>
                        <p className="text-sm text-slate-600">Pay when you receive your order</p>
                      </div>
                    </div>
                  </label>

                  {/* Esewa Option */}
                  <label className={`flex items-center gap-4 p-5 bg-slate-50 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'Esewa' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Esewa"
                      checked={paymentMethod === 'Esewa'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'COD' | 'Esewa')}
                      className="w-5 h-5 text-primary focus:ring-0 focus:ring-offset-0"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-1 border border-slate-200">
                        <img 
                          src="https://imgs.search.brave.com/6lBdIxLIAaXa5rt-ETSYtq8wPWRLeIWHwTBMsvPYsx0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/YnJhbmRmZXRjaC5p/by9pZERWdUhaM09L/L3cvNDAwL2gvNDAw/L3RoZW1lL2Rhcmsv/aWNvbi5qcGVnP2M9/MWJ4aWQ2NE11cDdh/Y3pld1NBWU1YJnQ9/MTc1MTM1MTM1ODAz/OQ" 
                          alt="Esewa" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Esewa</p>
                        <p className="text-sm text-slate-600">Pay securely with Esewa digital wallet</p>
                      </div>
                    </div>
                  </label>
                </div>
              </motion.div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`bg-gradient-to-r from-primary to-emerald-500 text-white px-12 py-4 rounded-xl font-black text-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 w-full max-w-md ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    'Submit Order'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 sticky top-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Order Summary</h2>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6 pb-6 border-b-2 border-slate-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md shrink-0">
                      <img 
                        src={item.product.photo_path ? `http://localhost:8000/storage/${item.product.photo_path}` : 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=200&h=200&fit=crop'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black text-slate-900 text-sm mb-1">{item.product.name}</h4>
                      <p className="text-primary font-black">Rs. {(parseFloat(item.product.price.toString()) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>Subtotal</span>
                  <span className="text-slate-900">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>Shipping</span>
                  <span className="text-slate-900">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-slate-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-slate-900">Total</span>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                    Rs. {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3">
                {[
                  { icon: <Lock />, text: 'Secure SSL Encryption' },
                  { icon: <CheckCircle2 />, text: 'Money-Back Guarantee' },
                  { icon: <ShoppingBag />, text: 'Free Returns' }
                ].map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {React.cloneElement(badge.icon as React.ReactElement, { className: 'w-4 h-4' })}
                    </div>
                    <span className="text-sm font-semibold">{badge.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        </Section>
      )}
    </>
  );
};

export default Checkout;
