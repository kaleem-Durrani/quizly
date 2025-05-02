import React, { useState } from 'react';
import { Typography, Table, Input, Card, Button, Space, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { generatePath } from '../../../constants/routes';

const { Title } = Typography;

/**
 * Admin Students page component
 * Displays a list of students with management options
 */
const Students: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => (
        <Link to={generatePath(ROUTES.ADMIN.STUDENT_DETAIL, { id: record.id })}>
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
      title: 'Verified',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (isVerified: boolean) => (
        isVerified 
          ? <Tag color="success">Verified</Tag> 
          : <Tag color="error">Not Verified</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Link to={generatePath(ROUTES.ADMIN.STUDENT_DETAIL, { id: record.id })}>
            <Button type="link" size="small">View</Button>
          </Link>
        </Space>
      ),
    },
  ];

  // Sample data (will be replaced with API data)
  const data: any[] = [];

  return (
    <div>
      <Title level={2}>Students</Title>
      
      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search students..."
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

export default Students;
