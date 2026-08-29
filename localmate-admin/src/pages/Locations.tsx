import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, Space,
  Tag, Typography, message, Card, Row, Col, Rate, Popconfirm
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  EnvironmentOutlined, SearchOutlined, SyncOutlined
} from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

export default function Locations() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  useEffect(() => { loadLocations(); }, []);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/locations?limit=100');
      setLocations(res.data.data || []);
    } catch (err) {
      message.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      tags: Array.isArray(record.tags) ? record.tags.join(', ') : record.tags
    });
    setModalOpen(true);
  };

  const handleSave = async (values: any) => {
    try {
      if (editing) {
        await api.put(`/admin/locations/${editing._id}`, values);
        message.success('Location updated successfully');
      } else {
        await api.post('/admin/locations', values);
        message.success('New location created');
      }
      setModalOpen(false);
      loadLocations();
    } catch (err) {
      message.error('Failed to save location');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/locations/${id}`);
      message.success('Location deactivated');
      loadLocations();
    } catch (err) {
      message.error('Failed to delete location');
    }
  };

  const filteredLocations = locations.filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.city?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Location Name',
      key: 'name',
      render: (_: any, r: any) => (
        <Space>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(99, 102, 241, 0.1)',
            color: '#6366f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16
          }}>
            <EnvironmentOutlined />
          </div>
          <div>
            <Text strong style={{ display: 'block', fontSize: 14 }}>{r.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.district ? `${r.district}, ` : ''}{r.city}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (c: string) => {
        const colors: Record<string, string> = {
          CULTURE: 'purple', FOOD: 'orange', NATURE: 'green',
          SHOPPING: 'magenta', ENTERTAINMENT: 'blue', RELIGIOUS: 'cyan'
        };
        return <Tag color={colors[c] || 'blue'}>{c}</Tag>;
      }
    },
    {
      title: 'Price Tier',
      dataIndex: 'priceRange',
      key: 'price',
      render: (p: string) => {
        const colors: Record<string, string> = {
          FREE: 'green', BUDGET: 'cyan', MODERATE: 'orange', EXPENSIVE: 'red'
        };
        return <Tag color={colors[p] || 'default'}>{p}</Tag>;
      }
    },
    {
      title: 'Rating',
      dataIndex: 'ratingAvg',
      key: 'rating',
      render: (r: number) => (
        <Space size="xs">
          <Rate disabled defaultValue={r} count={1} style={{ fontSize: 14, color: '#f59e0b' }} />
          <Text strong style={{ fontSize: 13 }}>{r?.toFixed(1) || 'N/A'}</Text>
        </Space>
      )
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap style={{ maxWidth: 200 }}>
          {tags?.slice(0, 3).map((t, idx) => (
            <Tag key={idx} color="default" style={{ fontSize: 11 }}>{t}</Tag>
          ))}
          {tags?.length > 3 && <Tag color="default">+{tags.length - 3}</Tag>}
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEdit(record)}
            style={{ borderRadius: 6 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to deactivate this destination?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              style={{ borderRadius: 6 }}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Card style={{ marginBottom: 24, borderRadius: 16 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>
              Tourist Destination Catalog ({locations.length})
            </Title>
            <Text type="secondary">
              Manage featured locations, landmarks, and cultural spots available for tour itineraries.
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Input
                placeholder="Search by name or city..."
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: 240, borderRadius: 8 }}
              />
              <Button icon={<SyncOutlined spin={loading} />} onClick={loadLocations} style={{ borderRadius: 8 }}>
                Refresh
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} style={{ borderRadius: 10 }}>
                Add Location
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 16 }}>
        <Table
          columns={columns}
          dataSource={filteredLocations}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editing ? 'Edit Location' : 'Add New Location'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={620}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ paddingTop: 12 }}>
          <Form.Item name="name" label="Location Name" rules={[{ required: true, message: 'Please enter location name' }]}>
            <Input placeholder="e.g. Ha Long Bay" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please enter city' }]}>
                <Input placeholder="e.g. Ha Long" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="district" label="District">
                <Input placeholder="e.g. Quang Ninh" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select placeholder="Select category" options={[
                  { value: 'CULTURE', label: 'Culture & History' },
                  { value: 'FOOD', label: 'Food & Culinary' },
                  { value: 'NATURE', label: 'Nature & Landscape' },
                  { value: 'SHOPPING', label: 'Shopping & Markets' },
                  { value: 'ENTERTAINMENT', label: 'Entertainment' },
                  { value: 'RELIGIOUS', label: 'Religious & Temples' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priceRange" label="Price Tier" rules={[{ required: true }]}>
                <Select placeholder="Select price range" options={[
                  { value: 'FREE', label: 'Free Admission' },
                  { value: 'BUDGET', label: 'Budget ($)' },
                  { value: 'MODERATE', label: 'Moderate ($$)' },
                  { value: 'EXPENSIVE', label: 'Expensive ($$$)' },
                ]} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="tags" label="Tags (comma separated)">
            <Input placeholder="e.g. photography, unesco, walking, sunset" />
          </Form.Item>

          <Form.Item name="description" label="Short Description">
            <Input.TextArea rows={3} placeholder="Highlights, tips, and tour recommendations..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
