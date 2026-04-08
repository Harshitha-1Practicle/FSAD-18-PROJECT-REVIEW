import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">🧵 LoomGlobal</div>
            <p>Connecting master artisans with global buyers. Every thread tells a story of heritage and craftsmanship.</p>
          </div>
          <div className="footer-col"><h4>Shop</h4><Link to="/products">All Products</Link><Link to="/products?category=SAREES">Sarees</Link><Link to="/products?category=STOLES">Stoles</Link><Link to="/products?category=HOME_DECOR">Home Decor</Link></div>
          <div className="footer-col"><h4>Platform</h4><Link to="/register">Become an Artisan</Link><Link to="/register">Join as Buyer</Link><Link to="/login">Login</Link></div>
          <div className="footer-col"><h4>Contact</h4><span>support@loomglobal.com</span><span>+91 98765 43210</span><span>Hyderabad, India</span></div>
        </div>
        <div className="footer-bottom"><p>© 2024 LoomGlobal. All rights reserved. Made with ❤️ for handloom artisans.</p></div>
      </div>
    </footer>
  );
}
