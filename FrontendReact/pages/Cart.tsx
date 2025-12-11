import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from '../components/Section';
import Button from '../components/Button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCart, updateCartItemQuantity, removeFromCart, CartItem } from '../src/constant/cartUtils';
import { toast } from '../components/Toast';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    // Load cart from backend
    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const loadCart = async () => {
    const cart = await getCart();
    setCartItems(cart);
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    await updateCartItemQuantity(id, newQuantity);
    loadCart();
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await removeFromCart(itemToDelete);
      toast.success('Item removed from cart');
      loadCart();
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
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
                        src={item.product.photo_path ? `http://localhost:8000/storage/${item.product.photo_path}` : 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop'} 
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-primary/90 text-white text-xs font-bold rounded-full">
                          {item.product.category?.name || 'Product'}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">
                        {item.product.name}
                      </h3>
                      <p className="text-2xl font-black text-primary mb-4">
                        ${parseFloat(item.product.price).toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-primary hover:text-white transition-all flex items-center justify-center font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-black text-lg text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-primary hover:text-white transition-all flex items-center justify-center font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {item.quantity >= item.product.stock && (
                        <p className="text-xs text-red-500 mt-1">Maximum stock reached</p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleDeleteClick(item.id)}
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

      {/* Delete Confirmation Modal */}
      {itemToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-slate-200"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Remove Item?</h3>
              <p className="text-slate-600">
                Are you sure you want to remove this item from your cart?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold transition-all shadow-lg shadow-red-500/30"
              >
                Remove
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Cart;
