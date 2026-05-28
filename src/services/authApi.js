import axiosInstance from './axiosInstance.js';

export const authApi = {
  login: async (payload) => {
    const response = await axiosInstance.post('/auth/login', payload);

    return response.data.data;
  },

  register: async (payload) => {
    const response = await axiosInstance.post('/auth/register', payload);

    return response.data.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');

    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');

    return response.data.data;
  },

  forgotPassword: async (payload) => {
    const response = await axiosInstance.post('/auth/forgot-password', payload);

    return response.data;
  },

  resetPassword: async (token, payload) => {
    const response = await axiosInstance.post(`/auth/reset-password/${token}`, payload);

    return response.data;
  },
};
