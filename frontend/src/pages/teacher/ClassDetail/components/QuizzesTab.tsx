import React from 'react';
import { Table, Button, Space, Typography, Tag, Empty } from 'antd';
import { PlusOutlined, FileOutlined, EyeOutlined, BarChartOutlined, CalendarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES, generatePath } from '../../../../constants/routes';
import { Quiz } from '../../../../constants/types';
import dayjs from 'dayjs';

const { Text } = Typography;

interface QuizzesTabProps {
  quizzes: Quiz[];
  loading: boolean;
  classId: string;
}

/**
 * Quizzes Tab Component
 * Displays a list of quizzes for the class with actions
 */
const QuizzesTab: React.FC<QuizzesTabProps> = ({ quizzes, loading, classId }) => {
  // Format date for display
  const formatDate = (date: string | Date) => {
    return dayjs(date).format('MMM D, YYYY');
  };

  // Quiz columns for the table
  const quizColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (_: any, quiz: Quiz) => (
        <Link to={generatePath(ROUTES.TEACHER.QUIZ_DETAIL, { id: quiz._id })}>
          <div className="flex items-center">
            <FileOutlined className="text-green-500 mr-2" />
            <span className="font-medium">{quiz.title}</span>
          </div>
        </Link>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'published') color = 'green';
        if (status === 'draft') color = 'orange';
        if (status === 'closed') color = 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Questions',
      dataIndex: 'questionCount',
      key: 'questionCount',
      render: (count: number) => (
        <Tag color="blue">{count} {count === 1 ? 'Question' : 'Questions'}</Tag>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} min`,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div className="flex items-center text-gray-500">
          <CalendarOutlined className="mr-1" />
          <span>{formatDate(date)}</span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, quiz: Quiz) => (
        <Space size="small">
          <Link to={generatePath(ROUTES.TEACHER.QUIZ_DETAIL, { id: quiz._id })}>
            <Button 
              size="small" 
              icon={<EyeOutlined />}
              className="hover:text-blue-500 hover:border-blue-500"
            >
              View
            </Button>
          </Link>
          <Link to={generatePath(ROUTES.TEACHER.QUIZ_RESULTS, { id: quiz._id })}>
            <Button 
              size="small" 
              icon={<BarChartOutlined />}
              className="hover:text-green-500 hover:border-green-500"
            >
              Results
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-4">
        <Text>Total Quizzes: {quizzes.length}</Text>
        <Link to={ROUTES.TEACHER.CREATE_QUIZ}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            className="btn-gradient"
          >
            Create Quiz
          </Button>
        </Link>
      </div>
      
      {/* Quizzes Table */}
      <Table
        columns={quizColumns}
        dataSource={quizzes}
        rowKey="_id"
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}
        locale={{
          emptyText: (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description={
                <div className="text-center py-4">
                  <Text type="secondary">No quizzes in this class yet</Text>
                  <div className="mt-2">
                    <Link to={ROUTES.TEACHER.CREATE_QUIZ}>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        className="btn-gradient"
                      >
                        Create Quiz
                      </Button>
                    </Link>
                  </div>
                </div>
              }
            />
          )
        }}
      />
    </div>
  );
};

export default QuizzesTab;
