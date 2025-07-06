
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Receipt, 
  // CreditCard, 
  FileText, 
  LogOut,
  Droplets
} from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Sales', href: '/sales', icon: ShoppingCart },
    { name: 'Expenses', href: '/expenses', icon: Receipt },
    // { name: 'Creditors', href: '/creditors', icon: CreditCard },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="layout">
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div className="sidebar-brand" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Droplets size={24} />
          RO Plant Manager
        </div>
        <nav style={{ flexGrow: 1 }}>
          <ul className="sidebar-nav" style={{ padding: '0 1.5rem' }}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name} style={{ marginBottom: '0.5rem' }}>
                  <Link 
                    to={item.href} 
                    className={isActive(item.href) ? 'active' : ''}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: isActive(item.href) ? '#60a5fa' : '#cbd5e1',
                      background: isActive(item.href) ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                    }}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(59, 130, 246, 0.1)', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
              Logged in as
            </div>
            <div style={{ fontWeight: '600', color: '#60a5fa' }}>
              {user?.username}
            </div>
          </div>
          <button 
            onClick={logout}
            className="btn btn-danger"
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: '8px'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;