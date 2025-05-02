import React, { useState } from 'react';
import { Typography, Table, Button, Input, Space, Card, Tag, Select } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { generatePath } from '../../../constants/routes';

const { Title } = Typography;
const { Option } = Select;

/**
 * Teacher Quizzes page component
 * Displays a list of quizzes created by the teacher
 */
const Quizzes: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Table columns
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (_: any, record: any) => (
        <Link to={generatePath(ROUTES.TEACHER.QUIZ_DETAIL, { id: record.id })}>
          {record.title}
        </Link>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Class',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'published') color = 'green';
        if (status === 'draft') color = 'orange';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Link to={generatePath(ROUTES.TEACHER.QUIZ_DETAIL, { id: record.id })}>
            <Button icon={<EyeOutlined />} size="small">View</Button>
          </Link>
          <Link to={generatePath(ROUTES.TEACHER.EDIT_QUIZ, { id: record.id })}>
            <Button icon={<EditOutlined />} size="small">Edit</Button>
          </Link>
          <Button 
            icon={<DeleteOutlined />} 
            danger 
            size="small"
            onClick={() => handleDeleteQuiz(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Sample data (will be replaced with API data)
  const data: any[] = [];

  // Handle quiz deletion
  const handleDeleteQuiz = (quizId: string) => {
    console.log('Delete quiz:', quizId);
    // Implement delete functionality
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>My Quizzes</Title>
        <Link to={ROUTES.TEACHER.CREATE_QUIZ}>
          <Button type="primary" icon={<PlusOutlined />}>
            Create Quiz
          </Button>
        </Link>
      </div>
      
      <Card>
        <div className="flex mb-4 gap-4">
          <Input
            placeholder="Search quizzes..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="flex-1"
          />
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 200 }}
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="draft">Draft</Option>
            <Option value="published">Published</Option>
          </Select>
        </div>
        
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
        />
      </Card>
    </div>
  );
};

export default Quizzes;
