import React from 'react';
import { Radio, Space, Typography } from 'antd';
import { Question } from '../../../../constants/types';

const { Group } = Radio;
const { Text } = Typography;

interface MultipleChoiceQuestionProps {
  question: Question;
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

/**
 * Multiple Choice Question Component
 * Displays multiple choice options for a question
 */
const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ 
  question, 
  selectedOptions, 
  onChange 
}) => {
  // Handle option selection
  const handleChange = (e: any) => {
    onChange([e.target.value]);
  };
  
  if (!question.options || question.options.length === 0) {
    return <Text type="danger">No options available for this question</Text>;
  }
  
  return (
    <div className="p-4">
      <Group 
        value={selectedOptions[0]} 
        onChange={handleChange}
      >
        <Space direction="vertical" className="w-full">
          {question.options.map((option, index) => (
            <Radio 
              key={index} 
              value={option._id}
              className="p-3 w-full border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50"
            >
              <Text className="text-base">{option.text}</Text>
            </Radio>
          ))}
        </Space>
      </Group>
    </div>
  );
};

export default MultipleChoiceQuestion;
