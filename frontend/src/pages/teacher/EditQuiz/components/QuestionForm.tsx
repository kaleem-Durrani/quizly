import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, Space, Typography, Divider } from 'antd';
import { QuestionCircleOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Question, QuestionType } from '../../../../constants/types';

// Import question type specific components
import MultipleChoiceForm from './MultipleChoiceForm';
import TrueFalseForm from './TrueFalseForm';
import ShortAnswerForm from './ShortAnswerForm';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface QuestionFormProps {
  question: Question | null;
  isAdding: boolean;
  onSave: (questionData: Partial<Question>) => void;
  onCancel: () => void;
}

/**
 * Question Form Component
 * Form for adding or editing quiz questions
 */
const QuestionForm: React.FC<QuestionFormProps> = ({ 
  question, 
  isAdding, 
  onSave, 
  onCancel 
}) => {
  const [form] = Form.useForm();
  const [questionType, setQuestionType] = useState<QuestionType>(
    question?.type || 'multiple_choice'
  );

  // Reset form when question changes
  useEffect(() => {
    if (question) {
      form.setFieldsValue({
        text: question.text,
        type: question.type,
        marks: question.marks,
        explanation: question.explanation,
        options: question.options,
        correctAnswer: question.correctAnswer,
      });
      setQuestionType(question.type);
    } else {
      form.resetFields();
      setQuestionType('multiple_choice');
    }
  }, [question, form]);

  /**
   * Handle question type change
   */
  const handleTypeChange = (value: QuestionType) => {
    setQuestionType(value);
    
    // Reset type-specific fields when type changes
    if (value === 'multiple_choice') {
      form.setFieldsValue({ 
        options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
        correctAnswer: undefined 
      });
    } else if (value === 'true_false') {
      form.setFieldsValue({ 
        options: undefined,
        correctAnswer: 'True' 
      });
    } else if (value === 'short_answer') {
      form.setFieldsValue({ 
        options: undefined,
        correctAnswer: '' 
      });
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (values: any) => {
    const questionData: Partial<Question> = {
      text: values.text,
      type: values.type,
      marks: values.marks,
      explanation: values.explanation,
    };

    // Add type-specific data
    if (values.type === 'multiple_choice') {
      questionData.options = values.options;
    } else {
      questionData.correctAnswer = values.correctAnswer;
    }

    onSave(questionData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Title level={4} className="mb-2">
          <QuestionCircleOutlined className="mr-2 text-blue-500" />
          {isAdding ? 'Add New Question' : 'Edit Question'}
        </Title>
        <Text type="secondary">
          {isAdding 
            ? 'Create a new question for your quiz' 
            : 'Update the selected question'}
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: 'multiple_choice',
          marks: 1,
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ]
        }}
      >
        {/* Question Text */}
        <Form.Item
          name="text"
          label="Question Text"
          rules={[{ required: true, message: 'Please enter the question text' }]}
        >
          <TextArea 
            rows={3} 
            placeholder="Enter your question here..." 
            className="text-base"
          />
        </Form.Item>

        {/* Question Type */}
        <Form.Item
          name="type"
          label="Question Type"
          rules={[{ required: true, message: 'Please select a question type' }]}
        >
          <Select onChange={(value) => handleTypeChange(value as QuestionType)}>
            <Option value="multiple_choice">Multiple Choice</Option>
            <Option value="true_false">True/False</Option>
            <Option value="short_answer">Short Answer</Option>
          </Select>
        </Form.Item>

        {/* Question Points */}
        <Form.Item
          name="marks"
          label="Points"
          rules={[{ required: true, message: 'Please enter points for this question' }]}
        >
          <InputNumber min={1} max={100} className="w-full" />
        </Form.Item>

        {/* Type-specific form components */}
        {questionType === 'multiple_choice' && (
          <MultipleChoiceForm form={form} />
        )}

        {questionType === 'true_false' && (
          <TrueFalseForm form={form} />
        )}

        {questionType === 'short_answer' && (
          <ShortAnswerForm form={form} />
        )}

        {/* Explanation (Optional) */}
        <Form.Item
          name="explanation"
          label="Explanation (Optional)"
        >
          <TextArea 
            rows={2} 
            placeholder="Provide an explanation for the correct answer..." 
          />
        </Form.Item>

        <Divider />

        {/* Form Actions */}
        <Form.Item>
          <Space className="w-full justify-end">
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="btn-gradient">
              {isAdding ? 'Add Question' : 'Save Changes'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default QuestionForm;
