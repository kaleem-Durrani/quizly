import React, { useState } from 'react';
import { Typography, Card, Button, List, Tag, Empty } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { generatePath } from '../../../constants/routes';

const { Title, Text } = Typography;

/**
 * Student Class Detail page component
 * Displays detailed information about a class
 */
const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Sample data (will be replaced with API data)
  const classData = {
    name: 'Loading...',
    description: '',
    teacherName: '',
  };
  const quizzes: any[] = [];

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(ROUTES.STUDENT.CLASSES)}
          className="mr-4"
        >
          Back to Classes
        </Button>
        <Title level={2} className="m-0">{classData.name}</Title>
      </div>
      
      <Card className="mb-4">
        <div>
          <div className="mb-2">
            <Text strong>Teacher: </Text>
            <Text>{classData.teacherName || '-'}</Text>
          </div>
          <div>
            <Text strong>Description: </Text>
            <Text>{classData.description || 'No description'}</Text>
          </div>
        </div>
      </Card>
      
      <Card title="Quizzes">
        {quizzes.length > 0 ? (
          <List
            dataSource={quizzes}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Link 
                    key="take" 
                    to={generatePath(ROUTES.STUDENT.QUIZ_DETAIL, { id: item.id })}
                  >
                    <Button type="primary">
                      {item.status === 'completed' ? 'View Results' : 'Take Quiz'}
                    </Button>
                  </Link>
                ]}
              >
                <List.Item.Meta
                  title={
                    <div className="flex items-center">
                      <span>{item.title}</span>
                      {item.status === 'completed' ? (
                        <Tag color="success" className="ml-2">
                          <CheckCircleOutlined /> Completed
                        </Tag>
                      ) : (
                        <Tag color="processing" className="ml-2">
                          <ClockCircleOutlined /> Available
                        </Tag>
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <p>Duration: {item.duration} minutes</p>
                      <p>Questions: {item.questionCount}</p>
                      {item.status === 'completed' && (
                        <p>Your Score: {item.score}%</p>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No quizzes available in this class yet" />
        )}
      </Card>
    </div>
  );
};

export default ClassDetail;
