import React from 'react';
import { Modal, Button, Typography, Progress, Alert } from 'antd';
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface QuizSubmitConfirmationProps {
  visible: boolean;
  answeredCount: number;
  totalCount: number;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

/**
 * Quiz Submit Confirmation Component
 * Displays a confirmation dialog before submitting a quiz
 */
const QuizSubmitConfirmation: React.FC<QuizSubmitConfirmationProps> = ({ 
  visible, 
  answeredCount, 
  totalCount, 
  isSubmitting, 
  onCancel, 
  onSubmit 
}) => {
  // Calculate progress percentage
  const progressPercent = Math.round((answeredCount / totalCount) * 100);
  const allQuestionsAnswered = answeredCount === totalCount;
  
  return (
    <Modal
      title={
        <div className="flex items-center">
          <InfoCircleOutlined className="text-blue-500 mr-2" />
          <span>Submit Quiz</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} disabled={isSubmitting}>
          Return to Quiz
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={isSubmitting} 
          onClick={onSubmit}
          className="btn-gradient"
        >
          Submit Quiz
        </Button>
      ]}
      width={500}
    >
      <div className="py-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Text strong>Your Progress</Text>
            <Text>{answeredCount} of {totalCount} questions answered</Text>
          </div>
          <Progress 
            percent={progressPercent} 
            status={allQuestionsAnswered ? "success" : "active"} 
          />
        </div>
        
        {allQuestionsAnswered ? (
          <Alert
            message="All questions answered"
            description="You have answered all questions in this quiz. You can now submit your answers."
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        ) : (
          <Alert
            message="Some questions are unanswered"
            description={`You have not answered ${totalCount - answeredCount} question(s). You can still submit the quiz, but unanswered questions will be marked as incorrect.`}
            type="warning"
            showIcon
            icon={<ExclamationCircleOutlined />}
          />
        )}
        
        <Paragraph className="mt-4">
          Once submitted, you cannot return to this quiz or change your answers.
        </Paragraph>
      </div>
    </Modal>
  );
};

export default QuizSubmitConfirmation;
