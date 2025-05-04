import React from 'react';
import { Radio, Space, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Group } = Radio;
const { Text } = Typography;

interface TrueFalseQuestionProps {
  selected: string;
  onChange: (selected: string) => void;
}

/**
 * True/False Question Component
 * Displays true/false options for a question
 */
const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ 
  selected, 
  onChange 
}) => {
  return (
    <div className="p-4">
      <Group 
        value={selected} 
        onChange={(e) => onChange(e.target.value)}
      >
        <Space direction="vertical" className="w-full">
          <Radio 
            value="True"
            className="p-3 w-full border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50"
          >
            <div className="flex items-center">
              <CheckCircleOutlined className="text-green-500 mr-2" />
              <Text className="text-base">True</Text>
            </div>
          </Radio>
          
          <Radio 
            value="False"
            className="p-3 w-full border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50"
          >
            <div className="flex items-center">
              <CloseCircleOutlined className="text-red-500 mr-2" />
              <Text className="text-base">False</Text>
            </div>
          </Radio>
        </Space>
      </Group>
    </div>
  );
};

export default TrueFalseQuestion;
