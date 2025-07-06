
// import React, { useState, useEffect, useRef } from 'react';
// import { Plus, Calendar, DollarSign, Package, TrendingUp, Edit, Trash2 } from 'lucide-react';
// import { salesService, customerService } from '../services/api';
// import { format } from 'date-fns';

// interface Sale {
//   _id: string;
//   date: string;
//   units: number;
//   unitRate: number;
//   totalBill: number;
//   counterCash: number;
//   customerName?: string;
//   customerId?: string;
//   notes?: string;
//   createdAt: string;
// }

// interface Customer {
//   _id: string;
//   name: string;
// }

// const Sales: React.FC = () => {
//   const [sales, setSales] = useState<Sale[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [formData, setFormData] = useState({
//     date: format(new Date(), 'yyyy-MM-dd'),
//     units: '',
//     unitRate: '',
//     counterCash: '',
//     customerName: '',
//     customerId: '',
//     notes: ''
//   });
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const customerInputRef = useRef<HTMLInputElement>(null);
//   const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const [salesData, customersData] = await Promise.all([
//           salesService.getAll({ date: selectedDate }),
//           customerService.getAll()
//         ]);
//         setSales(salesData);
//         setCustomers(customersData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, [selectedDate]);

//   const handleCustomerInput = (value: string) => {
//     setFormData({ ...formData, customerName: value, customerId: '' });
//     if (value.trim()) {
//       const filtered = customers.filter((customer) =>
//         customer.name.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredCustomers(filtered);
//       setShowSuggestions(true);
//     } else {
//       setFilteredCustomers([]);
//       setShowSuggestions(false);
//     }
//   };

//   const handleSelectCustomer = (customer: Customer) => {
//     setFormData({ ...formData, customerName: customer.name, customerId: customer._id });
//     setShowSuggestions(false);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isSubmitting) return;

//     setIsSubmitting(true);
//     try {
//       let customerId = formData.customerId;
//       if (!customerId && formData.customerName.trim()) {
//         const existingCustomer = customers.find(
//           (c) => c.name.toLowerCase() === formData.customerName.toLowerCase()
//         );
//         if (!existingCustomer) {
//           const newCustomer = await customerService.create({ name: formData.customerName });
//           customerId = newCustomer._id;
//           setCustomers([...customers, newCustomer]);
//         } else {
//           customerId = existingCustomer._id;
//         }
//       }

//       const saleData = {
//         date: formData.date,
//         units: parseInt(formData.units),
//         unitRate: parseFloat(formData.unitRate),
//         counterCash: parseFloat(formData.counterCash),
//         totalBill: parseInt(formData.units) * parseFloat(formData.unitRate),
//         customerId: customerId || undefined,
//         notes: formData.notes
//       };

//       if (selectedSale) {
//         const updatedSale = await salesService.update(selectedSale._id, saleData);
//         setSales(sales.map(s => s._id === updatedSale._id ? updatedSale : s));
//       } else {
//         const newSale = await salesService.create(saleData);
//         setSales((prevSales) => [...prevSales, newSale]);
//       }

//       const updatedSales = await salesService.getAll({ date: selectedDate });
//       setSales(updatedSales);

//       setShowModal(false);
//       setShowEditModal(false);
//       resetForm();
//     } catch (error) {
//       console.error('Error saving sale:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (window.confirm('Are you sure you want to delete this sale?')) {
//       try {
//         await salesService.delete(id);
//         const updatedSales = await salesService.getAll({ date: selectedDate });
//         setSales(updatedSales);
//       } catch (error) {
//         console.error('Error deleting sale:', error);
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       date: format(new Date(), 'yyyy-MM-dd'),
//       units: '',
//       unitRate: '',
//       counterCash: '',
//       customerName: '',
//       customerId: '',
//       notes: ''
//     });
//     setShowSuggestions(false);
//     setSelectedSale(null);
//   };

