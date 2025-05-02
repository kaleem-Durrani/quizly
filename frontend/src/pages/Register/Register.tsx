import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { registerStudent } from '../../api/authApi';

const { Title, Text, Paragraph } = Typography;

/**
 * Register page component
 * Handles student registration
 */
const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) => {
    setLoading(true);
    try {
      // Remove confirmPassword as it's not needed for the API
      const { confirmPassword, ...registrationData } = values;
      
      const response = await registerStudent(registrationData);
      
      if (response.success) {
        // Navigate to verification page
        navigate(ROUTES.VERIFY_EMAIL, { 
          state: { email: values.email } 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <div className="text-center mb-6">
        <Title level={2}>Create an Account</Title>
        <Text type="secondary">Join Quizly as a student</Text>
      </div>
      
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: 'Please enter a username' },
            { min: 3, message: 'Username must be at least 3 characters' }
          ]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Username" 
            size="large" 
          />
        </Form.Item>
        
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
        
        <Divider />
        
        <Form.Item
          name="firstName"
          rules={[{ required: true, message: 'Please enter your first name' }]}
        >
          <Input 
            prefix={<IdcardOutlined />} 
            placeholder="First Name" 
            size="large" 
          />
        </Form.Item>
        
        <Form.Item
          name="lastName"
          rules={[{ required: true, message: 'Please enter your last name' }]}
        >
          <Input 
            prefix={<IdcardOutlined />} 
            placeholder="Last Name" 
            size="large" 
          />
        </Form.Item>
        
        <Divider />
        
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please enter a password' },
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Password" 
            size="large" 
          />
        </Form.Item>
        
        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
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
        
        <Paragraph className="text-sm text-gray-500 mb-4">
          By registering, you agree to our Terms of Service and Privacy Policy.
        </Paragraph>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block 
            loading={loading}
          >
            Register
          </Button>
        </Form.Item>
        
        <div className="text-center mt-4">
          <Text type="secondary">Already have an account? </Text>
          <Link to={ROUTES.LOGIN}>Sign in</Link>
        </div>
      </Form>
    </Card>
  );
};

export default Register;
