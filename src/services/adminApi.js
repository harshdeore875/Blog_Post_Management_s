import axiosInstance from './axiosInstance.js';

export const adminApi = {
  getUsers: async () => {
    const response = await axiosInstance.get('/admin/users');

    return response.data.data || [];
  },

  getBlogs: async () => {
    const response = await axiosInstance.get('/admin/blogs');

    return response.data.data || [];
  },

  updateUserRole: async (id, role) => {
    const response = await axiosInstance.put(`/admin/users/${id}/role`, { role });

    return response.data.data;
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/admin/users/${id}`);

    return response.data;
  },

  deleteBlog: async (id) => {
    const response = await axiosInstance.delete(`/admin/blogs/${id}`);

    return response.data;
  },
};
