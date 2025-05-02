import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, BookOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons';

const { Title } = Typography;

/**
 * Admin Dashboard page component
 * Displays overview statistics and quick actions for administrators
 */
const Dashboard: React.FC = () => {
  return (
    <div>
      <Title level={2}>Admin Dashboard</Title>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Teachers" 
              value={0} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Students" 
              value={0} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Subjects" 
              value={0} 
              prefix={<BookOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Total Quizzes" 
              value={0} 
              prefix={<FileOutlined />} 
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Recent Activity">
            <p>No recent activity to display.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
