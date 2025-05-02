import React, { useState } from 'react';
import { Typography, Card, Row, Col, List, Button, Input, Modal, Form, message } from 'antd';
import { BookOutlined, FileOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { generatePath } from '../../../constants/routes';

const { Title, Text } = Typography;

/**
 * Student Dashboard page component
 * Displays overview of classes and quizzes for students
 */
const Dashboard: React.FC = () => {
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sample data (will be replaced with API data)
  const classes: any[] = [];
  const upcomingQuizzes: any[] = [];
  const recentResults: any[] = [];

  /**
   * Handle join class form submission
   * @param values Form values
   */
  const handleJoinClass = async (values: { joinCode: string }) => {
    setLoading(true);
    try {
      // API call would go here
      // const response = await joinClass(values.joinCode);
      
      message.success('Successfully joined the class');
      setJoinModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error joining class:', error);
      message.error('Failed to join class. Please check the join code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>Student Dashboard</Title>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card 
            title={
              <div className="flex items-center">
                <BookOutlined className="mr-2" />
                <span>My Classes</span>
              </div>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setJoinModalVisible(true)}
              >
                Join Class
              </Button>
            }
          >
            {classes.length > 0 ? (
              <List
                dataSource={classes}
                renderItem={(item) => (
                  <List.Item>
                    <Link to={generatePath(ROUTES.STUDENT.CLASS_DETAIL, { id: item.id })}>
                      <List.Item.Meta
                        title={item.name}
                        description={`Teacher: ${item.teacherName}`}
                      />
                    </Link>
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-4">
                <Text type="secondary">You haven't joined any classes yet</Text>
                <div className="mt-2">
                  <Button 
                    type="primary"
                    onClick={() => setJoinModalVisible(true)}
                  >
                    Join a Class
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card 
            title={
              <div className="flex items-center">
                <FileOutlined className="mr-2" />
                <span>Upcoming Quizzes</span>
              </div>
            }
            extra={
              <Link to={ROUTES.STUDENT.QUIZZES}>
                <Button type="link">View All</Button>
              </Link>
            }
          >
            {upcomingQuizzes.length > 0 ? (
              <List
                dataSource={upcomingQuizzes}
                renderItem={(item) => (
                  <List.Item>
                    <Link to={generatePath(ROUTES.STUDENT.QUIZ_DETAIL, { id: item.id })}>
                      <List.Item.Meta
                        title={item.title}
                        description={`${item.className} • Due: ${item.dueDate}`}
                      />
                    </Link>
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-4">
                <Text type="secondary">No upcoming quizzes</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
      
      <Card 
        title="Recent Quiz Results"
        extra={
          <Link to={ROUTES.STUDENT.RESULTS}>
            <Button type="link">View All</Button>
          </Link>
        }
      >
        {recentResults.length > 0 ? (
          <List
            dataSource={recentResults}
            renderItem={(item) => (
              <List.Item>
                <Link to={generatePath(ROUTES.STUDENT.QUIZ_RESULT, { id: item.quizId })}>
                  <List.Item.Meta
                    title={item.quizTitle}
                    description={`Score: ${item.score}% • Completed: ${item.completedAt}`}
                  />
                </Link>
              </List.Item>
            )}
          />
        ) : (
          <div className="text-center py-4">
            <Text type="secondary">No quiz results yet</Text>
          </div>
        )}
      </Card>
      
      {/* Join Class Modal */}
      <Modal
        title="Join a Class"
        open={joinModalVisible}
        onCancel={() => setJoinModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleJoinClass}
        >
          <Form.Item
            name="joinCode"
            label="Class Join Code"
            rules={[
              { required: true, message: 'Please enter the join code' },
              { min: 6, max: 6, message: 'Join code must be 6 characters' }
            ]}
          >
            <Input placeholder="Enter the 6-character join code" />
          </Form.Item>
          
          <div className="flex justify-end">
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
            >
              Join Class
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
