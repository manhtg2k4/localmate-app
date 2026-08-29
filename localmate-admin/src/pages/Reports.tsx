import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, Statistic, Table, Typography, Button,
  Space, Tag, Tabs, Modal, Input, message, Avatar, Popconfirm
} from 'antd';
import {
  DownloadOutlined, DollarCircleOutlined, PieChartOutlined,
  LineChartOutlined, RiseOutlined, BankOutlined, CheckCircleOutlined,
  CloseCircleOutlined, UserOutlined, SyncOutlined
} from '@ant-design/icons';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../services/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const PIE_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#0EA5E9', '#EC4899', '#8B5CF6'];

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<{
    monthlyData: any[];
    categoryData: any[];
    summary: any;
  }>({
    monthlyData: [],
    categoryData: [],
    summary: { totalGross: 0, totalCommission: 0, avgOrderValue: 0, totalCount: 0 }
  });

  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [withLoading, setWithLoading] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedWith, setSelectedWith] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [acting, setActing] = useState(false);

  useEffect(() => {
    loadReports();
    loadWithdrawals();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports');
      if (res.data?.data) {
        setReportData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadWithdrawals = async () => {
    setWithLoading(true);
    try {
      const res = await api.get('/admin/withdrawals?limit=50');
      setWithdrawals(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setWithLoading(false);
    }
  };

  const handleApproveWithdrawal = async (id: string) => {
    setActing(true);
    try {
      await api.put(`/admin/withdrawals/${id}`, { status: 'completed', adminNote: 'Transferred via bank wire' });
      message.success('Withdrawal approved and processed!');
      loadWithdrawals();
    } catch (err) {
      message.error('Failed to approve withdrawal');
    } finally {
      setActing(false);
    }
  };

  const handleRejectWithdrawal = async () => {
    if (!rejectReason.trim()) {
      message.warning('Please provide a reason for rejecting the payout request');
      return;
    }
    setActing(true);
    try {
      await api.put(`/admin/withdrawals/${selectedWith._id}`, { status: 'rejected', adminNote: rejectReason });
      message.success('Withdrawal rejected. Funds returned to Guide wallet.');
      setRejectModalOpen(false);
      setRejectReason('');
      loadWithdrawals();
    } catch (err) {
      message.error('Failed to reject withdrawal');
    } finally {
      setActing(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Month', 'Gross Revenue ($)', 'Total Bookings', 'Platform Commission 15% ($)'];
    const rows = reportData.monthlyData.map(d => [d.month, d.revenue, d.bookings, d.commission].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'localmate-financial-report.csv';
    a.click();
  };

  const tableColumns = [
    { title: 'Billing Period', dataIndex: 'month', key: 'month', render: (m: string) => <Tag color="indigo">{m} 2026</Tag> },
    { title: 'Gross Revenue', dataIndex: 'revenue', key: 'revenue', render: (v: number) => <Text strong>${v?.toLocaleString()}</Text> },
    { title: 'Completed Bookings', dataIndex: 'bookings', key: 'bookings' },
    {
      title: 'Platform Fee (15%)',
      dataIndex: 'commission',
      key: 'commission',
      render: (v: number) => <Text strong style={{ color: '#10B981' }}>${v?.toLocaleString()}</Text>
    },
  ];

  const withdrawalColumns = [
    {
      title: 'Guide',
      key: 'guide',
      render: (_: any, r: any) => (
        <Space>
          <Avatar style={{ backgroundColor: '#10B981' }}>{r.guideId?.userId?.fullName?.[0] || 'G'}</Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 13 }}>{r.guideId?.userId?.fullName || 'N/A'}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{r.guideId?.userId?.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Payout Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (a: number) => <Text strong style={{ color: '#10B981', fontSize: 14 }}>${a?.toFixed(2)}</Text>
    },
    {
      title: 'Bank Details',
      key: 'bank',
      render: (_: any, r: any) => (
        <div>
          <Text strong style={{ display: 'block', fontSize: 13 }}>{r.bankName}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{r.accountNumber} ({r.accountHolder})</Text>
        </div>
      )
    },
    {
      title: 'Request Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const colors: Record<string, string> = { pending: 'gold', processing: 'blue', completed: 'green', rejected: 'red' };
        return <Tag color={colors[s] || 'default'}>{s.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, r: any) => (
        r.status === 'pending' || r.status === 'processing' ? (
          <Space>
            <Popconfirm title="Approve and mark payout as transferred?" onConfirm={() => handleApproveWithdrawal(r._id)}>
              <Button type="primary" size="small" icon={<CheckCircleOutlined />} style={{ background: '#10B981', borderRadius: 6 }}>
                Approve
              </Button>
            </Popconfirm>
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => { setSelectedWith(r); setRejectModalOpen(true); }}
              style={{ borderRadius: 6 }}
            >
              Reject
            </Button>
          </Space>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>{r.adminNote || 'Processed'}</Text>
        )
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Card style={{ marginBottom: 24, borderRadius: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>
              Financial Reports & Payout Management
            </Title>
            <Text type="secondary">
              Analyze platform earnings, commission splits, and process guide withdrawal payouts.
            </Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<SyncOutlined spin={loading || withLoading} />} onClick={() => { loadReports(); loadWithdrawals(); }}>
                Refresh
              </Button>
              <Button type="primary" icon={<DownloadOutlined />} onClick={exportCSV} style={{ borderRadius: 10 }}>
                Export Financial CSV
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Financial KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { title: 'Total Gross Revenue', value: `$${reportData.summary?.totalGross?.toLocaleString() || '0'}`, suffix: 'All completed tours', color: '#6366F1' },
          { title: 'Platform Commission (15%)', value: `$${reportData.summary?.totalCommission?.toLocaleString() || '0'}`, suffix: 'Net platform income', color: '#10B981' },
          { title: 'Total Tour Bookings', value: `${reportData.summary?.totalCount || '0'}`, suffix: 'Tours executed', color: '#0EA5E9' },
          { title: 'Average Order Value', value: `$${reportData.summary?.avgOrderValue ? reportData.summary.avgOrderValue.toFixed(2) : '0'}`, suffix: 'Per booked tour', color: '#F59E0B' },
        ].map(stat => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Card className="stat-card-hover" style={{ borderRadius: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>{stat.title}</Text>
                <Tag color="green" style={{ borderRadius: 10, fontSize: 11 }}><RiseOutlined /> Live</Tag>
              </div>
              <Statistic value={stat.value} valueStyle={{ fontSize: 24, fontWeight: 700, color: stat.color }} />
              <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>{stat.suffix}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Tabs defaultActiveKey="1" items={[
        {
          key: '1',
          label: (
            <Space>
              <LineChartOutlined />
              <span>Revenue & Analytics</span>
            </Space>
          ),
          children: (
            <div>
              {/* Financial Charts */}
              <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={16}>
                  <Card
                    title={
                      <Space>
                        <LineChartOutlined style={{ color: '#6366F1' }} />
                        <Text strong style={{ fontSize: 16 }}>Gross Revenue vs Platform Commission</Text>
                      </Space>
                    }
                  >
                    <ResponsiveContainer width="100%" height={290}>
                      <AreaChart data={reportData.monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="commGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: '#0F172A', borderRadius: 12, color: '#fff', border: 'none' }} />
                        <Area type="monotone" dataKey="revenue" name="Gross Revenue ($)" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#revGradient)" />
                        <Area type="monotone" dataKey="commission" name="Commission ($)" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#commGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>

                <Col xs={24} lg={8}>
                  <Card
                    title={
                      <Space>
                        <PieChartOutlined style={{ color: '#0EA5E9' }} />
                        <Text strong style={{ fontSize: 16 }}>Category Shares</Text>
                      </Space>
                    }
                  >
                    <ResponsiveContainer width="100%" height={290}>
                      <PieChart>
                        <Pie
                          data={reportData.categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={95}
                          dataKey="value"
                          paddingAngle={4}
                        >
                          {reportData.categoryData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#0F172A', borderRadius: 12, color: '#fff', border: 'none' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>

              <Card title={<Text strong style={{ fontSize: 16 }}>Monthly Financial Breakdown</Text>}>
                <Table columns={tableColumns} dataSource={reportData.monthlyData} rowKey="month" pagination={false} />
              </Card>
            </div>
          )
        },
        {
          key: '2',
          label: (
            <Space>
              <BankOutlined />
              <span>Guide Withdrawal Requests ({withdrawals.filter(w => w.status === 'pending').length})</span>
            </Space>
          ),
          children: (
            <Card title={<Text strong style={{ fontSize: 16 }}>Guide Payout & Withdrawal Requests</Text>}>
              <Table
                columns={withdrawalColumns}
                dataSource={withdrawals}
                rowKey="_id"
                loading={withLoading}
                pagination={{ pageSize: 10 }}
              />
            </Card>
          )
        }
      ]} />

      {/* Reject Withdrawal Modal */}
      <Modal
        title="Reject Withdrawal Request"
        open={rejectModalOpen}
        onCancel={() => { setRejectModalOpen(false); setRejectReason(''); }}
        onOk={handleRejectWithdrawal}
        okText="Confirm & Return Balance"
        okButtonProps={{ danger: true, loading: acting }}
      >
        <Paragraph>
          Provide a reason for rejecting this payout request. The requested amount (${selectedWith?.amount}) will be instantly refunded back to the guide's wallet balance.
        </Paragraph>
        <TextArea
          rows={3}
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          placeholder="e.g. Bank account holder name does not match KYC verification..."
        />
      </Modal>
    </div>
  );
}
