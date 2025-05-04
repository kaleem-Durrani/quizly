import React from 'react';
import { Typography, Card, Button, Tag, Modal, message } from 'antd';
import { ReloadOutlined, EditOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES, generatePath } from '../../../../constants/routes';
import { Class } from '../../../../constants/types';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

interface ClassHeaderProps {
  classData: Class;
  regenerateJoinCode: () => void;
  regeneratingCode: boolean;
}

/**
 * Class Header Component
 * Displays the class name, join code, and basic information
 */
const ClassHeader: React.FC<ClassHeaderProps> = ({ 
  classData, 
  regenerateJoinCode,
  regeneratingCode 
}) => {
  // Format date for display
  const formatDate = (date: string | Date) => {
    return dayjs(date).format('MMM D, YYYY');
  };
  
  // Handle join code regeneration
  const handleRegenerateJoinCode = () => {
    confirm({
      title: 'Regenerate Join Code',
      icon: <ReloadOutlined className="text-blue-500" />,
      content: (
        <div>
          <p>Are you sure you want to regenerate the join code?</p>
          <p className="text-orange-500">The old code will no longer work and students won't be able to join with it.</p>
        </div>
      ),
      onOk: regenerateJoinCode,
      okText: 'Regenerate',
      okButtonProps: { 
        className: 'btn-gradient',
      },
    });
  };

  return (
    <Card className="shadow-sm mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div className="mb-4 md:mb-0">
          <Title level={3} className="mb-2 flex items-center">
            <TeamOutlined className="mr-2 text-blue-500" />
            {classData.name}
          </Title>
          
          <div className="mb-4">
            <div className="flex flex-wrap items-center mb-2">
              <Text strong className="mr-2">Join Code:</Text>
              <Tag color="blue" className="text-lg px-3 py-1 mr-2">
                {classData.joinCode}
              </Tag>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRegenerateJoinCode}
                loading={regeneratingCode}
                className="hover:text-blue-500 hover:border-blue-500"
              >
                Regenerate
              </Button>
            </div>
            
            <div className="flex items-center text-gray-500 mb-2">
              <CalendarOutlined className="mr-2" />
              <Text>Created: {formatDate(classData.createdAt)}</Text>
            </div>
            
            {classData.description && (
              <div className="mt-3">
                <Text strong className="block mb-1">Description:</Text>
                <Paragraph className="text-gray-600">
                  {classData.description}
                </Paragraph>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Link to={generatePath(ROUTES.TEACHER.EDIT_CLASS, { id: classData._id })}>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              className="btn-gradient w-full"
            >
              Edit Class
            </Button>
          </Link>
          
          <Link to={generatePath(ROUTES.TEACHER.CREATE_QUIZ, { classId: classData._id })}>
            <Button className="w-full">
              Create Quiz for this Class
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ClassHeader;
