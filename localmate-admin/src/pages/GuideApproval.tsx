import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Modal, Space, Typography, Input, message, Descriptions, Avatar, Card, Row, Col, Tabs } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, SearchOutlined, CheckCircleOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function GuideApproval() {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [acting, setActing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { loadGuides(); }, []);

  const loadGuides = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/guides/pending?limit=50');
      setGuides(res.data.data || []);
    } catch (err) {
      message.error('Failed to load pending guides');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (guideId: string) => {
    setActing(true);
    try {
      await api.put(`/admin/guides/${guideId}/approve`, { approve: true });
      message.success('Đã phê duyệt hồ sơ hướng dẫn viên thành công!');
      setModalOpen(false);
      loadGuides();
    } catch (err) {
      message.error('Phê duyệt hướng dẫn viên thất bại');
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối');
      return;
    }
    setActing(true);
    try {
      await api.put(`/admin/guides/${selectedGuide._id}/approve`, { approve: false, reason: rejectReason });
      message.success('Đã từ chối hồ sơ ứng viên');
      setRejectModalOpen(false);
      setRejectReason('');
      setModalOpen(false);
      loadGuides();
    } catch (err) {
      message.error('Thao tác từ chối thất bại');
    } finally {
      setActing(false);
    }
  };

  const filteredGuides = guides.filter(g => {
    const name = g.userId?.fullName?.toLowerCase() || '';
    const email = g.userId?.email?.toLowerCase() || '';
    const term = search.toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  const columns = [
    {
      title: 'Ứng viên HDV',
      key: 'name',
      width: 260,
      render: (_: any, r: any) => (
        <Space size="middle" style={{ whiteSpace: 'nowrap' }}>
          <Avatar size={42} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontWeight: 700, flexShrink: 0 }}>
            {r.userId?.fullName?.[0] || 'G'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 14, whiteSpace: 'nowrap' }}>{r.userId?.fullName || 'Ẩn danh'}</Text>
            <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{r.userId?.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Quốc tịch',
      dataIndex: ['userId', 'nationality'],
      key: 'nationality',
      width: 140,
      render: (nat: string) => <Tag color="geekblue" icon={<GlobalOutlined />} style={{ whiteSpace: 'nowrap' }}>{nat || 'Việt Nam'}</Tag>
    },
    {
      title: 'Ngôn ngữ',
      dataIndex: 'languages',
      key: 'languages',
      width: 200,
      render: (langs: string[]) => (
        <Space size={[0, 4]} wrap>
          {langs?.map(l => <Tag color="blue" key={l}>{l}</Tag>)}
        </Space>
      )
    },
    {
      title: 'Kinh nghiệm',
      dataIndex: 'yearsExperience',
      key: 'exp',
      width: 120,
      render: (y: number) => <Text strong style={{ color: '#0F172A', whiteSpace: 'nowrap' }}>{y || 0} năm</Text>
    },
    {
      title: 'Mức giá',
      key: 'rate',
      width: 130,
      render: (_: any, r: any) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <Text strong style={{ color: '#10B981', display: 'block' }}>${r.hourlyRate}/giờ</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>${r.dailyRate}/ngày</Text>
        </div>
      )
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'createdAt',
      key: 'date',
      width: 130,
      render: (d: string) => <span style={{ whiteSpace: 'nowrap' }}>{new Date(d).toLocaleDateString('vi-VN')}</span>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 260,
      render: (_: any, record: any) => (
        <Space style={{ whiteSpace: 'nowrap' }}>
          <Button
            icon={<EyeOutlined />}
            onClick={() => { setSelectedGuide(record); setModalOpen(true); }}
            style={{ borderRadius: 8 }}
          >
            Xem hồ sơ
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record._id)}
            loading={acting}
            style={{ borderRadius: 8, background: '#10b981' }}
          >
            Duyệt
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => { setSelectedGuide(record); setRejectModalOpen(true); }}
            style={{ borderRadius: 8 }}
          >
            Từ chối
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Card style={{ marginBottom: 24, borderRadius: 16 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>
              Xét duyệt hồ sơ Hướng dẫn viên
            </Title>
            <Text type="secondary">
              Xem xét và xác minh hồ sơ HDV trước khi hiển thị công khai trên ứng dụng LocalMate.
            </Text>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', maxWidth: 280, borderRadius: 10 }}
            />
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 16 }}>
        <Table
          columns={columns}
          dataSource={filteredGuides}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1050 }}
        />
      </Card>

      {/* Profile Review Modal */}
      <Modal
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#6366f1' }} />
            <span>Chi tiết & Xác minh hồ sơ HDV</span>
          </Space>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        width={720}
        footer={[
          <Button key="reject" danger icon={<CloseOutlined />} onClick={() => setRejectModalOpen(true)}>
            Từ chối hồ sơ
          </Button>,
          <Button key="approve" type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(selectedGuide?._id)} loading={acting}>
            Duyệt & Kích hoạt hồ sơ
          </Button>
        ]}
      >
        {selectedGuide && (
          <div style={{ paddingTop: 12 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
              <Avatar size={64} style={{ background: '#6366f1', fontSize: 24 }}>
                {selectedGuide.userId?.fullName?.[0]}
              </Avatar>
              <div>
                <Title level={4} style={{ margin: 0 }}>{selectedGuide.userId?.fullName}</Title>
                <Text type="secondary">{selectedGuide.userId?.email} • {selectedGuide.userId?.nationality || 'Việt Nam'}</Text>
                <div style={{ marginTop: 4 }}>
                  <Tag color="green">${selectedGuide.hourlyRate}/giờ</Tag>
                  <Tag color="blue">{selectedGuide.yearsExperience} năm kinh nghiệm</Tag>
                </div>
              </div>
            </div>

            <Tabs defaultActiveKey="1" items={[
              {
                key: '1',
                label: 'Tổng quan hồ sơ',
                children: (
                  <Descriptions bordered column={2} style={{ marginTop: 8 }}>
                    <Descriptions.Item label="Ngôn ngữ giao tiếp" span={2}>{selectedGuide.languages?.join(', ')}</Descriptions.Item>
                    <Descriptions.Item label="Khu vực hoạt động" span={2}>{selectedGuide.areas?.join(', ') || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Giá theo giờ">${selectedGuide.hourlyRate}/giờ</Descriptions.Item>
                    <Descriptions.Item label="Giá theo ngày">${selectedGuide.dailyRate}/ngày</Descriptions.Item>
                    <Descriptions.Item label="Tiểu sử bản thân" span={2}>{selectedGuide.bio || 'Chưa cập nhật tiểu sử.'}</Descriptions.Item>
                  </Descriptions>
                )
              },
              {
                key: '2',
                label: 'Giấy tờ xác minh',
                children: (
                  <div style={{ padding: 16, textAlign: 'center', background: '#f8fafc', borderRadius: 12, marginTop: 8 }}>
                    <UserOutlined style={{ fontSize: 36, color: '#94a3b8', marginBottom: 8 }} />
                    <Paragraph type="secondary">Ảnh CCCD / Hộ chiếu và Thẻ hướng dẫn viên du lịch được lưu trữ bảo mật trên hệ thống Cloudinary.</Paragraph>
                    <Tag color="processing">Trạng thái: Chờ kiểm duyệt thủ công</Tag>
                  </div>
                )
              }
            ]} />
          </div>
        )}
      </Modal>

      {/* Rejection Note Modal */}
      <Modal
        title="Từ chối hồ sơ ứng viên"
        open={rejectModalOpen}
        onCancel={() => { setRejectModalOpen(false); setRejectReason(''); }}
        onOk={handleReject}
        okText="Xác nhận từ chối"
        cancelText="Hủy bỏ"
        okButtonProps={{ danger: true, loading: acting }}
      >
        <Paragraph>Vui lòng ghi rõ lý do từ chối hồ sơ này. Hệ thống sẽ tự động gửi email thông báo đến ứng viên.</Paragraph>
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          placeholder="Ví dụ: Giấy tờ xác minh không rõ nét, thiếu thẻ hướng dẫn viên du lịch..."
        />
      </Modal>
    </div>
  );
}
