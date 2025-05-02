import React, { useState } from 'react';
import { Typography, Card, Tabs, Form, Input, Button, Descriptions, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';

const { Title } = Typography;
const { TabPane } = Tabs;

/**
 * Student Profile page component
 * Displays and allows editing of student profile information
 */
const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  /**
   * Handle profile update
   * @param values Form values
   */
  const handleUpdateProfile = async (values: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    setLoading(true);
    try {
      // API call would go here
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle password change
   * @param values Form values
   */
  const handleChangePassword = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    try {
      // API call would go here
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (error) {
      console.error('Error changing password:', error);
      message.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>My Profile</Title>
      
      <Card>
        <Tabs defaultActiveKey="profile">
          <TabPane tab="Profile Information" key="profile">
            <Descriptions 
              title="Account Information" 
              bordered 
              column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
              className="mb-6"
            >
              <Descriptions.Item label="Username">{user?.username || '-'}</Descriptions.Item>
              <Descriptions.Item label="Email">{user?.email || '-'}</Descriptions.Item>
              <Descriptions.Item label="Role">Student</Descriptions.Item>
              <Descriptions.Item label="Last Login">-</Descriptions.Item>
            </Descriptions>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              initialValues={{
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
              }}
            >
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter your first name' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter your last name' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="Change Password" key="password">
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter your new password' },
                  { min: 8, message: 'Password must be at least 8 characters' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password' },
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
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Profile;
