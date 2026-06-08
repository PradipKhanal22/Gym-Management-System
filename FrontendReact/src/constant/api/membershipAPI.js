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

export const membershipAPI = {
  // Get all memberships (Admin only)
  getAll: async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/memberships`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching memberships:', error);
      return { success: false, message: 'Failed to fetch memberships' };
    }
  },
};
