import { BASE_URL } from '../api';

// Service API Endpoints
export const serviceAPI = {
  // Get all services
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/services`);
    return response.json();
  },

  // Get single service by ID
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/services/${id}`);
    return response.json();
  },

  // Create new service
  create: async (formData) => {
    const response = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      body: formData, // FormData for file upload
    });
    return response.json();
  },

  // Update service
  update: async (id, formData) => {
    const response = await fetch(`${BASE_URL}/services/${id}`, {
      method: 'POST', // Using POST with _method field for Laravel
      body: formData,
    });
    return response.json();
  },

  // Delete service
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/services/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
