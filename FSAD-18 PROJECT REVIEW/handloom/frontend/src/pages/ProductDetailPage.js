import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Star, ShoppingCart, Heart, Package, Globe, Scissors, ArrowLeft } from 'lucide-react';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([productService.getById(id), productService.getReviews(id)])
      .then(([p, r]) => { setProduct(p.data.data); setReviews(r.data.data || []); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user || user.role !== 'BUYER') { toast.error('Please login as a buyer'); return; }
    try { await cartService.addToCart(product.id, qty); toast.success('Added to cart!'); } catch {}
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'BUYER') { toast.error('Please login as a buyer'); return; }
    setSubmitting(true);
    try {
      await productService.addReview(id, reviewForm);
      toast.success('Review submitted for approval!');
      setReviewForm({ rating: 5, comment: '' });
    } catch {} finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading-center" style={{minHeight:'60vh'}}><div className="spinner"/></div>;
  if (!product) return <div className="container" style={{padding:'60px 24px',textAlign:'center'}}><h2>Product not found</h2></div>;

  const imgs = product.images?.length > 0 ? product.images : [`https://picsum.photos/seed/${id}/600/500`];

  return (
    <div className="product-detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={16}/> Back</button>
        <div className="product-detail-grid">
          {/* Images */}
          <div className="product-images">
            <div className="main-image"><img src={imgs[selectedImg]} alt={product.name} onError={e => e.target.src=`https://picsum.photos/seed/${id+5}/600/500`} /></div>
            {imgs.length > 1 && (
              <div className="image-thumbs">
                {imgs.map((img, i) => <img key={i} src={img} alt="" className={selectedImg===i?'active':''} onClick={() => setSelectedImg(i)} />)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info">
            <div className="product-tags">
              <span className="badge badge-orange">{product.category?.replace('_',' ')}</span>
              {product.region && <span className="badge badge-blue">{product.region}</span>}
            </div>
            <h1 className="detail-name">{product.name}</h1>
            <div className="detail-rating">
              {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= Math.round(product.averageRating||0)?'#d4a017':'none'} stroke="#d4a017"/>)}
              <span>{product.averageRating?.toFixed(1)||'0.0'}</span>
              <span className="review-count">({product.reviewCount||0} reviews)</span>
            </div>
            <p className="detail-price">₹{product.price?.toLocaleString('en-IN')}</p>
            <p className="detail-desc">{product.description}</p>

            <div className="detail-specs">
              {product.fabric && <div className="spec-item"><Scissors size={15}/><span><strong>Fabric:</strong> {product.fabric}</span></div>}
              {product.weaveType && <div className="spec-item"><Package size={15}/><span><strong>Weave:</strong> {product.weaveType}</span></div>}
              {product.dimensions && <div className="spec-item"><Globe size={15}/><span><strong>Dimensions:</strong> {product.dimensions}</span></div>}
            </div>

            <div className="artisan-info">
              <div className="artisan-avatar">🎨</div>
              <div><p className="artisan-name">By {product.artisanName}</p><p className="artisan-country">{product.artisanCountry || 'India'}</p></div>
            </div>

            {product.status === 'ACTIVE' && product.stockQuantity > 0 ? (
              <div className="add-to-cart-section">
                <div className="qty-control">
                  <button onClick={() => setQty(Math.max(1,qty-1))}>–</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stockQuantity,qty+1))}>+</button>
                </div>
                <button className="btn btn-primary add-cart-large" onClick={handleAddToCart}><ShoppingCart size={18}/> Add to Cart</button>
                <button className="btn btn-outline" style={{padding:'12px'}}><Heart size={18}/></button>
              </div>
            ) : (
              <p className="out-of-stock-msg">⚠️ This product is currently unavailable</p>
            )}

            {product.careInstructions && (
              <div className="care-instructions">
                <h4>Care Instructions</h4>
                <p>{product.careInstructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          {reviews.length === 0 ? <p className="no-reviews">No reviews yet. Be the first to review!</p> : (
            <div className="reviews-list">
              {reviews.map(r => (
                <div className="review-card" key={r.id}>
                  <div className="review-header">
                    <div className="review-stars">{[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s<=r.rating?'#d4a017':'none'} stroke="#d4a017"/>)}</div>
                    <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
          {user?.role === 'BUYER' && (
            <form className="review-form" onSubmit={handleReview}>
              <h3>Write a Review</h3>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <select className="form-select" style={{width:'auto'}} value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm,rating:Number(e.target.value)})}>
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n} stars)</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Your Review</label><textarea className="form-input" rows={4} placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm,comment:e.target.value})} /></div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting?'Submitting…':'Submit Review'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
