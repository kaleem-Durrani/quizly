import React from 'react';
import { Form, InputNumber, DatePicker, Typography } from 'antd';
import { ClockCircleOutlined, CalendarOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

/**
 * Quiz Settings Form Component
 * Contains fields for quiz duration, total marks, and availability period
 */
const QuizSettingsForm: React.FC = () => {
  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <Title level={4} className="mb-2">
          <ClockCircleOutlined className="mr-2 text-green-500" />
          Quiz Settings
        </Title>
        <Paragraph className="text-gray-500">
          Configure the settings for your quiz
        </Paragraph>
      </div>
      
      {/* Quiz Duration */}
      <Form.Item
        name="duration"
        label="Duration (minutes)"
        rules={[{ required: true, message: 'Please enter the duration' }]}
      >
        <InputNumber 
          min={1} 
          max={180} 
          placeholder="60" 
          style={{ width: '100%' }} 
          className="py-2"
          prefix={<ClockCircleOutlined className="text-gray-400 mr-2" />}
          addonAfter="minutes"
        />
      </Form.Item>
      
      {/* Total Marks */}
      <Form.Item
        name="totalMarks"
        label="Total Marks"
        rules={[{ required: true, message: 'Please enter the total marks' }]}
      >
        <InputNumber 
          min={1} 
          placeholder="100" 
          style={{ width: '100%' }} 
          className="py-2"
          prefix={<TrophyOutlined className="text-gray-400 mr-2" />}
          addonAfter="points"
        />
      </Form.Item>
      
      {/* Availability Period */}
      <Form.Item
        name="dateRange"
        label="Availability Period (Optional)"
        help="If set, students can only take the quiz during this period"
      >
        <RangePicker 
          showTime 
          format="YYYY-MM-DD HH:mm" 
          style={{ width: '100%' }}
          className="py-2"
          placeholder={['Start Date & Time', 'End Date & Time']}
          suffixIcon={<CalendarOutlined className="text-gray-400" />}
        />
      </Form.Item>
    </div>
  );
};

export default QuizSettingsForm;