//   const openModal = (sale?: Sale) => {
//     if (sale) {
//       setSelectedSale(sale);
//       setFormData({
//         date: format(new Date(sale.date), 'yyyy-MM-dd'),
//         units: sale.units.toString(),
//         unitRate: sale.unitRate.toString(),
//         counterCash: sale.counterCash.toString(),
//         customerName: sale.customerName || '',
//         customerId: sale.customerId || '',
//         notes: sale.notes || ''
//       });
//       setShowEditModal(true);
//     } else {
//       resetForm();
//       setShowModal(true);
//     }
//   };

//   const totalSales = sales.reduce((sum, sale) => sum + sale.totalBill, 0);
//   const totalCash = sales.reduce((sum, sale) => sum + sale.counterCash, 0);
//   const totalUnits = sales.reduce((sum, sale) => sum + sale.units, 0);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="page-header py-6">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div>
//               <h1 className="page-title text-2xl md:text-3xl font-bold text-gray-900">Sales Management</h1>
//               <p className="page-subtitle text-sm md:text-base text-gray-600">Track daily sales and revenue</p>
//             </div>
//             <button
//               className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base disabled:opacity-50"
//               onClick={() => openModal()}
//               disabled={isSubmitting}
//             >
//               <Plus size={16} />
//               Record Sale
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-6">
//         {/* Date Filter and Summary */}
//         <div className="card bg-white p-4 md:p-6 rounded-lg shadow mb-6">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
//             <div className="flex items-center gap-3">
//               <Calendar size={18} color="#2563eb" />
//               <input
//                 type="date"
//                 className="form-input p-2 border rounded text-sm md:text-base"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//               />
//             </div>
//             <div className="badge badge-info p-1 text-sm md:text-base">
//               {sales.length} sales recorded
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="stat-card p-4 rounded-lg shadow">
//               <div className="stat-icon flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
//                 <DollarSign size={20} />
//               </div>
//               <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
//                 Rs.{totalSales.toLocaleString()}
//               </div>
//               <div className="stat-label text-sm md:text-base text-gray-600">Total Sales</div>
//             </div>
            
//             <div className="stat-card p-4 rounded-lg shadow">
//               <div className="stat-icon flex items-center justify-center w-10 h-10 bg-teal-100 rounded-full">
//                 <DollarSign size={20} />
//               </div>
//               <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
//                 Rs.{totalCash.toLocaleString()}
//               </div>
//               <div className="stat-label text-sm md:text-base text-gray-600">Cash Collected</div>
//             </div>
            
//             <div className="stat-card p-4 rounded-lg shadow">
//               <div className="stat-icon flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
//                 <Package size={20} />
//               </div>
//               <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
//                 {totalUnits}
//               </div>
//               <div className="stat-label text-sm md:text-base text-gray-600">Units Sold</div>
//             </div>
            
//             <div className="stat-card p-4 rounded-lg shadow">
//               <div className="stat-icon flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full">
//                 <TrendingUp size={20} />
//               </div>
//               <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
//                 Rs.{totalUnits > 0 ? (totalSales / totalUnits).toFixed(2) : '0'}
//               </div>
//               <div className="stat-label text-sm md:text-base text-gray-600">Avg. Rate</div>
//             </div>
//           </div>
//         </div>

