import React, { useState, useEffect } from 'react';
import { Plus, AlertTriangle, CheckCircle, Clock, Phone } from 'lucide-react';
import { creditorService } from '../services/api';
import { format } from 'date-fns';

interface Creditor {
  _id: string;
  name: string;
  phone?: string;
  billAmount: number;
  description: string;
  dueDate?: string;
  isPaid: boolean;
  paidDate?: string;
  notes?: string;
  createdAt: string;
}

const Creditors: React.FC = () => {
  const [creditors, setCreditors] = useState<Creditor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCreditor, setSelectedCreditor] = useState<Creditor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    billAmount: '',
    description: '',
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchCreditors();
  }, []);

  const fetchCreditors = async () => {
    try {
      const data = await creditorService.getAll();
      setCreditors(data);
    } catch (error) {
      console.error('Error fetching creditors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const creditorData = {
        ...formData,
        billAmount: parseFloat(formData.billAmount)
      };
      
      if (selectedCreditor) {
        await creditorService.update(selectedCreditor._id, creditorData);
      } else {
        await creditorService.create(creditorData);
      }
      
      await fetchCreditors();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving creditor:', error);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await creditorService.markPaid(id);
      await fetchCreditors();
    } catch (error) {
      console.error('Error marking creditor as paid:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this creditor?')) {
      try {
        await creditorService.delete(id);
        await fetchCreditors();
      } catch (error) {
        console.error('Error deleting creditor:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      billAmount: '',
      description: '',
      dueDate: '',
      notes: ''
    });
    setSelectedCreditor(null);
  };

  const openModal = (creditor?: Creditor) => {
    if (creditor) {
      setSelectedCreditor(creditor);
      setFormData({
        name: creditor.name,
        phone: creditor.phone || '',
        billAmount: creditor.billAmount.toString(),
        description: creditor.description,
        dueDate: creditor.dueDate ? format(new Date(creditor.dueDate), 'yyyy-MM-dd') : '',
        notes: creditor.notes || ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const pendingCreditors = creditors.filter(c => !c.isPaid);
  const paidCreditors = creditors.filter(c => c.isPaid);
  const totalPending = pendingCreditors.reduce((sum, c) => sum + c.billAmount, 0);
  const overdueCreditors = pendingCreditors.filter(c => 
    c.dueDate && new Date(c.dueDate) < new Date()
  );

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="page-title">Creditors Management</h1>
              <p className="page-subtitle">Track bills and payment obligations</p>
            </div>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <Plus size={20} />
              Add Creditor
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Summary Cards */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card warning">
            <div className="stat-icon" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}>
              <Clock size={24} />
            </div>
            <div className="stat-value">{pendingCreditors.length}</div>
            <div className="stat-label">Pending Bills</div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-value">Rs.{totalPending.toLocaleString()}</div>
            <div className="stat-label">Total Outstanding</div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-value">{paidCreditors.length}</div>
            <div className="stat-label">Paid This Month</div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-value">{overdueCreditors.length}</div>
            <div className="stat-label">Overdue Bills</div>
          </div>
        </div>

        {/* Alerts */}
        {overdueCreditors.length > 0 && (
          <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
            <AlertTriangle size={20} />
            <strong>Urgent:</strong> {overdueCreditors.length} bills are overdue and require immediate attention.
          </div>
        )}

        {/* Pending Creditors */}
        {pendingCreditors.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <h3 className="card-title">Pending Bills</h3>
              <p className="card-description">Bills awaiting payment</p>
            </div>
            
            <div className="grid grid-2">
              {pendingCreditors.map((creditor) => {
                const isOverdue = creditor.dueDate && new Date(creditor.dueDate) < new Date();
                
                return (
                  <div 
                    key={creditor._id} 
                    className="card"
                    style={{ 
                      border: isOverdue ? '2px solid #dc2626' : '1px solid #e2e8f0',
                      background: isOverdue ? '#fef2f2' : 'white'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                          {creditor.name}
                        </h4>
                        {creditor.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Phone size={14} color="#64748b" />
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{creditor.phone}</span>
                          </div>
                        )}
                      </div>
                      {isOverdue && (
                        <span className="badge badge-danger">Overdue</span>
                      )}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                        {creditor.description}
                      </p>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626' }}>
                        Rs.{creditor.billAmount.toLocaleString()}
                      </div>
                    </div>

                    {creditor.dueDate && (
                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Due Date: </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: isOverdue ? '#dc2626' : '#64748b',
                          fontWeight: isOverdue ? '600' : '400'
                        }}>
                          {format(new Date(creditor.dueDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-success"
                        style={{ flex: 1 }}
                        onClick={() => handleMarkPaid(creditor._id)}
                      >
                        <CheckCircle size={16} />
                        Mark Paid
                      </button>
                      <button 
                        className="btn btn-outline"
                        onClick={() => openModal(creditor)}
                      >
                        Edit
                      </button>
                    </div>

                    {creditor.notes && (
                      <div style={{ 
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: '#f8fafc',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        color: '#64748b'
                      }}>
                        {creditor.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recently Paid */}
        {paidCreditors.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recently Paid</h3>
              <p className="card-description">Bills paid this month</p>
            </div>
            
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Paid Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paidCreditors.slice(0, 10).map((creditor) => (
                    <tr key={creditor._id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: '500' }}>{creditor.name}</div>
                          {creditor.phone && (
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{creditor.phone}</div>
                          )}
                        </div>
                      </td>
                      <td>{creditor.description}</td>
                      <td style={{ fontWeight: '600', color: '#059669' }}>
                        Rs.{creditor.billAmount.toLocaleString()}
                      </td>
                      <td>
                        {creditor.paidDate ? format(new Date(creditor.paidDate), 'MMM d') : '-'}
                      </td>
                      <td>
                        <span className="badge badge-success">Paid</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {creditors.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ color: '#64748b', marginBottom: '1rem' }}>
              No creditors added yet.
            </div>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <Plus size={20} />
              Add Your First Creditor
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedCreditor ? 'Edit Creditor' : 'Add New Creditor'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Bill Amount (Rs.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formData.billAmount}
                    onChange={(e) => setFormData({ ...formData, billAmount: e.target.value })}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this bill for?"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedCreditor ? 'Update Creditor' : 'Add Creditor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Creditors;