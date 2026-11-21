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
      title: 'Mã đặt tour',
      dataIndex: '_id',
      key: 'id',
      width: 130,
      render: (id: string) => <Tag color="geekblue" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>#{id.slice(-6).toUpperCase()}</Tag>
    },
    {
      title: 'Khách du lịch',
      key: 'tourist',
      width: 220,
      render: (_: any, r: any) => (
        <Space style={{ whiteSpace: 'nowrap' }}>
          <Avatar style={{ backgroundColor: '#6366F1', flexShrink: 0 }}>
            {r.touristId?.fullName?.[0] || 'T'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 13, whiteSpace: 'nowrap' }}>{r.touristId?.fullName || 'N/A'}</Text>
            <Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{r.touristId?.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'HDV phụ trách',
      key: 'guide',
      width: 200,
      render: (_: any, r: any) => (
        <Space style={{ whiteSpace: 'nowrap' }}>
          <Avatar style={{ backgroundColor: '#10B981', flexShrink: 0 }}>
            {r.guideId?.userId?.fullName?.[0] || 'G'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 13, whiteSpace: 'nowrap' }}>{r.guideId?.userId?.fullName || 'Chưa phân công'}</Text>
            <Text type="secondary" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{r.guideId?.userId?.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Điểm tham quan',
      key: 'location',
      width: 200,
      render: (_: any, r: any) => (
        <Space style={{ whiteSpace: 'nowrap' }}>
          <EnvironmentOutlined style={{ color: '#0EA5E9', flexShrink: 0 }} />
          <Text style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{r.locationId?.name ? `${r.locationId.name} (${r.locationId.city})` : 'Tour tự chọn'}</Text>
        </Space>
      )
    },
    {
      title: 'Ngày khởi hành',
      dataIndex: 'bookingDate',
      key: 'date',
      width: 150,
      render: (d: string) => (
        <Space style={{ whiteSpace: 'nowrap' }}>
          <CalendarOutlined style={{ color: '#94a3b8' }} />
          <Text>{new Date(d).toLocaleDateString('vi-VN')}</Text>
        </Space>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'amount',
      width: 140,
      render: (a: number, r: any) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <Text strong style={{ color: '#0F172A', fontSize: 14 }}>
            ${a?.toFixed(2)}
          </Text>
          <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
            (Phí sàn: ${r.platformFee?.toFixed(2) || '0.00'})
          </Text>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (s: string) => {
        const labels: Record<string, string> = {
          PENDING: 'Chờ duyệt',
          CONFIRMED: 'Đã xác nhận',
          COMPLETED: 'Hoàn thành',
          CANCELLED: 'Đã hủy',
          REJECTED: 'Bị từ chối'
        };
        return <Tag color={STATUS_COLORS[s] || 'default'} style={{ whiteSpace: 'nowrap' }}>{labels[s] || s}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_: any, record: any) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => setSelected(record)}
          style={{ borderRadius: 6, whiteSpace: 'nowrap' }}
        >
          Chi tiết
        </Button>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Card style={{ marginBottom: 24, borderRadius: 16 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={14}>
            <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>
              Quản lý đặt tour ({total})
            </Title>
            <Text type="secondary">
              Theo dõi danh sách đặt tour, trạng thái thanh toán, điểm đến và lịch trình tham quan.
            </Text>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: 'right' }}>
            <Space wrap>
              <Select
                value={status || 'Tất cả trạng thái'}
                onChange={v => { setStatus(v === 'Tất cả trạng thái' ? '' : v); setPage(1); }}
                style={{ width: 170 }}
                options={[
                  { value: 'Tất cả trạng thái', label: 'Tất cả trạng thái' },
                  { value: 'PENDING', label: 'Chờ duyệt' },
                  { value: 'CONFIRMED', label: 'Đã xác nhận' },
                  { value: 'COMPLETED', label: 'Hoàn thành' },
                  { value: 'CANCELLED', label: 'Đã hủy' },
                  { value: 'REJECTED', label: 'Bị từ chối' }
                ]}
              />
              <Button icon={<SyncOutlined spin={loading} />} onClick={loadBookings} style={{ borderRadius: 8 }}>
                Làm mới
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
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Booking Details Modal */}
      <Modal
        title={`Chi tiết đơn tour #${selected?._id?.slice(-6).toUpperCase()}`}
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
        width={620}
      >
        {selected && (
          <div style={{ paddingTop: 12 }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Khách du lịch" span={2}>
                <Space>
                  <UserOutlined />
                  <span>{selected.touristId?.fullName} ({selected.touristId?.email})</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Hướng dẫn viên" span={2}>
                <Space>
                  <TeamOutlined />
                  <span>{selected.guideId?.userId?.fullName || 'Chưa phân công'} ({selected.guideId?.userId?.email || 'N/A'})</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Điểm tham quan" span={2}>
                <Space>
                  <EnvironmentOutlined />
                  <span>{selected.locationId?.name ? `${selected.locationId.name} (${selected.locationId.city})` : 'Lịch trình tùy chọn'}</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày khởi hành">
                {new Date(selected.bookingDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Khung giờ">
                <ClockCircleOutlined /> {selected.startTime || '09:00'} - {selected.endTime || '17:00'}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <strong style={{ color: '#10b981', fontSize: 16 }}>${selected.totalAmount?.toFixed(2)}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={STATUS_COLORS[selected.status]}>{selected.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Yêu cầu đặc biệt" span={2}>
                {selected.specialRequests || selected.notes || 'Không có yêu cầu đặc biệt từ khách.'}
              </Descriptions.Item>
              {selected.cancelReason && (
                <Descriptions.Item label="Lý do hủy tour" span={2}>
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
