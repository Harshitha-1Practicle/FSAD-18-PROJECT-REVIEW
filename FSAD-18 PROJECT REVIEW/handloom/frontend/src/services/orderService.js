import api from './api';
export const orderService = {
  createOrder: (data) => api.post('/api/buyer/orders', data),
  getMyOrders: (page=0, size=10) => api.get('/api/buyer/orders', { params: { page, size } }),
  getOrderById: (id) => api.get(`/api/buyer/orders/${id}`),
  getAllOrders: (page=0, size=10) => api.get('/api/admin/orders', { params: { page, size } }),
  updateOrderStatus: (id, status) => api.patch(`/api/admin/orders/${id}/status`, null, { params: { status } }),
};
