import React from 'react';
import { Form, Radio, Space, Typography } from 'antd';
import { FormInstance } from 'antd/lib/form';

const { Text } = Typography;
const { Group } = Radio;

interface TrueFalseFormProps {
  form: FormInstance;
}

/**
 * True/False Question Form Component
 * Form fields specific to true/false questions
 */
const TrueFalseForm: React.FC<TrueFalseFormProps> = ({ form }) => {
  return (
    <div className="mb-6">
      <div className="mb-2">
        <Text strong>Correct Answer</Text>
      </div>
      
      <Form.Item
        name="correctAnswer"
        rules={[{ required: true, message: 'Please select the correct answer' }]}
      >
        <Group>
          <Space direction="vertical">
            <Radio value="True">True</Radio>
            <Radio value="False">False</Radio>
          </Space>
        </Group>
      </Form.Item>
    </div>
  );
};

export default TrueFalseForm;
