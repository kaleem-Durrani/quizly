import React from 'react';
import { Typography, Card, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const { Title, Text } = Typography;

/**
 * Teacher Quiz Results page component
 * Displays results of a quiz for all students
 */
const QuizResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(`${ROUTES.TEACHER.QUIZ_DETAIL.replace(':id', id || '')}`)}
          className="mr-4"
        >
          Back to Quiz
        </Button>
        <Title level={2} className="m-0">Quiz Results Page</Title>
      </div>
      
      <Card>
        <Text>This is a placeholder for the Teacher Quiz Results page. Quiz ID: {id}</Text>
      </Card>
    </div>
  );
};

export default QuizResults;
