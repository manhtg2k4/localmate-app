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
      message.success('Đã phê duyệt và xử lý chuyển tiền thành công!');
      loadWithdrawals();
    } catch (err) {
      message.error('Phê duyệt rút tiền thất bại');
    } finally {
      setActing(false);
    }
  };

  const handleRejectWithdrawal = async () => {
    if (!rejectReason.trim()) {
      message.warning('Vui lòng cung cấp lý do từ chối yêu cầu rút tiền');
      return;
    }
    setActing(true);
    try {
      await api.put(`/admin/withdrawals/${selectedWith._id}`, { status: 'rejected', adminNote: rejectReason });
      message.success('Đã từ chối rút tiền. Số tiền đã được hoàn trả vào ví của HDV.');
      setRejectModalOpen(false);
      setRejectReason('');
      loadWithdrawals();
    } catch (err) {
      message.error('Từ chối rút tiền thất bại');
    } finally {
      setActing(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Tháng', 'Tổng doanh thu ($)', 'Số lượt đặt tour', 'Hoa hồng sàn 15% ($)'];
    const rows = reportData.monthlyData.map(d => [d.month, d.revenue, d.bookings, d.commission].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bao-cao-tai-chinh-localmate.csv';
    a.click();
  };

  const tableColumns = [
    { title: 'Kỳ thanh toán', dataIndex: 'month', key: 'month', render: (m: string) => <Tag color="indigo">Tháng {m}/2026</Tag> },
    { title: 'Doanh thu gộp', dataIndex: 'revenue', key: 'revenue', render: (v: number) => <Text strong>${v?.toLocaleString()}</Text> },
    { title: 'Số tour hoàn thành', dataIndex: 'bookings', key: 'bookings' },
    {
      title: 'Hoa hồng sàn (15%)',
      dataIndex: 'commission',
      key: 'commission',
      render: (v: number) => <Text strong style={{ color: '#10B981' }}>${v?.toLocaleString()}</Text>
    },
  ];

  const withdrawalColumns = [
    {
      title: 'Hướng dẫn viên',
      key: 'guide',
      width: 220,
      render: (_: any, r: any) => (
        <Space style={{ whiteSpace: 'nowrap' }}>
          <Avatar style={{ backgroundColor: '#10B981', flexShrink: 0 }}>{r.guideId?.userId?.fullName?.[0] || 'G'}</Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 13, whiteSpace: 'nowrap' }}>{r.guideId?.userId?.fullName || 'N/A'}</Text>
            <Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{r.guideId?.userId?.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Số tiền rút',
      dataIndex: 'amount',
      key: 'amount',
      width: 140,
      render: (a: number) => <Text strong style={{ color: '#10B981', fontSize: 14, whiteSpace: 'nowrap' }}>${a?.toFixed(2)}</Text>
    },
    {
      title: 'Thông tin tài khoản',
      key: 'bank',
      width: 240,
      render: (_: any, r: any) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <Text strong style={{ display: 'block', fontSize: 13 }}>{r.bankName}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{r.accountNumber} ({r.accountHolder})</Text>
        </div>
      )
    },
    {
      title: 'Ngày yêu cầu',
      dataIndex: 'createdAt',
      key: 'date',
      width: 140,
      render: (d: string) => <span style={{ whiteSpace: 'nowrap' }}>{new Date(d).toLocaleDateString('vi-VN')}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (s: string) => {
        const labels: Record<string, string> = { pending: 'CHỜ DUYỆT', processing: 'ĐANG XỬ LÝ', completed: 'HOÀN THÀNH', rejected: 'TỪ CHỐI' };
        const colors: Record<string, string> = { pending: 'gold', processing: 'blue', completed: 'green', rejected: 'red' };
        return <Tag color={colors[s] || 'default'} style={{ whiteSpace: 'nowrap' }}>{labels[s] || s.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 160,
      render: (_: any, r: any) => (
        r.status === 'pending' || r.status === 'processing' ? (
          <Space style={{ whiteSpace: 'nowrap' }}>
            <Popconfirm title="Xác nhận duyệt và đã chuyển khoản cho HDV?" okText="Duyệt" cancelText="Hủy" onConfirm={() => handleApproveWithdrawal(r._id)}>
              <Button type="primary" size="small" icon={<CheckCircleOutlined />} style={{ background: '#10B981', borderRadius: 6 }}>
                Duyệt chi
              </Button>
            </Popconfirm>
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => { setSelectedWith(r); setRejectModalOpen(true); }}
              style={{ borderRadius: 6 }}
            >
              Từ chối
            </Button>
          </Space>
        ) : (
          <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{r.adminNote || 'Đã xử lý'}</Text>
        )
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Card style={{ marginBottom: 24, borderRadius: 16 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={14}>
            <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>
              Báo cáo tài chính & Quản lý rút tiền
            </Title>
            <Text type="secondary">
              Phân tích doanh thu nền tảng, tỷ lệ hoa hồng và xử lý yêu cầu rút tiền của hướng dẫn viên.
            </Text>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: 'right' }}>
            <Space wrap>
              <Button icon={<SyncOutlined spin={loading || withLoading} />} onClick={() => { loadReports(); loadWithdrawals(); }}>
                Làm mới
              </Button>
              <Button type="primary" icon={<DownloadOutlined />} onClick={exportCSV} style={{ borderRadius: 10 }}>
                Xuất file CSV
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Financial KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { title: 'Tổng doanh thu gộp', value: `$${reportData.summary?.totalGross?.toLocaleString() || '0'}`, suffix: 'Tất cả tour hoàn thành', color: '#6366F1' },
          { title: 'Hoa hồng sàn (15%)', value: `$${reportData.summary?.totalCommission?.toLocaleString() || '0'}`, suffix: 'Thu nhập ròng của sàn', color: '#10B981' },
          { title: 'Tổng số lượt đặt tour', value: `${reportData.summary?.totalCount || '0'}`, suffix: 'Chuyến đi đã dẫn', color: '#0EA5E9' },
          { title: 'Giá trị đơn trung bình', value: `$${reportData.summary?.avgOrderValue ? reportData.summary.avgOrderValue.toFixed(2) : '0'}`, suffix: 'Trên mỗi chuyến đi', color: '#F59E0B' },
        ].map(stat => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Card className="stat-card-hover" style={{ borderRadius: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>{stat.title}</Text>
                <Tag color="green" style={{ borderRadius: 10, fontSize: 11 }}><RiseOutlined /> Trực tiếp</Tag>
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
              <span>Doanh thu & Phân tích</span>
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
                        <Text strong style={{ fontSize: 16 }}>Tổng doanh thu so với Hoa hồng sàn</Text>
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
                        <Area type="monotone" dataKey="revenue" name="Tổng doanh thu ($)" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#revGradient)" />
                        <Area type="monotone" dataKey="commission" name="Hoa hồng sàn ($)" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#commGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>

                <Col xs={24} lg={8}>
                  <Card
                    title={
                      <Space>
                        <PieChartOutlined style={{ color: '#0EA5E9' }} />
                        <Text strong style={{ fontSize: 16 }}>Tỷ trọng theo danh mục</Text>
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

              <Card title={<Text strong style={{ fontSize: 16 }}>Chi tiết tài chính theo từng tháng</Text>}>
                <Table columns={tableColumns} dataSource={reportData.monthlyData} rowKey="month" pagination={false} scroll={{ x: 600 }} />
              </Card>
            </div>
          )
        },
        {
          key: '2',
          label: (
            <Space>
              <BankOutlined />
              <span>Yêu cầu rút tiền của HDV ({withdrawals.filter(w => w.status === 'pending').length})</span>
            </Space>
          ),
          children: (
            <Card title={<Text strong style={{ fontSize: 16 }}>Danh sách yêu cầu rút tiền của HDV</Text>}>
              <Table
                columns={withdrawalColumns}
                dataSource={withdrawals}
                rowKey="_id"
                loading={withLoading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 900 }}
              />
            </Card>
          )
        }
      ]} />

      {/* Reject Withdrawal Modal */}
      <Modal
        title="Từ chối yêu cầu rút tiền"
        open={rejectModalOpen}
        onCancel={() => { setRejectModalOpen(false); setRejectReason(''); }}
        onOk={handleRejectWithdrawal}
        okText="Xác nhận & Hoàn tiền vào ví"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: acting }}
      >
        <Paragraph>
          Vui lòng nhập lý do từ chối yêu cầu rút tiền này. Số tiền yêu cầu (${selectedWith?.amount}) sẽ được hoàn trả ngay lập tức vào số dư ví của hướng dẫn viên.
        </Paragraph>
        <TextArea
          rows={3}
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          placeholder="Ví dụ: Tên chủ tài khoản ngân hàng không khớp với hồ sơ KYC..."
        />
      </Modal>
    </div>
  );
}
