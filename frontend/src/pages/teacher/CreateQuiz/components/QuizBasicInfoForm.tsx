import React from 'react';
import { Form, Input, Select, Typography } from 'antd';
import { BookOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons';
import { Class, SubjectOption } from '../../../../constants/types';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface QuizBasicInfoFormProps {
  classes: Class[];
  subjectOptions: SubjectOption[];
}

/**
 * Quiz Basic Information Form Component
 * Contains fields for quiz title, description, class, and subject
 */
const QuizBasicInfoForm: React.FC<QuizBasicInfoFormProps> = ({ classes, subjectOptions }) => {
  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <Title level={4} className="mb-2">
          <FileOutlined className="mr-2 text-blue-500" />
          Basic Information
        </Title>
        <Paragraph className="text-gray-500">
          Enter the basic details for your quiz
        </Paragraph>
      </div>
      
      {/* Quiz Title */}
      <Form.Item
        name="title"
        label="Quiz Title"
        rules={[{ required: true, message: 'Please enter a quiz title' }]}
      >
        <Input 
          placeholder="e.g., Midterm Exam" 
          prefix={<FileOutlined className="text-gray-400" />}
          className="py-2"
        />
      </Form.Item>
      
      {/* Quiz Description */}
      <Form.Item
        name="description"
        label="Description (Optional)"
      >
        <TextArea 
          placeholder="Enter a description for this quiz" 
          rows={4}
          className="py-2"
        />
      </Form.Item>
      
      {/* Class Selection */}
      <Form.Item
        name="classId"
        label="Class"
        rules={[{ required: true, message: 'Please select a class' }]}
      >
        <Select 
          placeholder="Select a class"
          optionFilterProp="children"
          showSearch
          className="py-1"
          suffixIcon={<TeamOutlined className="text-gray-400" />}
        >
          {classes.map(classItem => (
            <Option key={classItem._id} value={classItem._id}>
              {classItem.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      
      {/* Subject Selection */}
      <Form.Item
        name="subject"
        label="Subject"
        rules={[{ required: true, message: 'Please select a subject' }]}
      >
        <Select 
          placeholder="Select a subject"
          optionFilterProp="children"
          showSearch
          className="py-1"
          suffixIcon={<BookOutlined className="text-gray-400" />}
        >
          {subjectOptions.map(subject => (
            <Option key={subject.value} value={subject.value}>
              {subject.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
};

export default QuizBasicInfoForm;
