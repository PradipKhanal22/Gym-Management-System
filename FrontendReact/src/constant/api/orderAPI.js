import { BASE_URL } from '../api';

// Helper to get auth token
const getAuthToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const orderAPI = {
  // Get all orders for authenticated user
  getAll: async () => {
    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { success: false, message: 'Failed to fetch orders' };
    }
  },

  // Get single order by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/orders/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      return { success: false, message: 'Failed to fetch order' };
    }
  },

  // Create new order
  create: async (orderData) => {
    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, message: 'Failed to create order' };
    }
  },

  // Cancel order
  cancel: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/orders/${id}/cancel`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error cancelling order:', error);
      return { success: false, message: 'Failed to cancel order' };
    }
  },

  // Admin: Get all orders
  getAllOrders: async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/orders`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return { success: false, message: 'Failed to fetch all orders' };
    }
  },

  // Admin: Update order status
  updateStatus: async (id, statusData) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(statusData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, message: 'Failed to update order status' };
    }
  },
};
