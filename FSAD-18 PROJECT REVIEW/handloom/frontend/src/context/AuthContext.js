import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem('handloom_user');
    if (stored) { const u = JSON.parse(stored); setUser(u); api.defaults.headers.common['Authorization'] = `Bearer ${u.token}`; }
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const userData = res.data.data;
    setUser(userData); localStorage.setItem('handloom_user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    return userData;
  };
  const register = async (data) => {
    const res = await api.post('/api/auth/register', data);
    const userData = res.data.data;
    setUser(userData); localStorage.setItem('handloom_user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    return userData;
  };
  const logout = () => {
    setUser(null); localStorage.removeItem('handloom_user');
    delete api.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };
  const isRole = (role) => user?.role === role;
  return <AuthContext.Provider value={{ user, login, register, logout, loading, isRole }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
