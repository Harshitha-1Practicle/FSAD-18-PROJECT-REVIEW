import React, { useState, useEffect } from 'react';
import { campaignService } from '../../services/campaignService';
import toast from 'react-hot-toast';
import { PlusCircle, Trash2, Play, Pause } from 'lucide-react';
import Pagination from '../../components/common/Pagination';
import './Marketing.css';

const TYPES = ['SEASONAL','FEATURED','DISCOUNT','AWARENESS','FESTIVAL'];
const STATUS_BADGE = { DRAFT:'badge-gray',ACTIVE:'badge-green',PAUSED:'badge-orange',COMPLETED:'badge-blue',CANCELLED:'badge-red' };

export default function MarketingCampaigns() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'',description:'',startDate:'',endDate:'',type:'SEASONAL',targetAudience:'',discountCode:'',discountPercentage:'' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(()=>{ loadCampaigns(); },[page]);
  const loadCampaigns = () => { setLoading(true); campaignService.getMyCampaigns(page,10).then(r=>setData(r.data.data)).finally(()=>setLoading(false)); };

  const handleCreate = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await campaignService.createCampaign({ ...form, discountPercentage: form.discountPercentage ? parseFloat(form.discountPercentage) : null });
      toast.success('Campaign created!'); setShowForm(false); setForm({title:'',description:'',startDate:'',endDate:'',type:'SEASONAL',targetAudience:'',discountCode:'',discountPercentage:''}); loadCampaigns();
    } catch {} finally { setSubmitting(false); }
  };

  const handleStatus = async (id, status) => {
    try { await campaignService.updateStatus(id,status); toast.success('Status updated'); loadCampaigns(); } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    try { await campaignService.deleteCampaign(id); toast.success('Campaign deleted'); loadCampaigns(); } catch {}
  };

  return (
    <div className="marketing-page">
      <div className="container">
        <div className="page-header">
          <div><h1 className="page-title">Campaigns</h1><p className="page-subtitle">Create and manage promotional campaigns</p></div>
          <button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}><PlusCircle size={16}/> New Campaign</button>
        </div>

        {showForm && (
          <div className="campaign-form-card">
            <h3>Create New Campaign</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label className="form-label">Campaign Title *</label><input className="form-input" placeholder="e.g. Diwali Handloom Festival 2024" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
              <div className="grid-3">
                <div className="form-group"><label className="form-label">Start Date *</label><input className="form-input" type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">End Date *</label><input className="form-input" type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Campaign Type</label><select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
              </div>
              <div className="grid-3">
                <div className="form-group"><label className="form-label">Target Audience</label><input className="form-input" placeholder="e.g. Global fashion buyers" value={form.targetAudience} onChange={e=>setForm({...form,targetAudience:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Discount Code</label><input className="form-input" placeholder="e.g. DIWALI20" value={form.discountCode} onChange={e=>setForm({...form,discountCode:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Discount %</label><input className="form-input" type="number" placeholder="e.g. 20" value={form.discountPercentage} onChange={e=>setForm({...form,discountPercentage:e.target.value})} /></div>
              </div>
              <div style={{display:'flex',gap:12}}>
                <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting?'Creating…':'Create Campaign'}</button>
                <button className="btn btn-outline" type="button" onClick={()=>setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <>
            <div className="campaigns-grid">
              {(data?.content||[]).map(c=>(
                <div className="campaign-card" key={c.id}>
                  <div className="cc-header">
                    <span className="cc-type">{c.type||'GENERAL'}</span>
                    <span className={`badge ${STATUS_BADGE[c.status]||'badge-gray'}`}>{c.status}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.description || 'No description'}</p>
                  {c.discountCode && <div className="cc-discount">Code: <strong>{c.discountCode}</strong> · {c.discountPercentage}% OFF</div>}
                  <div className="cc-dates">{new Date(c.startDate).toLocaleDateString()} → {new Date(c.endDate).toLocaleDateString()}</div>
                  <div className="cc-actions">
                    {c.status==='DRAFT' && <button className="btn btn-primary" style={{padding:'7px 14px',fontSize:'0.82rem'}} onClick={()=>handleStatus(c.id,'ACTIVE')}><Play size={13}/> Activate</button>}
                    {c.status==='ACTIVE' && <button className="btn btn-outline" style={{padding:'7px 14px',fontSize:'0.82rem'}} onClick={()=>handleStatus(c.id,'PAUSED')}><Pause size={13}/> Pause</button>}
                    {c.status==='PAUSED' && <button className="btn btn-primary" style={{padding:'7px 14px',fontSize:'0.82rem'}} onClick={()=>handleStatus(c.id,'ACTIVE')}><Play size={13}/> Resume</button>}
                    <button className="icon-btn danger" onClick={()=>handleDelete(c.id)}><Trash2 size={15}/></button>
                  </div>
                </div>
              ))}
              {(data?.content||[]).length===0 && <div className="empty-state" style={{gridColumn:'1/-1'}}><Megaphone size={48} color="var(--text-muted)"/><h3>No campaigns yet</h3><p>Create your first promotional campaign!</p></div>}
            </div>
            <Pagination page={page} totalPages={data?.totalPages||0} onPageChange={setPage}/>
          </>
        )}
      </div>
    </div>
  );
}
