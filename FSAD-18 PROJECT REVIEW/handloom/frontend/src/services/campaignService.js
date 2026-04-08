import api from './api';
export const campaignService = {
  getActiveCampaigns: () => api.get('/api/campaigns/public/active'),
  getMyCampaigns: (page=0, size=10) => api.get('/api/marketing/campaigns', { params: { page, size } }),
  createCampaign: (data) => api.post('/api/marketing/campaigns', data),
  updateCampaign: (id, data) => api.put(`/api/marketing/campaigns/${id}`, data),
  updateStatus: (id, status) => api.patch(`/api/marketing/campaigns/${id}/status`, null, { params: { status } }),
  deleteCampaign: (id) => api.delete(`/api/marketing/campaigns/${id}`),
};
