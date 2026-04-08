import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8,marginTop:32}}>
      <button className="btn btn-outline" style={{padding:'8px 14px'}} onClick={() => onPageChange(page-1)} disabled={page===0}><ChevronLeft size={16}/></button>
      {Array.from({length:totalPages},(_,i)=>i).map(i => (
        <button key={i} onClick={() => onPageChange(i)} style={{width:36,height:36,borderRadius:'50%',border:'1.5px solid',borderColor:i===page?'var(--saffron)':'var(--border)',background:i===page?'var(--saffron)':'white',color:i===page?'white':'var(--text-secondary)',fontWeight:500,fontSize:'0.88rem',cursor:'pointer'}}>{i+1}</button>
      ))}
      <button className="btn btn-outline" style={{padding:'8px 14px'}} onClick={() => onPageChange(page+1)} disabled={page===totalPages-1}><ChevronRight size={16}/></button>
    </div>
  );
}
