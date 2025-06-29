// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Edit, Trash2, Eye, Phone, MapPin } from 'lucide-react';
// import { customerService } from '../services/api';

// interface Customer {
//   _id: string;
//   name: string;
//   phone: string;
//   email?: string;
//   address: string;
//   notes?: string;
//   totalPurchases: number;
//   lastPurchase?: string;
//   createdAt: string;
// }

// interface HistoryItem {
//   _id: string;
//   saleId: string;
//   date: string;
//   amount: number;
//   units: number;
//   counterCash: number; // Added to track cash received
//   notes?: string;
// }

// const Customers: React.FC = () => {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     address: '',
//     notes: ''
//   });
//   const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const data = await customerService.getAll();
//       setCustomers(data);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchHistory = async (customerId: string) => {
//     try {
//       const data = await customerService.getHistory(customerId);
//       setHistoryData(data);
//       setShowHistoryModal(true);
//     } catch (error) {
//       console.error('Error fetching history:', error);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isSubmitting) return;

//     setIsSubmitting(true);
//     try {
//       let updatedCustomer;
//       if (selectedCustomer) {
//         updatedCustomer = await customerService.update(selectedCustomer._id, formData);
//         setCustomers(customers.map(c => c._id === selectedCustomer._id ? updatedCustomer : c));
//       } else {
//         updatedCustomer = await customerService.create(formData);
//         setCustomers([...customers, updatedCustomer]);
//       }
      
//       await fetchCustomers();
//       setShowModal(false);
//       resetForm();
//     } catch (error) {
//       console.error('Error saving customer:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (window.confirm('Are you sure you want to delete this customer?')) {
//       try {
//         await customerService.delete(id);
//         await fetchCustomers();
//       } catch (error) {
//         console.error('Error deleting customer:', error);
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       phone: '',
//       email: '',
//       address: '',
//       notes: ''
//     });
//     setSelectedCustomer(null);
//   };

//   const openModal = (customer?: Customer) => {
//     if (customer) {
//       setSelectedCustomer(customer);
//       setFormData({
//         name: customer.name,
//         phone: customer.phone,
//         email: customer.email || '',
//         address: customer.address,
//         notes: customer.notes || ''
//       });
//     } else {
//       resetForm();
//     }
//     setShowModal(true);
//   };

//   const filteredCustomers = customers.filter(customer =>
//     customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     customer.phone.includes(searchTerm) ||
//     customer.address.toLowerCase().includes(searchTerm.toLowerCase())
//   );

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
//               <h1 className="page-title">Customers</h1>
//               <p className="page-subtitle">Manage your customer database</p>
//             </div>
//             <button className="btn btn-primary" onClick={() => openModal()} disabled={isSubmitting}>
//               <Plus size={20} />
//               Add Customer
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="container">
//         {/* Search and Filters */}
//         <div className="card" style={{ marginBottom: '2rem' }}>
//           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
//             <div style={{ position: 'relative', flex: 1 }}>
//               <Search 
//                 size={20} 
//                 style={{ 
//                   position: 'absolute', 
//                   left: '1rem', 
//                   top: '50%', 
//                   transform: 'translateY(-50%)',
//                   color: '#64748b'
//                 }} 
//               />
//               <input
//                 type="text"
//                 className="form-input"
//                 placeholder="Search customers by name, phone, or address..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 style={{ paddingLeft: '3rem' }}
//               />
//             </div>
//             <div className="badge badge-info">
//               {filteredCustomers.length} customers
//             </div>
//           </div>
//         </div>

//         {/* Customers Grid */}
//         <div className="grid grid-3">
//           {filteredCustomers.map((customer) => (
//             <div key={customer._id} className="card">
//               <div style={{ marginBottom: '1rem' }}>
//                 <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
//                   {customer.name}
//                 </h3>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
//                   <Phone size={16} color="#64748b" />
//                   <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{customer.phone}</span>
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                   <MapPin size={16} color="#64748b" />
//                   <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{customer.address}</span>
//                 </div>
//               </div>

