const BASE_URL = 'http://localhost:8000/api';

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

export const cartAPI = {
  // Get all cart items for authenticated user
  getAll: async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching cart:', error);
      return { success: false, message: 'Failed to fetch cart' };
    }
  },

  // Add item to cart
  add: async (productId, quantity = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Failed to add to cart' };
    }
  },

  // Update cart item quantity
  update: async (cartItemId, quantity) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating cart:', error);
      return { success: false, message: 'Failed to update cart' };
    }
  },

  // Remove item from cart
  remove: async (cartItemId) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, message: 'Failed to remove from cart' };
    }
  },

  // Clear entire cart
  clear: async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart-clear`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: 'Failed to clear cart' };
    }
  },
};
