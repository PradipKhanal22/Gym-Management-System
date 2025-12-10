import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Section from '../components/Section';
import Button from '../components/Button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Premium Whey Protein',
      price: 49.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
      category: 'Supplements'
    },
    {
      id: 2,
      name: 'Resistance Bands Set',
      price: 29.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop',
      category: 'Equipment'
    },
    {
      id: 3,
      name: 'Gym Duffle Bag',
      price: 39.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      category: 'Accessories'
    }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[50vh] mt-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80" 
            alt="Shopping Cart" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-primary/30 to-slate-900/70"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mx-auto shadow-2xl">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black uppercase text-white mb-4"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
          >
            Shopping Cart
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white font-medium"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
          >
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready for checkout
          </motion.p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart */
        <Section className="bg-white py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-16 h-16 text-slate-400" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">Your Cart is Empty</h2>
            <p className="text-slate-600 text-lg mb-8">Start adding products to fuel your fitness journey!</p>
            <Link to="/products">
              <Button size="lg" className="bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg">
                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </Section>
      ) : (
        <Section className="bg-gradient-to-b from-slate-50 to-white py-16">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">Your Items</span>
              </div>
              
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200 group"
                >
                  <div className="flex gap-6 items-center">
                    {/* Image */}
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 shadow-md">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-primary/90 text-white text-xs font-bold rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-2xl font-black text-primary mb-4">
                        ${item.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-primary hover:text-white transition-all flex items-center justify-center font-bold shadow-sm"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-black text-lg text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-primary hover:text-white transition-all flex items-center justify-center font-bold shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-12 h-12 rounded-xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 sticky top-24"
              >
                <div className="inline-block mb-6">
                  <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">Order Summary</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600 font-semibold">
                    <span>Subtotal</span>
                    <span className="text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-semibold">
                    <span>Shipping</span>
                    <span className="text-slate-900">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal < 100 && (
                    <p className="text-xs text-slate-500 italic">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                </div>

                <div className="border-t-2 border-slate-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-slate-900">Total</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full justify-center bg-gradient-to-r from-primary to-emerald-500 text-white hover:from-primary/90 hover:to-emerald-500/90 shadow-xl mb-4"
                >
                  <Link to="/checkout" className="flex items-center justify-center w-full">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>

                <Link to="/products">
                  <button className="w-full text-center text-slate-600 hover:text-primary font-bold py-3 transition-colors">
                    Continue Shopping
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </Section>
      )}

      {/* Recommended Products */}
      <Section className="bg-white py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">You May Also Like</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Recommended <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Products</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Pre-Workout Energy',
                price: 34.99,
                image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=400&fit=crop'
              },
              {
                name: 'Yoga Mat Pro',
                price: 44.99,
                image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop'
              },
              {
                name: 'Shaker Bottle',
                price: 14.99,
                image: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&h=400&fit=crop'
              }
            ].map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-slate-200 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-black text-primary mb-5">${product.price}</p>
                  <Button className="w-full justify-center bg-gradient-to-r from-primary to-emerald-500 text-white hover:from-primary/90 hover:to-emerald-500/90 shadow-lg">
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

export default Cart;
