import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { ArrowLeft, MapPin, Package, CreditCard } from 'lucide-react';
import './Buyer.css';

const STATUS_STEPS = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED'];
const STATUS_BADGE = { PENDING:'badge-orange',CONFIRMED:'badge-blue',PROCESSING:'badge-blue',SHIPPED:'badge-blue',DELIVERED:'badge-green',CANCELLED:'badge-red' };

export default function BuyerOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { orderService.getOrderById(id).then(r=>setOrder(r.data.data)).finally(()=>setLoading(false)); }, [id]);

  if (loading) return <div className="loading-center" style={{minHeight:'60vh'}}><div className="spinner"/></div>;
  if (!order) return <div className="container" style={{padding:60,textAlign:'center'}}><h2>Order not found</h2></div>;

  const stepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="buyer-page">
      <div className="container" style={{maxWidth:800}}>
        <button className="back-btn" onClick={()=>navigate(-1)}><ArrowLeft size={16}/> Back to Orders</button>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
          <h1 style={{fontSize:'1.5rem',color:'var(--indigo)'}}>{order.orderNumber}</h1>
          <span className={`badge ${STATUS_BADGE[order.status]||'badge-gray'}`} style={{padding:'6px 16px',fontSize:'0.88rem'}}>{order.status}</span>
        </div>

        {order.status !== 'CANCELLED' && (
          <div className="order-progress">
            {STATUS_STEPS.map((s,i) => (
              <div key={s} className={`progress-step ${i<=stepIdx?'active':''}`}>
                <div className="progress-dot">{i<=stepIdx?'✓':i+1}</div>
                <span>{s}</span>
                {i < STATUS_STEPS.length-1 && <div className={`progress-line ${i<stepIdx?'active':''}`}/>}
              </div>
            ))}
          </div>
        )}

        <div className="order-detail-grid">
          <div>
            <div className="detail-section"><h3><Package size={16}/> Items Ordered</h3>
              {order.orderItems?.map((item,i) => (
                <div className="order-detail-item" key={i}>
                  <img src={item.productImage||`https://picsum.photos/seed/${item.productId}/80/70`} alt={item.productName} onError={e=>e.target.src=`https://picsum.photos/seed/${i+20}/80/70`}/>
                  <div><p className="item-name">{item.productName}</p><p className="item-qty">Qty: {item.quantity} × ₹{item.unitPrice?.toLocaleString('en-IN')}</p></div>
                  <strong style={{marginLeft:'auto'}}>₹{item.totalPrice?.toLocaleString('en-IN')}</strong>
                </div>
              ))}
            </div>
            <div className="detail-section"><h3><MapPin size={16}/> Shipping Address</h3>
              <p>{order.shippingAddress}, {order.shippingCity}</p>
              <p>{order.shippingCountry}</p>
              {order.trackingNumber && <p style={{marginTop:8}}>📦 Tracking: <strong>{order.trackingNumber}</strong></p>}
            </div>
          </div>
          <div className="detail-section">
            <h3><CreditCard size={16}/> Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Shipping</span><span>₹{order.shippingCost?.toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Tax</span><span>₹{order.taxAmount?.toLocaleString('en-IN')}</span></div>
            <div className="summary-total"><span>Total</span><span>₹{order.totalAmount?.toLocaleString('en-IN')}</span></div>
            <p style={{fontSize:'0.8rem',color:'var(--text-muted)',marginTop:12}}>Payment: {order.paymentStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
