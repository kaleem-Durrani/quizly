import React, { useState } from 'react';
import { Typography, Card, List, Button, Input, Modal, Form, message, Empty } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { generatePath } from '../../../constants/routes';

const { Title, Text } = Typography;

/**
 * Student Classes page component
 * Displays a list of classes the student is enrolled in
 */
const Classes: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sample data (will be replaced with API data)
  const classes: any[] = [];

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

  // Filter classes based on search text
  const filteredClasses = classes.filter(
    (cls) => cls.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>My Classes</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setJoinModalVisible(true)}
        >
          Join Class
        </Button>
      </div>
      
      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search classes..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>
        
        {filteredClasses.length > 0 ? (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
            dataSource={filteredClasses}
            renderItem={(item) => (
              <List.Item>
                <Link to={generatePath(ROUTES.STUDENT.CLASS_DETAIL, { id: item.id })}>
                  <Card hoverable>
                    <Card.Meta
                      title={item.name}
                      description={
                        <div>
                          <p>Teacher: {item.teacherName}</p>
                          <p>{item.quizCount} quizzes</p>
                        </div>
                      }
                    />
                  </Card>
                </Link>
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description={
              <Text>
                {searchText 
                  ? "No classes match your search" 
                  : "You haven't joined any classes yet"}
              </Text>
            }
          >
            <Button 
              type="primary"
              onClick={() => setJoinModalVisible(true)}
            >
              Join a Class
            </Button>
          </Empty>
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

export default Classes;
