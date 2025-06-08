
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
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart,
  AlertTriangle,
  Calendar,
  Target
} from 'lucide-react';
import { reportService } from '../services/api';

interface DashboardStats {
  totalSales: number;
  totalExpenses: number;
  dailyProfit: number;
  totalCustomers: number;
  pendingCreditors: number;
  salesGrowth: number;
  expensesGrowth: number;
  profitGrowth: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalExpenses: 0,
    dailyProfit: 0,
    totalCustomers: 0,
    pendingCreditors: 0,
    salesGrowth: 0,
    expensesGrowth: 0,
    profitGrowth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await reportService.getDashboardStats({
          timeRange,
          startDate,
          endDate
        });
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange, startDate, endDate]);

  const handleTimeRangeChange = (range: 'daily' | 'weekly' | 'monthly') => {
    setTimeRange(range);
    setStartDate('');
    setEndDate('');
    // Auto-set dates based on range
    const today = new Date();
    if (range === 'weekly') {
      const lastWeek = new Date(today.setDate(today.getDate() - 7));
      setStartDate(lastWeek.toISOString().split('T')[0]);
      setEndDate(new Date().toISOString().split('T')[0]);
    } else if (range === 'monthly') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleCustomRange = () => {
    if (startDate && endDate) {
      setTimeRange('daily'); // Default to daily for custom range
    }
  };

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
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here's what's happening with your RO plant today.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Time Range Selection */}
        <div className="card bg-white p-4 md:p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Calendar size={18} color="#2563eb" />
              <select
                className="form-input p-2 border rounded text-sm md:text-base"
                value={timeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value as 'daily' | 'weekly' | 'monthly')}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="form-input p-2 border rounded text-sm md:text-base"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={timeRange !== 'daily'}
              />
              <span>to</span>
              <input
                type="date"
                className="form-input p-2 border rounded text-sm md:text-base"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={timeRange !== 'daily'}
              />
              <button
                className="btn btn-primary px-4 py-2 text-sm"
                onClick={handleCustomRange}
                disabled={!startDate || !endDate || timeRange !== 'daily'}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="stats-grid">
          <div className="stat-card success">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-value">Rs.{stats.totalSales.toLocaleString()}</div>
            <div className="stat-label">{timeRange === 'daily' ? "Today's Sales" : timeRange === 'weekly' ? 'This Week\'s Sales' : 'This Month\'s Sales'}</div>
            {stats.salesGrowth > 0 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                marginTop: '0.5rem',
                color: '#059669',
                fontSize: '0.75rem'
              }}>
                <TrendingUp size={12} />
                +{stats.salesGrowth}% from previous period
              </div>
            )}
          </div>

          <div className="stat-card danger">
            <div className="stat-icon" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}>
              <TrendingDown size={24} />
            </div>
            <div className="stat-value">Rs.{stats.totalExpenses.toLocaleString()}</div>
            <div className="stat-label">{timeRange === 'daily' ? "Today's Expenses" : timeRange === 'weekly' ? 'This Week\'s Expenses' : 'This Month\'s Expenses'}</div>
            {stats.expensesGrowth !== 0 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                marginTop: '0.5rem',
                color: stats.expensesGrowth > 0 ? '#dc2626' : '#059669',
                fontSize: '0.75rem'
              }}>
                {stats.expensesGrowth > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stats.expensesGrowth > 0 ? '+' : ''}{stats.expensesGrowth}% from previous period
              </div>
            )}
          </div>

          <div className={`stat-card ${stats.dailyProfit >= 0 ? 'success' : 'danger'}`}>
            <div className="stat-icon" style={{ 
              background: stats.dailyProfit >= 0 ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)', 
              color: stats.dailyProfit >= 0 ? '#059669' : '#dc2626' 
            }}>
              <Target size={24} />
            </div>
            <div className="stat-value">Rs.{stats.dailyProfit.toLocaleString()}</div>
            <div className="stat-label">{timeRange === 'daily' ? "Today's Profit" : timeRange === 'weekly' ? 'This Week\'s Profit' : 'This Month\'s Profit'}</div>
            {stats.profitGrowth !== 0 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                marginTop: '0.5rem',
                color: stats.profitGrowth > 0 ? '#059669' : '#dc2626',
                fontSize: '0.75rem'
              }}>
                {stats.profitGrowth > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stats.profitGrowth > 0 ? '+' : ''}{stats.profitGrowth}% from previous period
              </div>
            )}
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
              <Users size={24} />
            </div>
            <div className="stat-value">{stats.totalCustomers}</div>
            <div className="stat-label">Total Customers</div>
          </div>
        </div>

        {/* Quick Actions and Alerts */}
        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
              <p className="card-description">Frequently used operations</p>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <Link to="/sales">
                <button className="btn btn-primary flex items-center gap-2 w-full" style={{ justifyContent: 'flex-start' }}>
                  <ShoppingCart size={20} />
                  Record New Sale
                </button>
              </Link>
              <Link to="/expenses">
                <button className="btn btn-secondary flex items-center gap-2 w-full" style={{ justifyContent: 'flex-start' }}>
                  <TrendingDown size={20} />
                  Add Expense
                </button>
              </Link>
              <Link to="/customers">
                <button className="btn btn-success flex items-center gap-2 w-full" style={{ justifyContent: 'flex-start' }}>
                  <Users size={20} />
                  Add Customer
                </button>
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Alerts & Notifications</h3>
              <p className="card-description">Important updates</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.pendingCreditors > 0 ? (
                <div className="alert alert-warning">
                  <AlertTriangle size={20} />
                  {stats.pendingCreditors} creditor bills pending payment
                </div>
              ) : (
                <div className="alert alert-success">
                  <Target size={20} />
                  All creditor bills are up to date!
                </div>
              )}
              
              <div className="alert alert-info">
                <Calendar size={20} />
                Daily backup completed successfully
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Today's Summary</h3>
            <p className="card-description">Overview of today's business activities</p>
          </div>
          
          <div className="grid grid-3">
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#2563eb',
                marginBottom: '0.5rem'
              }}>
                {((stats.totalSales / (stats.totalSales + stats.totalExpenses)) * 100 || 0).toFixed(1)}%
              </div>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Sales Ratio
              </div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#0d9488',
                marginBottom: '0.5rem'
              }}>
                {stats.dailyProfit > 0 ? 
                  ((stats.dailyProfit / stats.totalSales) * 100).toFixed(1) : 
                  '0.0'
                }%
              </div>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Profit Margin
              </div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#059669',
                marginBottom: '0.5rem'
              }}>
                Rs.{(stats.totalSales / Math.max(stats.totalCustomers, 1)).toFixed(0)}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Avg. Sale per Customer
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;