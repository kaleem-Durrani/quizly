import React, { useState } from 'react';
import { Typography, Card, Descriptions, Button, Space, Modal, message } from 'antd';
import { EditOutlined, KeyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const { Title } = Typography;
const { confirm } = Modal;

/**
 * Admin Teacher Detail page component
 * Displays detailed information about a teacher
 */
const TeacherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handle password reset
  const handleResetPassword = () => {
    confirm({
      title: 'Reset Password',
      content: 'Are you sure you want to reset this teacher\'s password? They will receive an email with a temporary password.',
      onOk: async () => {
        setLoading(true);
        try {
          // API call would go here
          message.success('Password reset successfully. An email has been sent to the teacher.');
        } catch (error) {
          console.error('Error resetting password:', error);
          message.error('Failed to reset password');
        } finally {
          setLoading(false);
        }
      },
    });
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
        <Title level={2} className="m-0">Teacher Details</Title>
      </div>
      
      <Card>
        <Descriptions 
          title="Teacher Information" 
          bordered 
          column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
          extra={
            <Space>
              <Button 
                icon={<EditOutlined />} 
                type="primary"
              >
                Edit
              </Button>
              <Button 
                icon={<KeyOutlined />} 
                onClick={handleResetPassword}
                loading={loading}
              >
                Reset Password
              </Button>
            </Space>
          }
        >
          <Descriptions.Item label="First Name">-</Descriptions.Item>
          <Descriptions.Item label="Last Name">-</Descriptions.Item>
          <Descriptions.Item label="Username">-</Descriptions.Item>
          <Descriptions.Item label="Email">-</Descriptions.Item>
          <Descriptions.Item label="Status">-</Descriptions.Item>
          <Descriptions.Item label="Created At">-</Descriptions.Item>
          <Descriptions.Item label="Last Login">-</Descriptions.Item>
        </Descriptions>
      </Card>
      
      <Card title="Classes" className="mt-4">
        <p>No classes found.</p>
      </Card>
      
      <Card title="Quizzes" className="mt-4">
        <p>No quizzes found.</p>
      </Card>
    </div>
  );
};

export default TeacherDetail;
