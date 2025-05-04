import React from 'react';
import { Form, Input, Typography } from 'antd';
import { FormInstance } from 'antd/lib/form';

const { Text } = Typography;
const { TextArea } = Input;

interface ShortAnswerFormProps {
  form: FormInstance;
}

/**
 * Short Answer Question Form Component
 * Form fields specific to short answer questions
 */
const ShortAnswerForm: React.FC<ShortAnswerFormProps> = ({ form }) => {
  return (
    <div className="mb-6">
      <div className="mb-2">
        <Text strong>Sample Answer</Text>
      </div>
      
      <Form.Item
        name="correctAnswer"
        rules={[{ required: true, message: 'Please provide a sample answer' }]}
        extra="This will be used as a reference for grading. Students' answers will be compared to this."
      >
        <TextArea 
          rows={3} 
          placeholder="Enter a sample answer..." 
        />
      </Form.Item>
    </div>
  );
};

export default ShortAnswerForm;
