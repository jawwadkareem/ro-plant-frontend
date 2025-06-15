
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   TrendingUp, 
//   TrendingDown, 
//   DollarSign, 
//   Users, 
//   ShoppingCart,
//   AlertTriangle,
//   Calendar,
//   Target
// } from 'lucide-react';
// import { reportService } from '../services/api';

// interface DashboardStats {
//   totalSales: number;
//   totalExpenses: number;
//   dailyProfit: number;
//   totalCustomers: number;
//   pendingCreditors: number;
//   salesGrowth: number;
//   expensesGrowth: number;
//   profitGrowth: number;
// }

// const Dashboard: React.FC = () => {
//   const [stats, setStats] = useState<DashboardStats>({
//     totalSales: 0,
//     totalExpenses: 0,
//     dailyProfit: 0,
//     totalCustomers: 0,
//     pendingCreditors: 0,
//     salesGrowth: 0,
//     expensesGrowth: 0,
//     profitGrowth: 0
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const data = await reportService.getDashboardStats();
//         setStats(data);
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

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
//           <h1 className="page-title">Dashboard</h1>
//           <p className="page-subtitle">
//             Welcome back! Here's what's happening with your RO plant today.
//           </p>
//         </div>
//       </div>

//       <div className="container">
//         {/* Key Metrics */}
//         <div className="stats-grid">
//           <div className="stat-card success">
//             <div className="stat-icon">
//               <DollarSign size={24} />
//             </div>
//             <div className="stat-value">Rs.{stats.totalSales.toLocaleString()}</div>
//             <div className="stat-label">Today's Sales</div>
//             {stats.salesGrowth > 0 && (
//               <div style={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 gap: '0.25rem',
//                 marginTop: '0.5rem',
//                 color: '#059669',
//                 fontSize: '0.75rem'
//               }}>
//                 <TrendingUp size={12} />
//                 +{stats.salesGrowth}% from yesterday
//               </div>
//             )}
//           </div>

//           <div className="stat-card danger">
//             <div className="stat-icon" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}>
//               <TrendingDown size={24} />
//             </div>
//             <div className="stat-value">Rs.{stats.totalExpenses.toLocaleString()}</div>
//             <div className="stat-label">Today's Expenses</div>
//             {stats.expensesGrowth !== 0 && (
//               <div style={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 gap: '0.25rem',
//                 marginTop: '0.5rem',
//                 color: stats.expensesGrowth > 0 ? '#dc2626' : '#059669',
//                 fontSize: '0.75rem'
//               }}>
//                 {stats.expensesGrowth > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
//                 {stats.expensesGrowth > 0 ? '+' : ''}{stats.expensesGrowth}% from yesterday
//               </div>
//             )}
//           </div>

//           <div className={`stat-card ${stats.dailyProfit >= 0 ? 'success' : 'danger'}`}>
//             <div className="stat-icon" style={{ 
//               background: stats.dailyProfit >= 0 ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)', 
//               color: stats.dailyProfit >= 0 ? '#059669' : '#dc2626' 
//             }}>
//               <Target size={24} />
//             </div>
//             <div className="stat-value">Rs.{stats.dailyProfit.toLocaleString()}</div>
//             <div className="stat-label">Today's Profit</div>
//             {stats.profitGrowth !== 0 && (
//               <div style={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 gap: '0.25rem',
//                 marginTop: '0.5rem',
//                 color: stats.profitGrowth > 0 ? '#059669' : '#dc2626',
//                 fontSize: '0.75rem'
//               }}>
//                 {stats.profitGrowth > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
//                 {stats.profitGrowth > 0 ? '+' : ''}{stats.profitGrowth}% from yesterday
//               </div>
//             )}
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon" style={{ background: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
//               <Users size={24} />
//             </div>
//             <div className="stat-value">{stats.totalCustomers}</div>
//             <div className="stat-label">Total Customers</div>
//           </div>
//         </div>

//         {/* Quick Actions and Alerts */}
//         <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
//           <div className="card">
//             <div className="card-header">
//               <h3 className="card-title">Quick Actions</h3>
//               <p className="card-description">Frequently used operations</p>
//             </div>
//             <div style={{ display: 'grid', gap: '1rem' }}>
//               <Link to="/sales">
//                 <button className="btn btn-primary flex items-center gap-2 w-full" style={{ justifyContent: 'flex-start' }}>
//                   <ShoppingCart size={20} />
//                   Record New Sale
//                 </button>
//               </Link>
//               <Link to="/expenses">
//                 <button className="btn btn-secondary flex items-center gap-2 w-full" style={{ justifyContent: 'flex-start' }}>
//                   <TrendingDown size={20} />
//                   Add Expense
//                 </button>
//               </Link>
//               <Link to="/customers">
//                 <button className="btn btn-success flex items-center gap-2 w-full" style={{ justifyContent: 'flex-start' }}>
//                   <Users size={20} />
//                   Add Customer
//                 </button>
//               </Link>
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header">
//               <h3 className="card-title">Alerts & Notifications</h3>
//               <p className="card-description">Important updates</p>
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//               {stats.pendingCreditors > 0 ? (
//                 <div className="alert alert-warning">
//                   <AlertTriangle size={20} />
//                   {stats.pendingCreditors} creditor bills pending payment
//                 </div>
//               ) : (
//                 <div className="alert alert-success">
//                   <Target size={20} />
//                   All creditor bills are up to date!
//                 </div>
//               )}
              
