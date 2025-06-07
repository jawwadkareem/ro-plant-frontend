

// import React, { useState, useEffect } from 'react';
// import { Calendar, TrendingUp, TrendingDown, FileText, Download } from 'lucide-react';
// import { reportService } from '../services/api';
// import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

// interface ReportData {
//   sales: Array<{ date: string; amount: number; units: number }>;
//   expenses: Array<{ date: string; amount: number; type: string }>;
//   profit: Array<{ date: string; profit: number }>;
//   summary: {
//     totalSales: number;
//     totalExpenses: number;
//     totalProfit: number;
//     avgDailyProfit: number;
//   };
// }

// const Reports: React.FC = () => {
//   const [reportData, setReportData] = useState<ReportData | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [dateRange, setDateRange] = useState({
//     startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
//     endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
//   });
//   const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'expenses' | 'profit'>('overview');

//   useEffect(() => {
//     fetchReportData();
//   }, [dateRange]);

//   const fetchReportData = async () => {
//     setIsLoading(true);
//     try {
//       const [salesData, expensesData, profitData] = await Promise.all([
//         reportService.getSalesReport(dateRange.startDate, dateRange.endDate),
//         reportService.getExpensesReport(dateRange.startDate, dateRange.endDate),
//         reportService.getProfitData('custom')
//       ]);

//       setReportData({
//         sales: salesData.daily || [],
//         expenses: expensesData.daily || [],
//         profit: profitData.daily || [],
//         summary: {
//           totalSales: salesData.total || 0,
//           totalExpenses: expensesData.total || 0,
//           totalProfit: (salesData.total || 0) - (expensesData.total || 0),
//           avgDailyProfit: profitData.avgDaily || 0
//         }
//       });
//     } catch (error) {
//       console.error('Error fetching report data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const setQuickRange = (days: number) => {
//     const endDate = new Date();
//     const startDate = subDays(endDate, days - 1);
//     setDateRange({
//       startDate: format(startDate, 'yyyy-MM-dd'),
//       endDate: format(endDate, 'yyyy-MM-dd')
//     });
//   };

//   const exportReport = () => {
//     if (!reportData) return;

//     // Prepare CSV headers and rows
//     const headers = [
//       'Section,Date,Amount,Units,Type,Profit,Status,Trend',
//     ];

//     const rows: string[] = [];

//     // Summary Section
//     rows.push(
//       `Summary,,,Total Sales: Rs.${reportData.summary.totalSales.toLocaleString()},,,Total Expenses: Rs.${reportData.summary.totalExpenses.toLocaleString()},`,
//       `Summary,,,Total Profit: Rs.${reportData.summary.totalProfit.toLocaleString()},,,Avg Daily Profit: Rs.${reportData.summary.avgDailyProfit.toLocaleString()},`
//     );

//     // Sales Data
//     if (reportData.sales.length > 0) {
//       rows.push('', 'Sales Data');
//       reportData.sales.forEach((sale) => {
//         rows.push(
//           `Sales,${format(new Date(sale.date), 'MMM d, yyyy')},Rs.${sale.amount.toLocaleString()},${sale.units},,,Avg Rate: Rs.${sale.units > 0 ? (sale.amount / sale.units).toFixed(2) : '0'},`
//         );
//       });
//     }

//     // Expenses Data
//     if (reportData.expenses.length > 0) {
//       rows.push('', 'Expenses Data');
//       reportData.expenses.forEach((expense) => {
//         rows.push(
//           `Expenses,${format(new Date(expense.date), 'MMM d, yyyy')},Rs.${expense.amount.toLocaleString()},,${expense.type},,% of Total: ${(reportData.summary.totalExpenses > 0 ? (expense.amount / reportData.summary.totalExpenses) * 100 : 0).toFixed(1)}%,`
//         );
//       });
//     }

//     // Profit Data
//     if (reportData.profit.length > 0) {
//       rows.push('', 'Profit Data');
//       reportData.profit.forEach((day, index) => {
//         const prevProfit = index > 0 ? reportData.profit[index - 1].profit : day.profit;
//         const trend = day.profit - prevProfit;
//         rows.push(
//           `Profit,${format(new Date(day.date), 'MMM d, yyyy')},Rs.${day.profit.toLocaleString()},,,${day.profit >= 0 ? 'Profitable' : 'Loss'},,${index > 0 ? (trend >= 0 ? `+Rs.${trend.toLocaleString()}` : `Rs.${trend.toLocaleString()}`) : ''}`
//         );
//       });
//     }

