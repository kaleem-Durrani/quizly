import React from 'react';
import { Typography, Card, Row, Col, Statistic, List, Button } from 'antd';
import { TeamOutlined, FileOutlined, CalendarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const { Title, Text } = Typography;

/**
 * Teacher Dashboard page component
 * Displays overview statistics and quick actions for teachers
 */
const Dashboard: React.FC = () => {
  // Sample data (will be replaced with API data)
  const recentClasses: any[] = [];
  const upcomingQuizzes: any[] = [];

  return (
    <div>
      <Title level={2}>Teacher Dashboard</Title>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic 
              title="My Classes" 
              value={0} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic 
              title="My Quizzes" 
              value={0} 
              prefix={<FileOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic 
              title="Active Quizzes" 
              value={0} 
              prefix={<CalendarOutlined />} 
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Classes" 
            extra={
              <Link to={ROUTES.TEACHER.CLASSES}>
                <Button type="link">View All</Button>
              </Link>
            }
          >
            {recentClasses.length > 0 ? (
              <List
                dataSource={recentClasses}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.name}
                      description={`${item.studentCount} students`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-4">
                <Text type="secondary">No classes found</Text>
                <div className="mt-2">
                  <Link to={ROUTES.TEACHER.CREATE_CLASS}>
                    <Button type="primary">Create a Class</Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title="Upcoming Quizzes" 
            extra={
              <Link to={ROUTES.TEACHER.QUIZZES}>
                <Button type="link">View All</Button>
              </Link>
            }
          >
            {upcomingQuizzes.length > 0 ? (
              <List
                dataSource={upcomingQuizzes}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={`${item.className} • ${item.date}`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-4">
                <Text type="secondary">No upcoming quizzes</Text>
                <div className="mt-2">
                  <Link to={ROUTES.TEACHER.CREATE_QUIZ}>
                    <Button type="primary">Create a Quiz</Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
