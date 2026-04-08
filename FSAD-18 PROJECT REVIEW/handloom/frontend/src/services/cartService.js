import api from './api';
export const cartService = {
  getCart: () => api.get('/api/buyer/cart'),
  addToCart: (productId, quantity) => api.post('/api/buyer/cart/add', null, { params: { productId, quantity } }),
  updateCart: (productId, quantity) => api.put('/api/buyer/cart/update', null, { params: { productId, quantity } }),
  removeFromCart: (productId) => api.delete(`/api/buyer/cart/remove/${productId}`),
  clearCart: () => api.delete('/api/buyer/cart/clear'),
};
