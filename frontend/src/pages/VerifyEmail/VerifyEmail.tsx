import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { MailOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { verifyEmail, resendOTP } from '../../api/authApi';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

/**
 * Email Verification page component
 * Handles OTP verification for new accounts
 */
const VerifyEmail: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuthStatus } = useAuth();
  
  // Get email from location state if available
  const initialEmail = location.state?.email || '';

  useEffect(() => {
    // Start countdown timer if needed
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: { email: string; otp: string }) => {
    setLoading(true);
    try {
      const response = await verifyEmail(values.email, values.otp);
      
      if (response.success) {
        // Refresh auth status and redirect to dashboard
        await checkAuthStatus();
        navigate(ROUTES.STUDENT.DASHBOARD);
      }
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle OTP resend
   */
  const handleResendOTP = async () => {
    const email = form.getFieldValue('email');
    if (!email) {
      form.setFields([
        {
          name: 'email',
          errors: ['Please enter your email to resend the code'],
        },
      ]);
      return;
    }

    setResending(true);
    try {
      const response = await resendOTP(email);
      
      if (response.success) {
        // Start countdown for resend button
        setCountdown(60);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <div className="text-center mb-6">
        <Title level={2}>Verify Your Email</Title>
        <Text type="secondary">
          Enter the verification code sent to your email
        </Text>
      </div>
      
      <Form
        form={form}
        name="verifyEmail"
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
            { required: true, message: 'Please enter the verification code' },
            { len: 6, message: 'Verification code must be 6 characters' }
          ]}
        >
          <Input 
            prefix={<KeyOutlined />} 
            placeholder="Verification Code" 
            size="large" 
          />
        </Form.Item>
        
        <Paragraph className="text-sm text-gray-500 mb-4">
          Didn't receive a code? Check your spam folder or request a new code.
        </Paragraph>
        
        <Form.Item>
          <Space direction="vertical" className="w-full">
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block 
              loading={loading}
            >
              Verify Email
            </Button>
            
            <Button 
              type="link" 
              block
              onClick={handleResendOTP}
              disabled={countdown > 0}
              loading={resending}
            >
              {countdown > 0 
                ? `Resend Code (${countdown}s)` 
                : 'Resend Verification Code'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default VerifyEmail;