//               <div style={{ marginBottom: '1.5rem' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
//                   <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Purchases</span>
//                   <span style={{ fontWeight: '600', color: '#1e293b' }}>
//                     Rs.{customer.totalPurchases?.toLocaleString() || '0'}
//                   </span>
//                 </div>
//                 {customer.lastPurchase && (
//                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Last Purchase</span>
//                     <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
//                       {new Date(customer.lastPurchase).toLocaleDateString()}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {customer.notes && (
//                 <div style={{ 
//                   padding: '0.75rem', 
//                   background: '#f8fafc', 
//                   borderRadius: '6px',
//                   marginBottom: '1rem'
//                 }}>
//                   <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
//                     {customer.notes}
//                   </p>
//                 </div>
//               )}

//               <div style={{ display: 'flex', gap: '0.5rem' }}>
//                 <button 
//                   className="btn btn-outline" 
//                   style={{ flex: 1 }}
//                   onClick={() => fetchHistory(customer._id)}
//                 >
//                   <Eye size={16} />
//                   History
//                 </button>
//                 <button 
//                   className="btn btn-secondary"
//                   onClick={() => openModal(customer)}
//                 >
//                   <Edit size={16} />
//                 </button>
//                 <button 
//                   className="btn btn-danger"
//                   onClick={() => handleDelete(customer._id)}
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredCustomers.length === 0 && (
//           <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
//             <div style={{ color: '#64748b', marginBottom: '1rem' }}>
//               {searchTerm ? 'No customers found matching your search.' : 'No customers added yet.'}
//             </div>
//             <button className="btn btn-primary" onClick={() => openModal()} disabled={isSubmitting}>
//               <Plus size={20} />
//               Add Your First Customer
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Edit/Add Modal */}
//       {showModal && (
//         <div className="modal-overlay" onClick={() => setShowModal(false)}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2 className="modal-title">
//                 {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
//               </h2>
//               <button className="modal-close" onClick={() => setShowModal(false)}>
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label className="form-label">Name *</label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Phone</label>
//                 <input
//                   type="tel"
//                   className="form-input"
//                   value={formData.phone}
//                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Email</label>
//                 <input
//                   type="email"
//                   className="form-input"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Address</label>
//                 <textarea
//                   className="form-input form-textarea"
//                   value={formData.address}
//                   onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Notes</label>
//                 <textarea
//                   className="form-input form-textarea"
//                   value={formData.notes}
//                   onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                   placeholder="Any additional notes about this customer..."
//                 />
//               </div>

//               <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
//                 <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
//                   {selectedCustomer ? 'Update Customer' : 'Add Customer'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* History Modal */}
//       {showHistoryModal && (
//         <div className="modal-overlay" onClick={() => setShowHistoryModal(false)} style={{ 
//           position: 'fixed', 
//           top: 0, 
//           left: 0, 
//           right: 0, 
//           bottom: 0, 
//           background: 'rgba(0, 0, 0, 0.5)', 
//           display: 'flex', 
//           justifyContent: 'center', 
//           alignItems: 'center', 
//           zIndex: 1000 
//         }}>
//           <div className="modal" onClick={(e) => e.stopPropagation()} style={{ 
//             background: '#fff', 
//             padding: '1.5rem', 
//             borderRadius: '0.375rem', 
//             boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
//             maxWidth: '90vw', 
//             width: '500px', 
//             maxHeight: '80vh', 
//             overflowY: 'auto' 
//           }}>
//             <div className="modal-header" style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between', 
//               alignItems: 'center', 
//               marginBottom: '1rem' 
//             }}>
//               <h2 className="modal-title" style={{ 
//                 fontSize: '1.25rem', 
//                 fontWeight: '600', 
//                 color: '#1e293b' 
//               }}>
//                 Purchase History for {selectedCustomer?.name}
//               </h2>
//               <button className="modal-close" onClick={() => setShowHistoryModal(false)} style={{ 
//                 fontSize: '1.5rem', 
//                 fontWeight: 'bold', 
//                 color: '#64748b', 
//                 border: 'none', 
//                 background: 'none', 
//                 cursor: 'pointer' 
//               }}>
//                 ×
//               </button>
//             </div>

