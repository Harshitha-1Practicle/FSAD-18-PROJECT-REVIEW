import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './CartPage.css';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadCart(); }, []);

  const loadCart = async () => {
    try { const res = await cartService.getCart(); setCart(res.data.data); } catch {} finally { setLoading(false); }
  };

  const handleUpdate = async (productId, qty) => {
    try { const res = await cartService.updateCart(productId, qty); setCart(res.data.data); } catch {}
  };

  const handleRemove = async (productId) => {
    try { const res = await cartService.removeFromCart(productId); setCart(res.data.data); toast.success('Item removed'); } catch {}
  };

  const total = cart?.cartItems?.reduce((sum, i) => sum + (i.product?.price * i.quantity), 0) || 0;

  if (loading) return <div className="loading-center" style={{minHeight:'60vh'}}><div className="spinner"/></div>;

  const items = cart?.cartItems || [];

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title" style={{marginBottom:32}}>Your Cart</h1>
        {items.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={64} color="var(--text-muted)" />
            <h2>Your cart is empty</h2>
            <p>Discover beautiful handloom products and add them to your cart.</p>
            <Link to="/products" className="btn btn-primary">Browse Products <ArrowRight size={16}/></Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map(item => (
                <div className="cart-item" key={item.id}>
                  <img src={item.product?.images?.[0] || `https://picsum.photos/seed/${item.product?.id}/120/100`} alt={item.product?.name} onError={e => e.target.src=`https://picsum.photos/seed/${item.id}/120/100`} />
                  <div className="cart-item-info">
                    <Link to={`/products/${item.product?.id}`} className="cart-item-name">{item.product?.name}</Link>
                    <p className="cart-item-meta">{item.product?.category?.replace('_',' ')} · {item.product?.artisanName || 'Artisan'}</p>
                    <p className="cart-item-price">₹{item.product?.price?.toLocaleString('en-IN')} each</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button onClick={() => handleUpdate(item.product?.id, item.quantity-1)}><Minus size={13}/></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdate(item.product?.id, item.quantity+1)}><Plus size={13}/></button>
                    </div>
                    <span className="cart-item-total">₹{(item.product?.price * item.quantity)?.toLocaleString('en-IN')}</span>
                    <button className="remove-btn" onClick={() => handleRemove(item.product?.id)}><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row"><span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{total >= 10000 ? <span style={{color:'var(--sage)'}}>Free</span> : '₹830'}</span></div>
              <div className="summary-row"><span>Tax (5%)</span><span>₹{(total * 0.05).toLocaleString('en-IN',{maximumFractionDigits:0})}</span></div>
              <div className="summary-total"><span>Total</span><span>₹{(total + (total<10000?830:0) + total*0.05).toLocaleString('en-IN',{maximumFractionDigits:0})}</span></div>
              <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'14px'}} onClick={() => navigate('/checkout')}>Proceed to Checkout <ArrowRight size={16}/></button>
              <Link to="/products" className="continue-shopping">← Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
