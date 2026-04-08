import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const navigate = useNavigate();
  const [form, setForm] = useState({ shippingFirstName:'',shippingLastName:'',shippingAddress:'',shippingCity:'',shippingState:'',shippingCountry:'India',shippingZipCode:'',shippingPhone:'',paymentMethod:'CARD',notes:'' });

  useEffect(() => { cartService.getCart().then(r => setCart(r.data.data)).finally(() => setLoading(false)); }, []);

  const subtotal = cart?.cartItems?.reduce((sum, i) => sum + (i.product?.price * i.quantity), 0) || 0;
  const shipping = subtotal >= 10000 ? 0 : 830;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart?.cartItems?.length) { toast.error('Cart is empty'); return; }
    setSubmitting(true);
    try {
      const items = cart.cartItems.map(i => ({ productId: i.product.id, quantity: i.quantity }));
      const res = await orderService.createOrder({ ...form, items });
      setOrderNum(res.data.data.orderNumber);
      await cartService.clearCart();
      setSuccess(true);
    } catch {} finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading-center" style={{minHeight:'60vh'}}><div className="spinner"/></div>;

  if (success) return (
    <div className="checkout-success">
      <CheckCircle size={64} color="var(--sage)" />
      <h2>Order Placed Successfully!</h2>
      <p>Your order <strong>{orderNum}</strong> has been confirmed. We'll notify you with shipping updates.</p>
      <div style={{display:'flex',gap:12,justifyContent:'center'}}>
        <button className="btn btn-primary" onClick={() => navigate('/buyer/orders')}>Track Orders</button>
        <button className="btn btn-outline" onClick={() => navigate('/products')}>Continue Shopping</button>
      </div>
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title" style={{marginBottom:32}}>Checkout</h1>
        <div className="checkout-layout">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-section">
              <h3>Shipping Address</h3>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">First Name *</label><input className="form-input" value={form.shippingFirstName} onChange={e=>setForm({...form,shippingFirstName:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Last Name *</label><input className="form-input" value={form.shippingLastName} onChange={e=>setForm({...form,shippingLastName:e.target.value})} required /></div>
              </div>
              <div className="form-group"><label className="form-label">Address *</label><input className="form-input" value={form.shippingAddress} onChange={e=>setForm({...form,shippingAddress:e.target.value})} required /></div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">City *</label><input className="form-input" value={form.shippingCity} onChange={e=>setForm({...form,shippingCity:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">State *</label><input className="form-input" value={form.shippingState} onChange={e=>setForm({...form,shippingState:e.target.value})} required /></div>
              </div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Country *</label><input className="form-input" value={form.shippingCountry} onChange={e=>setForm({...form,shippingCountry:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">ZIP Code *</label><input className="form-input" value={form.shippingZipCode} onChange={e=>setForm({...form,shippingZipCode:e.target.value})} required /></div>
              </div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.shippingPhone} onChange={e=>setForm({...form,shippingPhone:e.target.value})} /></div>
            </div>
            <div className="checkout-section">
              <h3>Payment Method</h3>
              {['CARD','UPI','NET_BANKING','CASH_ON_DELIVERY'].map(m => (
                <label key={m} className={`payment-option ${form.paymentMethod===m?'selected':''}`}>
                  <input type="radio" name="payment" value={m} checked={form.paymentMethod===m} onChange={() => setForm({...form,paymentMethod:m})} />
                  {{CARD:'💳 Credit / Debit Card',UPI:'📱 UPI Payment',NET_BANKING:'🏦 Net Banking',CASH_ON_DELIVERY:'💵 Cash on Delivery'}[m]}
                </label>
              ))}
            </div>
            <div className="checkout-section">
              <h3>Special Instructions</h3>
              <textarea className="form-input" rows={3} placeholder="Any special requests for packaging or delivery…" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
            </div>
            <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'15px',fontSize:'1rem'}} type="submit" disabled={submitting}>
              {submitting ? <div className="spinner" style={{width:20,height:20,borderWidth:2}}/> : `Place Order · ₹${total.toLocaleString('en-IN',{maximumFractionDigits:0})}`}
            </button>
          </form>

          <div className="order-summary">
            <h3>Order Summary</h3>
            {cart?.cartItems?.map(item => (
              <div className="summary-item" key={item.id}>
                <img src={item.product?.images?.[0]||`https://picsum.photos/seed/${item.product?.id}/80/70`} alt={item.product?.name} onError={e=>e.target.src=`https://picsum.photos/seed/${item.id}/80/70`}/>
                <div className="summary-item-info"><p>{item.product?.name}</p><p className="qty-label">Qty: {item.quantity}</p></div>
                <span>₹{(item.product?.price*item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="summary-divider"/>
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping===0?<span style={{color:'var(--sage)'}}>Free</span>:`₹${shipping}`}</span></div>
            <div className="summary-row"><span>Tax (5%)</span><span>₹{tax.toLocaleString('en-IN',{maximumFractionDigits:0})}</span></div>
            <div className="summary-total"><span>Total</span><span>₹{total.toLocaleString('en-IN',{maximumFractionDigits:0})}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