//               <div className="alert alert-info">
//                 <Calendar size={20} />
//                 Daily backup completed successfully
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title">Today's Summary</h3>
//             <p className="card-description">Overview of today's business activities</p>
//           </div>
          
//           <div className="grid grid-3">
//             <div style={{ textAlign: 'center', padding: '1.5rem' }}>
//               <div style={{ 
//                 fontSize: '2rem', 
//                 fontWeight: '700', 
//                 color: '#2563eb',
//                 marginBottom: '0.5rem'
//               }}>
//                 {((stats.totalSales / (stats.totalSales + stats.totalExpenses)) * 100 || 0).toFixed(1)}%
//               </div>
//               <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
//                 Sales Ratio
//               </div>
//             </div>
            
//             <div style={{ textAlign: 'center', padding: '1.5rem' }}>
//               <div style={{ 
//                 fontSize: '2rem', 
//                 fontWeight: '700', 
//                 color: '#0d9488',
//                 marginBottom: '0.5rem'
//               }}>
//                 {stats.dailyProfit > 0 ? 
//                   ((stats.dailyProfit / stats.totalSales) * 100).toFixed(1) : 
//                   '0.0'
//                 }%
//               </div>
//               <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
//                 Profit Margin
//               </div>
//             </div>
            
//             <div style={{ textAlign: 'center', padding: '1.5rem' }}>
//               <div style={{ 
//                 fontSize: '2rem', 
//                 fontWeight: '700', 
//                 color: '#059669',
//                 marginBottom: '0.5rem'
//               }}>
//                 Rs.{(stats.totalSales / Math.max(stats.totalCustomers, 1)).toFixed(0)}
//               </div>
//               <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
//                 Avg. Sale per Customer
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from 'react';
import { DollarSign, Package, User, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { reportService, salesService } from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalExpenses: 0,
    dailyProfit: 0,
    totalCustomers: 0,
    pendingCreditors: 0,
    salesGrowth: 0,
    expensesGrowth: 0,
    profitGrowth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [avgSalesPerDay, setAvgSalesPerDay] = useState(0);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const [dashboardData, salesData] = await Promise.all([
        reportService.getDashboardStats(),
        salesService.getAll()
      ]);

      setStats(dashboardData);

      const uniqueDates = [...new Set(salesData.map((s: any) => new Date(s.date).toDateString()))];
      const totalSales = salesData.reduce((sum: number, sale: any) => sum + sale.totalBill, 0);
      setAvgSalesPerDay(uniqueDates.length > 0 ? totalSales / uniqueDates.length : 0);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
              <h1 className="page-title text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="page-subtitle text-sm md:text-base text-gray-600">Overview of your business performanceeeee</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="stat-card p-4 rounded-lg shadow bg-green-50">
            <div className="stat-icon flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <DollarSign size={20} />
            </div>
            <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
              Rs.{stats.totalSales.toLocaleString()}
            </div>
            <div className="stat-label text-sm md:text-base text-gray-600">Total Sales</div>
          </div>

          <div className="stat-card p-4 rounded-lg shadow bg-red-50">
            <div className="stat-icon flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <DollarSign size={20} />
            </div>
            <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
              Rs.{stats.totalExpenses.toLocaleString()}
            </div>
            <div className="stat-label text-sm md:text-base text-gray-600">Total Expenses</div>
          </div>

          <div className="stat-card p-4 rounded-lg shadow bg-blue-50">
            <div className="stat-icon flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <DollarSign size={20} />
            </div>
            <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
              Rs.{stats.dailyProfit.toLocaleString()}
            </div>
            <div className="stat-label text-sm md:text-base text-gray-600">Daily Profit</div>
          </div>

          <div className="stat-card p-4 rounded-lg shadow bg-purple-50">
            <div className="stat-icon flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
              <User size={20} />
            </div>
            <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
              {stats.totalCustomers}
            </div>
            <div className="stat-label text-sm md:text-base text-gray-600">Total Customers</div>
          </div>

          <div className="stat-card p-4 rounded-lg shadow bg-yellow-50">
            <div className="stat-icon flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
              <Clock size={20} />
            </div>
            <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
              {stats.pendingCreditors}
            </div>
            <div className="stat-label text-sm md:text-base text-gray-600">Pending Creditors</div>
          </div>

          <div className="stat-card p-4 rounded-lg shadow bg-teal-50">
            <div className="stat-icon flex items-center justify-center w-10 h-10 bg-teal-100 rounded-full">
              <TrendingUp size={20} />
            </div>
            <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
              {avgSalesPerDay.toFixed(2)}
            </div>
            <div className="stat-label text-sm md:text-base text-gray-600">Avg Sales/Day</div>
          </div>
        </div>

        {stats.pendingCreditors > 0 && (
          <div className="alert p-4 mb-6 bg-red-50 text-red-800 rounded-lg flex items-center gap-2">
            <AlertTriangle size={20} />
            <strong>Urgent:</strong> {stats.pendingCreditors} creditors have outstanding balances.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;