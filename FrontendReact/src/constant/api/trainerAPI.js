import { BASE_URL } from '../api';

// Trainer API Endpoints
export const trainerAPI = {
  // Get all trainers
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/trainers`);
    return response.json();
  },

  // Get single trainer by ID
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/trainers/${id}`);
    return response.json();
  },

  // Create new trainer
  create: async (formData) => {
    const response = await fetch(`${BASE_URL}/trainers`, {
      method: 'POST',
      body: formData, // FormData for file upload
    });
    return response.json();
  },

  // Update trainer
  update: async (id, formData) => {
    const response = await fetch(`${BASE_URL}/trainers/${id}`, {
      method: 'POST', // Using POST with _method field for Laravel
      body: formData,
    });
    return response.json();
  },

  // Delete trainer
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/trainers/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
