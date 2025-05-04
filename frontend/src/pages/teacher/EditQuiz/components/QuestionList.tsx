import React, { useState } from 'react';
import { List, Button, Space, Typography, Tag, Popconfirm, Empty, Spin } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  QuestionCircleOutlined,
  CheckCircleOutlined,
  FormOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Question, QuestionType } from '../../../../constants/types';

const { Text, Paragraph } = Typography;

interface QuestionListProps {
  questions: Question[];
  loading: boolean;
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
}

/**
 * Question List Component
 * Displays a list of questions for a quiz with options to edit or delete
 */
const QuestionList: React.FC<QuestionListProps> = ({ 
  questions, 
  loading, 
  onEdit, 
  onDelete 
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
          icon: <QuestionCircleOutlined />,
          color: 'default',
          label: 'Unknown'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Spin size="large" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Empty 
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="text-center py-4">
            <Text type="secondary">No questions added to this quiz yet</Text>
            <Paragraph type="secondary" className="mt-2">
              Click the "Add Question" button to create your first question
            </Paragraph>
          </div>
        }
      />
    );
  }

  return (
    <List
      itemLayout="vertical"
      dataSource={questions}
      renderItem={(question, index) => {
        const typeInfo = getQuestionTypeInfo(question.type);
        
        return (
          <List.Item
            key={question._id}
            className="bg-white rounded-lg shadow-sm mb-4 hover:shadow-md transition-shadow"
            actions={[
              <Button 
                key="edit" 
                icon={<EditOutlined />} 
                onClick={() => onEdit(question)}
                className="hover:text-blue-500 hover:border-blue-500"
              >
                Edit
              </Button>,
              <Popconfirm
                key="delete"
                title="Delete this question?"
                description="This action cannot be undone."
                onConfirm={() => onDelete(question._id)}
                okText="Yes"
                cancelText="No"
                placement="topRight"
              >
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Button>
              </Popconfirm>
            ]}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                <Text strong>{index + 1}</Text>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  <Tag color={typeInfo.color as any} icon={typeInfo.icon} className="mr-2">
                    {typeInfo.label}
                  </Tag>
                  <Tag color="purple">{question.marks} {question.marks === 1 ? 'point' : 'points'}</Tag>
                </div>
                
                <Paragraph strong className="text-lg mb-2">
                  {question.text}
                </Paragraph>
                
                {question.type === 'multiple_choice' && question.options && (
                  <div className="ml-4">
                    {question.options.map((option, i) => (
                      <div key={i} className="flex items-center mb-1">
                        <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${option.isCorrect ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                          {option.isCorrect && <CheckCircleOutlined />}
                        </div>
                        <Text className={option.isCorrect ? 'text-green-600 font-medium' : ''}>
                          {option.text}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'true_false' && (
                  <div className="ml-4">
                    <Text className="text-green-600 font-medium">
                      Correct answer: {question.correctAnswer}
                    </Text>
                  </div>
                )}
                
                {question.type === 'short_answer' && question.correctAnswer && (
                  <div className="ml-4">
                    <Text type="secondary">Sample answer: </Text>
                    <Text className="text-green-600 font-medium">
                      {question.correctAnswer}
                    </Text>
                  </div>
                )}
                
                {question.explanation && (
                  <div className="mt-2 bg-gray-50 p-2 rounded">
                    <Text type="secondary">Explanation: </Text>
                    <Text>{question.explanation}</Text>
                  </div>
                )}
              </div>
            </div>
          </List.Item>
        );
      }}
    />
  );
};

export default QuestionList;
