import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { UserCheck, UserX, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Pagination from '../../components/common/Pagination';
import './Admin.css';

export default function AdminUsers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => { loadUsers(); }, [page]);
  const loadUsers = () => { setLoading(true); adminService.getUsers(page, 10).then(r => setData(r.data.data)).finally(() => setLoading(false)); };

  const handleStatusChange = async (id, active) => {
    try { await adminService.updateUserStatus(id, active); toast.success('User status updated'); loadUsers(); } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await adminService.deleteUser(id); toast.success('User deleted'); loadUsers(); } catch {}
  };

  const ROLE_BADGE = { ADMIN:'badge-red', ARTISAN:'badge-orange', BUYER:'badge-blue', MARKETING_SPECIALIST:'badge-green' };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header"><h1 className="page-title">User Management</h1><p className="page-subtitle">Manage platform users</p></div>
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <>
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Country</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {(data?.content || []).map(u => (
                      <tr key={u.id}>
                        <td><strong>{u.firstName} {u.lastName}</strong></td>
                        <td>{u.email}</td>
                        <td><span className={`badge ${ROLE_BADGE[u.role]||'badge-gray'}`}>{u.role.replace('_',' ')}</span></td>
                        <td>{u.country || '—'}</td>
                        <td><span className={`badge ${u.active?'badge-green':'badge-red'}`}>{u.active?'Active':'Inactive'}</span></td>
                        <td>
                          <div style={{display:'flex',gap:8}}>
                            <button className="icon-btn" title={u.active?'Deactivate':'Activate'} onClick={() => handleStatusChange(u.id, !u.active)}>{u.active?<UserX size={16}/>:<UserCheck size={16}/>}</button>
                            <button className="icon-btn danger" title="Delete" onClick={() => handleDelete(u.id)}><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination page={page} totalPages={data?.totalPages||0} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
