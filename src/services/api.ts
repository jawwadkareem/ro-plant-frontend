

// import axios from 'axios';

// // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// const API_BASE_URL = 'https://ro-plant-backend-73yj.vercel.app/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
// });

// // Add auth token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Auth Service
// export const authService = {
//   login: async (username: string, password: string) => {
//     const response = await api.post('/auth/login', { username, password });
//     return response.data;
//   },
  
//   verifyToken: async () => {
//     const response = await api.get('/auth/verify');
//     return response.data;
//   },
  
//   resetPassword: async (userId: string, newPassword: string) => {
//     const response = await api.patch('/users/reset-password', { userId, newPassword });
//     return response.data;
//   }
// };

// // Customer Service
// export const customerService = {
//   getAll: async () => {
//     const response = await api.get('/customers');
//     return response.data;
//   },
  
//   create: async (customer: any) => {
//     const response = await api.post('/customers', customer);
//     return response.data;
//   },
  
//   update: async (id: string, customer: any) => {
//     const response = await api.put(`/customers/${id}`, customer);
//     return response.data;
//   },
  
//   delete: async (id: string) => {
//     const response = await api.delete(`/customers/${id}`);
//     return response.data;
//   },
  
//   getHistory: async (id: string) => {
//     const response = await api.get(`/customers/${id}/history`);
//     return response.data;
//   }
// };

// // Sales Service
// export const salesService = {
//   getAll: async (params?: any) => {
//     const response = await api.get('/sales', { params });
//     return response.data;
//   },
  
//   create: async (sale: any) => {
//     const { _id, ...saleData } = sale; // Remove _id for create
//     const response = await api.post('/sales', saleData);
//     return response.data;
//   },
  
//   update: async (id: string, sale: any) => {
//     const { _id, ...saleData } = sale; // Remove _id for update
//     const response = await api.put(`/sales/${id}`, saleData);
//     return response.data;
//   },
  
//   delete: async (id: string) => {
//     const response = await api.delete(`/sales/${id}`);
//     return response.data;
//   },
  
//   getDailySummary: async (date?: string) => {
//     const response = await api.get('/sales/daily-summary', { 
//       params: { date } 
//     });
//     return response.data;
//   }
// };

// // Expenses Service
// export const expenseService = {
//   getAll: async (params?: any) => {
//     const response = await api.get('/expenses', { params });
//     return response.data;
//   },
  
//   create: async (expense: any) => {
//     const { _id, ...expenseData } = expense; // Remove _id for create
//     const response = await api.post('/expenses', expenseData);
//     return response.data;
//   },
  
//   update: async (id: string, expense: any) => {
//     const { _id, ...expenseData } = expense; // Remove _id for update
//     const response = await api.put(`/expenses/${id}`, expenseData);
//     return response.data;
//   },
  
//   delete: async (id: string) => {
//     const response = await api.delete(`/expenses/${id}`);
//     return response.data;
//   }
// };

// // Creditors Service
// export const creditorService = {
//   getAll: async () => {
//     const response = await api.get('/creditors');
//     return response.data;
//   },
  
//   create: async (creditor: any) => {
//     const { _id, ...creditorData } = creditor; // Remove _id for create
//     const response = await api.post('/creditors', creditorData);
//     return response.data;
//   },
  
//   update: async (id: string, creditor: any) => {
//     const { _id, ...creditorData } = creditor; // Remove _id for update
//     const response = await api.put(`/creditors/${id}`, creditorData);
//     return response.data;
//   },
  
//   markPaid: async (id: string) => {
//     const response = await api.patch(`/creditors/${id}/pay`);
//     return response.data;
//   },
  
//   delete: async (id: string) => {
//     const response = await api.delete(`/creditors/${id}`);
//     return response.data;
//   }
// };

// // Reports Service
// export const reportService = {
//   getDashboardStats: async () => {
//     const response = await api.get('/reports/dashboard');
//     return response.data;
//   },
  
//   getProfitData: async (period: string) => {
//     const response = await api.get('/reports/profit', { 
//       params: { period } 
//     });
//     return response.data;
//   },
  
//   getSalesReport: async (startDate: string, endDate: string) => {
//     const response = await api.get('/reports/sales', { 
//       params: { startDate, endDate } 
//     });
//     return response.data;
//   },
  
//   getExpensesReport: async (startDate: string, endDate: string) => {
//     const response = await api.get('/reports/expenses', { 
//       params: { startDate, endDate } 
//     });
//     return response.data;
//   },
  
//   getAssetsLiabilities: async () => {
//     const response = await api.get('/reports/assets');
//     return response.data;
//   }
// };

// export default api;
import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// const API_BASE_URL = 'https://ro-plant-backend-73yj.vercel.app/api';
const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
  
  resetPassword: async (userId: string, newPassword: string) => {
    const response = await api.patch('/users/reset-password', { userId, newPassword });
    return response.data;
  }
};

// Customer Service
export const customerService = {
  getAll: async () => {
    const response = await api.get('/customers');
    return response.data;
  },
  
  create: async (customer: any) => {
    const response = await api.post('/customers', customer);
    return response.data;
  },
  
  update: async (id: string, customer: any) => {
    const response = await api.put(`/customers/${id}`, customer);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
  
  getHistory: async (id: string) => {
    const response = await api.get(`/customers/${id}/history`);
    return response.data;
  }
};

// Sales Service
export const salesService = {
  getAll: async (params?: any) => {
    const response = await api.get('/sales', { params });
    return response.data;
  },
  
  create: async (sale: any) => {
    const { _id, ...saleData } = sale; // Remove _id for create
    const response = await api.post('/sales', saleData);
    return response.data;
  },
  
  update: async (id: string, sale: any) => {
    const { _id, ...saleData } = sale; // Remove _id for update
    const response = await api.put(`/sales/${id}`, saleData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  },
  
  getDailySummary: async (date?: string) => {
    const response = await api.get('/sales/daily-summary', { 
      params: { date } 
    });
    return response.data;
  }
};

// Expenses Service
export const expenseService = {
  getAll: async (params?: any) => {
    const response = await api.get('/expenses', { params });
    return response.data;
  },
  
  create: async (expense: any) => {
    const { _id, ...expenseData } = expense; // Remove _id for create
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },
  
  update: async (id: string, expense: any) => {
    const { _id, ...expenseData } = expense; // Remove _id for update
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  }
};

// Reports Service
export const reportService = {
  getDashboardStats: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },
  
  getProfitData: async (period: string) => {
    const response = await api.get('/reports/profit', { 
      params: { period } 
    });
    return response.data;
  },
  
  getSalesReport: async (startDate: string, endDate: string) => {
    const response = await api.get('/reports/sales', { 
      params: { startDate, endDate } 
    });
    return response.data;
  },
  
  getExpensesReport: async (startDate: string, endDate: string) => {
    const response = await api.get('/reports/expenses', { 
      params: { startDate, endDate } 
    });
    return response.data;
  },
  
  getAssetsLiabilities: async () => {
    const response = await api.get('/reports/assets');
    return response.data;
  }
};

export default api;