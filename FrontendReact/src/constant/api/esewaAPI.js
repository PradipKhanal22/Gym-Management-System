import { BASE_URL } from '../api';

const getAuthToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const esewaAPI = {
  payOrder: async (orderId, amount) => {
    try {
      const response = await fetch(`${BASE_URL}/esewa/pay-order`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ order_id: orderId, amount }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error initiating eSewa payment:', error);
      return { success: false, message: 'Failed to initiate eSewa payment' };
    }
  },
};

export const redirectToEsewa = (url, params) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;

  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
