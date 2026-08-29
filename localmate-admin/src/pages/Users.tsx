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
      title: `Block user "${name}"?`,
      content: 'This user will no longer be able to log in or use LocalMate services.',
      okText: 'Confirm Block',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await api.put(`/admin/users/${userId}/block`);
          message.success(`User "${name}" has been blocked`);
          loadUsers();
        } catch (err) {
          message.error('Failed to block user');
        }
      }
    });
  };

  const handleUnblock = async (userId: string, name: string) => {
    try {
      await api.put(`/admin/users/${userId}/unblock`);
      message.success(`User "${name}" unblocked successfully`);
      loadUsers();
    } catch (err) {
      message.error('Failed to unblock user');
    }
  };

  const columns = [
    {
      title: 'User Profile',
      key: 'name',
      render: (_: any, r: any) => (
        <Space size="middle">
          <Avatar style={{ background: r.role === 'ADMIN' ? '#8b5cf6' : r.role === 'GUIDE' ? '#10b981' : '#3b82f6', fontWeight: 600 }}>
            {r.fullName?.[0] || 'U'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: 14 }}>{r.fullName || 'User'}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (r: string) => {
        const config: Record<string, { color: string; icon: any }> = {
          TOURIST: { color: 'blue', icon: <UserOutlined /> },
          GUIDE: { color: 'green', icon: <TeamOutlined /> },
          ADMIN: { color: 'purple', icon: <SafetyCertificateOutlined /> }
        };
        const cfg = config[r] || { color: 'default', icon: null };
        return <Tag color={cfg.color} icon={cfg.icon}>{r}</Tag>;
      }
    },
    {
      title: 'Nationality',
      dataIndex: 'nationality',
      key: 'nationality',
      render: (n: string) => n || 'N/A'
    },
    {
      title: 'Status',
      dataIndex: 'isBlocked',
      key: 'status',
      render: (blocked: boolean) => (
        <Tag color={blocked ? 'red' : 'green'} icon={blocked ? <StopOutlined /> : <CheckCircleOutlined />}>
          {blocked ? 'BLOCKED' : 'ACTIVE'}
        </Tag>
      )
    },
    {
      title: 'Joined Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        record.isBlocked ? (
          <Button
            type="primary"
            size="small"
            onClick={() => handleUnblock(record._id, record.fullName)}
            style={{ borderRadius: 6, background: '#10b981' }}
          >
            Unblock
          </Button>
        ) : (
          <Button
            danger
            size="small"
            icon={<StopOutlined />}
            onClick={() => handleBlock(record._id, record.fullName)}
            style={{ borderRadius: 6 }}
          >
            Block
          </Button>
        )
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <Card style={{ marginBottom: 24, borderRadius: 16 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>
              User Directory ({pagination.total})
            </Title>
            <Text type="secondary">
              Manage accounts, roles, and access control across Tourists, Guides, and Admins.
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Search
                placeholder="Search name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: 260 }}
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              />
              <Select
                value={role || 'All Roles'}
                onChange={v => setRole(v === 'All Roles' ? '' : v)}
                style={{ width: 140 }}
                options={[
                  { value: 'All Roles', label: 'All Roles' },
                  { value: 'TOURIST', label: 'Tourists' },
                  { value: 'GUIDE', label: 'Guides' },
                  { value: 'ADMIN', label: 'Admins' }
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
        />
      </Card>
    </div>
  );
}
