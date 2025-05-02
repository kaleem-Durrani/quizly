import React, { useState } from 'react';
import { Typography, Card, Form, Input, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const { Title, Text } = Typography;

/**
 * Teacher First Login page component
 * Displayed when a teacher logs in for the first time to set a new password
 */
const FirstLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { newPassword: string; confirmPassword: string }) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate(ROUTES.TEACHER.DASHBOARD);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <div className="text-center mb-6">
        <Title level={2}>Welcome to Quizly</Title>
        <Text type="secondary">
          Please set a new password to continue
        </Text>
      </div>
      
      <Form
        name="firstLogin"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Please enter a new password' },
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="New Password" 
            size="large" 
          />
        </Form.Item>
        
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Confirm Password" 
            size="large" 
          />
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block 
            loading={loading}
          >
            Set Password
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FirstLogin;
