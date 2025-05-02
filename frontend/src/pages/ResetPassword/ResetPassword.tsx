import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { MailOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { resetPassword } from '../../api/authApi';

const { Title, Text } = Typography;

/**
 * Reset Password page component
 * Handles password reset with OTP
 */
const ResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state if available
  const initialEmail = location.state?.email || '';

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: { 
    email: string; 
    otp: string; 
    newPassword: string; 
    confirmPassword: string;
  }) => {
    setLoading(true);
    try {
      const { email, otp, newPassword } = values;
      
      const response = await resetPassword(email, otp, newPassword);
      
      if (response.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 3000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <div className="text-center mb-6">
        <Title level={2}>Reset Password</Title>
        <Text type="secondary">
          Enter the code sent to your email and create a new password
        </Text>
      </div>
      
      {success ? (
        <Alert
          type="success"
          message="Password Reset Successful"
          description="Your password has been reset successfully. You will be redirected to the login page."
          showIcon
          className="mb-4"
        />
      ) : (
        <Form
          form={form}
          name="resetPassword"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ email: initialEmail }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              size="large" 
            />
          </Form.Item>
          
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: 'Please enter the reset code' },
              { len: 6, message: 'Reset code must be 6 characters' }
            ]}
          >
            <Input 
              prefix={<KeyOutlined />} 
              placeholder="Reset Code" 
              size="large" 
            />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
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
              Reset Password
            </Button>
          </Form.Item>
          
          <div className="text-center">
            <Link to={ROUTES.LOGIN}>Back to Login</Link>
          </div>
        </Form>
      )}
    </Card>
  );
};

export default ResetPassword;
