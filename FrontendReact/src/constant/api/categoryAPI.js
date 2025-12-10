import { BASE_URL } from '../api';

// Category API Endpoints
export const categoryAPI = {
  // Get all categories
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/categories`);
    return response.json();
  },

  // Get single category by ID
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/categories/${id}`);
    return response.json();
  },

  // Create new category
  create: async (data) => {
    const response = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Update category
  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete category
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
