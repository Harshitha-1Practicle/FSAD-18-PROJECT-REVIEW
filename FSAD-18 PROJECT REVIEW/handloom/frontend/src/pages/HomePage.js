import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { campaignService } from '../services/campaignService';
import ProductCard from '../components/common/ProductCard';
import { ArrowRight, Award, Globe, Leaf, ShieldCheck } from 'lucide-react';
import './HomePage.css';

const CATEGORIES = [
  { name:'Sarees', key:'SAREES', emoji:'👘', desc:'Traditional & contemporary weaves' },
  { name:'Stoles', key:'STOLES', emoji:'🧣', desc:'Lightweight handwoven wraps' },
  { name:'Dupattas', key:'DUPATTAS', emoji:'🌸', desc:'Vibrant handloom dupattas' },
  { name:'Kurtas', key:'KURTAS', emoji:'👔', desc:'Artisan handcrafted kurtas' },
  { name:'Home Decor', key:'HOME_DECOR', emoji:'🏡', desc:'Handloom for your home' },
  { name:'Accessories', key:'ACCESSORIES', emoji:'💍', desc:'Handcrafted accessories' },
];

export default function HomePage() {
  const [topProducts, setTopProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getTopSelling(),
      productService.getLatest(),
      campaignService.getActiveCampaigns(),
    ]).then(([top, latest, camp]) => {
      setTopProducts(top.data.data || []);
      setLatestProducts(latest.data.data || []);
      setCampaigns(camp.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-tag">🌿 Authentic Handloom</span>
            <h1>Where Ancient Craft<br /><em>Meets Global Style</em></h1>
            <p>Discover handwoven treasures from master artisans across India. Every piece carries centuries of tradition and the soul of its maker.</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary" style={{fontSize:'1rem',padding:'14px 32px'}}>Explore Collection <ArrowRight size={18}/></Link>
              <Link to="/register" className="btn btn-outline" style={{fontSize:'1rem',padding:'14px 32px',borderColor:'white',color:'white'}}>Sell Your Craft</Link>
            </div>
            <div className="hero-stats">
              <div><strong>500+</strong><span>Artisans</span></div>
              <div><strong>5000+</strong><span>Products</span></div>
              <div><strong>80+</strong><span>Countries</span></div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-img-wrapper">
              <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80" alt="Handloom weaving" />
              <div className="hero-img-badge"><Award size={20}/> Certified Authentic</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="container trust-inner">
          {[['🌍','Global Shipping','80+ countries served'],['🛡️','Authenticity Guaranteed','Every product verified'],['🤝','Artisan Direct','Support real craftspeople'],['↩️','Easy Returns','30-day return policy']].map(([icon,title,sub])=>(
            <div className="trust-item" key={title}><span className="trust-icon">{icon}</span><div><strong>{title}</strong><p>{sub}</p></div></div>
          ))}
        </div>
      </section>

      {/* Active Campaigns */}
      {campaigns.length > 0 && (
        <section className="campaigns-section">
          <div className="container">
            {campaigns.slice(0,1).map(c => (
              <div className="campaign-banner" key={c.id}>
                <div className="campaign-content">
                  <span className="campaign-tag">🎉 Special Offer</span>
                  <h2>{c.title}</h2>
                  <p>{c.description}</p>
                  {c.discountCode && <div className="discount-code">Use code: <strong>{c.discountCode}</strong> — {c.discountPercentage}% OFF</div>}
                  <Link to="/products" className="btn btn-primary">Shop Now <ArrowRight size={16}/></Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Explore our curated collection of handloom craftsmanship</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link to={`/products?category=${cat.key}`} className="category-card" key={cat.key}>
                <span className="cat-emoji">{cat.emoji}</span>
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Selling */}
      {topProducts.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <h2>Bestsellers</h2>
              <Link to="/products?sort=sales" className="see-all">See All <ArrowRight size={14}/></Link>
            </div>
            {loading ? <div className="loading-center"><div className="spinner"/></div> : (
              <div className="grid-4">{topProducts.slice(0,8).map(p => <ProductCard key={p.id} product={p} />)}</div>
            )}
          </div>
        </section>
      )}

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="section-header"><h2>Why LoomGlobal?</h2></div>
          <div className="grid-3">
            {[[<Globe size={28}/>, 'Global Reach', 'Our platform connects artisans from every corner of India to buyers in 80+ countries worldwide.'],
              [<Leaf size={28}/>, 'Sustainable Fashion', 'Handloom is inherently eco-friendly. No electricity, no pollution — just human skill and natural fibers.'],
              [<ShieldCheck size={28}/>, 'Artisan Welfare', 'We ensure fair prices and transparent supply chains so artisans receive what they deserve.']
            ].map(([icon, title, desc]) => (
              <div className="value-card" key={title}>
                <div className="value-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest */}
      {latestProducts.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <h2>New Arrivals</h2>
              <Link to="/products?sort=newest" className="see-all">See All <ArrowRight size={14}/></Link>
            </div>
            {loading ? <div className="loading-center"><div className="spinner"/></div> : (
              <div className="grid-4">{latestProducts.slice(0,8).map(p => <ProductCard key={p.id} product={p} />)}</div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2>Are You an Artisan?</h2>
          <p>Join thousands of weavers who've expanded their market globally through LoomGlobal. List your products for free and start selling today.</p>
          <Link to="/register" className="btn btn-primary" style={{fontSize:'1rem',padding:'14px 32px'}}>Start Selling Free <ArrowRight size={18}/></Link>
        </div>
      </section>
    </div>
  );
}