//     // Create CSV content
//     const csvContent = headers.concat(rows).join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.setAttribute('href', url);
//     link.setAttribute('download', `RO_Plant_Report_${dateRange.startDate}_to_${dateRange.endDate}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

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
//               <h1 className="page-title">Reports & Analytics</h1>
//               <p className="page-subtitle">Comprehensive business insights</p>
//             </div>
//             <button className="btn btn-secondary" onClick={exportReport} disabled={!reportData}>
//               <Download size={20} />
//               Export Report
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="container">
//         {/* Date Range Controls */}
//         <div className="card" style={{ marginBottom: '2rem' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//               <Calendar size={20} color="#2563eb" />
//               <input
//                 type="date"
//                 className="form-input"
//                 value={dateRange.startDate}
//                 onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
//                 style={{ width: 'auto' }}
//               />
//               <span style={{ color: '#64748b' }}>to</span>
//               <input
//                 type="date"
//                 className="form-input"
//                 value={dateRange.endDate}
//                 onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
//                 style={{ width: 'auto' }}
//               />
//             </div>
            
//             <div style={{ display: 'flex', gap: '0.5rem' }}>
//               <button className="btn btn-outline" onClick={() => setQuickRange(7)}>
//                 Last 7 Days
//               </button>
//               <button className="btn btn-outline" onClick={() => setQuickRange(30)}>
//                 Last 30 Days
//               </button>
//               <button className="btn btn-outline" onClick={() => {
//                 const now = new Date();
//                 setDateRange({
//                   startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
//                   endDate: format(endOfMonth(now), 'yyyy-MM-dd')
//                 });
//               }}>
//                 This Month
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         {reportData && (
//           <div className="stats-grid" style={{ marginBottom: '2rem' }}>
//             <div className="stat-card success">
//               <div className="stat-icon">
//                 <TrendingUp size={24} />
//               </div>
//               <div className="stat-value">Rs.{reportData.summary.totalSales.toLocaleString()}</div>
//               <div className="stat-label">Total Sales</div>
//             </div>

//             <div className="stat-card danger">
//               <div className="stat-icon" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}>
//                 <TrendingDown size={24} />
//               </div>
//               <div className="stat-value">Rs.{reportData.summary.totalExpenses.toLocaleString()}</div>
//               <div className="stat-label">Total Expenses</div>
//             </div>

//             <div className={`stat-card ${reportData.summary.totalProfit >= 0 ? 'success' : 'danger'}`}>
//               <div className="stat-icon" style={{ 
//                 background: reportData.summary.totalProfit >= 0 ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)',
//                 color: reportData.summary.totalProfit >= 0 ? '#059669' : '#dc2626'
//               }}>
//                 {reportData.summary.totalProfit >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
//               </div>
//               <div className="stat-value">Rs.{reportData.summary.totalProfit.toLocaleString()}</div>
//               <div className="stat-label">Net Profit</div>
//             </div>

//             <div className="stat-card">
//               <div className="stat-icon" style={{ background: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' }}>
//                 <FileText size={24} />
//               </div>
//               <div className="stat-value">Rs.{reportData.summary.avgDailyProfit.toLocaleString()}</div>
//               <div className="stat-label">Avg Daily Profit</div>
//             </div>
//           </div>
//         )}

//         {/* Tab Navigation */}
//         <div className="card" style={{ marginBottom: '2rem' }}>
//           <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
//             {[
//               { key: 'overview', label: 'Overview' },
//               { key: 'sales', label: 'Sales Analysis' },
//               { key: 'expenses', label: 'Expense Analysis' },
//               { key: 'profit', label: 'Profit Trends' }
//             ].map(tab => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveTab(tab.key as any)}
//                 style={{
//                   padding: '1rem 1.5rem',
//                   border: 'none',
//                   background: 'none',
//                   cursor: 'pointer',
//                   fontWeight: '500',
//                   color: activeTab === tab.key ? '#2563eb' : '#64748b',
//                   borderBottom: activeTab === tab.key ? '2px solid #2563eb' : '2px solid transparent',
//                   transition: 'all 0.2s ease'
//                 }}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           <div style={{ padding: '2rem' }}>
//             {activeTab === 'overview' && reportData && (
//               <div>
//                 <h3 style={{ marginBottom: '1.5rem' }}>Business Overview</h3>
//                 <div className="grid grid-2">
//                   <div>
//                     <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Key Metrics</h4>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <span>Profit Margin:</span>
//                         <span style={{ fontWeight: '600' }}>
//                           {reportData.summary.totalSales > 0 
//                             ? ((reportData.summary.totalProfit / reportData.summary.totalSales) * 100).toFixed(1)
//                             : '0'
//                           }%
//                         </span>
//                       </div>
//                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <span>Days in Period:</span>
//                         <span style={{ fontWeight: '600' }}>
//                           {Math.ceil((new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1}
//                         </span>
//                       </div>
//                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <span>Avg Daily Sales:</span>
//                         <span style={{ fontWeight: '600' }}>
//                           Rs.{Math.round(reportData.summary.totalSales / Math.max(1, Math.ceil((new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)).toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Performance Status</h4>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                       <div className={`alert ${reportData.summary.totalProfit > 0 ? 'alert-success' : 'alert-warning'}`}>
//                         {reportData.summary.totalProfit > 0 ? 'Business is profitable' : 'Business needs attention'}
//                       </div>
//                       {reportData.summary.totalSales > reportData.summary.totalExpenses * 2 && (
//                         <div className="alert alert-success">
//                           Excellent cost control maintained
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'sales' && reportData && (
//               <div>
//                 <h3 style={{ marginBottom: '1.5rem' }}>Sales Analysis</h3>
//                 {reportData.sales.length > 0 ? (
//                   <div className="table-container">
//                     <table className="table">
//                       <thead>
//                         <tr>
//                           <th>Date</th>
//                           <th>Units Sold</th>
//                           <th>Sales Amount</th>
//                           <th>Avg Rate</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {reportData.sales.map((sale, index) => (
//                           <tr key={index}>
//                             <td>{format(new Date(sale.date), 'MMM d, yyyy')}</td>
//                             <td>{sale.units}</td>
//                             <td style={{ fontWeight: '600', color: '#059669' }}>
//                               Rs.{sale.amount.toLocaleString()}
//                             </td>
//                             <td>Rs.{sale.units > 0 ? (sale.amount / sale.units).toFixed(2) : '0'}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
//                     No sales data available for selected period
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === 'expenses' && reportData && (
//               <div>
//                 <h3 style={{ marginBottom: '1.5rem' }}>Expense Analysis</h3>
//                 {reportData.expenses.length > 0 ? (
//                   <div className="table-container">
//                     <table className="table">
//                       <thead>
//                         <tr>
//                           <th>Date</th>
//                           <th>Category</th>
//                           <th>Amount</th>
//                           <th>% of Total</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {reportData.expenses.map((expense, index) => (
//                           <tr key={index}>
//                             <td>{format(new Date(expense.date), 'MMM d, yyyy')}</td>
//                             <td>
//                               <span className="badge badge-info">{expense.type}</span>
//                             </td>
//                             <td style={{ fontWeight: '600', color: '#dc2626' }}>
//                               Rs.{expense.amount.toLocaleString()}
//                             </td>
//                             <td>
//                               {reportData.summary.totalExpenses > 0 
//                                 ? ((expense.amount / reportData.summary.totalExpenses) * 100).toFixed(1)
//                                 : '0'
//                               }%
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
//                     No expense data available for selected period
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === 'profit' && reportData && (
//               <div>
//                 <h3 style={{ marginBottom: '1.5rem' }}>Profit Trends</h3>
//                 {reportData.profit.length > 0 ? (
//                   <div className="table-container">
//                     <table className="table">
//                       <thead>
//                         <tr>
//                           <th>Date</th>
//                           <th>Daily Profit</th>
//                           <th>Status</th>
//                           <th>Trend</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {reportData.profit.map((day, index) => {
//                           const prevProfit = index > 0 ? reportData.profit[index - 1].profit : day.profit;
//                           const trend = day.profit - prevProfit;
                          
//                           return (
//                             <tr key={index}>
//                               <td>{format(new Date(day.date), 'MMM d, yyyy')}</td>
//                               <td style={{ 
//                                 fontWeight: '600', 
//                                 color: day.profit >= 0 ? '#059669' : '#dc2626' 
//                               }}>
//                                 Rs.{day.profit.toLocaleString()}
//                               </td>
//                               <td>
//                                 <span className={`badge ${day.profit >= 0 ? 'badge-success' : 'badge-danger'}`}>
//                                   {day.profit >= 0 ? 'Profitable' : 'Loss'}
//                                 </span>
//                               </td>
//                               <td>
//                                 {index > 0 && (
//                                   <div style={{ 
//                                     display: 'flex', 
//                                     alignItems: 'center', 
//                                     gap: '0.25rem',
//                                     color: trend >= 0 ? '#059669' : '#dc2626'
//                                   }}>
//                                     {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
//                                     {trend >= 0 ? '+' : ''}Rs.{trend.toLocaleString()}
//                                   </div>
//                                 )}
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
//                     No profit data available for selected period
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Reports;


import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, FileText, Download } from 'lucide-react';
import { reportService } from '../services/api';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface ReportData {
  sales: Array<{ date: string; amount: number; units: number }>;
  expenses: Array<{ date: string; amount: number; type: string }>;
  profit: Array<{ date: string; profit: number }>;
  summary: {
    totalSales: number;
    totalExpenses: number;
    totalProfit: number;
    avgDailyProfit: number;
  };
}

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'expenses' | 'profit'>('overview');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const [salesData, expensesData, profitData] = await Promise.all([
        reportService.getSalesReport(dateRange.startDate, dateRange.endDate),
        reportService.getExpensesReport(dateRange.startDate, dateRange.endDate),
        reportService.getProfitData('custom')
      ]);

      setReportData({
        sales: salesData.daily || [],
        expenses: expensesData.daily || [],
        profit: profitData.daily || [],
        summary: {
          totalSales: salesData.total || 0,
          totalExpenses: expensesData.total || 0,
          totalProfit: (salesData.total || 0) - (expensesData.total || 0),
          avgDailyProfit: profitData.avgDaily || 0
        }
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setQuickRange = (days: number) => {
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);
    setDateRange({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    });
  };

  const exportReport = () => {
    if (!reportData) return;

    const headers = ['Section,Date,Amount,Units,Type,Profit,Status,Trend'];

    const rows: string[] = [];

    rows.push(
      `Summary,,,Total Sales: Rs.${reportData.summary.totalSales.toLocaleString()},,,Total Expenses: Rs.${reportData.summary.totalExpenses.toLocaleString()},`,
      `Summary,,,Total Profit: Rs.${reportData.summary.totalProfit.toLocaleString()},,,Avg Daily Profit: Rs.${reportData.summary.avgDailyProfit.toLocaleString()},`
    );

    if (reportData.sales.length > 0) {
      rows.push('', 'Sales Data');
      reportData.sales.forEach((sale) => {
        rows.push(
          `Sales,${format(new Date(sale.date), 'MMM d, yyyy')},Rs.${sale.amount.toLocaleString()},${sale.units},,,Avg Rate: Rs.${sale.units > 0 ? (sale.amount / sale.units).toFixed(2) : '0'},`
        );
      });
    }

    if (reportData.expenses.length > 0) {
      rows.push('', 'Expenses Data');
      reportData.expenses.forEach((expense) => {
        rows.push(
          `Expenses,${format(new Date(expense.date), 'MMM d, yyyy')},Rs.${expense.amount.toLocaleString()},,${expense.type},,% of Total: ${(reportData.summary.totalExpenses > 0 ? (expense.amount / reportData.summary.totalExpenses) * 100 : 0).toFixed(1)}%,`
        );
      });
    }

    if (reportData.profit.length > 0) {
      rows.push('', 'Profit Data');
      reportData.profit.forEach((day, index) => {
        const prevProfit = index > 0 ? reportData.profit[index - 1].profit : day.profit;
        const trend = day.profit - prevProfit;
        rows.push(
          `Profit,${format(new Date(day.date), 'MMM d, yyyy')},Rs.${day.profit.toLocaleString()},,,${day.profit >= 0 ? 'Profitable' : 'Loss'},,${index > 0 ? (trend >= 0 ? `+Rs.${trend.toLocaleString()}` : `Rs.${trend.toLocaleString()}`) : ''}`
        );
      });
    }

    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `RO_Plant_Report_${dateRange.startDate}_to_${dateRange.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
              <h1 className="page-title text-2xl md:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="page-subtitle text-sm md:text-base text-gray-600">Comprehensive business insights</p>
            </div>
            <button
              className="btn btn-secondary flex items-center gap-2 px-4 py-2 text-sm md:text-base disabled:opacity-50"
              onClick={exportReport}
              disabled={!reportData}
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Date Range Controls */}
        <div className="card bg-white p-4 md:p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Calendar size={18} color="#2563eb" />
              <input
                type="date"
                className="form-input p-2 border rounded text-sm md:text-base"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
              <span className="text-gray-500 text-sm md:text-base">to</span>
              <input
                type="date"
                className="form-input p-2 border rounded text-sm md:text-base"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="btn btn-outline px-3 py-1.5 text-sm md:text-base" onClick={() => setQuickRange(7)}>
                Last 7 Days
              </button>
              <button className="btn btn-outline px-3 py-1.5 text-sm md:text-base" onClick={() => setQuickRange(30)}>
                Last 30 Days
              </button>
              <button
                className="btn btn-outline px-3 py-1.5 text-sm md:text-base"
                onClick={() => {
                  const now = new Date();
                  setDateRange({
                    startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
                    endDate: format(endOfMonth(now), 'yyyy-MM-dd')
                  });
                }}
              >
                This Month
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {reportData && (
          <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="stat-card success p-4 rounded-lg shadow">
              <div className="stat-icon flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                <TrendingUp size={20} />
              </div>
              <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
                Rs.{reportData.summary.totalSales.toLocaleString()}
              </div>
              <div className="stat-label text-sm md:text-base text-gray-600">Total Sales</div>
            </div>

            <div className="stat-card danger p-4 rounded-lg shadow">
              <div className="stat-icon flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                <TrendingDown size={20} />
              </div>
              <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
                Rs.{reportData.summary.totalExpenses.toLocaleString()}
              </div>
              <div className="stat-label text-sm md:text-base text-gray-600">Total Expenses</div>
            </div>

            <div className={`stat-card ${reportData.summary.totalProfit >= 0 ? 'success' : 'danger'} p-4 rounded-lg shadow`}>
              <div className="stat-icon flex items-center justify-center w-10 h-10 rounded-full" style={{ 
                background: reportData.summary.totalProfit >= 0 ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                color: reportData.summary.totalProfit >= 0 ? '#059669' : '#dc2626'
              }}>
                {reportData.summary.totalProfit >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
              <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
                Rs.{reportData.summary.totalProfit.toLocaleString()}
              </div>
              <div className="stat-label text-sm md:text-base text-gray-600">Net Profit</div>
            </div>

            <div className="stat-card p-4 rounded-lg shadow">
              <div className="stat-icon flex items-center justify-center w-10 h-10 bg-teal-100 rounded-full">
                <FileText size={20} />
              </div>
              <div className="stat-value text-xl md:text-2xl font-bold text-gray-900 mt-2">
                Rs.{reportData.summary.avgDailyProfit.toLocaleString()}
              </div>
              <div className="stat-label text-sm md:text-base text-gray-600">Avg Daily Profit</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="card bg-white p-4 md:p-6 rounded-lg shadow mb-6">
          <div className="flex overflow-x-auto md:overflow-hidden border-b border-gray-200">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'sales', label: 'Sales Analysis' },
              { key: 'expenses', label: 'Expense Analysis' },
              { key: 'profit', label: 'Profit Trends' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap ${activeTab === tab.key ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 md:p-6">
            {activeTab === 'overview' && reportData && (
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">Business Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md md:text-lg font-medium mb-3 text-gray-700">Key Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Profit Margin:</span>
                        <span className="font-semibold">
                          {reportData.summary.totalSales > 0 
                            ? ((reportData.summary.totalProfit / reportData.summary.totalSales) * 100).toFixed(1)
                            : '0'
                          }%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Days in Period:</span>
                        <span className="font-semibold">
                          {Math.ceil((new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Daily Sales:</span>
                        <span className="font-semibold">
                          Rs.{Math.round(reportData.summary.totalSales / Math.max(1, Math.ceil((new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md md:text-lg font-medium mb-3 text-gray-700">Performance Status</h4>
                    <div className="space-y-3">
                      <div className={`alert p-2 rounded ${reportData.summary.totalProfit > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {reportData.summary.totalProfit > 0 ? 'Business is profitable' : 'Business needs attention'}
                      </div>
                      {reportData.summary.totalSales > reportData.summary.totalExpenses * 2 && (
                        <div className="alert p-2 rounded bg-green-100 text-green-800">
                          Excellent cost control maintained
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sales' && reportData && (
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">Sales Analysis</h3>
                {reportData.sales.length > 0 ? (
                  <div className="table-container overflow-x-auto">
                    <table className="table w-full text-sm md:text-base">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 md:p-3 text-left">Date</th>
                          <th className="p-2 md:p-3 text-left">Units Sold</th>
                          <th className="p-2 md:p-3 text-left">Sales Amount</th>
                          <th className="p-2 md:p-3 text-left">Avg Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.sales.map((sale, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 md:p-3">{format(new Date(sale.date), 'MMM d, yyyy')}</td>
                            <td className="p-2 md:p-3">{sale.units}</td>
                            <td className="p-2 md:p-3 font-semibold text-green-600">
                              Rs.{sale.amount.toLocaleString()}
                            </td>
                            <td className="p-2 md:p-3">Rs.{sale.units > 0 ? (sale.amount / sale.units).toFixed(2) : '0'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    No sales data available for selected period
                  </div>
                )}
              </div>
            )}

            {activeTab === 'expenses' && reportData && (
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">Expense Analysis</h3>
                {reportData.expenses.length > 0 ? (
                  <div className="table-container overflow-x-auto">
                    <table className="table w-full text-sm md:text-base">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 md:p-3 text-left">Date</th>
                          <th className="p-2 md:p-3 text-left">Category</th>
                          <th className="p-2 md:p-3 text-left">Amount</th>
                          <th className="p-2 md:p-3 text-left">% of Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.expenses.map((expense, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 md:p-3">{format(new Date(expense.date), 'MMM d, yyyy')}</td>
                            <td className="p-2 md:p-3">
                              <span className="badge badge-info p-1 text-xs md:text-sm">{expense.type}</span>
                            </td>
                            <td className="p-2 md:p-3 font-semibold text-red-600">
                              Rs.{expense.amount.toLocaleString()}
                            </td>
                            <td className="p-2 md:p-3">
                              {reportData.summary.totalExpenses > 0 
                                ? ((expense.amount / reportData.summary.totalExpenses) * 100).toFixed(1)
                                : '0'
                              }%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    No expense data available for selected period
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profit' && reportData && (
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">Profit Trends</h3>
                {reportData.profit.length > 0 ? (
                  <div className="table-container overflow-x-auto">
                    <table className="table w-full text-sm md:text-base">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 md:p-3 text-left">Date</th>
                          <th className="p-2 md:p-3 text-left">Daily Profit</th>
                          <th className="p-2 md:p-3 text-left">Status</th>
                          <th className="p-2 md:p-3 text-left">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.profit.map((day, index) => {
                          const prevProfit = index > 0 ? reportData.profit[index - 1].profit : day.profit;
                          const trend = day.profit - prevProfit;
                          return (
                            <tr key={index} className="border-b">
                              <td className="p-2 md:p-3">{format(new Date(day.date), 'MMM d, yyyy')}</td>
                              <td className="p-2 md:p-3 font-semibold" style={{ color: day.profit >= 0 ? '#059669' : '#dc2626' }}>
                                Rs.{day.profit.toLocaleString()}
                              </td>
                              <td className="p-2 md:p-3">
                                <span className={`badge ${day.profit >= 0 ? 'badge-success' : 'badge-danger'} p-1 text-xs md:text-sm`}>
                                  {day.profit >= 0 ? 'Profitable' : 'Loss'}
                                </span>
                              </td>
                              <td className="p-2 md:p-3">
                                {index > 0 && (
                                  <div className="flex items-center gap-1" style={{ color: trend >= 0 ? '#059669' : '#dc2626' }}>
                                    {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {trend >= 0 ? '+' : ''}Rs.{trend.toLocaleString()}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    No profit data available for selected period
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;