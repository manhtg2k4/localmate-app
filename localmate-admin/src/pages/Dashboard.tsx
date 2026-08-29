import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Button, Space, Avatar, Modal, Badge } from 'antd';
import {
  UserOutlined, TeamOutlined, CalendarOutlined,
  DollarOutlined, ClockCircleOutlined, RiseOutlined,
  ArrowRightOutlined, SyncOutlined, CheckCircleFilled,
  CompassOutlined, EyeOutlined
} from '@ant-design/icons';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text, Paragraph } = Typography;

export default function Dashboard() {
  const [stats, setStats] = useState<any>({});
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, bookingsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/bookings?limit=6')
      ]);
      setStats(dashRes.data.data || {});
      setRecentBookings(bookingsRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const revenueData = [
    { month: 'Jan', revenue: 1400, bookings: 28 },
    { month: 'Feb', revenue: 2100, bookings: 42 },
    { month: 'Mar', revenue: 2850, bookings: 54 },
    { month: 'Apr', revenue: 2400, bookings: 46 },
    { month: 'May', revenue: 3600, bookings: 68 },
    { month: 'Jun', revenue: 4100, bookings: 82 },
  ];

  const bookingColumns = [
    {
      title: 'Tourist',
      key: 'tourist',
      render: (_: any, r: any) => (
        <Space>
          <Avatar style={{ backgroundColor: '#6366F1' }}>
            {r.touristId?.fullName?.[0] || 'T'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 13 }}>{r.touristId?.fullName || 'N/A'}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{r.touristId?.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Guide',
      key: 'guide',
      render: (_: any, r: any) => (
        <Space>
          <Avatar style={{ backgroundColor: '#10B981' }}>
            {r.guideId?.userId?.fullName?.[0] || 'G'}
          </Avatar>
          <Text style={{ fontSize: 13 }}>{r.guideId?.userId?.fullName || 'N/A'}</Text>
        </Space>
      )
    },
    {
      title: 'Booking Date',
      dataIndex: 'bookingDate',
      key: 'date',
      render: (d: string) => <Text style={{ fontSize: 13 }}>{new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'amount',
      render: (a: number) => (
        <Text strong style={{ color: '#0F172A', fontSize: 14 }}>
          ${a?.toFixed(2)}
        </Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const config: Record<string, { color: string; label: string }> = {
          PENDING: { color: 'gold', label: 'Pending' },
          CONFIRMED: { color: 'green', label: 'Confirmed' },
          COMPLETED: { color: 'blue', label: 'Completed' },
          CANCELLED: { color: 'red', label: 'Cancelled' }
        };
        const c = config[s] || { color: 'default', label: s };
        return <Tag color={c.color}>{c.label}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => setSelectedBooking(record)}
        >
          Details
        </Button>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Top Welcome Banner */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #0ea5e9 100%)',
          borderRadius: 20,
          border: 'none',
          marginBottom: 24,
          boxShadow: '0 12px 30px rgba(99, 102, 241, 0.25)',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '28px 32px' }}
      >
        <Row justify="space-between" align="middle" gutter={24}>
          <Col span={16}>
            <Space style={{ marginBottom: 8 }}>
              <Tag color="cyan" icon={<CheckCircleFilled />} style={{ borderRadius: 20, padding: '2px 10px' }}>
                All Systems Operational
              </Tag>
            </Space>
            <Title level={2} style={{ color: '#fff', margin: '0 0 6px 0', fontWeight: 800 }}>
              Welcome back, LocalMate Admin! 👋
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', margin: 0, fontSize: 15 }}>
              Here is your platform performance overview for today. You have {stats.pendingGuides || 0} pending guide approvals requiring review.
            </Paragraph>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                icon={<SyncOutlined spin={loading} />}
                onClick={loadData}
                style={{ background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: '#fff', fontWeight: 600, borderRadius: 10 }}
              >
                Refresh Data
              </Button>
              {stats.pendingGuides > 0 && (
                <Button
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate('/guides')}
                  style={{ background: '#fff', color: '#4f46e5', border: 'none', fontWeight: 700, borderRadius: 10 }}
                >
                  Review Guides ({stats.pendingGuides})
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 5 KPI Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { title: 'Total Users', value: stats.totalUsers || 0, icon: <UserOutlined />, color: '#6366F1', bg: '#EEF2FF', growth: '+14%' },
          { title: 'Active Guides', value: stats.totalGuides || 0, icon: <TeamOutlined />, color: '#10B981', bg: '#ECFDF5', growth: '+8%' },
          { title: 'Total Bookings', value: stats.totalBookings || 0, icon: <CalendarOutlined />, color: '#F59E0B', bg: '#FFFBEB', growth: '+22%' },
          { title: 'Platform Revenue', value: `$${(stats.totalRevenue || 0).toFixed(2)}`, icon: <DollarOutlined />, color: '#0EA5E9', bg: '#F0F9FF', growth: '+18%' },
          { title: 'Pending Approvals', value: stats.pendingGuides || 0, icon: <ClockCircleOutlined />, color: '#EF4444', bg: '#FEF2F2', growth: 'Needs action' },
        ].map(stat => (
          <Col xs={24} sm={12} md={8} lg={4.8} style={{ flex: '0 0 20%', maxWidth: '20%' }} key={stat.title}>
            <Card className="stat-card-hover" style={{ borderRadius: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                  fontSize: 20
                }}>
                  {stat.icon}
                </div>
                <Tag color={stat.color === '#EF4444' ? 'red' : 'green'} style={{ borderRadius: 12, fontSize: 10 }}>
                  <RiseOutlined /> {stat.growth}
                </Tag>
              </div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                {stat.title}
              </Text>
              <Statistic
                value={stat.value}
                valueStyle={{ fontSize: 24, fontWeight: 700, color: '#0F172A' }}
                loading={loading}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recharts Analytics Charts */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <CompassOutlined style={{ color: '#6366F1' }} />
                <Text strong style={{ fontSize: 16 }}>Revenue & Growth Trend</Text>
              </Space>
            }
            extra={<Tag color="indigo">Last 6 Months</Tag>}
          >
            <ResponsiveContainer width="100%" height={290}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0F172A', borderRadius: 12, color: '#fff', border: 'none' }}
                  formatter={(v: any) => [`$${v}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <CalendarOutlined style={{ color: '#0EA5E9' }} />
                <Text strong style={{ fontSize: 16 }}>Bookings Volume</Text>
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0F172A', borderRadius: 12, color: '#fff', border: 'none' }} />
                <Bar dataKey="bookings" fill="#0EA5E9" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Bookings Table */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: 16 }}>Recent Bookings Activity</Text>
            <Button type="link" onClick={() => navigate('/bookings')}>
              View All Bookings <ArrowRightOutlined />
            </Button>
          </div>
        }
      >
        <Table
          columns={bookingColumns}
          dataSource={recentBookings}
          rowKey="_id"
          pagination={false}
          loading={loading}
        />
      </Card>

      {/* Details Modal */}
      <Modal
        title={`Booking #${selectedBooking?._id?.slice(-6)}`}
        open={!!selectedBooking}
        onCancel={() => setSelectedBooking(null)}
        footer={null}
        width={550}
      >
        {selectedBooking && (
          <div style={{ padding: '8px 0' }}>
            <p><strong>Tourist:</strong> {selectedBooking.touristId?.fullName} ({selectedBooking.touristId?.email})</p>
            <p><strong>Guide:</strong> {selectedBooking.guideId?.userId?.fullName}</p>
            <p><strong>Date:</strong> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
            <p><strong>Amount:</strong> ${selectedBooking.totalAmount}</p>
            <p><strong>Status:</strong> <Tag color="blue">{selectedBooking.status}</Tag></p>
          </div>
        )}
      </Modal>
    </div>
  );
}
