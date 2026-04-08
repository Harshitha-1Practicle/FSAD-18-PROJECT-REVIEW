import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Pagination from '../../components/common/Pagination';
import './Artisan.css';

export default function ArtisanProducts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => { loadProducts(); }, [page]);
  const loadProducts = () => { setLoading(true); productService.getMyProducts(page, 10).then(r => setData(r.data.data)).finally(() => setLoading(false)); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await productService.deleteProduct(id); toast.success('Product deleted'); loadProducts(); } catch {}
  };

  return (
    <div className="artisan-page">
      <div className="container">
        <div className="page-header">
          <div><h1 className="page-title">My Products</h1><p className="page-subtitle">Manage your handloom listings</p></div>
          <Link to="/artisan/products/add" className="btn btn-primary"><PlusCircle size={16}/> Add Product</Link>
        </div>
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <>
            {(data?.content||[]).length === 0 ? (
              <div className="empty-state"><span>🎨</span><h3>No products yet</h3><p>Start listing your handloom creations!</p><Link to="/artisan/products/add" className="btn btn-primary">Add Your First Product</Link></div>
            ) : (
              <div className="product-table-grid">
                {(data?.content||[]).map(p => (
                  <div className="product-table-card" key={p.id}>
                    <img src={p.images?.[0]||`https://picsum.photos/seed/${p.id}/200/160`} alt={p.name} onError={e=>e.target.src=`https://picsum.photos/seed/${p.id+5}/200/160`}/>
                    <div className="ptc-info">
                      <h4>{p.name}</h4>
                      <p>{p.category?.replace('_',' ')} · {p.region||'India'}</p>
                      <strong>₹{p.price?.toLocaleString('en-IN')}</strong>
                      <div style={{display:'flex',gap:12,marginTop:8}}>
                        <span style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>Stock: {p.stockQuantity}</span>
                        <span style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>Sales: {p.salesCount}</span>
                      </div>
                    </div>
                    <div className="ptc-actions">
                      <span className={`badge ${p.status==='ACTIVE'?'badge-green':'badge-gray'}`}>{p.status}</span>
                      <button className="icon-btn danger" onClick={() => handleDelete(p.id)}><Trash2 size={15}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Pagination page={page} totalPages={data?.totalPages||0} onPageChange={setPage}/>
          </>
        )}
      </div>
    </div>
  );
}
