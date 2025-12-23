import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar';
import { orderAPI } from '../../../src/constant/api/orderAPI';
import { toast } from '../../../components/Toast';
import { Package, Eye, Search, Filter, ChevronDown, User, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

interface OrderItem {
  id: number;
  product_name: string;
  product_price: string;
  quantity: number;
  subtotal: string;
}

interface Order {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
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
  orderItems: OrderItem[];
}

const Order: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders();
      console.log('Orders API Response:', response);
      if (response.success) {
        console.log('Orders data:', response.data);
        if (response.data.length > 0) {
          console.log('First order structure:', response.data[0]);
          console.log('First order items:', response.data[0].orderItems || response.data[0].order_items);
        }
        setOrders(response.data);
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

  const handleUpdateStatus = async (orderId: number, newStatus: string, newPaymentStatus?: string) => {
    try {
      setUpdatingStatus(true);
      const statusData: any = {
        order_status: newStatus
      };
      
      if (newPaymentStatus) {
        statusData.payment_status = newPaymentStatus;
      }

      const response = await orderAPI.updateStatus(orderId, statusData);
      
      if (response.success) {
        toast.success('Order status updated successfully');
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(response.data);
        }
      } else {
        toast.error(response.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
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
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-orange-100 text-orange-700',
      paid: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Orders</h1>
                  <p className="text-slate-600 mt-1">Manage customer orders</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold">
                  {filteredOrders.length} Orders
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-12 pr-10 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg font-bold text-slate-600">Loading orders...</div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 text-center">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl font-bold text-slate-900 mb-2">No orders found</p>
              <p className="text-slate-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Orders will appear here once customers start placing them'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-black text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="text-base font-black text-slate-900">#{order.id}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-900">{order.full_name}</p>
                            <p className="text-sm text-slate-600">{order.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-slate-900 font-semibold">{order.phone}</p>
                            <p className="text-xs text-slate-600 line-clamp-1">{order.address}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                            {(order.orderItems || order.order_items)?.length || 0} item(s)
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-base font-black text-primary">Rs. {parseFloat(order.total).toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${getPaymentStatusColor(order.payment_status)}`}>
                              {order.payment_status}
                            </span>
                            <p className="text-xs text-slate-600 mt-1">{order.payment_method}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${getStatusColor(order.order_status)}`}>
                            {order.order_status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-900 font-semibold">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-slate-600">
                            {new Date(order.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Order Details</h2>
                  <p className="text-slate-600 mt-1">Order #{selectedOrder.id}</p>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
                >
                  <span className="text-xl font-bold text-slate-600">×</span>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Customer Info */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-black text-slate-900 mb-4">Customer Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Full Name</p>
                    <p className="font-bold text-slate-900">{selectedOrder.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Email</p>
                    <p className="font-semibold text-slate-900">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Phone</p>
                    <p className="font-semibold text-slate-900">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Payment Method</p>
                    <p className="font-bold text-slate-900">{selectedOrder.payment_method}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-500 mb-1">Delivery Address</p>
                    <p className="font-semibold text-slate-900">{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {(selectedOrder.orderItems || selectedOrder.order_items || []).map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{item.product_name}</p>
                        <p className="text-sm text-slate-600">
                          Rs. {parseFloat(item.product_price).toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-lg font-black text-primary">
                        Rs. {parseFloat(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-black text-slate-900 mb-4">Order Summary</h3>
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
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">Tax</span>
                    <span className="font-bold">Rs. {parseFloat(selectedOrder.tax).toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-center">
                    <span className="text-xl font-black text-slate-900">Total</span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                      Rs. {parseFloat(selectedOrder.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-black text-slate-900 mb-4">Update Order Status</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Order Status</label>
                    <select
                      value={selectedOrder.order_status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                      disabled={updatingStatus}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Payment Status</label>
                    <select
                      value={selectedOrder.payment_status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, selectedOrder.order_status, e.target.value)}
                      disabled={updatingStatus}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none font-semibold text-slate-900 transition-all disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Date */}
              <div className="text-center text-sm text-slate-500">
                Order placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Order;
