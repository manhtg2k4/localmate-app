import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Select, Space, Modal, Descriptions,
  Typography, message, Button, Card, Row, Col, Avatar
} from 'antd';
import {
  EyeOutlined, CalendarOutlined, ClockCircleOutlined,
  DollarOutlined, UserOutlined, TeamOutlined, EnvironmentOutlined,
  SyncOutlined
} from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'gold',
  CONFIRMED: 'green',
  REJECTED: 'red',
  COMPLETED: 'blue',
  CANCELLED: 'default',
  ACTIVE: 'purple'
};

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { loadBookings(); }, [status, page]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/bookings', { params: { status, page, limit: 10 } });
      setBookings(res.data.data || []);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      message.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: '_id',
      key: 'id',
      render: (id: string) => <Tag color="geekblue" style={{ fontWeight: 600 }}>#{id.slice(-6).toUpperCase()}</Tag>
    },
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
      title: 'Guide Assigned',
      key: 'guide',
      render: (_: any, r: any) => (
        <Space>
          <Avatar style={{ backgroundColor: '#10B981' }}>
            {r.guideId?.userId?.fullName?.[0] || 'G'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 13 }}>{r.guideId?.userId?.fullName || 'Unassigned'}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{r.guideId?.userId?.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Destination',
      key: 'location',
      render: (_: any, r: any) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#0EA5E9' }} />
          <Text style={{ fontSize: 13 }}>{r.locationId?.name ? `${r.locationId.name} (${r.locationId.city})` : 'Custom Tour'}</Text>
        </Space>
      )
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'bookingDate',
      key: 'date',
      render: (d: string) => (
        <Space>
          <CalendarOutlined style={{ color: '#94a3b8' }} />
          <Text>{new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
        </Space>
      )
    },
    {
      title: 'Total Price',
      dataIndex: 'totalAmount',
      key: 'amount',
      render: (a: number, r: any) => (
        <div>
          <Text strong style={{ color: '#0F172A', fontSize: 14 }}>
            ${a?.toFixed(2)}
          </Text>
          <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
            (Fee: ${r.platformFee?.toFixed(2) || '0.00'})
          </Text>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={STATUS_COLORS[s] || 'default'}>{s}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => setSelected(record)}
          style={{ borderRadius: 6 }}
        >
          Details
        </Button>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Card style={{ marginBottom: 24, borderRadius: 16 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>
              Booking Management ({total})
            </Title>
            <Text type="secondary">
              Track tour reservations, payment statuses, destination locations, and schedule details.
            </Text>
          </Col>
          <Col>
            <Space>
              <Select
                value={status || 'All Statuses'}
                onChange={v => { setStatus(v === 'All Statuses' ? '' : v); setPage(1); }}
                style={{ width: 180 }}
                options={[
                  { value: 'All Statuses', label: 'All Statuses' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'CONFIRMED', label: 'Confirmed' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'CANCELLED', label: 'Cancelled' },
                  { value: 'REJECTED', label: 'Rejected' }
                ]}
              />
              <Button icon={<SyncOutlined spin={loading} />} onClick={loadBookings} style={{ borderRadius: 8 }}>
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 16 }}>
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="_id"
          loading={loading}
          pagination={{ current: page, total, pageSize: 10, onChange: setPage }}
        />
      </Card>

      {/* Booking Details Modal */}
      <Modal
        title={`Booking Details #${selected?._id?.slice(-6).toUpperCase()}`}
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
        width={620}
      >
        {selected && (
          <div style={{ paddingTop: 12 }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Tourist" span={2}>
                <Space>
                  <UserOutlined />
                  <span>{selected.touristId?.fullName} ({selected.touristId?.email})</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Guide" span={2}>
                <Space>
                  <TeamOutlined />
                  <span>{selected.guideId?.userId?.fullName || 'Unassigned'} ({selected.guideId?.userId?.email || 'N/A'})</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Destination" span={2}>
                <Space>
                  <EnvironmentOutlined />
                  <span>{selected.locationId?.name ? `${selected.locationId.name} (${selected.locationId.city})` : 'Custom Itinerary'}</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Tour Date">
                {new Date(selected.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Descriptions.Item>
              <Descriptions.Item label="Time Window">
                <ClockCircleOutlined /> {selected.startTime || '09:00'} - {selected.endTime || '17:00'}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <strong style={{ color: '#10b981', fontSize: 16 }}>${selected.totalAmount?.toFixed(2)}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={STATUS_COLORS[selected.status]}>{selected.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Special Requests" span={2}>
                {selected.specialRequests || selected.notes || 'No special requests provided by tourist.'}
              </Descriptions.Item>
              {selected.cancelReason && (
                <Descriptions.Item label="Cancellation Reason" span={2}>
                  <Text type="danger">{selected.cancelReason}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
}
