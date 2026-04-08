import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { Package, PlusCircle, TrendingUp, Star } from 'lucide-react';
import './Artisan.css';

export default function ArtisanDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { productService.getMyProducts(0, 100).then(r => setProducts(r.data.data?.content || [])).finally(() => setLoading(false)); }, []);

  const totalSales = products.reduce((sum, p) => sum + (p.salesCount || 0), 0);
  const avgRating = products.length ? (products.reduce((sum, p) => sum + (p.averageRating || 0), 0) / products.length).toFixed(1) : '0.0';
  const activeCount = products.filter(p => p.status === 'ACTIVE').length;

  return (
    <div className="artisan-page">
      <div className="container">
        <div className="page-header"><h1 className="page-title">Artisan Dashboard</h1><p className="page-subtitle">Manage your handloom products and track performance</p></div>
        <div className="grid-4" style={{marginBottom:32}}>
          {[['Total Products', products.length, <Package size={22}/>, '#e8671a'],
            ['Active Listings', activeCount, <TrendingUp size={22}/>, '#5a7a5e'],
            ['Total Sales', totalSales, <TrendingUp size={22}/>, '#2d3a5e'],
            ['Avg Rating', avgRating, <Star size={22}/>, '#d4a017']
          ].map(([label, value, icon, color]) => (
            <div className="stat-card" key={label}>
              <div className="stat-icon" style={{background:`${color}18`}}><span style={{color}}>{icon}</span></div>
              <div className="stat-value">{loading ? '…' : value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:16,marginBottom:32}}>
          <Link to="/artisan/products" className="btn btn-indigo"><Package size={16}/> My Products</Link>
          <Link to="/artisan/products/add" className="btn btn-primary"><PlusCircle size={16}/> Add New Product</Link>
        </div>
        {!loading && products.length > 0 && (
          <div className="card">
            <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)'}}><h3 style={{fontSize:'1rem',color:'var(--indigo)'}}>Recent Products</h3></div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Sales</th><th>Rating</th><th>Status</th></tr></thead>
                <tbody>
                  {products.slice(0,5).map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.category?.replace('_',' ')}</td>
                      <td>₹{p.price?.toLocaleString('en-IN')}</td>
                      <td>{p.stockQuantity}</td>
                      <td>{p.salesCount}</td>
                      <td>⭐ {p.averageRating?.toFixed(1)}</td>
                      <td><span className={`badge ${p.status==='ACTIVE'?'badge-green':'badge-gray'}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
