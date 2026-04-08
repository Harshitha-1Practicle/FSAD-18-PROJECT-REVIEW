import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';
import Pagination from '../../components/common/Pagination';
import './Admin.css';

const STATUS_OPTIONS = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'];
const STATUS_BADGE = { PENDING:'badge-orange', CONFIRMED:'badge-blue', PROCESSING:'badge-blue', SHIPPED:'badge-blue', DELIVERED:'badge-green', CANCELLED:'badge-red' };

export default function AdminOrders() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => { loadOrders(); }, [page]);
  const loadOrders = () => { setLoading(true); orderService.getAllOrders(page, 10).then(r => setData(r.data.data)).finally(() => setLoading(false)); };

  const handleStatus = async (id, status) => {
    try { await orderService.updateOrderStatus(id, status); toast.success('Order status updated'); loadOrders(); } catch {}
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header"><h1 className="page-title">Order Management</h1><p className="page-subtitle">Track and update all orders</p></div>
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <>
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Order #</th><th>Buyer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Update Status</th></tr></thead>
                  <tbody>
                    {(data?.content||[]).map(o => (
                      <tr key={o.id}>
                        <td><strong>{o.orderNumber}</strong></td>
                        <td>{o.shippingFirstName} {o.shippingLastName}<br/><small style={{color:'var(--text-muted)'}}>{o.shippingCountry}</small></td>
                        <td>{o.orderItems?.length} item(s)</td>
                        <td><strong>₹{o.totalAmount?.toLocaleString('en-IN')}</strong></td>
                        <td><span className={`badge ${STATUS_BADGE[o.status]||'badge-gray'}`}>{o.status}</span></td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td>
                          <select className="form-select" style={{width:'auto',padding:'6px 10px',fontSize:'0.82rem'}} value={o.status} onChange={e => handleStatus(o.id, e.target.value)}>
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination page={page} totalPages={data?.totalPages||0} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
