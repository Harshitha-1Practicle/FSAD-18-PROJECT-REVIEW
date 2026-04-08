import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import './AuthPage.css';

const ROLES = [
  { value: 'BUYER', label: '🛍️ Buyer', desc: 'Browse and purchase handloom products' },
  { value: 'ARTISAN', label: '🎨 Artisan', desc: 'List and sell your handloom creations' },
  { value: 'MARKETING_SPECIALIST', label: '📢 Marketing Specialist', desc: 'Promote products and run campaigns' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ email:'',password:'',firstName:'',lastName:'',phone:'',country:'',role:'BUYER' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome, ${user.firstName}! Your account is ready.`);
      const map = { ADMIN: '/admin/dashboard', ARTISAN: '/artisan/dashboard', BUYER: '/', MARKETING_SPECIALIST: '/marketing/dashboard' };
      navigate(map[user.role] || '/');
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{maxWidth:520}}>
        <div className="auth-header">
          <div className="auth-logo">🧵</div>
          <h1>Join LoomGlobal</h1>
          <p>Create your account and start your journey</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">First Name</label><input className="form-input" placeholder="Priya" value={form.firstName} onChange={e => setForm({...form,firstName:e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" placeholder="Sharma" value={form.lastName} onChange={e => setForm({...form,lastName:e.target.value})} required /></div>
          </div>
          <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required /></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required /></div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Country</label><input className="form-input" placeholder="India" value={form.country} onChange={e => setForm({...form,country:e.target.value})} /></div>
          </div>
          <div className="form-group">
            <label className="form-label">I want to join as</label>
            <div className="role-selector">
              {ROLES.map(r => (
                <label key={r.value} className={`role-option ${form.role===r.value?'selected':''}`}>
                  <input type="radio" name="role" value={r.value} checked={form.role===r.value} onChange={() => setForm({...form,role:r.value})} style={{display:'none'}} />
                  <span className="role-label">{r.label}</span>
                  <span className="role-desc">{r.desc}</span>
                </label>
              ))}
            </div>
          </div>
          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? <div className="spinner" style={{width:20,height:20,borderWidth:2}} /> : <><UserPlus size={17} /> Create Account</>}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in here</Link></p>
      </div>
    </div>
  );
}
