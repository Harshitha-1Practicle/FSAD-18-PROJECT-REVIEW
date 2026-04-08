import axios from 'axios';
import toast from 'react-hot-toast';
const api = axios.create({ baseURL: '' });
api.interceptors.response.use(res => res, err => {
  const msg = err.response?.data?.message || 'Something went wrong';
  if (err.response?.status === 401) { localStorage.removeItem('handloom_user'); window.location.href = '/login'; }
  toast.error(msg); return Promise.reject(err);
});
export default api;
