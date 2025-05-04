import React from 'react';
import { Alert, Button, Typography, Divider } from 'antd';
import { CheckCircleOutlined, FormOutlined, FileAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES, generatePath } from '../../../../constants/routes';

const { Title, Paragraph } = Typography;

interface QuizSuccessMessageProps {
  quizId: string;
  onCreateAnother: () => void;
}

/**
 * Quiz Success Message Component
 * Displayed after successfully creating a quiz
 */
const QuizSuccessMessage: React.FC<QuizSuccessMessageProps> = ({ quizId, onCreateAnother }) => {
  const navigate = useNavigate();
  
  return (
    <div className="py-4">
      {/* Success Icon */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircleOutlined className="text-green-500 text-4xl" />
        </div>
      </div>
      
      {/* Success Title */}
      <Title level={3} className="text-center mb-6">Quiz Created Successfully!</Title>
      
      {/* Success Alert */}
      <Alert
        type="success"
        message={
          <div className="font-medium">Your new quiz has been created</div>
        }
        description={
          <div>
            <p>You can now add questions to your quiz. The quiz is currently saved as a draft and is not visible to students until you publish it.</p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="font-medium mb-1">Next Steps:</div>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Add questions to your quiz</li>
                <li>Preview the quiz</li>
                <li>Publish the quiz when ready</li>
              </ul>
            </div>
          </div>
        }
        showIcon
        className="mb-6"
      />
      
      <Divider />
      
      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button 
          icon={<FormOutlined />}
          onClick={onCreateAnother}
          size="large"
        >
          Create Another Quiz
        </Button>
        <Button 
          type="primary" 
          icon={<FileAddOutlined />}
          onClick={() => navigate(generatePath(ROUTES.TEACHER.QUIZ_EDIT, { id: quizId }))}
          className="btn-gradient"
          size="large"
        >
          Add Questions
        </Button>
      </div>
    </div>
  );
};

export default QuizSuccessMessage;
