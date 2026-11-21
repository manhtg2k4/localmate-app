import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Input, Space, Modal, Typography, message, Select, Card, Avatar, Row, Col } from 'antd';
import { StopOutlined, SearchOutlined, CheckCircleOutlined, UserOutlined, TeamOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;
const { Search } = Input;

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0 });

  useEffect(() => { loadUsers(); }, [search, role, pagination.page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', { params: { search, role, page: pagination.page, limit: 10 } });
      setUsers(res.data.data || []);
      setPagination(prev => ({ ...prev, total: res.data.pagination?.total || 0 }));
    } catch (err) {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = (userId: string, name: string) => {
    Modal.confirm({
      title: `Khóa tài khoản "${name}"?`,
      content: 'Người dùng này sẽ không thể đăng nhập hoặc sử dụng dịch vụ của LocalMate.',
      okText: 'Xác nhận khóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await api.put(`/admin/users/${userId}/block`);
          message.success(`Đã khóa tài khoản "${name}" thành công`);
          loadUsers();
        } catch (err) {
          message.error('Khóa tài khoản thất bại');
        }
      }
    });
  };

  const handleUnblock = async (userId: string, name: string) => {
    try {
      await api.put(`/admin/users/${userId}/unblock`);
      message.success(`Đã mở khóa tài khoản "${name}" thành công`);
      loadUsers();
    } catch (err) {
      message.error('Mở khóa tài khoản thất bại');
    }
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'name',
      width: 240,
      render: (_: any, r: any) => (
        <Space size="middle" style={{ whiteSpace: 'nowrap' }}>
          <Avatar style={{ background: r.role === 'ADMIN' ? '#8b5cf6' : r.role === 'GUIDE' ? '#10b981' : '#3b82f6', fontWeight: 600, flexShrink: 0 }}>
            {r.fullName?.[0] || 'U'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 14, whiteSpace: 'nowrap' }}>{r.fullName || 'Người dùng'}</Text>
            <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{r.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      render: (r: string) => {
        const config: Record<string, { color: string; icon: any; label: string }> = {
          TOURIST: { color: 'blue', icon: <UserOutlined />, label: 'Khách du lịch' },
          GUIDE: { color: 'green', icon: <TeamOutlined />, label: 'Hướng dẫn viên' },
          ADMIN: { color: 'purple', icon: <SafetyCertificateOutlined />, label: 'Quản trị viên' }
        };
        const cfg = config[r] || { color: 'default', icon: null, label: r };
        return <Tag color={cfg.color} icon={cfg.icon} style={{ whiteSpace: 'nowrap' }}>{cfg.label}</Tag>;
      }
    },
    {
      title: 'Quốc tịch',
      dataIndex: 'nationality',
      key: 'nationality',
      width: 130,
      render: (n: string) => <span style={{ whiteSpace: 'nowrap' }}>{n || 'Chưa cập nhật'}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isBlocked',
      key: 'status',
      width: 140,
      render: (blocked: boolean) => (
        <Tag color={blocked ? 'red' : 'green'} icon={blocked ? <StopOutlined /> : <CheckCircleOutlined />} style={{ whiteSpace: 'nowrap' }}>
          {blocked ? 'ĐÃ KHÓA' : 'HOẠT ĐỘNG'}
        </Tag>
      )
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createdAt',
      key: 'date',
      width: 140,
      render: (d: string) => <span style={{ whiteSpace: 'nowrap' }}>{new Date(d).toLocaleDateString('vi-VN')}</span>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_: any, record: any) => (
        record.isBlocked ? (
          <Button
            type="primary"
            size="small"
            onClick={() => handleUnblock(record._id, record.fullName)}
            style={{ borderRadius: 6, background: '#10b981', whiteSpace: 'nowrap' }}
          >
            Mở khóa
          </Button>
        ) : (
          <Button
            danger
            size="small"
            icon={<StopOutlined />}
            onClick={() => handleBlock(record._id, record.fullName)}
            style={{ borderRadius: 6, whiteSpace: 'nowrap' }}
          >
            Khóa
          </Button>
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
              Danh bạ người dùng ({pagination.total})
            </Title>
            <Text type="secondary">
              Quản lý tài khoản, phân quyền và kiểm soát truy cập Khách du lịch, HDV và Quản trị viên.
            </Text>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: 'right' }}>
            <Space size="middle" wrap>
              <Search
                placeholder="Tìm tên hoặc email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: 220 }}
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              />
              <Select
                value={role || 'Tất cả vai trò'}
                onChange={v => setRole(v === 'Tất cả vai trò' ? '' : v)}
                style={{ width: 150 }}
                options={[
                  { value: 'Tất cả vai trò', label: 'Tất cả vai trò' },
                  { value: 'TOURIST', label: 'Khách du lịch' },
                  { value: 'GUIDE', label: 'Hướng dẫn viên' },
                  { value: 'ADMIN', label: 'Quản trị viên' }
                ]}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 16 }}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.page,
            total: pagination.total,
            pageSize: 10,
            onChange: page => setPagination(prev => ({ ...prev, page }))
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
}
