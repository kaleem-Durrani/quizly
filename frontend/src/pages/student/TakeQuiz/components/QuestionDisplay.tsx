import React from 'react';
import { Typography, Divider, Tag } from 'antd';
import { 
  CheckCircleOutlined, 
  FormOutlined, 
  FileTextOutlined 
} from '@ant-design/icons';
import { Question, QuestionType } from '../../../../constants/types';

// Import question type specific components
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion';

const { Title, Text, Paragraph } = Typography;

interface QuestionDisplayProps {
  question: Question;
  answer: string | string[];
  onChange: (questionId: string, answer: string | string[]) => void;
}

/**
 * Question Display Component
 * Displays a quiz question and the appropriate answer input based on question type
 */
const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  question, 
  answer, 
  onChange 
}) => {
  // Get question type display info
  const getQuestionTypeInfo = (type: QuestionType) => {
    switch (type) {
      case 'multiple_choice':
        return {
          icon: <CheckCircleOutlined />,
          color: 'blue',
          label: 'Multiple Choice'
        };
      case 'true_false':
        return {
          icon: <FormOutlined />,
          color: 'green',
          label: 'True/False'
        };
      case 'short_answer':
        return {
          icon: <FileTextOutlined />,
          color: 'orange',
          label: 'Short Answer'
        };
      default:
        return {
          icon: null,
          color: 'default',
          label: 'Unknown'
        };
    }
  };
  
  if (!question) {
    return <div>No question available</div>;
  }
  
  const typeInfo = getQuestionTypeInfo(question.type);
  
  return (
    <div>
      <div className="flex items-center mb-4">
        <Tag color={typeInfo.color as any} icon={typeInfo.icon} className="mr-2">
          {typeInfo.label}
        </Tag>
        <Tag color="purple">{question.marks} {question.marks === 1 ? 'point' : 'points'}</Tag>
      </div>
      
      <Title level={4} className="mb-6">{question.text}</Title>
      
      <Divider />
      
      {question.type === 'multiple_choice' && (
        <MultipleChoiceQuestion 
          question={question} 
          selectedOptions={Array.isArray(answer) ? answer : []}
          onChange={(selected) => onChange(question._id, selected)}
        />
      )}
      
      {question.type === 'true_false' && (
        <TrueFalseQuestion 
          selected={answer as string}
          onChange={(selected) => onChange(question._id, selected)}
        />
      )}
      
      {question.type === 'short_answer' && (
        <ShortAnswerQuestion 
          answer={answer as string}
          onChange={(text) => onChange(question._id, text)}
        />
      )}
    </div>
  );
};

export default QuestionDisplay;
