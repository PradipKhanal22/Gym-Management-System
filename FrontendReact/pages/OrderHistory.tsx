import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from '../components/Section';
import { Package, Calendar, CreditCard, MapPin, ChevronDown, Eye, X } from 'lucide-react';
import { orderAPI } from '../src/constant/api/orderAPI';
import { toast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: number;
  product_name: string;
  product_price: string;
  quantity: number;
  subtotal: string;
}

interface Order {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  created_at: string;
  orderItems?: OrderItem[];
  order_items?: OrderItem[];
}

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please login to view your order history');
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll();
      if (response.success) {
        setOrders(response.data || []);
      } else {
        toast.error(response.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      processing: 'bg-blue-100 text-blue-700 border-blue-300',
      shipped: 'bg-purple-100 text-purple-700 border-purple-300',
      delivered: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-orange-100 text-orange-700',
      paid: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[40vh] mt-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80" 
            alt="Order History" 
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
              <Package className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black uppercase text-white mb-4"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
          >
            Order History
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white font-medium"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}
          >
            Track your orders and view past purchases
          </motion.p>
        </div>
      </div>

      <Section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
                <p className="text-lg font-bold text-slate-600">Loading your orders...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto bg-white rounded-3xl p-12 shadow-lg border border-slate-200"
            >
              <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-8">
                <Package className="w-16 h-16 text-slate-400" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">No Orders Yet</h2>
              <p className="text-slate-600 text-lg mb-8">Start shopping to see your order history here!</p>
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-3 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-black hover:shadow-xl transition-all"
              >
                Browse Products
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900">Your Orders ({orders.length})</h2>
                <p className="text-slate-600 mt-1">View and track all your orders</p>
              </div>

              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl shadow-lg border-2 border-slate-200 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-4 border-b-2 border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900">Order #{order.id}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-600">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 ${getStatusColor(order.order_status)}`}>
                          {order.order_status}
                        </span>
                        <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-3">Delivery Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-slate-700 font-semibold">{order.address}</p>
                          </div>
                          <p className="text-sm text-slate-600 ml-6">{order.phone}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-3">Payment Details</h4>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-primary" />
                          <span className="font-bold text-slate-900">{order.payment_method}</span>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-slate-600">Items: {(order.orderItems || order.order_items || []).length}</p>
                          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500 mt-1">
                            Rs. {parseFloat(order.total).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-emerald-500 px-8 py-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Order Details</h2>
                    <p className="text-white/80 mt-1">Order #{selectedOrder.id}</p>
                  </div>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Order Status */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-200">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-2">Order Status</p>
                    <span className={`inline-block px-4 py-2 rounded-xl text-sm font-black uppercase border-2 ${getStatusColor(selectedOrder.order_status)}`}>
                      {selectedOrder.order_status}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-2">Payment Status</p>
                    <span className={`inline-block px-4 py-2 rounded-xl text-sm font-black uppercase ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-2">Order Date</p>
                    <p className="font-bold text-slate-900">
                      {new Date(selectedOrder.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Delivery Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Full Name</p>
                    <p className="font-bold text-slate-900">{selectedOrder.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Phone</p>
                    <p className="font-semibold text-slate-900">{selectedOrder.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-500 mb-1">Delivery Address</p>
                    <p className="font-semibold text-slate-900">{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {(selectedOrder.orderItems || selectedOrder.order_items || []).map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border-2 border-slate-200">
                      <div className="flex-1">
                        <p className="font-black text-slate-900 text-lg">{item.product_name}</p>
                        <p className="text-sm text-slate-600 mt-1">
                          Rs. {parseFloat(item.product_price).toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-xl font-black text-primary">
                        Rs. {parseFloat(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-primary/5 to-emerald-500/5 rounded-2xl p-6 border-2 border-primary/20">
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold">Rs. {parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">Shipping</span>
                    <span className="font-bold">
                      {parseFloat(selectedOrder.shipping) === 0 ? 'FREE' : `Rs. ${parseFloat(selectedOrder.shipping).toFixed(2)}`}
                    </span>
                  </div>
                  {parseFloat(selectedOrder.tax) > 0 && (
                    <div className="flex justify-between text-slate-700">
                      <span className="font-semibold">Tax</span>
                      <span className="font-bold">Rs. {parseFloat(selectedOrder.tax).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t-2 border-slate-300 flex justify-between items-center">
                    <span className="text-xl font-black text-slate-900">Total</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                      Rs. {parseFloat(selectedOrder.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-slate-600">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-semibold">Payment Method: {selectedOrder.payment_method}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default OrderHistory;
