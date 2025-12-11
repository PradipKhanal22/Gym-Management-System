// Cart utility functions for managing cart state with backend integration
import { cartAPI } from './api/cartAPI';

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    photo_path: string;
    stock: number;
    category: {
      id: number;
      name: string;
    };
  };
}

// Fetch cart from backend
export const getCart = async (): Promise<CartItem[]> => {
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
export const addToCart = async (product: any): Promise<boolean> => {
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
export const updateCartItemQuantity = async (cartItemId: number, quantity: number): Promise<void> => {
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
export const removeFromCart = async (cartItemId: number): Promise<void> => {
  try {
    await cartAPI.remove(cartItemId);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};

// Clear entire cart
export const clearCart = async (): Promise<void> => {
  try {
    await cartAPI.clear();
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

// Get cart total
export const getCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + (parseFloat(item.product.price.toString()) * item.quantity), 0);
};

// Get cart item count
export const getCartItemCount = (cart: CartItem[]): number => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};

