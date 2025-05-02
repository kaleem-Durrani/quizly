import React from 'react';
import { Typography, Card, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { generatePath } from '../../../constants/routes';

const { Title, Text } = Typography;

/**
 * Student Take Quiz page component
 * Interface for students to take a quiz
 */
const TakeQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Simulate quiz submission
  const handleSubmit = () => {
    navigate(generatePath(ROUTES.STUDENT.QUIZ_RESULTS, { id: id || '' }));
  };

  return (
    <div>
      <Title level={2}>Take Quiz</Title>
      
      <Card>
        <Text>This is a placeholder for the Student Take Quiz page. Quiz ID: {id}</Text>
        <div className="mt-4">
          <Button type="primary" onClick={handleSubmit}>
            Submit Quiz
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TakeQuiz;
