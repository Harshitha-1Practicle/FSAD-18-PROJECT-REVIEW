import api from './api';
export const productService = {
  search: (params) => api.get('/api/products/public/search', { params }),
  getById: (id) => api.get(`/api/products/public/${id}`),
  getTopSelling: () => api.get('/api/products/public/top-selling'),
  getLatest: () => api.get('/api/products/public/latest'),
  createProduct: (data) => api.post('/api/artisan/products', data),
  getMyProducts: (page=0, size=10) => api.get('/api/artisan/products', { params: { page, size } }),
  updateProduct: (id, data) => api.put(`/api/artisan/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/artisan/products/${id}`),
  getReviews: (id) => api.get(`/api/products/public/${id}/reviews`),
  addReview: (id, data) => api.post(`/api/buyer/products/${id}/reviews`, data),
};
