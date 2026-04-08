import api from './api';
export const adminService = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getUsers: (page=0, size=10) => api.get('/api/admin/users', { params: { page, size } }),
  updateUserStatus: (id, active) => api.patch(`/api/admin/users/${id}/status`, null, { params: { active } }),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
};
