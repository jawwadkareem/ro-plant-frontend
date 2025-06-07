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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const creditorData = {
        ...formData,
        billAmount: parseFloat(formData.billAmount)
      };
      
      let updatedCreditor;
      if (selectedCreditor) {
        updatedCreditor = await creditorService.update(selectedCreditor._id, creditorData);
        setCreditors(creditors.map(c => c._id === selectedCreditor._id ? updatedCreditor : c));
      } else {
        updatedCreditor = await creditorService.create(creditorData);
        setCreditors([...creditors, updatedCreditor]);
      }
      
      await fetchCreditors();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving creditor:', error);
    } finally {
      setIsSubmitting(false);
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
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="page-header py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="page-title text-2xl md:text-3xl font-bold text-gray-900">Creditors Management</h1>
              <p className="page-subtitle text-sm md:text-base text-gray-600">Track bills and payment obligations</p>
            </div>
            <button
              className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base disabled:opacity-50"
              onClick={() => openModal()}
              disabled={isSubmitting}
            >
              <Plus size={16} />
              Add Creditor
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="stat-card p-4 rounded-lg shadow bg-amber-50">
            <div className="stat-icon flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full">
              <Clock size={20} />
            </div>
            <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">{pendingCreditors.length}</div>
            <div className="stat-label text-sm md:text-base text-gray-600">Pending Bills</div>
          </div>

          <div className="stat-card p-4 rounded-lg shadow bg-red-50">
            <div className="stat-icon flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <AlertTriangle size={20} />
            </div>
            <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">Rs.{totalPending.toLocaleString()}</div>
            <div className="stat-label text-sm md:text-base text-gray-600">Total Outstanding</div>
          </div>

          <div className="stat-card p-4 rounded-lg shadow bg-green-50">
            <div className="stat-icon flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <CheckCircle size={20} />
            </div>
            <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">{paidCreditors.length}</div>
            <div className="stat-label text-sm md:text-base text-gray-600">Paid This Month</div>
          </div>

          <div className="stat-card p-4 rounded-lg shadow bg-red-50">
            <div className="stat-icon flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <AlertTriangle size={20} />
            </div>
            <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">{overdueCreditors.length}</div>
            <div className="stat-label text-sm md:text-base text-gray-600">Overdue Bills</div>
          </div>
        </div>

        {/* Alerts */}
        {overdueCreditors.length > 0 && (
          <div className="alert p-4 mb-6 bg-red-50 text-red-800 rounded-lg flex items-center gap-2">
            <AlertTriangle size={20} />
            <strong>Urgent:</strong> {overdueCreditors.length} bills are overdue and require immediate attention.
          </div>
        )}

        {/* Pending Creditors */}
        {pendingCreditors.length > 0 && (
          <div className="card bg-white p-6 rounded-lg shadow mb-6">
            <div className="card-header mb-4">
              <h3 className="card-title text-lg md:text-xl font-semibold text-gray-900">Pending Bills</h3>
              <p className="card-description text-sm text-gray-600">Bills awaiting payment</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingCreditors.map((creditor) => {
                const isOverdue = creditor.dueDate && new Date(creditor.dueDate) < new Date();
                
                return (
                  <div 
                    key={creditor._id} 
                    className="card p-4 rounded-lg shadow"
                    style={{ border: isOverdue ? '2px solid #dc2626' : '1px solid #e2e8f0', background: isOverdue ? '#fef2f2' : 'white' }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-md md:text-lg font-semibold text-gray-900 mb-1">{creditor.name}</h4>
                        {creditor.phone && (
                          <div className="flex items-center gap-1 mb-1">
                            <Phone size={14} color="#64748b" />
                            <span className="text-sm text-gray-600">{creditor.phone}</span>
                          </div>
                        )}
                      </div>
                      {isOverdue && (
                        <span className="badge badge-danger text-sm">Overdue</span>
                      )}
                    </div>

                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-1">{creditor.description}</p>
                      <div className="text-2xl font-bold text-red-600">
                        Rs.{creditor.billAmount.toLocaleString()}
                      </div>
                    </div>

                    {creditor.dueDate && (
                      <div className="mb-2">
                        <span className="text-xs text-gray-600">Due Date: </span>
                        <span className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                          {format(new Date(creditor.dueDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button 
                        className="btn btn-success flex-1 text-sm"
                        onClick={() => handleMarkPaid(creditor._id)}
                      >
                        <CheckCircle size={16} />
                        Mark Paid
                      </button>
                      <button 
                        className="btn btn-outline text-sm"
                        onClick={() => openModal(creditor)}
                      >
                        Edit
                      </button>
                    </div>

                    {creditor.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
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
          <div className="card bg-white p-6 rounded-lg shadow">
            <div className="card-header mb-4">
              <h3 className="card-title text-lg md:text-xl font-semibold text-gray-900">Recently Paid</h3>
              <p className="card-description text-sm text-gray-600">Bills paid this month</p>
            </div>
            
            <div className="table-container overflow-x-auto">
              <table className="table w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 md:p-3 text-left">Name</th>
                    <th className="p-2 md:p-3 text-left">Description</th>
                    <th className="p-2 md:p-3 text-left">Amount</th>
                    <th className="p-2 md:p-3 text-left">Paid Date</th>
                    <th className="p-2 md:p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paidCreditors.slice(0, 10).map((creditor) => (
                    <tr key={creditor._id} className="border-b">
                      <td className="p-2 md:p-3">
                        <div>
                          <div className="font-medium">{creditor.name}</div>
                          {creditor.phone && (
                            <div className="text-xs text-gray-600">{creditor.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-2 md:p-3">{creditor.description}</td>
                      <td className="p-2 md:p-3 font-semibold text-green-600">
                        Rs.{creditor.billAmount.toLocaleString()}
                      </td>
                      <td className="p-2 md:p-3">
                        {creditor.paidDate ? format(new Date(creditor.paidDate), 'MMM d') : '-'}
                      </td>
                      <td className="p-2 md:p-3">
                        <span className="badge badge-success text-sm">Paid</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {creditors.length === 0 && (
          <div className="card bg-white p-6 rounded-lg shadow text-center">
            <div className="text-gray-600 mb-4">
              No creditors added yet.
            </div>
            <button
              className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base"
              onClick={() => openModal()}
              disabled={isSubmitting}
            >
              <Plus size={16} />
              Add Your First Creditor
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="modal bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="modal-title text-xl font-semibold text-gray-900">
                {selectedCreditor ? 'Edit Creditor' : 'Add New Creditor'}
              </h2>
              <button className="modal-close text-2xl font-bold text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    className="form-input w-full p-2 border rounded text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    className="form-input w-full p-2 border rounded text-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-group">
                  <label className="form-label block text-sm font-medium text-gray-700">Bill Amount (Rs.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input w-full p-2 border rounded text-sm"
                    value={formData.billAmount}
                    onChange={(e) => setFormData({ ...formData, billAmount: e.target.value })}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    className="form-input w-full p-2 border rounded text-sm"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Description *</label>
                <input
                  type="text"
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this bill for?"
                  required
                />
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information..."
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button type="button" className="btn btn-outline px-4 py-2 text-sm" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4 py-2 text-sm" disabled={isSubmitting}>
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