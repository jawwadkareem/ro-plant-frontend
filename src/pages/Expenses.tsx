// import React, { useState, useEffect } from 'react';
// import { Plus, Calendar, TrendingDown, Tag, Receipt, Edit, Trash2 } from 'lucide-react';
// import { expenseService } from '../services/api';
// import { format } from 'date-fns';

// interface Expense {
//   _id: string;
//   date: string;
//   type: string;
//   amount: number;
//   description: string;
//   notes?: string;
//   createdAt: string;
// }

// const expenseTypes = [
//   'Raw Materials',
//   'Electricity',
//   'Maintenance',
//   'Labor',
//   'Transportation',
//   'Office Supplies',
//   'Marketing',
//   'Rent',
//   'Other'
// ];

// const Expenses: React.FC = () => {
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [formData, setFormData] = useState({
//     _id: '',
//     date: format(new Date(), 'yyyy-MM-dd'),
//     type: '',
//     amount: '',
//     description: '',
//     notes: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

//   useEffect(() => {
//     fetchExpenses();
//   }, [selectedDate]);

//   const fetchExpenses = async () => {
//     try {
//       const data = await expenseService.getAll({ date: selectedDate });
//       setExpenses(data);
//     } catch (error) {
//       console.error('Error fetching expenses:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isSubmitting) return;

//     setIsSubmitting(true);
//     try {
//       const expenseData = {
//         ...formData,
//         amount: parseFloat(formData.amount)
//       };
      
//       if (formData._id) {
//         const updatedExpense = await expenseService.update(formData._id, expenseData);
//         setExpenses(expenses.map(exp => exp._id === updatedExpense._id ? updatedExpense : exp));
//       } else {
//         const newExpense = await expenseService.create(expenseData);
//         setExpenses([...expenses, newExpense]);
//       }
      
//       await fetchExpenses();
//       setShowModal(false);
//       setShowEditModal(false);
//       resetForm();
//     } catch (error) {
//       console.error('Error saving expense:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (window.confirm('Are you sure you want to delete this expense?')) {
//       try {
//         await expenseService.delete(id);
//         const updatedExpenses = await expenseService.getAll({ date: selectedDate });
//         setExpenses(updatedExpenses);
//       } catch (error) {
//         console.error('Error deleting expense:', error);
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       _id: '',
//       date: format(new Date(), 'yyyy-MM-dd'),
//       type: '',
//       amount: '',
//       description: '',
//       notes: ''
//     });
//     setSelectedExpense(null);
//   };

//   const openModal = (expense?: Expense) => {
//   if (expense) {
//     setSelectedExpense(expense);
//     setFormData({
//       _id: expense._id,
//       date: format(new Date(), 'yyyy-MM-dd'), // Default to today's date
//       type: expense.type,
//       amount: expense.amount.toString(),
//       description: expense.description,
//       notes: expense.notes || ''
//     });
//     setShowEditModal(true);
//   } else {
//     resetForm();
//     setShowModal(true);
//   }
// };

//   const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
//   const expensesByType = expenses.reduce((acc, expense) => {
//     acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
//     return acc;
//   }, {} as Record<string, number>);

//   const topExpenseType = Object.entries(expensesByType).sort(([,a], [,b]) => b - a)[0];

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="page-header py-6">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div>
//               <h1 className="page-title text-2xl md:text-3xl font-bold text-gray-900">Expenses Management</h1>
//               <p className="page-subtitle text-sm md:text-base text-gray-600">Track and categorize business expenses</p>
//             </div>
//             <button
//               className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base disabled:opacity-50"
//               onClick={() => openModal()}
//               disabled={isSubmitting}
//             >
//               <Plus size={16} />
//               Add Expense
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
//             <div className="badge badge-danger p-1 text-sm md:text-base">
//               {expenses.length} expenses recorded
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div className="stat-card p-4 rounded-lg shadow bg-red-50">
//               <div className="stat-icon flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
//                 <TrendingDown size={20} />
//               </div>
//               <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">Rs.{totalExpenses.toLocaleString()}</div>
//               <div className="stat-label text-sm md:text-base text-gray-600">Total Expenses</div>
//             </div>
            
//             <div className="stat-card p-4 rounded-lg shadow bg-teal-50">
//               <div className="stat-icon flex items-center justify-center w-10 h-10 bg-teal-100 rounded-full">
//                 <Tag size={20} />
//               </div>
//               <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">{Object.keys(expensesByType).length}</div>
//               <div className="stat-label text-sm md:text-base text-gray-600">Categories Used</div>
//             </div>
            
//             <div className="stat-card p-4 rounded-lg shadow bg-amber-50">
//               <div className="stat-icon flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full">
//                 <Receipt size={20} />
//               </div>
//               <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
//                 {topExpenseType ? `Rs.${topExpenseType[1].toLocaleString()}` : 'Rs.0'}
//               </div>
//               <div className="stat-label text-sm md:text-base text-gray-600">
//                 {topExpenseType ? topExpenseType[0] : 'No expenses'}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Expense Categories Overview */}
//         {Object.keys(expensesByType).length > 0 && (
//           <div className="card bg-white p-6 rounded-lg shadow mb-6">
//             <div className="card-header mb-4">
//               <h3 className="card-title text-lg md:text-xl font-semibold text-gray-900">Expense Breakdown</h3>
//               <p className="card-description text-sm text-gray-600">Distribution by category</p>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {Object.entries(expensesByType)
//                 .sort(([,a], [,b]) => b - a)
//                 .map(([type, amount]) => (
//                   <div key={type} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
//                     <span className="font-medium text-gray-900">{type}</span>
//                     <span className="font-semibold text-red-600">Rs.{amount.toLocaleString()}</span>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}

//         {/* Expenses Table */}
//         {expenses.length > 0 ? (
//           <div className="table-container overflow-x-auto">
//             <table className="table w-full text-sm md:text-base">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-2 md:p-3 text-left">Time</th>
//                   <th className="p-2 md:p-3 text-left">Category</th>
//                   <th className="p-2 md:p-3 text-left">Description</th>
//                   <th className="p-2 md:p-3 text-left">Amount</th>
//                   <th className="p-2 md:p-3 text-left">Notes</th>
//                   <th className="p-2 md:p-3 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {expenses.map((expense) => (
//                   <tr key={expense._id} className="border-b">
//                     <td className="p-2 md:p-3">{format(new Date(expense.createdAt), 'HH:mm')}</td>
//                     <td className="p-2 md:p-3">
//                       <span className="badge badge-info text-sm">{expense.type}</span>
//                     </td>
//                     <td className="p-2 md:p-3">{expense.description}</td>
//                     <td className="p-2 md:p-3 font-semibold text-red-600">
//                       Rs.{expense.amount.toLocaleString()}
//                     </td>
//                     <td className="p-2 md:p-3">{expense.notes || '-'}</td>
//                     <td className="p-2 md:p-3">
//                       <div className="flex gap-2">
//                         <button
//                           className="btn btn-secondary text-sm"
//                           onClick={() => openModal(expense)}
//                         >
//                           <Edit size={16} />
//                         </button>
//                         <button
//                           className="btn btn-danger text-sm"
//                           onClick={() => handleDelete(expense._id)}
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
//             <div className="text-gray-600 mb-4">
//               No expenses recorded for {format(new Date(selectedDate), 'MMMM d, yyyy')}
//             </div>
//             <button
//               className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base"
//               onClick={() => openModal()}
//               disabled={isSubmitting}
//             >
//               <Plus size={16} />
//               Record Your First Expense
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Add Modal */}
//       {showModal && (
//         <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
//           <div className="modal bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header flex justify-between items-center mb-4">
//               <h2 className="modal-title text-xl font-semibold text-gray-900">Add New Expense</h2>
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

//                 <div className="form-group">
//                   <label className="form-label block text-sm font-medium text-gray-700">Category *</label>
//                   <select
//                     className="form-select w-full p-2 border rounded text-sm"
//                     value={formData.type}
//                     onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//                     required
//                   >
//                     <option value="">Select category</option>
//                     {expenseTypes.map(type => (
//                       <option key={type} value={type}>{type}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="form-group mt-4">
//                 <label className="form-label block text-sm font-medium text-gray-700">Amount (Rs.) *</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className="form-input w-full p-2 border rounded text-sm"
//                   value={formData.amount}
//                   onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//                   min="0"
//                   required
//                 />
//               </div>

//               <div className="form-group mt-4">
//                 <label className="form-label block text-sm font-medium text-gray-700">Description *</label>
//                 <input
//                   type="text"
//                   className="form-input w-full p-2 border rounded text-sm"
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   placeholder="Brief description of the expense"
//                   required
//                 />
//               </div>

//               <div className="form-group mt-4">
//                 <label className="form-label block text-sm font-medium text-gray-700">Notes</label>
//                 <textarea
//                   className="form-input w-full p-2 border rounded text-sm"
//                   value={formData.notes}
//                   onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                   placeholder="Any additional details..."
//                 />
//               </div>

//               <div className="flex justify-end gap-4 mt-6">
//                 <button type="button" className="btn btn-outline px-4 py-2 text-sm" onClick={() => setShowModal(false)}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary px-4 py-2 text-sm" disabled={isSubmitting}>
//                   Add Expense
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
//               <h2 className="modal-title text-xl font-semibold text-gray-900">Edit Expense</h2>
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

//                 <div className="form-group">
//                   <label className="form-label block text-sm font-medium text-gray-700">Category *</label>
//                   <select
//                     className="form-select w-full p-2 border rounded text-sm"
//                     value={formData.type}
//                     onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//                     required
//                   >
//                     <option value="">Select category</option>
//                     {expenseTypes.map(type => (
//                       <option key={type} value={type}>{type}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="form-group mt-4">
//                 <label className="form-label block text-sm font-medium text-gray-700">Amount (Rs.) *</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className="form-input w-full p-2 border rounded text-sm"
//                   value={formData.amount}
//                   onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//                   min="0"
//                   required
//                 />
//               </div>

//               <div className="form-group mt-4">
//                 <label className="form-label block text-sm font-medium text-gray-700">Description *</label>
//                 <input
//                   type="text"
//                   className="form-input w-full p-2 border rounded text-sm"
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   placeholder="Brief description of the expense"
//                   required
//                 />
//               </div>

//               <div className="form-group mt-4">
//                 <label className="form-label block text-sm font-medium text-gray-700">Notes</label>
//                 <textarea
//                   className="form-input w-full p-2 border rounded text-sm"
//                   value={formData.notes}
//                   onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                   placeholder="Any additional details..."
//                 />
//               </div>

//               <div className="flex justify-end gap-4 mt-6">
//                 <button type="button" className="btn btn-outline px-4 py-2 text-sm" onClick={() => setShowEditModal(false)}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary px-4 py-2 text-sm" disabled={isSubmitting}>
//                   Update Expense
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Expenses;
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, TrendingDown, Tag, Receipt, Edit, Trash2 } from 'lucide-react';
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: '',
    amount: '',
    description: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

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
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const expenseData = {
        date: formData.date,
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        notes: formData.notes
      };
      
      if (selectedExpense) {
        const updatedExpense = await expenseService.update(selectedExpense._id, expenseData);
        setExpenses(expenses.map(exp => exp._id === updatedExpense._id ? updatedExpense : exp));
      } else {
        const newExpense = await expenseService.create(expenseData);
        setExpenses([...expenses, newExpense]);
      }
      
      await fetchExpenses();
      setShowModal(false);
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.delete(id);
        const updatedExpenses = await expenseService.getAll({ date: selectedDate });
        setExpenses(updatedExpenses);
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
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
    setSelectedExpense(null);
  };

  const openModal = (expense?: Expense) => {
    if (expense) {
      setSelectedExpense(expense);
      setFormData({
        date: format(new Date(expense.date), 'yyyy-MM-dd'),
        type: expense.type,
        amount: expense.amount.toString(),
        description: expense.description,
        notes: expense.notes || ''
      });
      setShowEditModal(true);
    } else {
      resetForm();
      setShowModal(true);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesByType = expenses.reduce((acc, expense) => {
    acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topExpenseType = Object.entries(expensesByType).sort(([,a], [,b]) => b - a)[0];

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
              <h1 className="page-title text-2xl md:text-3xl font-bold text-gray-900">Expenses Management</h1>
              <p className="page-subtitle text-sm md:text-base text-gray-600">Track and categorize business expenses</p>
            </div>
            <button
              className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base disabled:opacity-50"
              onClick={() => openModal()}
              disabled={isSubmitting}
            >
              <Plus size={16} />
              Add Expense
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
            <div className="badge badge-danger p-1 text-sm md:text-base">
              {expenses.length} expenses recorded
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="stat-card p-4 rounded-lg shadow bg-red-50">
              <div className="stat-icon flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                <TrendingDown size={20} />
              </div>
              <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">Rs.{totalExpenses.toLocaleString()}</div>
              <div className="stat-label text-sm md:text-base text-gray-600">Total Expenses</div>
            </div>
            
            <div className="stat-card p-4 rounded-lg shadow bg-teal-50">
              <div className="stat-icon flex items-center justify-center w-10 h-10 bg-teal-100 rounded-full">
                <Tag size={20} />
              </div>
              <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">{Object.keys(expensesByType).length}</div>
              <div className="stat-label text-sm md:text-base text-gray-600">Categories Used</div>
            </div>
            
            <div className="stat-card p-4 rounded-lg shadow bg-amber-50">
              <div className="stat-icon flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full">
                <Receipt size={20} />
              </div>
              <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
                {topExpenseType ? `Rs.${topExpenseType[1].toLocaleString()}` : 'Rs.0'}
              </div>
              <div className="stat-label text-sm md:text-base text-gray-600">
                {topExpenseType ? topExpenseType[0] : 'No expenses'}
              </div>
            </div>
          </div>
        </div>

        {/* Expense Categories Overview */}
        {Object.keys(expensesByType).length > 0 && (
          <div className="card bg-white p-6 rounded-lg shadow mb-6">
            <div className="card-header mb-4">
              <h3 className="card-title text-lg md:text-xl font-semibold text-gray-900">Expense Breakdown</h3>
              <p className="card-description text-sm text-gray-600">Distribution by category</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(expensesByType)
                .sort(([,a], [,b]) => b - a)
                .map(([type, amount]) => (
                  <div key={type} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <span className="font-medium text-gray-900">{type}</span>
                    <span className="font-semibold text-red-600">Rs.{amount.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Expenses Table */}
        {expenses.length > 0 ? (
          <div className="table-container overflow-x-auto">
            <table className="table w-full text-sm md:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 md:p-3 text-left">Time</th>
                  <th className="p-2 md:p-3 text-left">Category</th>
                  <th className="p-2 md:p-3 text-left">Description</th>
                  <th className="p-2 md:p-3 text-left">Amount</th>
                  <th className="p-2 md:p-3 text-left">Notes</th>
                  <th className="p-2 md:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id} className="border-b">
                    <td className="p-2 md:p-3">{format(new Date(expense.createdAt), 'HH:mm')}</td>
                    <td className="p-2 md:p-3">
                      <span className="badge badge-info text-sm">{expense.type}</span>
                    </td>
                    <td className="p-2 md:p-3">{expense.description}</td>
                    <td className="p-2 md:p-3 font-semibold text-red-600">
                      Rs.{expense.amount.toLocaleString()}
                    </td>
                    <td className="p-2 md:p-3">{expense.notes || '-'}</td>
                    <td className="p-2 md:p-3">
                      <div className="flex gap-2">
                        <button
                          className="btn btn-secondary text-sm"
                          onClick={() => openModal(expense)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-danger text-sm"
                          onClick={() => handleDelete(expense._id)}
                        >
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
            <div className="text-gray-600 mb-4">
              No expenses recorded for {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </div>
            <button
              className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm md:text-base"
              onClick={() => openModal()}
              disabled={isSubmitting}
            >
              <Plus size={16} />
              Record Your First Expense
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="modal bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="modal-title text-xl font-semibold text-gray-900">Add New Expense</h2>
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

                <div className="form-group">
                  <label className="form-label block text-sm font-medium text-gray-700">Category *</label>
                  <select
                    className="form-select w-full p-2 border rounded text-sm"
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

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Amount (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  min="0"
                  required
                />
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Description *</label>
                <input
                  type="text"
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the expense"
                  required
                />
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional details..."
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button type="button" className="btn btn-outline px-4 py-2 text-sm" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4 py-2 text-sm" disabled={isSubmitting}>
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
          <div className="modal bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="modal-title text-xl font-semibold text-gray-900">Edit Expense</h2>
              <button className="modal-close text-2xl font-bold text-gray-500 hover:text-gray-700" onClick={() => setShowEditModal(false)}>
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

                <div className="form-group">
                  <label className="form-label block text-sm font-medium text-gray-700">Category *</label>
                  <select
                    className="form-select w-full p-2 border rounded text-sm"
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

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Amount (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  min="0"
                  required
                />
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Description *</label>
                <input
                  type="text"
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the expense"
                  required
                />
              </div>

              <div className="form-group mt-4">
                <label className="form-label block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  className="form-input w-full p-2 border rounded text-sm"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional details..."
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button type="button" className="btn btn-outline px-4 py-2 text-sm" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4 py-2 text-sm" disabled={isSubmitting}>
                  Update Expense
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