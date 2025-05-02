import React from 'react';
import { Typography, Card, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const { Title, Text } = Typography;

/**
 * Teacher Create Quiz page component
 * Form for creating a new quiz
 */
const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(ROUTES.TEACHER.QUIZZES)}
          className="mr-4"
        >
          Back to Quizzes
        </Button>
        <Title level={2} className="m-0">Create Quiz Page</Title>
      </div>
      
      <Card>
        <Text>This is a placeholder for the Teacher Create Quiz page.</Text>
      </Card>
    </div>
  );
};

export default CreateQuiz;