//             {historyData.length > 0 ? (
//               <div className="table-container" style={{ 
//                 overflowX: 'auto', 
//                 marginBottom: '1rem' 
//               }}>
//                 <table className="table" style={{ 
//                   width: '100%', 
//                   borderCollapse: 'collapse' 
//                 }}>
//                   <thead>
//                     <tr style={{ background: '#f8fafc' }}>
//                       <th style={{ padding: '0.5rem', textAlign: 'left', color: '#64748b' }}>Date</th>
//                       <th style={{ padding: '0.5rem', textAlign: 'left', color: '#64748b' }}>Sale ID</th>
//                       <th style={{ padding: '0.5rem', textAlign: 'left', color: '#64748b' }}>Amount</th>
//                       <th style={{ padding: '0.5rem', textAlign: 'left', color: '#64748b' }}>Units</th>
//                       <th style={{ padding: '0.5rem', textAlign: 'left', color: '#64748b' }}>Amount Left</th>
//                       <th style={{ padding: '0.5rem', textAlign: 'left', color: '#64748b' }}>Notes</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {historyData.map((item) => {
//                       const amountLeft = item.amount - item.counterCash;
//                       return (
//                         <tr key={item._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
//                           <td style={{ padding: '0.5rem' }}>{new Date(item.date).toLocaleDateString()}</td>
//                           <td style={{ padding: '0.5rem' }}>{item.saleId}</td>
//                           <td style={{ padding: '0.5rem', fontWeight: '600', color: '#059669' }}>
//                             Rs.{item.amount.toLocaleString()}
//                           </td>
//                           <td style={{ padding: '0.5rem' }}>{item.units}</td>
//                           <td style={{ padding: '0.5rem', fontWeight: '600', color: amountLeft > 0 ? '#dc2626' : '#065f46' }}>
//                             Rs.{amountLeft.toLocaleString()}
//                           </td>
//                           <td style={{ padding: '0.5rem' }}>{item.notes || '-'}</td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//                 <div style={{ 
//                   marginTop: '1rem', 
//                   fontSize: '0.875rem', 
//                   fontWeight: '600', 
//                   color: '#1e293b', 
//                   textAlign: 'right' 
//                 }}>
//                   Total Amount Left to Pay: Rs.{
//                     historyData.reduce((sum, item) => sum + (item.amount - item.counterCash), 0).toLocaleString()
//                   }
//                 </div>
//               </div>
//             ) : (
//               <div style={{ 
//                 textAlign: 'center', 
//                 padding: '1rem', 
//                 color: '#64748b' 
//               }}>
//                 No purchase history available for this customer.
//               </div>
//             )}

//             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
//               <button 
//                 type="button" 
//                 className="btn btn-outline" 
//                 onClick={() => setShowHistoryModal(false)}
//                 style={{ padding: '0.375rem 0.75rem' }}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Customers;

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Phone, MapPin } from 'lucide-react';
import { customerService } from '../services/api';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  notes?: string;
  totalPurchases: number;
  lastPurchase?: string;
  createdAt: string;
  unitRate?: number;
}

