import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { forgotPassword } from '../../api/authApi';

const { Title, Text } = Typography;

/**
 * Forgot Password page component
 * Handles password reset requests
 */
const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      const response = await forgotPassword(values.email);
      
      if (response.success) {
        setEmail(values.email);
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <div className="text-center mb-6">
        <Title level={2}>Forgot Password</Title>
        <Text type="secondary">
          Enter your email address and we'll send you a code to reset your password
        </Text>
      </div>
      
      {submitted ? (
        <div>
          <Alert
            type="success"
            message="Reset Code Sent"
            description={`We've sent a password reset code to ${email}. Please check your email and use the code to reset your password.`}
            showIcon
            className="mb-4"
          />
          
          <div className="text-center mt-4">
            <Link to={ROUTES.RESET_PASSWORD} className="block mb-2">
              <Button type="primary" size="large" block>
                Enter Reset Code
              </Button>
            </Link>
            
            <Link to={ROUTES.LOGIN}>Back to Login</Link>
          </div>
        </div>
      ) : (
        <Form
          form={form}
          name="forgotPassword"
          onFinish={onFinish}
          layout="vertical"
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
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block 
              loading={loading}
            >
              Send Reset Code
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

export default ForgotPassword;
