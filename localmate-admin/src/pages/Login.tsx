import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MailOutlined, LockOutlined, CompassOutlined, ArrowRightOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text, Paragraph } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', values);
      const { accessToken, user } = res.data.data;

      if (user.role !== 'ADMIN') {
        message.error('Truy cập bị từ chối. Yêu cầu tài khoản Quản trị viên.');
        return;
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      message.success({
        content: `Chào mừng trở lại, ${user.fullName || 'Quản trị viên'}!`,
        duration: 3
      });
      navigate('/');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    form.setFieldsValue({
      email: 'admin@localmate.com',
      password: 'admin123'
    });
    message.info('Đã tự động điền tài khoản mẫu!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: 24
    }}>
      {/* Decorative Background Orbs */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '20%',
        width: 450,
        height: 450,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0) 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '20%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, rgba(14,165,233,0) 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <Card
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 24,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          padding: '16px 8px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            marginBottom: 16
          }}>
            <CompassOutlined style={{ fontSize: 32, color: '#fff' }} />
          </div>
          
          <Title level={2} style={{ color: '#fff', margin: '0 0 8px 0', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Quản trị LocalMate
          </Title>
          <Paragraph style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>
            Đăng nhập để quản lý tour, hướng dẫn viên và nền tảng
          </Paragraph>

          <Tag icon={<SafetyCertificateOutlined />} color="processing" style={{ marginTop: 12, borderRadius: 20, padding: '2px 12px' }}>
            Cổng quản trị bảo mật
          </Tag>
        </div>

        <Form form={form} layout="vertical" onFinish={handleLogin} requiredMark={false}>
          <Form.Item
            name="email"
            label={<Text style={{ color: '#cbd5e1', fontWeight: 500 }}>Email Quản trị viên</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập email quản trị viên', type: 'email' }]}
          >
            <Input
              size="large"
              placeholder="admin@localmate.com"
              prefix={<MailOutlined style={{ color: '#64748b' }} />}
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                color: '#fff',
                borderRadius: 10
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text style={{ color: '#cbd5e1', fontWeight: 500 }}>Mật khẩu</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              prefix={<LockOutlined style={{ color: '#64748b' }} />}
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                color: '#fff',
                borderRadius: 10
              }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            icon={<ArrowRightOutlined />}
            style={{
              height: 48,
              fontSize: 16,
              marginTop: 12,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              border: 'none',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)'
            }}
          >
            Đăng nhập hệ thống
          </Button>
        </Form>

        <div style={{
          marginTop: 24,
          padding: '12px 16px',
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 12,
          border: '1px border-dashed rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <Text style={{ color: '#94a3b8', fontSize: 12, display: 'block' }}>Tài khoản mẫu nhanh</Text>
            <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>admin@localmate.com</Text>
          </div>
          <Button
            size="small"
            onClick={handleQuickFill}
            style={{
              background: 'rgba(99, 102, 241, 0.2)',
              borderColor: 'rgba(99, 102, 241, 0.4)',
              color: '#818cf8',
              borderRadius: 8,
              fontWeight: 600
            }}
          >
            Tự động điền
          </Button>
        </div>
      </Card>
    </div>
  );
}
