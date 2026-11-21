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
      title: 'Tên địa điểm',
      key: 'name',
      width: 250,
      render: (_: any, r: any) => (
        <Space style={{ whiteSpace: 'nowrap' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(99, 102, 241, 0.1)',
            color: '#6366f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            flexShrink: 0
          }}>
            <EnvironmentOutlined />
          </div>
          <div>
            <Text strong style={{ display: 'block', fontSize: 14, whiteSpace: 'nowrap' }}>{r.name}</Text>
            <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{r.district ? `${r.district}, ` : ''}{r.city}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 170,
      render: (c: string) => {
        const colors: Record<string, string> = {
          CULTURE: 'purple', FOOD: 'orange', NATURE: 'green',
          SHOPPING: 'magenta', ENTERTAINMENT: 'blue', RELIGIOUS: 'cyan'
        };
        const labels: Record<string, string> = {
          CULTURE: 'Văn hóa - Lịch sử',
          FOOD: 'Ẩm thực',
          NATURE: 'Thiên nhiên',
          SHOPPING: 'Mua sắm',
          ENTERTAINMENT: 'Giải trí',
          RELIGIOUS: 'Tâm linh'
        };
        return <Tag color={colors[c] || 'blue'} style={{ whiteSpace: 'nowrap' }}>{labels[c] || c}</Tag>;
      }
    },
    {
      title: 'Chi phí',
      dataIndex: 'priceRange',
      key: 'price',
      width: 140,
      render: (p: string) => {
        const colors: Record<string, string> = {
          FREE: 'green', BUDGET: 'cyan', MODERATE: 'orange', EXPENSIVE: 'red'
        };
        const labels: Record<string, string> = {
          FREE: 'Miễn phí',
          BUDGET: 'Tiết kiệm ($)',
          MODERATE: 'Trung bình ($$)',
          EXPENSIVE: 'Cao cấp ($$$)'
        };
        return <Tag color={colors[p] || 'default'} style={{ whiteSpace: 'nowrap' }}>{labels[p] || p}</Tag>;
      }
    },
    {
      title: 'Đánh giá',
      dataIndex: 'ratingAvg',
      key: 'rating',
      width: 110,
      render: (r: number) => (
        <Space size="small" style={{ whiteSpace: 'nowrap' }}>
          <Rate disabled defaultValue={r} count={1} style={{ fontSize: 14, color: '#f59e0b' }} />
          <Text strong style={{ fontSize: 13 }}>{r?.toFixed(1) || 'N/A'}</Text>
        </Space>
      )
    },
    {
      title: 'Từ khóa',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
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
      title: 'Thao tác',
      key: 'actions',
      width: 140,
      render: (_: any, record: any) => (
        <Space style={{ whiteSpace: 'nowrap' }}>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEdit(record)}
            style={{ borderRadius: 6 }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa địa điểm này?"
            okText="Xóa"
            cancelText="Hủy"
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
          <Col xs={24} md={14}>
            <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>
              Danh mục địa điểm du lịch ({locations.length})
            </Title>
            <Text type="secondary">
              Quản lý danh lam thắng cảnh, di tích lịch sử và địa điểm ẩm thực dành cho tour du lịch.
            </Text>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: 'right' }}>
            <Space size="middle" wrap>
              <Input
                placeholder="Tìm theo tên hoặc thành phố..."
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: 220, borderRadius: 8 }}
              />
              <Button icon={<SyncOutlined spin={loading} />} onClick={loadLocations} style={{ borderRadius: 8 }}>
                Làm mới
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} style={{ borderRadius: 10 }}>
                Thêm địa điểm
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
          scroll={{ x: 950 }}
        />
      </Card>

      <Modal
        title={editing ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm du lịch mới'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu địa điểm"
        cancelText="Hủy"
        width={620}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ paddingTop: 12 }}>
          <Form.Item name="name" label="Tên địa điểm" rules={[{ required: true, message: 'Vui lòng nhập tên địa điểm' }]}>
            <Input placeholder="Ví dụ: Vịnh Hạ Long, Phố cổ Hội An..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="city" label="Tỉnh / Thành phố" rules={[{ required: true, message: 'Vui lòng nhập thành phố' }]}>
                <Input placeholder="Ví dụ: Hà Nội, Đà Nẵng..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="district" label="Quận / Huyện">
                <Input placeholder="Ví dụ: Hoàn Kiếm, Ba Đình..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
                <Select placeholder="Chọn danh mục" options={[
                  { value: 'CULTURE', label: 'Văn hóa & Lịch sử' },
                  { value: 'FOOD', label: 'Ẩm thực & Món ngon' },
                  { value: 'NATURE', label: 'Thiên nhiên & Phong cảnh' },
                  { value: 'SHOPPING', label: 'Mua sắm & Chợ truyền thống' },
                  { value: 'ENTERTAINMENT', label: 'Vui chơi & Giải trí' },
                  { value: 'RELIGIOUS', label: 'Tâm linh & Đền chùa' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priceRange" label="Mức chi phí" rules={[{ required: true, message: 'Vui lòng chọn mức giá' }]}>
                <Select placeholder="Chọn mức giá" options={[
                  { value: 'FREE', label: 'Miễn phí vé vào' },
                  { value: 'BUDGET', label: 'Tiết kiệm ($)' },
                  { value: 'MODERATE', label: 'Trung bình ($$)' },
                  { value: 'EXPENSIVE', label: 'Cao cấp ($$$)' },
                ]} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="tags" label="Từ khóa (cách nhau bằng dấu phẩy)">
            <Input placeholder="Ví dụ: chụp ảnh, unesco, ngắm hoàng hôn, ẩm thực đường phố" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả tóm tắt">
            <Input.TextArea rows={3} placeholder="Điểm đặc sắc, lưu ý và gợi ý lịch trình tham quan..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
