import React, { useState } from 'react';
import { Typography, Table, Button, Input, Space, Card } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { generatePath } from '../../../constants/routes';

const { Title } = Typography;

/**
 * Admin Teachers page component
 * Displays a list of teachers with management options
 */
const Teachers: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => (
        <Link to={generatePath(ROUTES.ADMIN.TEACHER_DETAIL, { id: record.id })}>
          {record.firstName} {record.lastName}
        </Link>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Link to={generatePath(ROUTES.ADMIN.TEACHER_DETAIL, { id: record.id })}>
            <Button type="link" size="small">View</Button>
          </Link>
          <Button type="link" size="small" danger>Reset Password</Button>
        </Space>
      ),
    },
  ];

  // Sample data (will be replaced with API data)
  const data: any[] = [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Teachers</Title>
        <Link to={ROUTES.ADMIN.CREATE_TEACHER}>
          <Button type="primary" icon={<PlusOutlined />}>
            Add Teacher
          </Button>
        </Link>
      </div>
      
      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search teachers..."
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

export default Teachers;
