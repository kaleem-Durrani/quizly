import React, { useState } from 'react';
import { Typography, Table, Button, Input, Space, Card, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { generatePath } from '../../../constants/routes';

const { Title } = Typography;

/**
 * Teacher Classes page component
 * Displays a list of classes created by the teacher
 */
const Classes: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => (
        <Link to={generatePath(ROUTES.TEACHER.CLASS_DETAIL, { id: record.id })}>
          {record.name}
        </Link>
      ),
    },
    {
      title: 'Students',
      dataIndex: 'studentCount',
      key: 'studentCount',
    },
    {
      title: 'Join Code',
      dataIndex: 'joinCode',
      key: 'joinCode',
      render: (joinCode: string) => (
        <Tag color="blue">{joinCode}</Tag>
      ),
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
          <Link to={generatePath(ROUTES.TEACHER.CLASS_DETAIL, { id: record.id })}>
            <Button icon={<EyeOutlined />} size="small">View</Button>
          </Link>
          <Link to={generatePath(ROUTES.TEACHER.EDIT_CLASS, { id: record.id })}>
            <Button icon={<EditOutlined />} size="small">Edit</Button>
          </Link>
        </Space>
      ),
    },
  ];

  // Sample data (will be replaced with API data)
  const data: any[] = [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>My Classes</Title>
        <Link to={ROUTES.TEACHER.CREATE_CLASS}>
          <Button type="primary" icon={<PlusOutlined />}>
            Create Class
          </Button>
        </Link>
      </div>
      
      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search classes..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
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

export default Classes;
