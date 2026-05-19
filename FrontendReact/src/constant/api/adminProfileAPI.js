import { BASE_URL } from '../api';

const getAuthToken = () => {
  const user = localStorage.getItem('user');
  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user).token ?? null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

const getAuthHeaders = () => {
  const token = getAuthToken();

  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const adminProfileAPI = {
  getProfile: async () => {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return parseResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    return parseResponse(response);
  },

  updatePassword: async (passwordData) => {
    const response = await fetch(`${BASE_URL}/profile/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });

    return parseResponse(response);
  },
};