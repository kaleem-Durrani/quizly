import React from 'react';
import { Typography, Card, Descriptions, Button, Tabs } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const { Title } = Typography;
const { TabPane } = Tabs;

/**
 * Admin Student Detail page component
 * Displays detailed information about a student
 */
const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(ROUTES.ADMIN.STUDENTS)}
          className="mr-4"
        >
          Back to Students
        </Button>
        <Title level={2} className="m-0">Student Details</Title>
      </div>
      
      <Card>
        <Descriptions 
          title="Student Information" 
          bordered 
          column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="First Name">-</Descriptions.Item>
          <Descriptions.Item label="Last Name">-</Descriptions.Item>
          <Descriptions.Item label="Username">-</Descriptions.Item>
          <Descriptions.Item label="Email">-</Descriptions.Item>
          <Descriptions.Item label="Verified">-</Descriptions.Item>
          <Descriptions.Item label="Created At">-</Descriptions.Item>
          <Descriptions.Item label="Last Login">-</Descriptions.Item>
        </Descriptions>
      </Card>
      
      <Card className="mt-4">
        <Tabs defaultActiveKey="classes">
          <TabPane tab="Classes" key="classes">
            <p>No classes found.</p>
          </TabPane>
          <TabPane tab="Quizzes" key="quizzes">
            <p>No quizzes found.</p>
          </TabPane>
          <TabPane tab="Quiz Results" key="results">
            <p>No quiz results found.</p>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default StudentDetail;
