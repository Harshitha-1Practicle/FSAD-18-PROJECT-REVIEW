import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cartService } from '../../services/cartService';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'BUYER') { toast.error('Please login as a buyer to add to cart'); return; }
    try { await cartService.addToCart(product.id, 1); toast.success('Added to cart!'); } catch {}
  };
  const img = product.images?.[0] || `https://picsum.photos/seed/${product.id}/400/300`;
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-img">
        <img src={img} alt={product.name} onError={e => e.target.src=`https://picsum.photos/seed/${product.id+10}/400/300`} />
        <div className="product-card-overlay">
          {user?.role === 'BUYER' && (
            <button className="add-cart-btn" onClick={handleAddToCart}><ShoppingCart size={16} /> Add to Cart</button>
          )}
        </div>
        {product.salesCount > 10 && <span className="product-badge">Bestseller</span>}
      </div>
      <div className="product-card-body">
        <p className="product-region">{product.region || 'Handcrafted'} · {product.weaveType || product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <div className="product-rating">
            <Star size={13} fill="#d4a017" stroke="#d4a017" />
            <span>{product.averageRating?.toFixed(1) || '0.0'}</span>
            <span className="rating-count">({product.reviewCount || 0})</span>
          </div>
          <span className="product-price">₹{product.price?.toLocaleString('en-IN')}</span>
        </div>
        <p className="product-artisan">by {product.artisanName}</p>
      </div>
    </Link>
  );
}
