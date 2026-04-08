import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Users, Package, ShoppingCart, TrendingUp, Megaphone, UserCheck } from 'lucide-react';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminService.getDashboard().then(r => setStats(r.data.data)).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="loading-center" style={{minHeight:'60vh'}}><div className="spinner"/></div>;

  const cards = [
    { label:'Total Users', value: stats?.totalUsers, icon:<Users size={22}/>, color:'#3d4f7c', sub:`${stats?.totalArtisans} artisans · ${stats?.totalBuyers} buyers` },
    { label:'Total Products', value: stats?.totalProducts, icon:<Package size={22}/>, color:'#e8671a', sub:`${stats?.activeProducts} active` },
    { label:'Total Orders', value: stats?.totalOrders, icon:<ShoppingCart size={22}/>, color:'#5a7a5e', sub:`${stats?.pendingOrders} pending` },
    { label:'Total Revenue', value: `₹${(stats?.totalRevenue||0).toLocaleString('en-IN')}`, icon:<TrendingUp size={22}/>, color:'#d4a017', sub:'All time' },
    { label:'Campaigns', value: stats?.totalCampaigns, icon:<Megaphone size={22}/>, color:'#8b5e3c', sub:`${stats?.activeCampaigns} active` },
    { label:'Verified Artisans', value: stats?.totalArtisans, icon:<UserCheck size={22}/>, color:'#2d3a5e', sub:'Platform artisans' },
  ];

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Platform overview and management</p>
        </div>
        <div className="grid-3" style={{marginBottom:32}}>
          {cards.map(c => (
            <div className="stat-card" key={c.label}>
              <div className="stat-icon" style={{background:`${c.color}18`}}><span style={{color:c.color}}>{c.icon}</span></div>
              <div className="stat-value">{c.value ?? '—'}</div>
              <div className="stat-label">{c.label}</div>
              <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginTop:4}}>{c.sub}</p>
            </div>
          ))}
        </div>
        <div className="grid-3">
          <Link to="/admin/users" className="admin-quick-card">
            <Users size={28}/>
            <h3>Manage Users</h3>
            <p>View, activate or deactivate user accounts</p>
          </Link>
          <Link to="/admin/orders" className="admin-quick-card">
            <ShoppingCart size={28}/>
            <h3>Manage Orders</h3>
            <p>Track and update order statuses</p>
          </Link>
          <Link to="/products" className="admin-quick-card">
            <Package size={28}/>
            <h3>Browse Products</h3>
            <p>View all products on the platform</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
