import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Helper function to get auth token
const getAuthToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.token;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const contactAPI = {
  // Send contact message (requires authentication)
  sendMessage: async (messageData) => {
    try {
      const response = await axios.post(
        `${API_URL}/contact-messages`,
        messageData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error.response?.data || { success: false, message: 'Failed to send message' };
    }
  },

  // Get all messages (Admin only)
  getAll: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/contact-messages`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch messages' };
    }
  },

  // Get single message by ID
  getById: async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/contact-messages/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch message' };
    }
  },

  // Mark message as read
  markAsRead: async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/contact-messages/${id}/read`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error.response?.data || { success: false, message: 'Failed to mark message as read' };
    }
  },

  // Delete message
  delete: async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/contact-messages/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error.response?.data || { success: false, message: 'Failed to delete message' };
    }
  }
};
