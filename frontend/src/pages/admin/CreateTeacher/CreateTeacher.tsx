import React, { useState } from 'react';
import { Typography, Card, Form, Input, Button, Alert, Space } from 'antd';
import { MailOutlined, UserOutlined, IdcardOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const { Title } = Typography;

/**
 * Admin Create Teacher page component
 * Form for creating a new teacher account
 */
const CreateTeacher: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const navigate = useNavigate();

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: {
    email: string;
    firstName: string;
    lastName: string;
    username?: string;
  }) => {
    setLoading(true);
    try {
      // API call would go here
      // const response = await createTeacher(values);
      
      // Simulate API response
      setTempPassword('tempPassword123');
      setSuccess(true);
    } catch (error) {
      console.error('Error creating teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(ROUTES.ADMIN.TEACHERS)}
          className="mr-4"
        >
          Back to Teachers
        </Button>
        <Title level={2} className="m-0">Create Teacher</Title>
      </div>
      
      <Card>
        {success ? (
          <div>
            <Alert
              type="success"
              message="Teacher Created Successfully"
              description={
                <div>
                  <p>The teacher account has been created. An email with login instructions has been sent to the teacher.</p>
                  <p>Temporary password: <strong>{tempPassword}</strong></p>
                </div>
              }
              showIcon
              className="mb-4"
            />
            
            <Space>
              <Button onClick={() => {
                setSuccess(false);
                form.resetFields();
              }}>
                Create Another Teacher
              </Button>
              <Button type="primary" onClick={() => navigate(ROUTES.ADMIN.TEACHERS)}>
                Back to Teachers List
              </Button>
            </Space>
          </div>
        ) : (
          <Form
            form={form}
            name="createTeacher"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter the teacher\'s email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email" 
              />
            </Form.Item>
            
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: 'Please enter the teacher\'s first name' }
              ]}
            >
              <Input 
                prefix={<IdcardOutlined />} 
                placeholder="First Name" 
              />
            </Form.Item>
            
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                { required: true, message: 'Please enter the teacher\'s last name' }
              ]}
            >
              <Input 
                prefix={<IdcardOutlined />} 
                placeholder="Last Name" 
              />
            </Form.Item>
            
            <Form.Item
              name="username"
              label="Username (Optional)"
              extra="If not provided, a username will be generated automatically"
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
              />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                Create Teacher
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default CreateTeacher;
