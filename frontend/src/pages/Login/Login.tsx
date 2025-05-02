import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Radio, message, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import { UserRole } from '../../constants/types';

const { Title, Text, Link: AntLink } = Typography;

/**
 * Login page component
 * Handles user authentication for all user types
 */
const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserRole>('student');
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password, userType);
      
      // Redirect based on user type
      if (userType === 'admin') {
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else if (userType === 'teacher') {
        navigate(ROUTES.TEACHER.DASHBOARD);
      } else {
        navigate(ROUTES.STUDENT.DASHBOARD);
      }
    } catch (error) {
      console.error('Login error:', error);
      // Error message is displayed by the login function
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <div className="text-center mb-6">
        <Title level={2}>Welcome to Quizly</Title>
        <Text type="secondary">Sign in to continue</Text>
      </div>
      
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <div className="mb-4">
          <Radio.Group 
            value={userType} 
            onChange={(e) => setUserType(e.target.value)}
            className="w-full flex"
            buttonStyle="solid"
          >
            <Radio.Button value="student" className="flex-1 text-center">
              Student
            </Radio.Button>
            <Radio.Button value="teacher" className="flex-1 text-center">
              Teacher
            </Radio.Button>
            <Radio.Button value="admin" className="flex-1 text-center">
              Admin
            </Radio.Button>
          </Radio.Group>
        </div>
        
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input 
            prefix={<UserOutlined className="text-gray-400" />} 
            placeholder="Email" 
            size="large"
          />
        </Form.Item>
        
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password 
            prefix={<LockOutlined className="text-gray-400" />} 
            placeholder="Password" 
            size="large"
          />
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            block
            size="large"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
      
      <div className="text-center mt-4">
        {userType === 'student' && (
          <div className="mb-2">
            <Text>Don't have an account? </Text>
            <AntLink href={ROUTES.REGISTER}>Register now</AntLink>
          </div>
        )}
        <AntLink href={ROUTES.FORGOT_PASSWORD}>Forgot password?</AntLink>
      </div>
    </Card>
  );
};

export default Login;
