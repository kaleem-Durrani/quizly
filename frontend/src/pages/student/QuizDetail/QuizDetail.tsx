import React from 'react';
import { Typography, Card, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { generatePath } from '../../../constants/routes';

const { Title, Text } = Typography;

/**
 * Student Quiz Detail page component
 * Displays detailed information about a quiz before taking it
 */
const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(ROUTES.STUDENT.QUIZZES)}
          className="mr-4"
        >
          Back to Quizzes
        </Button>
        <Title level={2} className="m-0">Quiz Detail Page</Title>
      </div>
      
      <Card>
        <Text>This is a placeholder for the Student Quiz Detail page. Quiz ID: {id}</Text>
        <div className="mt-4">
          <Link to={generatePath(ROUTES.STUDENT.TAKE_QUIZ, { id: id || '' })}>
            <Button type="primary">Start Quiz</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default QuizDetail;
