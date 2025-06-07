
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Calendar, DollarSign, Package, TrendingUp } from 'lucide-react';
import { salesService, customerService } from '../services/api';
import { format } from 'date-fns';

interface Sale {
  _id: string;
  date: string;
  units: number;
  unitRate: number;
  totalBill: number;
  counterCash: number;
  customerName?: string;
  customerId?: string;
  notes?: string;
  createdAt: string;
}

interface Customer {
  _id: string;
  name: string;
}

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    units: '',
    unitRate: '',
    counterCash: '',
    customerName: '',
    customerId: '',
    notes: ''
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to prevent duplicate submissions
  const customerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [salesData, customersData] = await Promise.all([
          salesService.getAll({ date: selectedDate }),
          customerService.getAll()
        ]);
        setSales(salesData);
        setCustomers(customersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  const handleCustomerInput = (value: string) => {
    setFormData({ ...formData, customerName: value, customerId: '' });
    if (value.trim()) {
      const filtered = customers.filter((customer) =>
        customer.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredCustomers([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setFormData({ ...formData, customerName: customer.name, customerId: customer._id });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    try {
      let customerId = formData.customerId;
      if (!customerId && formData.customerName.trim()) {
        const existingCustomer = customers.find(
          (c) => c.name.toLowerCase() === formData.customerName.toLowerCase()
        );
        if (!existingCustomer) {
          const newCustomer = await customerService.create({ name: formData.customerName });
          customerId = newCustomer._id;
          setCustomers([...customers, newCustomer]);
        } else {
          customerId = existingCustomer._id;
        }
      }

      const saleData = {
        ...formData,
        units: parseInt(formData.units),
        unitRate: parseFloat(formData.unitRate),
        counterCash: parseFloat(formData.counterCash),
        totalBill: parseInt(formData.units) * parseFloat(formData.unitRate),
        customerId: customerId || undefined,
      };

      const newSale = await salesService.create(saleData); // Get the created sale
      // Immediately update the sales state with the new sale
      setSales((prevSales) => [...prevSales, newSale]);
      // Optional: Refresh the full list to ensure consistency
      const updatedSales = await salesService.getAll({ date: selectedDate });
      setSales(updatedSales);

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating sale:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      units: '',
      unitRate: '',
      counterCash: '',
      customerName: '',
      customerId: '',
      notes: ''
    });
    setShowSuggestions(false);
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.totalBill, 0);
  const totalCash = sales.reduce((sum, sale) => sum + sale.counterCash, 0);
  const totalUnits = sales.reduce((sum, sale) => sum + sale.units, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="page-title text-2xl md:text-3xl font-bold text-gray-900">Sales Management</h1>
              <p className="page-subtitle text-sm md:text-base text-gray-600">Track daily sales and revenue</p>
            </div>
            <button
              className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base disabled:opacity-50"
              onClick={() => setShowModal(true)}
              disabled={isSubmitting}
            >
              <Plus size={16} />
              Record Sale
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Date Filter and Summary */}
        <div className="card bg-white p-4 md:p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Calendar size={18} color="#2563eb" />
              <input
                type="date"
                className="form-input p-2 border rounded text-sm md:text-base"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="badge badge-info p-1 text-sm md:text-base">
              {sales.length} sales recorded
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card p-4 rounded-lg shadow">
              <div className="stat-icon flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                <DollarSign size={20} />
              </div>
              <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
                Rs.{totalSales.toLocaleString()}
              </div>
              <div className="stat-label text-sm md:text-base text-gray-600">Total Sales</div>
            </div>
            
            <div className="stat-card p-4 rounded-lg shadow">
              <div className="stat-icon flex items-center justify-center w-10 h-10 bg-teal-100 rounded-full">
                <DollarSign size={20} />
              </div>
              <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
                Rs.{totalCash.toLocaleString()}
              </div>
              <div className="stat-label text-sm md:text-base text-gray-600">Cash Collected</div>
            </div>
            
            <div className="stat-card p-4 rounded-lg shadow">
              <div className="stat-icon flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                <Package size={20} />
              </div>
              <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
                {totalUnits}
              </div>
              <div className="stat-label text-sm md:text-base text-gray-600">Units Sold</div>
            </div>
            
            <div className="stat-card p-4 rounded-lg shadow">
              <div className="stat-icon flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full">
                <TrendingUp size={20} />
              </div>
              <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
                Rs.{totalUnits > 0 ? (totalSales / totalUnits).toFixed(2) : '0'}
              </div>
              <div className="stat-label text-sm md:text-base text-gray-600">Avg. Rate</div>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        {sales.length > 0 ? (
          <div className="table-container overflow-x-auto">
            <table className="table w-full text-sm md:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 md:p-3 text-left">Time</th>
                  <th className="p-2 md:p-3 text-left">Customer</th>
                  <th className="p-2 md:p-3 text-left">Units</th>
                  <th className="p-2 md:p-3 text-left">Unit Rate</th>
                  <th className="p-2 md:p-3 text-left">Total Bill</th>
                  <th className="p-2 md:p-3 text-left">Cash Received</th>
                  <th className="p-2 md:p-3 text-left">Balance</th>
                  <th className="p-2 md:p-3 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id} className="border-b">
                    <td className="p-2 md:p-3">{format(new Date(sale.createdAt), 'HH:mm')}</td>
                    <td className="p-2 md:p-3">{sale.customerName || '-'}</td>
                    <td className="p-2 md:p-3">{sale.units}</td>
                    <td className="p-2 md:p-3">Rs.{sale.unitRate}</td>
                    <td className="p-2 md:p-3 font-semibold text-green-600">
                      Rs.{sale.totalBill.toLocaleString()}
                    </td>
                    <td className="p-2 md:p-3">Rs.{sale.counterCash.toLocaleString()}</td>
                    <td className="p-2 md:p-3">
                      <span className={`badge p-1 text-xs md:text-sm ${sale.totalBill - sale.counterCash === 0 ? 'badge-success' : sale.totalBill - sale.counterCash > 0 ? 'badge-warning' : 'badge-danger'}`}>
                        Rs.{(sale.totalBill - sale.counterCash).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-2 md:p-3">{sale.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card bg-white p-6 rounded-lg shadow text-center">
            <div className="text-gray-500 mb-4">
              No sales recorded for {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </div>
            <button
              className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base"
              onClick={() => setShowModal(true)}
              disabled={isSubmitting}
            >
              <Plus size={16} />
              Record Your First Sale
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="modal bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="modal-title text-xl font-semibold text-gray-900">Record New Sale</h2>
              <button className="modal-close text-2xl font-bold text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label block text-sm font-medium text-gray-700">Date *</label>
                  <input
                    type="date"
                    className="form-input w-full p-2 border rounded text-sm"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group relative">
                  <label className="form-label block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    className="form-input w-full p-2 border rounded text-sm"
                    value={formData.customerName}
                    onChange={(e) => handleCustomerInput(e.target.value)}
                    placeholder="Type to search or add new customer"
                    ref={customerInputRef}
                  />
                  {showSuggestions && filteredCustomers.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-40 overflow-auto">
                      {filteredCustomers.map((customer) => (
                        <li
                          key={customer._id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          {customer.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-group">
                  <label className="form-label block text-sm font-medium text-gray-700">Units Sold *</label>
                  <input
                    type="number"
                    className="form-input w-full p-2 border rounded text-sm"
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label block text-sm font-medium text-gray-700">Unit Rate (Rs.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input w-full p-2 border rounded text-sm"
                    value={formData.unitRate}
                    onChange={(e) => setFormData({ ...formData, unitRate: e.target.value })}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Total Bill</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded text-lg font-semibold text-green-600">
                  Rs.{(parseInt(formData.units || '0') * parseFloat(formData.unitRate || '0')).toLocaleString()}
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Counter Cash Received (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.counterCash}
                  onChange={(e) => setFormData({ ...formData, counterCash: e.target.value })}
                  min="0"
                  required
                />
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button type="button" className="btn btn-outline px-4 py-2 text-sm" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4 py-2 text-sm" disabled={isSubmitting}>
                  Record Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;