//         {/* Sales Table */}
//         {sales.length > 0 ? (
//           <div className="table-container overflow-x-auto">
//             <table className="table w-full text-sm md:text-base">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-2 md:p-3 text-left">Time</th>
//                   <th className="p-2 md:p-3 text-left">Customer</th>
//                   <th className="p-2 md:p-3 text-left">Units</th>
//                   <th className="p-2 md:p-3 text-left">Unit Rate</th>
//                   <th className="p-2 md:p-3 text-left">Total Bill</th>
//                   <th className="p-2 md:p-3 text-left">Cash Received</th>
//                   <th className="p-2 md:p-3 text-left">Balance</th>
//                   <th className="p-2 md:p-3 text-left">Notes</th>
//                   <th className="p-2 md:p-3 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sales.map((sale) => (
//                   <tr key={sale._id} className="border-b">
//                     <td className="p-2 md:p-3">{format(new Date(sale.createdAt), 'HH:mm')}</td>
//                     <td className="p-2 md:p-3">{sale.customerName || '-'}</td>
//                     <td className="p-2 md:p-3">{sale.units}</td>
//                     <td className="p-2 md:p-3">Rs.{sale.unitRate}</td>
//                     <td className="p-2 md:p-3 font-semibold text-green-600">
//                       Rs.{sale.totalBill.toLocaleString()}
//                     </td>
//                     <td className="p-2 md:p-3">Rs.{sale.counterCash.toLocaleString()}</td>
//                     <td className="p-2 md:p-3">
//                       <span className={`badge p-1 text-xs md:text-sm ${sale.totalBill - sale.counterCash === 0 ? 'badge-success' : sale.totalBill - sale.counterCash > 0 ? 'badge-warning' : 'badge-danger'}`}>
//                         Rs.{(sale.totalBill - sale.counterCash).toLocaleString()}
//                       </span>
//                     </td>
//                     <td className="p-2 md:p-3">{sale.notes || '-'}</td>
//                     <td className="p-2 md:p-3">
//                       <div className="flex gap-2">
//                         <button
//                           className="btn btn-secondary text-sm"
//                           onClick={() => openModal(sale)}
//                         >
//                           <Edit size={16} />
//                         </button>
//                         <button
//                           className="btn btn-danger text-sm"
//                           onClick={() => handleDelete(sale._id)}
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="card bg-white p-6 rounded-lg shadow text-center">
//             <div className="text-gray-500 mb-4">
//               No sales recorded for {format(new Date(selectedDate), 'MMMM d, yyyy')}
//             </div>
//             <button
//               className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base"
//               onClick={() => openModal()}
//               disabled={isSubmitting}
//             >
//               <Plus size={16} />
//               Record Your First Sale
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Add Modal */}
//       {showModal && (
//         <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
//           <div className="modal bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header flex justify-between items-center mb-4">
//               <h2 className="modal-title text-xl font-semibold text-gray-900">Record New Sale</h2>
//               <button className="modal-close text-2xl font-bold text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="form-group">
//                   <label className="form-label block text-sm font-medium text-gray-700">Date *</label>
//                   <input
//                     type="date"
//                     className="form-input w-full p-2 border rounded text-sm"
//                     value={formData.date}
//                     onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                     required
//                   />
//                 </div>

//                 <div className="form-group relative">
//                   <label className="form-label block text-sm font-medium text-gray-700">Customer Name</label>
//                   <input
//                     type="text"
//                     className="form-input w-full p-2 border rounded text-sm"
//                     value={formData.customerName}
//                     onChange={(e) => handleCustomerInput(e.target.value)}
//                     placeholder="Type to search or add new customer"
//                     ref={customerInputRef}
//                   />
//                   {showSuggestions && filteredCustomers.length > 0 && (
//                     <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-40 overflow-auto">
//                       {filteredCustomers.map((customer) => (
//                         <li
//                           key={customer._id}
//                           className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
//                           onClick={() => handleSelectCustomer(customer)}
//                         >
//                           {customer.name}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                 <div className="form-group">
//                   <label className="form-label block text-sm font-medium text-gray-700">Units Sold *</label>
//                   <input
//                     type="number"
//                     className="form-input w-full p-2 border rounded text-sm"
//                     value={formData.units}
//                     onChange={(e) => setFormData({ ...formData, units: e.target.value })}
//                     min="1"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label block text-sm font-medium text-gray-700">Unit Rate (Rs.) *</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     className="form-input w-full p-2 border rounded text-sm"
//                     value={formData.unitRate}
//                     onChange={(e) => setFormData({ ...formData, unitRate: e.target.value })}
//                     min="0"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="form-group mt-4">
//                 <label className="form-label block text-sm font-medium text-gray-700">Total Bill</label>
//                 <div className="p-2 bg-gray-50 border border-gray-200 rounded text-lg font-semibold text-green-600">
//                   Rs.{(parseInt(formData.units || '0') * parseFloat(formData.unitRate || '0')).toLocaleString()}
//                 </div>
//               </div>

//               <div className="form-group mt-4">
//                 <label className="form-label block text-sm font-medium text-gray-700">Counter Cash Received (Rs.) *</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className="form-input w-full p-2 border rounded text-sm"
//                   value={formData.counterCash}
//                   onChange={(e) => setFormData({ ...formData, counterCash: e.target.value })}
//                   min="0"
//                   required
//                 />
//               </div>

