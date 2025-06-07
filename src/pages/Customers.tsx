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

// const Customers: React.FC = () => {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     address: '',
//     notes: ''
//   });

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

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (selectedCustomer) {
//         await customerService.update(selectedCustomer._id, formData);
//       } else {
//         await customerService.create(formData);
//       }
//       await fetchCustomers();
//       setShowModal(false);
//       resetForm();
//     } catch (error) {
//       console.error('Error saving customer:', error);
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
//             <button className="btn btn-primary" onClick={() => openModal()}>
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
//                   onClick={() => console.log('View history for', customer._id)}
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
//             <button className="btn btn-primary" onClick={() => openModal()}>
//               <Plus size={20} />
//               Add Your First Customer
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
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
//                 <label className="form-label">Phone *</label>
//                 <input
//                   type="tel"
//                   className="form-input"
//                   value={formData.phone}
//                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                   required
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
//                 <label className="form-label">Address *</label>
//                 <textarea
//                   className="form-input form-textarea"
//                   value={formData.address}
//                   onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                   required
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
//                 <button type="submit" className="btn btn-primary">
//                   {selectedCustomer ? 'Update Customer' : 'Add Customer'}
//                 </button>
//               </div>
//             </form>
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
}

interface HistoryItem {
  _id: string;
  saleId: string;
  date: string;
  amount: number;
  units: number;
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
    notes: ''
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
      notes: ''
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
        notes: customer.notes || ''
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
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="page-title">Customers</h1>
              <p className="page-subtitle">Manage your customer database</p>
            </div>
            <button className="btn btn-primary" onClick={() => openModal()} disabled={isSubmitting}>
              <Plus size={20} />
              Add Customer
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Search and Filters */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }} 
              />
              <input
                type="text"
                className="form-input"
                placeholder="Search customers by name, phone, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              />
            </div>
            <div className="badge badge-info">
              {filteredCustomers.length} customers
            </div>
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-3">
          {filteredCustomers.map((customer) => (
            <div key={customer._id} className="card">
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                  {customer.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Phone size={16} color="#64748b" />
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{customer.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="#64748b" />
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{customer.address}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Purchases</span>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>
                    Rs.{customer.totalPurchases?.toLocaleString() || '0'}
                  </span>
                </div>
                {customer.lastPurchase && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Last Purchase</span>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {new Date(customer.lastPurchase).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {customer.notes && (
                <div style={{ 
                  padding: '0.75rem', 
                  background: '#f8fafc', 
                  borderRadius: '6px',
                  marginBottom: '1rem'
                }}>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                    {customer.notes}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1 }}
                  onClick={() => fetchHistory(customer._id)}
                >
                  <Eye size={16} />
                  History
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => openModal(customer)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(customer._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ color: '#64748b', marginBottom: '1rem' }}>
              {searchTerm ? 'No customers found matching your search.' : 'No customers added yet.'}
            </div>
            <button className="btn btn-primary" onClick={() => openModal()} disabled={isSubmitting}>
              <Plus size={20} />
              Add Your First Customer
            </button>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
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
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes about this customer..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {selectedCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)} style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 1000 
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ 
            background: '#fff', 
            padding: '1.5rem', 
            borderRadius: '0.375rem', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
            maxWidth: '90vw', 
            width: '500px', 
            maxHeight: '80vh', 
            overflowY: 'auto' 
          }}>
            <div className="modal-header" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1rem' 
            }}>
              <h2 className="modal-title" style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1e293b' 
              }}>
                Purchase History for {selectedCustomer?.name}
              </h2>
              <button className="modal-close" onClick={() => setShowHistoryModal(false)} style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#64748b', 
                border: 'none', 
                background: 'none', 
                cursor: 'pointer' 
              }}>
                ×
              </button>
            </div>

            {historyData.length > 0 ? (
              <div className="table-container" style={{ 
                overflowX: 'auto', 
                marginBottom: '1rem' 
              }}>
                <table className="table" style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse' 
                }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left', color: '#64748b' }}>Date</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', color: '#64748b' }}>Sale ID</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', color: '#64748b' }}>Amount</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', color: '#64748b' }}>Units</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', color: '#64748b' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((item) => (
                      <tr key={item._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.5rem' }}>{new Date(item.date).toLocaleDateString()}</td>
                        <td style={{ padding: '0.5rem' }}>{item.saleId}</td>
                        <td style={{ padding: '0.5rem', fontWeight: '600', color: '#059669' }}>
                          Rs.{item.amount.toLocaleString()}
                        </td>
                        <td style={{ padding: '0.5rem' }}>{item.units}</td>
                        <td style={{ padding: '0.5rem' }}>{item.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                color: '#64748b' 
              }}>
                No purchase history available for this customer.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setShowHistoryModal(false)}
                style={{ padding: '0.375rem 0.75rem' }}
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