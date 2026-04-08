import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';

import ArtisanDashboard from './pages/artisan/ArtisanDashboard';
import ArtisanProducts from './pages/artisan/ArtisanProducts';
import ArtisanAddProduct from './pages/artisan/ArtisanAddProduct';

import BuyerOrders from './pages/buyer/BuyerOrders';
import BuyerOrderDetail from './pages/buyer/BuyerOrderDetail';

import MarketingDashboard from './pages/marketing/MarketingDashboard';
import MarketingCampaigns from './pages/marketing/MarketingCampaigns';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<ProtectedRoute role="BUYER"><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute role="BUYER"><CheckoutPage /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><AdminOrders /></ProtectedRoute>} />

        <Route path="/artisan/dashboard" element={<ProtectedRoute role="ARTISAN"><ArtisanDashboard /></ProtectedRoute>} />
        <Route path="/artisan/products" element={<ProtectedRoute role="ARTISAN"><ArtisanProducts /></ProtectedRoute>} />
        <Route path="/artisan/products/add" element={<ProtectedRoute role="ARTISAN"><ArtisanAddProduct /></ProtectedRoute>} />

        <Route path="/buyer/orders" element={<ProtectedRoute role="BUYER"><BuyerOrders /></ProtectedRoute>} />
        <Route path="/buyer/orders/:id" element={<ProtectedRoute role="BUYER"><BuyerOrderDetail /></ProtectedRoute>} />

        <Route path="/marketing/dashboard" element={<ProtectedRoute role="MARKETING_SPECIALIST"><MarketingDashboard /></ProtectedRoute>} />
        <Route path="/marketing/campaigns" element={<ProtectedRoute role="MARKETING_SPECIALIST"><MarketingCampaigns /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif' } }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
