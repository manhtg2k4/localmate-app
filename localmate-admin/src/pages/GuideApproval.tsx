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
      message.success('Guide approved successfully!');
      setModalOpen(false);
      loadGuides();
    } catch (err) {
      message.error('Failed to approve guide');
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.warning('Please provide a reason for rejection');
      return;
    }
    setActing(true);
    try {
      await api.put(`/admin/guides/${selectedGuide._id}/approve`, { approve: false, reason: rejectReason });
      message.success('Guide application rejected');
      setRejectModalOpen(false);
      setRejectReason('');
      setModalOpen(false);
      loadGuides();
    } catch (err) {
      message.error('Failed to reject guide application');
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
      title: 'Guide Applicant',
      key: 'name',
      render: (_: any, r: any) => (
        <Space size="middle">
          <Avatar size={42} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontWeight: 700 }}>
            {r.userId?.fullName?.[0] || 'G'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 14 }}>{r.userId?.fullName || 'Anonymous'}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.userId?.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Nationality',
      dataIndex: ['userId', 'nationality'],
      key: 'nationality',
      render: (nat: string) => <Tag color="geekblue" icon={<GlobalOutlined />}>{nat || 'Vietnam'}</Tag>
    },
    {
      title: 'Spoken Languages',
      dataIndex: 'languages',
      key: 'languages',
      render: (langs: string[]) => (
        <Space size={[0, 4]} wrap>
          {langs?.map(l => <Tag color="blue" key={l}>{l}</Tag>)}
        </Space>
      )
    },
    {
      title: 'Experience',
      dataIndex: 'yearsExperience',
      key: 'exp',
      render: (y: number) => <Text strong style={{ color: '#0F172A' }}>{y || 0} yrs</Text>
    },
    {
      title: 'Rates',
      key: 'rate',
      render: (_: any, r: any) => (
        <div>
          <Text strong style={{ color: '#10B981', display: 'block' }}>${r.hourlyRate}/hr</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>${r.dailyRate}/day</Text>
        </div>
      )
    },
    {
      title: 'Applied On',
      dataIndex: 'createdAt',
      key: 'date',
      render: (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => { setSelectedGuide(record); setModalOpen(true); }}
            style={{ borderRadius: 8 }}
          >
            Review
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record._id)}
            loading={acting}
            style={{ borderRadius: 8, background: '#10b981' }}
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => { setSelectedGuide(record); setRejectModalOpen(true); }}
            style={{ borderRadius: 8 }}
          >
            Reject
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Card style={{ marginBottom: 24, borderRadius: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>
              Guide Application Approvals
            </Title>
            <Text type="secondary">
              Review and verify guide profiles before making them visible on the LocalMate marketplace.
            </Text>
          </Col>
          <Col>
            <Input
              placeholder="Search guide by name or email..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 280, borderRadius: 10 }}
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
        />
      </Card>

      {/* Profile Review Modal */}
      <Modal
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#6366f1' }} />
            <span>Guide Profile Verification Review</span>
          </Space>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        width={720}
        footer={[
          <Button key="reject" danger icon={<CloseOutlined />} onClick={() => setRejectModalOpen(true)}>
            Reject Application
          </Button>,
          <Button key="approve" type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(selectedGuide?._id)} loading={acting}>
            Approve & Publish Guide
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
                <Text type="secondary">{selectedGuide.userId?.email} • {selectedGuide.userId?.nationality}</Text>
                <div style={{ marginTop: 4 }}>
                  <Tag color="green">${selectedGuide.hourlyRate}/hr</Tag>
                  <Tag color="blue">{selectedGuide.yearsExperience} Years Experience</Tag>
                </div>
              </div>
            </div>

            <Tabs defaultActiveKey="1" items={[
              {
                key: '1',
                label: 'Profile Overview',
                children: (
                  <Descriptions bordered column={2} style={{ marginTop: 8 }}>
                    <Descriptions.Item label="Languages Spoken" span={2}>{selectedGuide.languages?.join(', ')}</Descriptions.Item>
                    <Descriptions.Item label="Coverage Areas" span={2}>{selectedGuide.areas?.join(', ') || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Hourly Rate">${selectedGuide.hourlyRate}</Descriptions.Item>
                    <Descriptions.Item label="Daily Rate">${selectedGuide.dailyRate}</Descriptions.Item>
                    <Descriptions.Item label="Biography" span={2}>{selectedGuide.bio || 'No biography provided.'}</Descriptions.Item>
                  </Descriptions>
                )
              },
              {
                key: '2',
                label: 'Verification Docs',
                children: (
                  <div style={{ padding: 16, textAlign: 'center', background: '#f8fafc', borderRadius: 12, marginTop: 8 }}>
                    <UserOutlined style={{ fontSize: 36, color: '#94a3b8', marginBottom: 8 }} />
                    <Paragraph type="secondary">ID Card and Tour Guide Certification documents are stored securely in Cloudinary storage.</Paragraph>
                    <Tag color="processing">Verification Status: Pending Manual Check</Tag>
                  </div>
                )
              }
            ]} />
          </div>
        )}
      </Modal>

      {/* Rejection Note Modal */}
      <Modal
        title="Reject Application"
        open={rejectModalOpen}
        onCancel={() => { setRejectModalOpen(false); setRejectReason(''); }}
        onOk={handleReject}
        okText="Confirm Rejection"
        okButtonProps={{ danger: true, loading: acting }}
      >
        <Paragraph>Please specify the reason for rejecting this guide's application. An email notification will be automatically sent to the applicant.</Paragraph>
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          placeholder="e.g. Identity verification document is unreadable or incomplete..."
        />
      </Modal>
    </div>
  );
}
