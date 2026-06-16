// Cart utility functions for managing cart state with backend integration
import { cartAPI } from './api/cartAPI';

// Fetch cart from backend
export const getCart = async () => {
  try {
    const response = await cartAPI.getAll();
    if (response.success) {
      return response.data || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
};

// Add product to cart (backend)
export const addToCart = async (product) => {
  try {
    const response = await cartAPI.add(product.id, 1);
    if (response.success) {
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    if (quantity <= 0) {
      await cartAPI.remove(cartItemId);
    } else {
      await cartAPI.update(cartItemId, quantity);
    }
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  } catch (error) {
    console.error('Error updating cart:', error);
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    await cartAPI.remove(cartItemId);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};

// Clear entire cart
export const clearCart = async () => {
  try {
    await cartAPI.clear();
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

// Get cart total
export const getCartTotal = (cart) => {
  return cart.reduce((total, item) => total + (parseFloat(item.product.price.toString()) * item.quantity), 0);
};

// Get cart item count
export const getCartItemCount = (cart) => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};
