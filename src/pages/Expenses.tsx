import React, { useState, useEffect } from 'react';
import { Plus, Calendar, TrendingDown, Tag, Receipt } from 'lucide-react';
import { expenseService } from '../services/api';
import { format } from 'date-fns';

interface Expense {
  _id: string;
  date: string;
  type: string;
  amount: number;
  description: string;
  notes?: string;
  createdAt: string;
}

const expenseTypes = [
  'Raw Materials',
  'Electricity',
  'Maintenance',
  'Labor',
  'Transportation',
  'Office Supplies',
  'Marketing',
  'Rent',
  'Other'
];

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: '',
    amount: '',
    description: '',
    notes: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, [selectedDate]);

  const fetchExpenses = async () => {
    try {
      const data = await expenseService.getAll({ date: selectedDate });
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      await expenseService.create(expenseData);
      await fetchExpenses();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      type: '',
      amount: '',
      description: '',
      notes: ''
    });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesByType = expenses.reduce((acc, expense) => {
    acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topExpenseType = Object.entries(expensesByType).sort(([,a], [,b]) => b - a)[0];

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
              <h1 className="page-title">Expenses Management</h1>
              <p className="page-subtitle">Track and categorize business expenses</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={20} />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Date Filter and Summary */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Calendar size={20} color="#2563eb" />
              <input
                type="date"
                className="form-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: 'auto' }}
              />
            </div>
            <div className="badge badge-danger">
              {expenses.length} expenses recorded
            </div>
          </div>

          <div className="grid grid-3">
            <div className="stat-card danger">
              <div className="stat-icon" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}>
                <TrendingDown size={24} />
              </div>
              <div className="stat-value">Rs.{totalExpenses.toLocaleString()}</div>
              <div className="stat-label">Total Expenses</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
                <Tag size={24} />
              </div>
              <div className="stat-value">{Object.keys(expensesByType).length}</div>
              <div className="stat-label">Categories Used</div>
            </div>
            
            <div className="stat-card warning">
              <div className="stat-icon" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}>
                <Receipt size={24} />
              </div>
              <div className="stat-value">
                {topExpenseType ? `Rs.${topExpenseType[1].toLocaleString()}` : 'Rs.0'}
              </div>
              <div className="stat-label">
                {topExpenseType ? topExpenseType[0] : 'No expenses'}
              </div>
            </div>
          </div>
        </div>

        {/* Expense Categories Overview */}
        {Object.keys(expensesByType).length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <h3 className="card-title">Expense Breakdown</h3>
              <p className="card-description">Distribution by category</p>
            </div>
            <div className="grid grid-3">
              {Object.entries(expensesByType)
                .sort(([,a], [,b]) => b - a)
                .map(([type, amount]) => (
                  <div key={type} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontWeight: '500', color: '#374151' }}>{type}</span>
                    <span style={{ fontWeight: '600', color: '#dc2626' }}>
                      Rs.{amount.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Expenses Table */}
        {expenses.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{format(new Date(expense.createdAt), 'HH:mm')}</td>
                    <td>
                      <span className="badge badge-info">{expense.type}</span>
                    </td>
                    <td>{expense.description}</td>
                    <td style={{ fontWeight: '600', color: '#dc2626' }}>
                      Rs.{expense.amount.toLocaleString()}
                    </td>
                    <td>{expense.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ color: '#64748b', marginBottom: '1rem' }}>
              No expenses recorded for {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={20} />
              Record Your First Expense
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Expense</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {expenseTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Amount (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the expense"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional details..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;