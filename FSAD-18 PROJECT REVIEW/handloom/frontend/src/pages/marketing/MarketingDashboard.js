import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../../services/campaignService';
import { Megaphone, TrendingUp, Eye, PlusCircle } from 'lucide-react';
import './Marketing.css';

export default function MarketingDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { campaignService.getMyCampaigns(0,100).then(r=>setCampaigns(r.data.data?.content||[])).finally(()=>setLoading(false)); },[]);

  const active = campaigns.filter(c=>c.status==='ACTIVE').length;
  const totalImpressions = campaigns.reduce((s,c)=>s+(c.impressions||0),0);
  const totalClicks = campaigns.reduce((s,c)=>s+(c.clicks||0),0);

  return (
    <div className="marketing-page">
      <div className="container">
        <div className="page-header"><h1 className="page-title">Marketing Dashboard</h1><p className="page-subtitle">Promote handloom products to global audiences</p></div>
        <div className="grid-4" style={{marginBottom:32}}>
          {[['Total Campaigns', campaigns.length, <Megaphone size={22}/>, '#e8671a'],
            ['Active Campaigns', active, <TrendingUp size={22}/>, '#5a7a5e'],
            ['Total Impressions', totalImpressions, <Eye size={22}/>, '#2d3a5e'],
            ['Total Clicks', totalClicks, <TrendingUp size={22}/>, '#d4a017']
          ].map(([label,value,icon,color])=>(
            <div className="stat-card" key={label}>
              <div className="stat-icon" style={{background:`${color}18`}}><span style={{color}}>{icon}</span></div>
              <div className="stat-value">{loading?'…':value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:16,marginBottom:32}}>
          <Link to="/marketing/campaigns" className="btn btn-indigo"><Megaphone size={16}/> All Campaigns</Link>
          <Link to="/marketing/campaigns" className="btn btn-primary"><PlusCircle size={16}/> New Campaign</Link>
        </div>
        {!loading && campaigns.length > 0 && (
          <div className="card">
            <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)'}}><h3 style={{fontSize:'1rem',color:'var(--indigo)'}}>Recent Campaigns</h3></div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Start</th><th>End</th><th>Impressions</th><th>Clicks</th></tr></thead>
                <tbody>
                  {campaigns.slice(0,5).map(c=>(
                    <tr key={c.id}>
                      <td><strong>{c.title}</strong></td>
                      <td>{c.type||'—'}</td>
                      <td><span className={`badge ${c.status==='ACTIVE'?'badge-green':c.status==='DRAFT'?'badge-gray':'badge-orange'}`}>{c.status}</span></td>
                      <td>{new Date(c.startDate).toLocaleDateString()}</td>
                      <td>{new Date(c.endDate).toLocaleDateString()}</td>
                      <td>{c.impressions||0}</td>
                      <td>{c.clicks||0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