//               <div className="form-group mt-4">
//                 <label className="form-label block text-sm font-medium text-gray-700">Notes</label>
//                 <textarea
//                   className="form-input w-full p-2 border rounded text-sm"
//                   value={formData.notes}
//                   onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                   placeholder="Any additional notes..."
//                 />
//               </div>

//               <div className="flex justify-end gap-4 mt-6">
//                 <button type="button" className="btn btn-outline px-4 py-2 text-sm" onClick={() => setShowModal(false)}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary px-4 py-2 text-sm" disabled={isSubmitting}>
//                   Record Sale
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && (
//         <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
//           <div className="modal bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header flex justify-between items-center mb-4">
//               <h2 className="modal-title text-xl font-semibold text-gray-900">Edit Sale</h2>
//               <button className="modal-close text-2xl font-bold text-gray-500 hover:text-gray-700" onClick={() => setShowEditModal(false)}>
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="form-group">
//                   <label className="form-label block text-sm font-medium text-gray-700">Date *</label>
//                   <input
//                     type="date"
//                     className="form-input w-full p-2 border rounded text-sm"
//                     value={formData.date}
//                     onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                     required
//                   />
//                 </div>

//                 <div className="form-group relative">
//                   <label className="form-label block text-sm font-medium text-gray-700">Customer Name</label>
//                   <input
//                     type="text"
//                     className="form-input w-full p-2 border rounded text-sm"
//                     value={formData.customerName}
//                     onChange={(e) => handleCustomerInput(e.target.value)}
//                     placeholder="Type to search or add new customer"
//                     ref={customerInputRef}
//                   />
//                   {showSuggestions && filteredCustomers.length > 0 && (
//                     <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-40 overflow-auto">
//                       {filteredCustomers.map((customer) => (
//                         <li
//                           key={customer._id}
//                           className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
//                           onClick={() => handleSelectCustomer(customer)}
//                         >
//                           {customer.name}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                 <div className="form-group">
//                   <label className="form-label block text-sm font-medium text-gray-700">Units Sold *</label>
//                   <input
//                     type="number"
//                     className="form-input w-full p-2 border rounded text-sm"
//                     value={formData.units}
//                     onChange={(e) => setFormData({ ...formData, units: e.target.value })}
//                     min="1"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label block text-sm font-medium text-gray-700">Unit Rate (Rs.) *</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     className="form-input w-full p-2 border rounded text-sm"
//                     value={formData.unitRate}
//                     onChange={(e) => setFormData({ ...formData, unitRate: e.target.value })}
//                     min="0"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="form-group mt-4">
//                 <label className="form-label block text-sm font-medium text-gray-700">Total Bill</label>
//                 <div className="p-2 bg-gray-50 border border-gray-200 rounded text-lg font-semibold text-green-600">
//                   Rs.{(parseInt(formData.units || '0') * parseFloat(formData.unitRate || '0')).toLocaleString()}
//                 </div>
//               </div>

//               <div className="form-group mt-4">
//                 <label className="form-label block text-sm font-medium text-gray-700">Counter Cash Received (Rs.) *</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className="form-input w-full p-2 border rounded text-sm"
//                   value={formData.counterCash}
//                   onChange={(e) => setFormData({ ...formData, counterCash: e.target.value })}
//                   min="0"
//                   required
//                 />
//               </div>

//               <div className="form-group mt-4">
//                 <label className="form-label block text-sm font-medium text-gray-700">Notes</label>
//                 <textarea
//                   className="form-input w-full p-2 border rounded text-sm"
//                   value={formData.notes}
//                   onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                   placeholder="Any additional notes..."
//                 />
//               </div>

//               <div className="flex justify-end gap-4 mt-6">
//                 <button type="button" className="btn btn-outline px-4 py-2 text-sm" onClick={() => setShowEditModal(false)}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary px-4 py-2 text-sm" disabled={isSubmitting}>
//                   Update Sale
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
import { Plus, Calendar, DollarSign, Package, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { salesService, customerService } from '../services/api';

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
  amountLeft?: number;
  isCreditor?: boolean;
}

interface Customer {
  _id: string;
  name: string;
  unitRate?: number;
}

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCashOnlyModal, setShowCashOnlyModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    units: '',
    unitRate: '',
    counterCash: '',
    customerName: '',
    customerId: '',
    notes: '',
    isCreditor: false,
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customerInputRef = useRef<HTMLInputElement>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [avgSalesPerDay, setAvgSalesPerDay] = useState(0);
  const [customerOutstanding, setCustomerOutstanding] = useState(0);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [salesRes, customersRes] = await Promise.all([
        salesService.getAll({ date: selectedDate }),
        customerService.getAll(),
      ]);
      setSales(salesRes);
      setCustomers(customersRes);

      const uniqueDates = [...new Set(salesRes.map((s) => s.date.toISOString().split('T')[0]))];
      const totalSales = salesRes.reduce((sum, sale) => sum + (sale.totalBill || 0), 0);
      setAvgSalesPerDay(uniqueDates.length > 0 ? totalSales / uniqueDates.length : 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerInput = (value) => {
    setFormData((prev) => ({ ...prev, customerName: value, customerId: '' }));
    updateOutstandingAmount(value);
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

  const handleSelectCustomer = (customer) => {
    setFormData((prev) => ({
      ...prev,
      customerName: customer.name,
      customerId: customer._id,
      unitRate: customer.unitRate?.toString() || prev.unitRate,
    }));
    updateOutstandingAmount(customer.name);
    setShowSuggestions(false);
  };

  const updateOutstandingAmount = (customerName) => {
    const customerSales = sales.filter(sale =>
      sale.customerName === customerName && sale.isCreditor && sale.amountLeft !== undefined
    );
    const totalOutstanding = customerSales.reduce((sum, sale) => sum + (sale.amountLeft || 0), 0);
    setCustomerOutstanding(totalOutstanding);
  };

  const calculateTotalBill = () => {
    const units = parseInt(formData.units) || 0;
    const unitRate = parseFloat(formData.unitRate) || 0;
    const currentBill = units * unitRate;
    return currentBill + customerOutstanding;
  };

  const calculateAmountLeft = () => {
    const totalBill = calculateTotalBill();
    const counterCash = parseFloat(formData.counterCash) || 0;
    return Math.max(0, totalBill - counterCash);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      let customerId = formData.customerId;
      if (!customerId && formData.customerName.trim()) {
        const existingCustomer = customers.find(
          (c) => c.name.toLowerCase() === formData.customerName.toLowerCase()
        );
        if (!existingCustomer) {
          const newCustomer = await customerService.create({
            name: formData.customerName,
            unitRate: formData.unitRate ? parseFloat(formData.unitRate) : undefined,
          });
          customerId = newCustomer._id;
          setCustomers((prev) => [...prev, newCustomer]);
        } else {
          customerId = existingCustomer._id;
        }
      }

      const units = parseInt(formData.units) || 0;
      const unitRate = parseFloat(formData.unitRate) || 0;
      const totalBill = units * unitRate;
      const counterCash = parseFloat(formData.counterCash) || 0;
      const amountLeft = formData.isCreditor ? calculateAmountLeft() : 0;

      const saleData = {
        date: formData.date,
        units,
        unitRate,
        totalBill,
        counterCash,
        customerId: customerId || undefined,
        customerName: customerId ? undefined : formData.customerName,
        notes: formData.notes,
        isCreditor: formData.isCreditor,
        amountLeft,
      };

      let response;
      if (selectedSale) {
        response = await salesService.update(selectedSale._id, saleData);
        setSales((prev) => prev.map((s) => (s._id === response._id ? response : s)));
      } else {
        response = await salesService.create(saleData);
        setSales((prev) => [...prev, response]);
      }

      setShowModal(false);
      setShowEditModal(false);
      setShowCashOnlyModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving sale:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCashOnlySubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const totalBill = parseFloat(formData.counterCash) || 0;
      const saleData = {
        date: formData.date,
        units: 0,
        unitRate: 0,
        totalBill,
        counterCash: totalBill,
        customerId: undefined,
        customerName: undefined,
        notes: formData.notes,
        isCreditor: false,
        amountLeft: 0,
      };

      const response = await salesService.create(saleData);
      setSales((prev) => [...prev, response]);
      setShowCashOnlyModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving cash-only sale:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await salesService.delete(id);
        setSales((prev) => prev.filter((s) => s._id !== id));
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      units: '',
      unitRate: '',
      counterCash: '',
      customerName: '',
      customerId: '',
      notes: '',
      isCreditor: false,
    });
    setShowSuggestions(false);
    setSelectedSale(null);
    setCustomerOutstanding(0);
  };

  const openModal = (sale, cashOnly = false) => {
    if (sale) {
      setSelectedSale(sale);
      setFormData({
        date: new Date(sale.date).toISOString().split('T')[0],
        units: sale.units.toString(),
        unitRate: sale.unitRate.toString(),
        counterCash: sale.counterCash.toString(),
        customerName: sale.customerName || '',
        customerId: sale.customerId || '',
        notes: sale.notes || '',
        isCreditor: sale.isCreditor || false,
      });
      updateOutstandingAmount(sale.customerName || '');
      setShowEditModal(true);
    } else if (cashOnly) {
      resetForm();
      setShowCashOnlyModal(true);
    } else {
      resetForm();
      setShowModal(true);
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + (sale.totalBill || 0), 0);
  const totalCash = sales.reduce((sum, sale) => sum + (sale.counterCash || 0), 0);
  const totalUnits = sales.reduce((sum, sale) => sum + (sale.units || 0), 0);

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
            <div className="flex gap-2">
              <button
                className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base disabled:opacity-50"
                onClick={() => openModal(null)}
                disabled={isSubmitting}
              >
                <Plus size={16} />
                Record Sale
              </button>
              <button
                className="btn btn-secondary flex items-center gap-2 px-4 py-2 text-sm md:text-base disabled:opacity-50"
                onClick={() => openModal(null, true)}
                disabled={isSubmitting}
              >
                <DollarSign size={16} />
                Cash Only
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                Rs.{totalUnits > 0 ? (totalSales / totalUnits).toFixed(2) : '0.00'}
              </div>
              <div className="stat-label text-sm md:text-base text-gray-600">Avg. Rate</div>
            </div>
            
            <div className="stat-card p-4 rounded-lg shadow">
              <div className="stat-icon flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <TrendingUp size={20} />
              </div>
              <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
                Rs.{avgSalesPerDay.toFixed(2)}
              </div>
              <div className="stat-label text-sm md:text-base text-gray-600">Avg Sales/Day</div>
            </div>
          </div>
        </div>

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
                  <th className="p-2 md:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id} className="border-b">
                    <td className="p-2 md:p-3">{new Date(sale.createdAt).toLocaleTimeString()}</td>
                    <td className="p-2 md:p-3">
                      {sale.customerName || (sale.customerId && customers.find((c) => c._id === sale.customerId)?.name) || '-'}
                    </td>
                    <td className="p-2 md:p-3">{sale.units || 0}</td>
                    <td className="p-2 md:p-3">Rs.{(sale.unitRate || 0).toLocaleString()}</td>
                    <td className="p-2 md:p-3 font-semibold text-green-600">
                      Rs.{(sale.totalBill || 0).toLocaleString()}
                    </td>
                    <td className="p-2 md:p-3">Rs.{(sale.counterCash || 0).toLocaleString()}</td>
                    <td className="p-2 md:p-3">
                      <span
                        className={`badge p-1 text-xs md:text-sm ${
                          sale.amountLeft === 0 ? 'badge-success' : 'badge-warning'
                        }`}
                      >
                        Rs.{(sale.amountLeft || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-2 md:p-3">{sale.notes || '-'}</td>
                    <td className="p-2 md:p-3">
                      <div className="flex gap-2">
                        <button className="btn btn-secondary text-sm" onClick={() => openModal(sale)}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-danger text-sm" onClick={() => handleDelete(sale._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card bg-white p-6 rounded-lg shadow text-center">
            <div className="text-gray-500 mb-4">
              No sales recorded for {new Date(selectedDate).toLocaleDateString()}
            </div>
            <button
              className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base"
              onClick={() => openModal(null)}
              disabled={isSubmitting}
            >
              <Plus size={16} />
              Record Your First Sale
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div className="modal bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="modal-title text-xl font-semibold text-gray-900">Record New Sale</h2>
              <button
                className="modal-close text-2xl font-bold text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
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
                  {formData.customerName && (
                    <div className="mt-2 text-sm text-gray-600">
                      Total Outstanding: Rs.{customerOutstanding.toLocaleString()}
                    </div>
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        units: e.target.value,
                      })
                    }
                    min="0"
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unitRate: e.target.value,
                      })
                    }
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Current Bill</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded text-lg font-semibold text-green-600">
                  Rs.{((parseInt(formData.units) || 0) * (parseFloat(formData.unitRate) || 0)).toLocaleString()}
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Total Bill (Including Outstanding)</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded text-lg font-semibold text-green-600">
                  Rs.{calculateTotalBill().toLocaleString()}
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Counter Cash Received (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.counterCash}
                  onChange={(e) => {
                    const newCounterCash = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      counterCash: newCounterCash,
                      isCreditor: parseFloat(newCounterCash) < calculateTotalBill(),
                    }));
                  }}
                  min="0"
                  required
                />
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Amount Left</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded text-lg font-semibold text-red-600">
                  Rs.{calculateAmountLeft().toLocaleString()}
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.isCreditor}
                    onChange={(e) => setFormData({ ...formData, isCreditor: e.target.checked })}
                    className="mr-2"
                  />
                  Creditor Sale (Pay Later)
                </label>
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

      {/* Edit Modal */}
      {showEditModal && (
        <div
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowEditModal(false)}
        >
          <div className="modal bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="modal-title text-xl font-semibold text-gray-900">Edit Sale</h2>
              <button
                className="modal-close text-2xl font-bold text-gray-500 hover:text-gray-700"
                onClick={() => setShowEditModal(false)}
              >
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
                  {formData.customerName && (
                    <div className="mt-2 text-sm text-gray-600">
                      Total Outstanding: Rs.{customerOutstanding.toLocaleString()}
                    </div>
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        units: e.target.value,
                      })
                    }
                    min="0"
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unitRate: e.target.value,
                      })
                    }
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Current Bill</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded text-lg font-semibold text-green-600">
                  Rs.{((parseInt(formData.units) || 0) * (parseFloat(formData.unitRate) || 0)).toLocaleString()}
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Total Bill (Including Outstanding)</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded text-lg font-semibold text-green-600">
                  Rs.{calculateTotalBill().toLocaleString()}
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Counter Cash Received (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.counterCash}
                  onChange={(e) => {
                    const newCounterCash = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      counterCash: newCounterCash,
                      isCreditor: parseFloat(newCounterCash) < calculateTotalBill(),
                    }));
                  }}
                  min="0"
                  required
                />
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Amount Left</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded text-lg font-semibold text-red-600">
                  Rs.{calculateAmountLeft().toLocaleString()}
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.isCreditor}
                    onChange={(e) => setFormData({ ...formData, isCreditor: e.target.checked })}
                    className="mr-2"
                  />
                  Creditor Sale (Pay Later)
                </label>
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
                <button type="button" className="btn btn-outline px-4 py-2 text-sm" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4 py-2 text-sm" disabled={isSubmitting}>
                  Update Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cash Only Modal */}
      {showCashOnlyModal && (
        <div
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowCashOnlyModal(false)}
        >
          <div className="modal bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="modal-title text-xl font-semibold text-gray-900">Record Cash Only Sale</h2>
              <button
                className="modal-close text-2xl font-bold text-gray-500 hover:text-gray-700"
                onClick={() => setShowCashOnlyModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCashOnlySubmit}>
              <div className="grid grid-cols-1 gap-4">
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

                <div className="form-group">
                  <label className="form-label block text-sm font-medium text-gray-700">Total Bill (Rs.) *</label>
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
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button type="button" className="btn btn-outline px-4 py-2 text-sm" onClick={() => setShowCashOnlyModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4 py-2 text-sm" disabled={isSubmitting}>
                  Record Cash
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