interface HistoryItem {
  _id: string;
  saleId: string;
  date: string;
  amount: number;
  units: number;
  counterCash: number;
  notes?: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    unitRate: ''
  });
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async (customerId: string) => {
    try {
      const data = await customerService.getHistory(customerId);
      setHistoryData(data);
      setShowHistoryModal(true);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      let updatedCustomer;
      if (selectedCustomer) {
        updatedCustomer = await customerService.update(selectedCustomer._id, formData);
        setCustomers(customers.map(c => c._id === selectedCustomer._id ? updatedCustomer : c));
      } else {
        updatedCustomer = await customerService.create(formData);
        setCustomers([...customers, updatedCustomer]);
      }
      
      await fetchCustomers();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.delete(id);
        await fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
      unitRate: ''
    });
    setSelectedCustomer(null);
  };

  const openModal = (customer?: Customer) => {
    if (customer) {
      setSelectedCustomer(customer);
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        address: customer.address,
        notes: customer.notes || '',
        unitRate: customer.unitRate?.toString() || ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="page-header py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="page-title text-2xl md:text-3xl font-bold text-gray-900">Customers</h1>
              <p className="page-subtitle text-sm md:text-base text-gray-600">Manage your customer database</p>
            </div>
            <button
              className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base disabled:opacity-50"
              onClick={() => openModal()}
              disabled={isSubmitting}
            >
              <Plus size={16} />
              Add Customer
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="card bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-auto flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                className="form-input w-full md:w-64 pl-10 p-2 border rounded text-sm md:text-base"
                placeholder="Search customers by name, phone, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="badge badge-info p-1 text-sm md:text-base">
              {filteredCustomers.length} customers
            </div>
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <div key={customer._id} className="card bg-white p-4 rounded-lg shadow">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{customer.name}</h3>
                <div className="flex items-center gap-2 mb-1">
                  <Phone size={16} color="#64748b" />
                  <span className="text-sm text-gray-600">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} color="#64748b" />
                  <span className="text-sm text-gray-600">{customer.address}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Total Purchases</span>
                  <span className="text-sm font-medium text-gray-900">
                    Rs.{customer.totalPurchases.toLocaleString()}
                  </span>
                </div>
                {customer.lastPurchase && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Purchase</span>
                    <span className="text-sm text-gray-600">
                      {new Date(customer.lastPurchase).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {customer.unitRate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Unit Rate</span>
                    <span className="text-sm text-gray-600">
                      Rs.{customer.unitRate.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {customer.notes && (
                <div className="p-2 bg-gray-50 rounded text-sm text-gray-600 mb-4">
                  {customer.notes}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  className="btn btn-outline flex-1 text-sm"
                  onClick={() => fetchHistory(customer._id)}
                >
                  <Eye size={16} />
                  History
                </button>
                <button
                  className="btn btn-secondary text-sm"
                  onClick={() => openModal(customer)}
                >
                  <Edit size={16} />
                </button>
                <button
                  className="btn btn-danger text-sm"
                  onClick={() => handleDelete(customer._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="card bg-white p-6 rounded-lg shadow text-center">
            <div className="text-gray-600 mb-4">
              {searchTerm ? 'No customers found matching your search.' : 'No customers added yet.'}
            </div>
            <button
              className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base"
              onClick={() => openModal()}
              disabled={isSubmitting}
            >
              <Plus size={16} />
              Add Your First Customer
            </button>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="modal bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="modal-title text-xl font-semibold text-gray-900">
                {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
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
                  <label className="form-label block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="form-input w-full p-2 border rounded text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label block text-sm font-medium text-gray-700">Unit Rate (Rs.) (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input w-full p-2 border rounded text-sm"
                    value={formData.unitRate}
                    onChange={(e) => setFormData({ ...formData, unitRate: e.target.value })}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes about this customer..."
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button type="button" className="btn btn-outline px-4 py-2 text-sm" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4 py-2 text-sm" disabled={isSubmitting}>
                  {selectedCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowHistoryModal(false)}>
          <div className="modal bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="modal-title text-xl font-semibold text-gray-900">
                Purchase History for {selectedCustomer?.name}
              </h2>
              <button className="modal-close text-2xl font-bold text-gray-500 hover:text-gray-700" onClick={() => setShowHistoryModal(false)}>
                ×
              </button>
            </div>

            {historyData.length > 0 ? (
              <div className="table-container overflow-x-auto">
                <table className="table w-full text-sm md:text-base">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 md:p-3 text-left">Date</th>
                      <th className="p-2 md:p-3 text-left">Sale ID</th>
                      <th className="p-2 md:p-3 text-left">Amount</th>
                      <th className="p-2 md:p-3 text-left">Units</th>
                      <th className="p-2 md:p-3 text-left">Cash Paid</th>
                      <th className="p-2 md:p-3 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td className="p-2 md:p-3">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="p-2 md:p-3">{item.saleId}</td>
                        <td className="p-2 md:p-3 font-semibold text-green-600">
                          Rs.{item.amount.toLocaleString()}
                        </td>
                        <td className="p-2 md:p-3">{item.units}</td>
                        <td className="p-2 md:p-3">Rs.{item.counterCash.toLocaleString()}</td>
                        <td className="p-2 md:p-3">{item.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-600">No purchase history available.</div>
            )}

            <div className="flex justify-end mt-4">
              <button
                className="btn btn-outline px-4 py-2 text-sm"
                onClick={() => setShowHistoryModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;