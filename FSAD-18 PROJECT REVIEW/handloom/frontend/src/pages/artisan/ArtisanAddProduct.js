import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';
import { Save, ArrowLeft } from 'lucide-react';
import './Artisan.css';

const CATEGORIES = ['SAREES','STOLES','DUPATTAS','KURTAS','DRESS_MATERIAL','JACKETS','SCARVES','HOME_DECOR','ACCESSORIES'];

export default function ArtisanAddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:'',description:'',price:'',stockQuantity:'',category:'SAREES',fabric:'',weaveType:'',region:'',dimensions:'',careInstructions:'',images:[''] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, price: parseFloat(form.price), stockQuantity: parseInt(form.stockQuantity), images: form.images.filter(img => img.trim()) };
      await productService.createProduct(data);
      toast.success('Product listed successfully!');
      navigate('/artisan/products');
    } catch {} finally { setLoading(false); }
  };

  const updateImage = (i, val) => { const imgs = [...form.images]; imgs[i] = val; setForm({...form, images: imgs}); };
  const addImageField = () => setForm({...form, images: [...form.images, '']});

  return (
    <div className="artisan-page">
      <div className="container" style={{maxWidth:720}}>
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={16}/> Back to Products</button>
        <div className="page-header"><h1 className="page-title">List New Product</h1><p className="page-subtitle">Share your handloom creation with the world</p></div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group"><label className="form-label">Product Name *</label><input className="form-input" placeholder="e.g. Banarasi Silk Saree in Midnight Blue" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Description *</label><textarea className="form-input" rows={4} placeholder="Describe the product's uniqueness, history, and craftsmanship…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required /></div>
            <div className="grid-3">
              <div className="form-group"><label className="form-label">Price (₹) *</label><input className="form-input" type="number" placeholder="2500" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Stock Qty *</label><input className="form-input" type="number" placeholder="10" value={form.stockQuantity} onChange={e=>setForm({...form,stockQuantity:e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Category *</label><select className="form-select" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATEGORIES.map(c=><option key={c} value={c}>{c.replace('_',' ')}</option>)}</select></div>
            </div>
          </div>
          <div className="form-section">
            <h3>Craft Details</h3>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Fabric / Material</label><input className="form-input" placeholder="e.g. Pure Silk, Cotton" value={form.fabric} onChange={e=>setForm({...form,fabric:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Weave Type</label><input className="form-input" placeholder="e.g. Jamdani, Ikat, Kanjivaram" value={form.weaveType} onChange={e=>setForm({...form,weaveType:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Region of Origin</label><input className="form-input" placeholder="e.g. Varanasi, Kanchipuram" value={form.region} onChange={e=>setForm({...form,region:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Dimensions / Size</label><input className="form-input" placeholder="e.g. 5.5m × 1.2m" value={form.dimensions} onChange={e=>setForm({...form,dimensions:e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Care Instructions</label><textarea className="form-input" rows={2} placeholder="e.g. Dry clean only, store in muslin cloth" value={form.careInstructions} onChange={e=>setForm({...form,careInstructions:e.target.value})} /></div>
          </div>
          <div className="form-section">
            <h3>Product Images</h3>
            <p style={{fontSize:'0.85rem',color:'var(--text-muted)',marginBottom:14}}>Add image URLs (use online image hosting)</p>
            {form.images.map((img,i) => (
              <div className="form-group" key={i}><input className="form-input" placeholder={`Image URL ${i+1}`} value={img} onChange={e=>updateImage(i,e.target.value)} /></div>
            ))}
            <button type="button" className="btn btn-outline" style={{padding:'8px 16px',fontSize:'0.85rem'}} onClick={addImageField}>+ Add Another Image</button>
          </div>
          <button className="btn btn-primary" type="submit" style={{width:'100%',justifyContent:'center',padding:'14px',fontSize:'1rem'}} disabled={loading}>
            {loading ? <div className="spinner" style={{width:20,height:20,borderWidth:2}}/> : <><Save size={17}/> List Product</>}
          </button>
        </form>
      </div>
    </div>
  );
}
