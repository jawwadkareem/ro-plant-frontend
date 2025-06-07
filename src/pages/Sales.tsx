// import React, { useState, useEffect } from 'react';
// import { Plus, Calendar, DollarSign, Package, TrendingUp } from 'lucide-react';
// import { salesService } from '../services/api';
// import { format } from 'date-fns';

// interface Sale {
//   _id: string;
//   date: string;
//   units: number;
//   unitRate: number;
//   totalBill: number;
//   counterCash: number;
//   customerName?: string;
//   notes?: string;
//   createdAt: string;
// }

// const Sales: React.FC = () => {
//   const [sales, setSales] = useState<Sale[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [formData, setFormData] = useState({
//     date: format(new Date(), 'yyyy-MM-dd'),
//     units: '',
//     unitRate: '',
//     counterCash: '',
//     customerName: '',
//     notes: ''
//   });

//   useEffect(() => {
//     fetchSales();
//   }, [selectedDate]);

//   const fetchSales = async () => {
//     try {
//       const data = await salesService.getAll({ date: selectedDate });
//       setSales(data);
//     } catch (error) {
//       console.error('Error fetching sales:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const saleData = {
//         ...formData,
//         units: parseInt(formData.units),
//         unitRate: parseFloat(formData.unitRate),
//         counterCash: parseFloat(formData.counterCash),
//         totalBill: parseInt(formData.units) * parseFloat(formData.unitRate)
//       };
      
//       await salesService.create(saleData);
//       await fetchSales();
//       setShowModal(false);
//       resetForm();
//     } catch (error) {
//       console.error('Error creating sale:', error);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       date: format(new Date(), 'yyyy-MM-dd'),
//       units: '',
//       unitRate: '',
//       counterCash: '',
//       customerName: '',
//       notes: ''
//     });
//   };

//   const totalSales = sales.reduce((sum, sale) => sum + sale.totalBill, 0);
//   const totalCash = sales.reduce((sum, sale) => sum + sale.counterCash, 0);
//   const totalUnits = sales.reduce((sum, sale) => sum + sale.units, 0);

//   if (isLoading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="page-header">
//         <div className="container">
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <div>
//               <h1 className="page-title">Sales Management</h1>
//               <p className="page-subtitle">Track daily sales and revenue</p>
//             </div>
//             <button className="btn btn-primary" onClick={() => setShowModal(true)}>
//               <Plus size={20} />
//               Record Sale
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="container">
//         {/* Date Filter and Summary */}
//         <div className="card" style={{ marginBottom: '2rem' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//               <Calendar size={20} color="#2563eb" />
//               <input
//                 type="date"
//                 className="form-input"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 style={{ width: 'auto' }}
//               />
//             </div>
//             <div className="badge badge-info">
//               {sales.length} sales recorded
//             </div>
//           </div>

//           <div className="grid grid-4">
//             <div className="stat-card success">
//               <div className="stat-icon">
//                 <DollarSign size={20} />
//               </div>
//               <div className="stat-value">Rs.{totalSales.toLocaleString()}</div>
//               <div className="stat-label">Total Sales</div>
//             </div>
            
//             <div className="stat-card">
//               <div className="stat-icon" style={{ background: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
//                 <DollarSign size={20} />
//               </div>
//               <div className="stat-value">Rs.{totalCash.toLocaleString()}</div>
//               <div className="stat-label">Cash Collected</div>
//             </div>
            
//             <div className="stat-card">
//               <div className="stat-icon" style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
//                 <Package size={20} />
//               </div>
//               <div className="stat-value">{totalUnits}</div>
//               <div className="stat-label">Units Sold</div>
//             </div>
            
//             <div className="stat-card">
//               <div className="stat-icon" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}>
//                 <TrendingUp size={20} />
//               </div>
//               <div className="stat-value">Rs.{totalUnits > 0 ? (totalSales / totalUnits).toFixed(2) : '0'}</div>
//               <div className="stat-label">Avg. Rate</div>
//             </div>
//           </div>
//         </div>

