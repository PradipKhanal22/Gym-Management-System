import { BASE_URL } from '../api';

// Product API Endpoints
export const productAPI = {
  // Get all products
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/products`);
    return response.json();
  },

  // Get single product by ID
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    return response.json();
  },

  // Create new product
  create: async (formData) => {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      body: formData, // FormData for file upload
    });
    return response.json();
  },

  // Update product
  update: async (id, formData) => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'POST', // Using POST with _method field for Laravel
      body: formData,
    });
    return response.json();
  },

  // Delete product
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
