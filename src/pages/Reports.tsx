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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ padding: '1.5rem 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', gap: '1rem', '@media (min-width: 640px)': { flexDirection: 'row' } }}>
            <div>
              <h1 className="page-title" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>Reports & Analytics</h1>
              <p className="page-subtitle" style={{ fontSize: '0.875rem' }}>Comprehensive business insights</p>
            </div>
            <button className="btn btn-secondary" onClick={exportReport} disabled={!reportData} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', '@media (max-width: 639px)': { width: '100%' } }}>
              <Download size={20} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Date Range Controls */}
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '1rem 1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', gap: '1rem', '@media (min-width: 640px)': { flexDirection: 'row' } }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: 'column', width: '100%', '@media (min-width: 640px)': { flexDirection: 'row', width: 'auto' } }}>
              <Calendar size={20} color="#2563eb" />
              <input
                type="date"
                className="form-input"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', width: '100%', '@media (min-width: 640px)': { width: 'auto' } }}
              />
              <span style={{ color: '#64748b', display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>to</span>
              <input
                type="date"
                className="form-input"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', width: '100%', '@media (min-width: 640px)': { width: 'auto' } }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', width: '100%', '@media (min-width: 640px)': { flexDirection: 'row', width: 'auto' } }}>
              <button className="btn btn-outline" onClick={() => setQuickRange(7)} style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: '#1e40af', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', width: '100%', '@media (min-width: 640px)': { width: 'auto' } }}>
                Last 7 Days
              </button>
              <button className="btn btn-outline" onClick={() => setQuickRange(30)} style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: '#1e40af', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', width: '100%', '@media (min-width: 640px)': { width: 'auto' } }}>
                Last 30 Days
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  const now = new Date();
                  setDateRange({
                    startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
                    endDate: format(endOfMonth(now), 'yyyy-MM-dd')
                  });
                }}
                style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: '#1e40af', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem', width: '100%', '@media (min-width: 640px)': { width: 'auto' } }}
              >
                This Month
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {reportData && (
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem', '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, 1fr)' }, '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(4, 1fr)' }, marginBottom: '2rem' }}>
            <div className="stat-card success" style={{ padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', backgroundColor: 'rgba(5, 150, 105, 0.1)' }}>
              <div className="stat-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '2.5rem', height: '2.5rem', backgroundColor: 'rgba(5, 150, 105, 0.2)', borderRadius: '9999px' }}>
                <TrendingUp size={24} />
              </div>
              <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginTop: '0.5rem' }}>Rs.{reportData.summary.totalSales.toLocaleString()}</div>
              <div className="stat-label" style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Sales</div>
            </div>

            <div className="stat-card danger" style={{ padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
              <div className="stat-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '2.5rem', height: '2.5rem', backgroundColor: 'rgba(220, 38, 38, 0.2)', borderRadius: '9999px' }}>
                <TrendingDown size={24} />
              </div>
              <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginTop: '0.5rem' }}>Rs.{reportData.summary.totalExpenses.toLocaleString()}</div>
              <div className="stat-label" style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Expenses</div>
            </div>

            <div className="stat-card" style={{ padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', backgroundColor: reportData.summary.totalProfit >= 0 ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)' }}>
              <div className="stat-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '2.5rem', height: '2.5rem', backgroundColor: reportData.summary.totalProfit >= 0 ? 'rgba(5, 150, 105, 0.2)' : 'rgba(220, 38, 38, 0.2)', borderRadius: '9999px', color: reportData.summary.totalProfit >= 0 ? '#059669' : '#dc2626' }}>
                {reportData.summary.totalProfit >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              </div>
              <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginTop: '0.5rem' }}>Rs.{reportData.summary.totalProfit.toLocaleString()}</div>
              <div className="stat-label" style={{ fontSize: '0.875rem', color: '#64748b' }}>Net Profit</div>
            </div>

            <div className="stat-card" style={{ padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', backgroundColor: 'rgba(13, 148, 136, 0.1)' }}>
              <div className="stat-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '2.5rem', height: '2.5rem', backgroundColor: 'rgba(13, 148, 136, 0.2)', borderRadius: '9999px' }}>
                <FileText size={24} />
              </div>
              <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginTop: '0.5rem' }}>Rs.{reportData.summary.avgDailyProfit.toLocaleString()}</div>
              <div className="stat-label" style={{ fontSize: '0.875rem', color: '#64748b' }}>Avg Daily Profit</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '0', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', overflowX: 'auto', '@media (max-width: 639px)': { paddingBottom: '0.5rem' } }}>
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'sales', label: 'Sales Analysis' },
              { key: 'expenses', label: 'Expense Analysis' },
              { key: 'profit', label: 'Profit Trends' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  padding: '1rem 1.5rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: activeTab === tab.key ? '#2563eb' : '#64748b',
                  borderBottom: activeTab === tab.key ? '2px solid #2563eb' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  '@media (max-width: 639px)': { padding: '0.75rem 1rem', fontSize: '0.875rem' }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '2rem', '@media (max-width: 639px)': { padding: '1rem' } }}>
            {activeTab === 'overview' && reportData && (
              <div>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Business Overview</h3>
                <div className="grid grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', '@media (min-width: 640px)': { gridTemplateColumns: '1fr 1fr' } }}>
                  <div>
                    <h4 style={{ marginBottom: '1rem', color: '#374151', fontSize: '1rem', fontWeight: '500' }}>Key Metrics</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Profit Margin:</span>
                        <span style={{ fontWeight: '600' }}>
                          {reportData.summary.totalSales > 0 
                            ? ((reportData.summary.totalProfit / reportData.summary.totalSales) * 100).toFixed(1)
                            : '0'
                          }%
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Days in Period:</span>
                        <span style={{ fontWeight: '600' }}>
                          {Math.ceil((new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Avg Daily Sales:</span>
                        <span style={{ fontWeight: '600' }}>
                          Rs.{Math.round(reportData.summary.totalSales / Math.max(1, Math.ceil((new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '1rem', color: '#374151', fontSize: '1rem', fontWeight: '500' }}>Performance Status</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="alert" style={{ padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: reportData.summary.totalProfit > 0 ? '#ecfdf5' : '#fef3c7', color: reportData.summary.totalProfit > 0 ? '#166534' : '#92400e' }}>
                        {reportData.summary.totalProfit > 0 ? 'Business is profitable' : 'Business needs attention'}
                      </div>
                      {reportData.summary.totalSales > reportData.summary.totalExpenses * 2 && (
                        <div className="alert" style={{ padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: '#ecfdf5', color: '#166534' }}>
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
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Sales Analysis</h3>
                {reportData.sales.length > 0 ? (
                  <div className="table-container" style={{ overflowX: 'auto', '@media (max-width: 639px)': { width: '100%', overflowX: 'scroll' } }}>
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', textAlign: 'left', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>Date</th>
                          <th style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', textAlign: 'left', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>Units Sold</th>
                          <th style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', textAlign: 'left', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>Sales Amount</th>
                          <th style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', textAlign: 'left', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>Avg Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.sales.map((sale, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>{format(new Date(sale.date), 'MMM d, yyyy')}</td>
                            <td style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>{sale.units}</td>
                            <td style={{ padding: '0.5rem 1rem', fontWeight: '600', color: '#059669', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>
                              Rs.{sale.amount.toLocaleString()}
                            </td>
                            <td style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>Rs.{sale.units > 0 ? (sale.amount / sale.units).toFixed(2) : '0'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.875rem' }}>
                    No sales data available for selected period
                  </div>
                )}
              </div>
            )}

            {activeTab === 'expenses' && reportData && (
              <div>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Expense Analysis</h3>
                {reportData.expenses.length > 0 ? (
                  <div className="table-container" style={{ overflowX: 'auto', '@media (max-width: 639px)': { width: '100%', overflowX: 'scroll' } }}>
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', textAlign: 'left', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>Date</th>
                          <th style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', textAlign: 'left', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>Category</th>
                          <th style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', textAlign: 'left', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>Amount</th>
                          <th style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', textAlign: 'left', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>% of Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.expenses.map((expense, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>{format(new Date(expense.date), 'MMM d, yyyy')}</td>
                            <td style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>
                              <span className="badge badge-info" style={{ padding: '0.25rem 0.5rem', backgroundColor: '#bfdbfe', color: '#1e40af', borderRadius: '0.375rem', fontSize: '0.75rem' }}>{expense.type}</span>
                            </td>
                            <td style={{ padding: '0.5rem 1rem', fontWeight: '600', color: '#dc2626', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>
                              Rs.{expense.amount.toLocaleString()}
                            </td>
                            <td style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>
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
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.875rem' }}>
                    No expense data available for selected period
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profit' && reportData && (
              <div>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Profit Trends</h3>
                {reportData.profit.length > 0 ? (
                  <div className="table-container" style={{ overflowX: 'auto', '@media (max-width: 639px)': { width: '100%', overflowX: 'scroll' } }}>
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', textAlign: 'left', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>Date</th>
                          <th style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', textAlign: 'left', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>Daily Profit</th>
                          <th style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', textAlign: 'left', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>Status</th>
                          <th style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', textAlign: 'left', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.profit.map((day, index) => {
                          const prevProfit = index > 0 ? reportData.profit[index - 1].profit : day.profit;
                          const trend = day.profit - prevProfit;
                          
                          return (
                            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>{format(new Date(day.date), 'MMM d, yyyy')}</td>
                              <td style={{ padding: '0.5rem 1rem', fontWeight: '600', color: day.profit >= 0 ? '#059669' : '#dc2626', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>
                                Rs.{day.profit.toLocaleString()}
                              </td>
                              <td style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>
                                <span className="badge" style={{ padding: '0.25rem 0.5rem', backgroundColor: day.profit >= 0 ? '#ecfdf5' : '#fee2e2', color: day.profit >= 0 ? '#166534' : '#991b1b', borderRadius: '0.375rem', fontSize: '0.75rem' }}>
                                  {day.profit >= 0 ? 'Profitable' : 'Loss'}
                                </span>
                              </td>
                              <td style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', '@media (min-width: 640px)': { padding: '0.75rem 1.5rem' } }}>
                                {index > 0 && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: trend >= 0 ? '#059669' : '#dc2626' }}>
                                    {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
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
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.875rem' }}>
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