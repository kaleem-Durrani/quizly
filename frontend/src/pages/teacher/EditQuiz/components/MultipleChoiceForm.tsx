import React from 'react';
import { Form, Input, Button, Checkbox, Space, Typography, Alert } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';

const { Text } = Typography;

interface MultipleChoiceFormProps {
  form: FormInstance;
}

/**
 * Multiple Choice Question Form Component
 * Form fields specific to multiple choice questions
 */
const MultipleChoiceForm: React.FC<MultipleChoiceFormProps> = ({ form }) => {
  // Get the current options from form
  const options = Form.useWatch('options', form) || [];
  
  // Check if at least one option is marked as correct
  const hasCorrectOption = options.some((option: any) => option?.isCorrect);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <Text strong>Answer Options</Text>
        <Text type="secondary">Mark at least one option as correct</Text>
      </div>
      
      {!hasCorrectOption && options.length > 0 && (
        <Alert
          message="Please mark at least one option as correct"
          type="warning"
          showIcon
          className="mb-4"
        />
      )}
      
      <Form.List
        name="options"
        rules={[
          {
            validator: async (_, options) => {
              if (!options || options.length < 2) {
                return Promise.reject(new Error('At least 2 options are required'));
              }
              
              if (!options.some(option => option.isCorrect)) {
                return Promise.reject(new Error('At least one option must be marked as correct'));
              }
              
              return Promise.resolve();
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} className="flex items-start mb-3">
                <Form.Item
                  {...field}
                  name={[field.name, 'isCorrect']}
                  valuePropName="checked"
                  className="mb-0 mr-2 mt-1"
                >
                  <Checkbox />
                </Form.Item>
                
                <Form.Item
                  {...field}
                  name={[field.name, 'text']}
                  className="mb-0 flex-grow"
                  rules={[
                    { required: true, message: 'Option text is required' },
                  ]}
                >
                  <Input placeholder={`Option ${index + 1}`} />
                </Form.Item>
                
                {fields.length > 2 && (
                  <Button
                    type="text"
                    className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(field.name)}
                  />
                )}
              </div>
            ))}
            
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add({ text: '', isCorrect: false })}
                icon={<PlusOutlined />}
                className="w-full"
              >
                Add Option
              </Button>
            </Form.Item>
            
            <Form.ErrorList errors={errors} />
          </>
        )}
      </Form.List>
    </div>
  );
};

export default MultipleChoiceForm;
