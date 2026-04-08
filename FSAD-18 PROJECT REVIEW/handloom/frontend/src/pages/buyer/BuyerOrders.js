import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import Pagination from '../../components/common/Pagination';
import { Package } from 'lucide-react';
import './Buyer.css';

const STATUS_BADGE = { PENDING:'badge-orange',CONFIRMED:'badge-blue',PROCESSING:'badge-blue',SHIPPED:'badge-blue',DELIVERED:'badge-green',CANCELLED:'badge-red',REFUNDED:'badge-gray' };

export default function BuyerOrders() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => { setLoading(true); orderService.getMyOrders(page,10).then(r => setData(r.data.data)).finally(()=>setLoading(false)); }, [page]);

  return (
    <div className="buyer-page">
      <div className="container">
        <div className="page-header"><h1 className="page-title">My Orders</h1><p className="page-subtitle">Track your handloom purchases</p></div>
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <>
            {(data?.content||[]).length === 0 ? (
              <div className="empty-state"><Package size={64} color="var(--text-muted)"/><h3>No orders yet</h3><p>Your order history will appear here.</p><Link to="/products" className="btn btn-primary">Start Shopping</Link></div>
            ) : (
              <div className="orders-list">
                {(data?.content||[]).map(o => (
                  <Link to={`/buyer/orders/${o.id}`} key={o.id} className="order-card">
                    <div className="order-card-header">
                      <div><span className="order-num">{o.orderNumber}</span><span className={`badge ${STATUS_BADGE[o.status]||'badge-gray'}`} style={{marginLeft:12}}>{o.status}</span></div>
                      <span className="order-date">{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                    </div>
                    <div className="order-items-preview">
                      {o.orderItems?.slice(0,3).map((item,i) => (
                        <div key={i} className="order-item-chip">
                          <img src={item.productImage||`https://picsum.photos/seed/${item.productId}/40/36`} alt={item.productName} onError={e=>e.target.src=`https://picsum.photos/seed/${i+10}/40/36`}/>
                          <span>{item.productName} ×{item.quantity}</span>
                        </div>
                      ))}
                      {o.orderItems?.length > 3 && <span style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>+{o.orderItems.length-3} more</span>}
                    </div>
                    <div className="order-card-footer">
                      <span style={{fontSize:'0.85rem',color:'var(--text-muted)'}}>{o.orderItems?.length} item(s)</span>
                      <strong style={{color:'var(--saffron)',fontSize:'1.05rem'}}>₹{o.totalAmount?.toLocaleString('en-IN')}</strong>
                    </div>
                  </Link>
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
