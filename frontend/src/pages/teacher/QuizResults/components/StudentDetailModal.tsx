import React from 'react';
import { Modal, Typography, Divider, List, Tag, Card, Progress } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  UserOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Quiz, QuizSubmission } from '../../../../constants/types';

const { Title, Text, Paragraph } = Typography;

interface StudentDetailModalProps {
  visible: boolean;
  submission: QuizSubmission;
  quiz: Quiz;
  onClose: () => void;
}

/**
 * Student Detail Modal Component
 * Displays detailed information about a student's quiz submission
 */
const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ 
  visible, 
  submission, 
  quiz, 
  onClose 
}) => {
  // Calculate time taken
  const calculateTimeTaken = () => {
    if (!submission.startTime || !submission.endTime) {
      return 'N/A';
    }
    
    const startTime = new Date(submission.startTime);
    const endTime = new Date(submission.endTime);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    return `${diffMins} minutes`;
  };
  
  // Get question by ID
  const getQuestionById = (questionId: string) => {
    return quiz.questions?.find(q => q._id === questionId);
  };
  
  // Format answer display
  const formatAnswer = (answer: string | string[], questionId: string) => {
    const question = getQuestionById(questionId);
    
    if (!question) {
      return answer;
    }
    
    if (question.type === 'multiple_choice' && Array.isArray(answer)) {
      // Find option text by ID
      const selectedOption = question.options?.find(o => o._id === answer[0]);
      return selectedOption ? selectedOption.text : 'Unknown option';
    }
    
    return answer;
  };
  
  return (
    <Modal
      title={
        <div className="flex items-center">
          <UserOutlined className="text-blue-500 mr-2" />
          <span>Student Submission Details</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div className="py-4">
        <Card className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <Text type="secondary">Student ID</Text>
              <Title level={4} className="m-0">{submission.studentId}</Title>
            </div>
            
            <div className="text-right">
              <Text type="secondary">Score</Text>
              <div className="flex items-center">
                <Title 
                  level={4} 
                  className="m-0" 
                  style={{ 
                    color: (submission.score || 0) >= (quiz.passingScore || 60) 
                      ? '#52c41a' 
                      : '#ff4d4f' 
                  }}
                >
                  {submission.score !== undefined ? `${submission.score}%` : 'Not graded'}
                </Title>
                
                {submission.score !== undefined && (
                  (submission.score >= (quiz.passingScore || 60)) ? (
                    <CheckCircleOutlined className="ml-2 text-green-500" />
                  ) : (
                    <CloseCircleOutlined className="ml-2 text-red-500" />
                  )
                )}
              </div>
            </div>
          </div>
          
          <Divider />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text type="secondary">Submission Status</Text>
              <div>
                <Tag 
                  color={submission.status === 'graded' ? 'green' : 'blue'}
                  icon={submission.status === 'in_progress' ? <ClockCircleOutlined /> : <CheckCircleOutlined />}
                >
                  {submission.status.toUpperCase().replace('_', ' ')}
                </Tag>
              </div>
            </div>
            
            <div>
              <Text type="secondary">Time Taken</Text>
              <div>
                <Text>{calculateTimeTaken()}</Text>
              </div>
            </div>
            
            <div>
              <Text type="secondary">Started At</Text>
              <div>
                <Text>{new Date(submission.startTime).toLocaleString()}</Text>
              </div>
            </div>
            
            <div>
              <Text type="secondary">Submitted At</Text>
              <div>
                <Text>
                  {submission.endTime 
                    ? new Date(submission.endTime).toLocaleString() 
                    : 'In progress'}
                </Text>
              </div>
            </div>
          </div>
          
          <Divider />
          
          <div>
            <Text type="secondary">Performance</Text>
            <Progress 
              percent={submission.score || 0} 
              status={(submission.score || 0) >= (quiz.passingScore || 60) ? "success" : "exception"} 
              strokeWidth={10}
            />
          </div>
        </Card>
        
        <Title level={5}>Question Responses</Title>
        
        <List
          itemLayout="vertical"
          dataSource={submission.answers}
          renderItem={(answer, index) => {
            const question = getQuestionById(answer.questionId);
            
            if (!question) {
              return null;
            }
            
            return (
              <Card className="mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <Text strong>{index + 1}</Text>
                  </div>
                  
                  <div className="flex-grow">
                    <Paragraph strong className="text-lg mb-2">
                      {question.text}
                    </Paragraph>
                    
                    <div className="flex items-center mb-4">
                      <Tag color="purple">{question.type.replace('_', ' ')}</Tag>
                      <Tag color="blue">{question.marks} {question.marks === 1 ? 'point' : 'points'}</Tag>
                      
                      {answer.isCorrect !== undefined && (
                        answer.isCorrect ? (
                          <Tag color="green" icon={<CheckCircleOutlined />}>Correct</Tag>
                        ) : (
                          <Tag color="red" icon={<CloseCircleOutlined />}>Incorrect</Tag>
                        )
                      )}
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded mb-3">
                      <Text type="secondary">Student's Answer:</Text>
                      <div className="mt-1">
                        <Text strong>{formatAnswer(answer.answer, answer.questionId)}</Text>
                      </div>
                    </div>
                    
                    {question.type !== 'multiple_choice' && question.correctAnswer && (
                      <div className="bg-green-50 p-3 rounded">
                        <Text type="secondary">Correct Answer:</Text>
                        <div className="mt-1">
                          <Text strong className="text-green-600">{question.correctAnswer}</Text>
                        </div>
                      </div>
                    )}
                    
                    {answer.marks !== undefined && (
                      <div className="mt-3">
                        <Text type="secondary">Points awarded: </Text>
                        <Text strong>{answer.marks} / {question.marks}</Text>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          }}
        />
      </div>
    </Modal>
  );
};

export default StudentDetailModal;
