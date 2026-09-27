import React, { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Button, Typography, Avatar, Space, Badge, Dropdown, Input, Tag } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined, UserOutlined, CalendarOutlined,
  EnvironmentOutlined, BarChartOutlined,
  CheckCircleOutlined, LogoutOutlined, BellOutlined,
  CompassFilled, SearchOutlined, MenuUnfoldOutlined,
  MenuFoldOutlined, SettingOutlined, UserSwitchOutlined
} from '@ant-design/icons';
import api from '../services/api';

const { Sider, Content, Header } = AntLayout;
const { Title, Text } = Typography;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchPendingCount();
  }, [location.pathname]);

  const fetchPendingCount = async () => {
    try {
      const res = await api.get('/admin/guides/pending?limit=1');
      setPendingCount(res.data.pagination?.total || res.data.data?.length || 0);
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { key: '/', icon: <DashboardOutlined style={{ fontSize: 18 }} />, label: 'Dashboard' },
    {
      key: '/guides',
      icon: (
        <Badge count={pendingCount} overflowCount={99} offset={[10, 0]}>
          <CheckCircleOutlined style={{ fontSize: 18, color: pendingCount > 0 ? '#f59e0b' : undefined }} />
        </Badge>
      ),
      label: 'Guide Approvals'
    },
    { key: '/users', icon: <UserOutlined style={{ fontSize: 18 }} />, label: 'Users' },
    { key: '/bookings', icon: <CalendarOutlined style={{ fontSize: 18 }} />, label: 'Bookings' },
    { key: '/locations', icon: <EnvironmentOutlined style={{ fontSize: 18 }} />, label: 'Locations' },
    { key: '/reports', icon: <BarChartOutlined style={{ fontSize: 18 }} />, label: 'Reports' },
  ];

  const currentLabel = menuItems.find(m => m.key === location.pathname)?.label || 'Dashboard';

  const userMenu = {
    items: [
      {
        key: 'profile',
        label: (
          <div style={{ padding: '4px 8px' }}>
            <Text strong style={{ display: 'block' }}>{user.fullName || 'System Admin'}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{user.email || 'admin@localmate.com'}</Text>
          </div>
        ),
      },
      { type: 'divider' as const },
      {
        key: 'guides',
        icon: <UserSwitchOutlined />,
        label: 'Pending Approvals',
        onClick: () => navigate('/guides')
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Platform Settings',
      },
      { type: 'divider' as const },
      {
        key: 'logout',
        icon: <LogoutOutlined style={{ color: '#ef4444' }} />,
        label: <Text type="danger">Log Out</Text>,
        onClick: handleLogout
      }
    ]
  };

  return (
    <AntLayout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={250}
        style={{
          background: '#0f172a',
          boxShadow: '4px 0 24px rgba(15, 23, 42, 0.08)',
          zIndex: 20
        }}
      >
        <div style={{
          padding: collapsed ? '20px 12px' : '20px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            flexShrink: 0
          }}>
            <CompassFilled style={{ fontSize: 22, color: '#fff' }} />
          </div>

          {!collapsed && (
            <div>
              <Title level={4} style={{ color: '#fff', margin: 0, fontSize: 18, fontWeight: 700 }}>
                LocalMate
              </Title>
              <Tag color="indigo" style={{ margin: 0, fontSize: 10, borderRadius: 4, padding: '0 6px' }}>
                ADMIN v1.0
              </Tag>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ marginTop: 16 }}
        />
      </Sider>

      <AntLayout style={{ background: '#f8fafc' }}>
        {/* Top Header */}
        <Header style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: 64
        }}>
          <Space size="middle">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16 }}
            />
            <Text strong style={{ fontSize: 18, color: '#0f172a' }}>
              {currentLabel}
            </Text>
          </Space>

          <Space size="large">
            <Input
              placeholder="Search guides, bookings, users..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              style={{
                width: 240,
                borderRadius: 20,
                background: '#f1f5f9',
                border: '1px solid transparent'
              }}
            />

            <Badge count={pendingCount} dot={pendingCount > 0}>
              <Button
                type="text"
                shape="circle"
                icon={<BellOutlined style={{ fontSize: 18 }} />}
                onClick={() => navigate('/guides')}
              />
            </Badge>

            <Dropdown menu={userMenu} trigger={['click', 'hover']} placement="bottomRight" arrow={{ pointAtCenter: true }}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  fontWeight: 600
                }}>
                  {user?.fullName?.[0] || 'A'}
                </Avatar>
                <div style={{ display: 'none', md: 'block' } as any}>
                  <Text strong style={{ fontSize: 14, color: '#0f172a', display: 'block', lineHeight: 1.2 }}>
                    {user?.fullName || 'Admin User'}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>Super Admin</Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Content Area */}
        <Content style={{ minHeight: 'calc(100vh - 64px)', padding: '24px 28px' }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
