import React from 'react';
import { Input, Typography } from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

interface ShortAnswerQuestionProps {
  answer: string;
  onChange: (text: string) => void;
}

/**
 * Short Answer Question Component
 * Displays a text area for answering short answer questions
 */
const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({ 
  answer, 
  onChange 
}) => {
  return (
    <div className="p-4">
      <Text className="block mb-2">Enter your answer below:</Text>
      <TextArea 
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here..."
        rows={6}
        className="text-base"
      />
    </div>
  );
};

export default ShortAnswerQuestion;