//         {/* Sales Table */}
//         {sales.length > 0 ? (
//           <div className="table-container">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Time</th>
//                   <th>Customer</th>
//                   <th>Units</th>
//                   <th>Unit Rate</th>
//                   <th>Total Bill</th>
//                   <th>Cash Received</th>
//                   <th>Balance</th>
//                   <th>Notes</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sales.map((sale) => (
//                   <tr key={sale._id}>
//                     <td>{format(new Date(sale.createdAt), 'HH:mm')}</td>
//                     <td>{sale.customerName || '-'}</td>
//                     <td>{sale.units}</td>
//                     <td>Rs.{sale.unitRate}</td>
//                     <td style={{ fontWeight: '600', color: '#059669' }}>
//                       Rs.{sale.totalBill.toLocaleString()}
//                     </td>
//                     <td>Rs.{sale.counterCash.toLocaleString()}</td>
//                     <td>
//                       <span className={`badge ${sale.totalBill - sale.counterCash === 0 ? 'badge-success' : sale.totalBill - sale.counterCash > 0 ? 'badge-warning' : 'badge-danger'}`}>
//                         Rs.{(sale.totalBill - sale.counterCash).toLocaleString()}
//                       </span>
//                     </td>
//                     <td>{sale.notes || '-'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
//             <div style={{ color: '#64748b', marginBottom: '1rem' }}>
//               No sales recorded for {format(new Date(selectedDate), 'MMMM d, yyyy')}
//             </div>
//             <button className="btn btn-primary" onClick={() => setShowModal(true)}>
//               <Plus size={20} />
//               Record Your First Sale
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="modal-overlay" onClick={() => setShowModal(false)}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2 className="modal-title">Record New Sale</h2>
//               <button className="modal-close" onClick={() => setShowModal(false)}>
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-2">
//                 <div className="form-group">
//                   <label className="form-label">Date *</label>
//                   <input
//                     type="date"
//                     className="form-input"
//                     value={formData.date}
//                     onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Customer Name</label>
//                   <input
//                     type="text"
//                     className="form-input"
//                     value={formData.customerName}
//                     onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
//                     placeholder="Optional"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-2">
//                 <div className="form-group">
//                   <label className="form-label">Units Sold *</label>
//                   <input
//                     type="number"
//                     className="form-input"
//                     value={formData.units}
//                     onChange={(e) => setFormData({ ...formData, units: e.target.value })}
//                     min="1"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Unit Rate (Rs.) *</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     className="form-input"
//                     value={formData.unitRate}
//                     onChange={(e) => setFormData({ ...formData, unitRate: e.target.value })}
//                     min="0"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Total Bill</label>
//                 <div style={{ 
//                   padding: '0.75rem 1rem', 
//                   background: '#f8fafc', 
//                   border: '2px solid #e5e7eb',
//                   borderRadius: '8px',
//                   fontSize: '1.25rem',
//                   fontWeight: '600',
//                   color: '#059669'
//                 }}>
//                   Rs.{(parseInt(formData.units || '0') * parseFloat(formData.unitRate || '0')).toLocaleString()}
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Counter Cash Received (Rs.) *</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className="form-input"
//                   value={formData.counterCash}
//                   onChange={(e) => setFormData({ ...formData, counterCash: e.target.value })}
//                   min="0"
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Notes</label>
//                 <textarea
//                   className="form-input form-textarea"
//                   value={formData.notes}
//                   onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                   placeholder="Any additional notes..."
//                 />
//               </div>

//               <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
//                 <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary">
//                   Record Sale
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sales;

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
  customerId?: string; // Added to store customer ID
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
    customerId: '', // Added to store selected customer ID
    notes: ''
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
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
    try {
      let customerId = formData.customerId;
      // Check if customer exists; if not, create a new one
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

      await salesService.create(saleData);
      await salesService.getAll({ date: selectedDate });
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating sale:', error);
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
              <h1 className="page-title">Sales Management</h1>
              <p className="page-subtitle">Track daily sales and revenue</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={20} />
              Record Sale
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
            <div className="badge badge-info">
              {sales.length} sales recorded
            </div>
          </div>

          <div className="grid grid-4">
            <div className="stat-card success">
              <div className="stat-icon">
                <DollarSign size={20} />
              </div>
              <div className="stat-value">Rs.{totalSales.toLocaleString()}</div>
              <div className="stat-label">Total Sales</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
                <DollarSign size={20} />
              </div>
              <div className="stat-value">Rs.{totalCash.toLocaleString()}</div>
              <div className="stat-label">Cash Collected</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
                <Package size={20} />
              </div>
              <div className="stat-value">{totalUnits}</div>
              <div className="stat-label">Units Sold</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}>
                <TrendingUp size={20} />
              </div>
              <div className="stat-value">Rs.{totalUnits > 0 ? (totalSales / totalUnits).toFixed(2) : '0'}</div>
              <div className="stat-label">Avg. Rate</div>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        {sales.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Customer</th>
                  <th>Units</th>
                  <th>Unit Rate</th>
                  <th>Total Bill</th>
                  <th>Cash Received</th>
                  <th>Balance</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id}>
                    <td>{format(new Date(sale.createdAt), 'HH:mm')}</td>
                    <td>{sale.customerName || '-'}</td>
                    <td>{sale.units}</td>
                    <td>Rs.{sale.unitRate}</td>
                    <td style={{ fontWeight: '600', color: '#059669' }}>
                      Rs.{sale.totalBill.toLocaleString()}
                    </td>
                    <td>Rs.{sale.counterCash.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${sale.totalBill - sale.counterCash === 0 ? 'badge-success' : sale.totalBill - sale.counterCash > 0 ? 'badge-warning' : 'badge-danger'}`}>
                        Rs.{(sale.totalBill - sale.counterCash).toLocaleString()}
                      </span>
                    </td>
                    <td>{sale.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ color: '#64748b', marginBottom: '1rem' }}>
              No sales recorded for {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={20} />
              Record Your First Sale
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Record New Sale</h2>
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

                <div className="form-group relative">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.customerName}
                    onChange={(e) => handleCustomerInput(e.target.value)}
                    placeholder="Type to search or add new customer"
                    ref={customerInputRef}
                  />
                  {showSuggestions && filteredCustomers.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto">
                      {filteredCustomers.map((customer) => (
                        <li
                          key={customer._id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          {customer.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Units Sold *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Unit Rate (Rs.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formData.unitRate}
                    onChange={(e) => setFormData({ ...formData, unitRate: e.target.value })}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Total Bill</label>
                <div style={{ 
                  padding: '0.75rem 1rem', 
                  background: '#f8fafc', 
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#059669'
                }}>
                  Rs.{(parseInt(formData.units || '0') * parseFloat(formData.unitRate || '0')).toLocaleString()}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Counter Cash Received (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.counterCash}
                  onChange={(e) => setFormData({ ...formData, counterCash: e.target.value })}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
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