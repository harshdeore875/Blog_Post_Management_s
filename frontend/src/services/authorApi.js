import axiosInstance from './axiosInstance.js';

export const authorApi = {
  getBlogs: async () => {
    const response = await axiosInstance.get('/author/blogs');

    return response.data.data || [];
  },

  getDashboard: async () => {
    const response = await axiosInstance.get('/author/dashboard');

    return response.data.data;
  },
};
