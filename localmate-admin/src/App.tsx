import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GuideApproval from './pages/GuideApproval';
import Users from './pages/Users';
import Bookings from './pages/Bookings';
import Locations from './pages/Locations';
import Reports from './pages/Reports';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          colorPrimary: '#6366F1',
          colorSuccess: '#10B981',
          colorWarning: '#F59E0B',
          colorError: '#EF4444',
          colorInfo: '#0EA5E9',
          borderRadius: 12,
          colorBgContainer: '#FFFFFF',
          colorBgLayout: '#F8FAFC',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        },
        components: {
          Button: {
            fontWeight: 600,
            borderRadius: 10,
            controlHeight: 40,
          },
          Card: {
            borderRadiusLG: 16,
            boxShadowSecondary: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          },
          Table: {
            borderRadius: 12,
            headerBg: '#F8FAFC',
            headerColor: '#475569',
            headerSplitColor: 'transparent',
          },
          Tag: {
            borderRadiusSM: 6,
          }
        }
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="guides" element={<GuideApproval />} />
            <Route path="users" element={<Users />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="locations" element={<Locations />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
