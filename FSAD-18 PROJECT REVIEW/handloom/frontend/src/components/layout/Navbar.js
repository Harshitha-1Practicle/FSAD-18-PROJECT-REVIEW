import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Menu, X, User, LogOut, Package, LayoutDashboard, Megaphone } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const navigate = useNavigate();
  const getDashboardLink = () => {
    if (!user) return '/';
    const map = { ADMIN: '/admin/dashboard', ARTISAN: '/artisan/dashboard', BUYER: '/buyer/orders', MARKETING_SPECIALIST: '/marketing/dashboard' };
    return map[user.role] || '/';
  };
  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand"><span className="brand-icon">🧵</span><span className="brand-text">LoomGlobal</span></Link>
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/products?category=SAREES" onClick={() => setMenuOpen(false)}>Sarees</Link>
          <Link to="/products?category=STOLES" onClick={() => setMenuOpen(false)}>Stoles</Link>
          <Link to="/products?category=HOME_DECOR" onClick={() => setMenuOpen(false)}>Home Decor</Link>
        </div>
        <div className="navbar-actions">
          {user?.role === 'BUYER' && <Link to="/cart" className="cart-btn"><ShoppingBag size={20} /></Link>}
          {user ? (
            <div className="user-menu" onMouseLeave={() => setDropOpen(false)}>
              <button className="user-btn" onClick={() => setDropOpen(!dropOpen)}><User size={18} /><span>{user.firstName}</span></button>
              {dropOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header"><p className="dropdown-name">{user.firstName} {user.lastName}</p><p className="dropdown-role">{user.role.replace('_',' ')}</p></div>
                  <Link to={getDashboardLink()} className="dropdown-item" onClick={() => setDropOpen(false)}><LayoutDashboard size={15} /> Dashboard</Link>
                  {user.role === 'BUYER' && <Link to="/buyer/orders" className="dropdown-item" onClick={() => setDropOpen(false)}><Package size={15} /> My Orders</Link>}
                  {user.role === 'MARKETING_SPECIALIST' && <Link to="/marketing/campaigns" className="dropdown-item" onClick={() => setDropOpen(false)}><Megaphone size={15} /> Campaigns</Link>}
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}><LogOut size={15} /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-outline" style={{padding:'8px 18px',fontSize:'0.85rem'}}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{padding:'8px 18px',fontSize:'0.85rem'}}>Register</Link>
            </div>
          )}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
    </nav>
  );
}
