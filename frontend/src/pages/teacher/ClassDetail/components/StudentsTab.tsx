import React, { useState } from 'react';
import { Table, Input, Button, Space, Modal, message, Typography, Empty, Tag } from 'antd';
import { SearchOutlined, DeleteOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { User } from '../../../../constants/types';

const { Text, Paragraph } = Typography;
const { confirm } = Modal;

interface StudentsTabProps {
  students: User[];
  loading: boolean;
  removeStudent: (studentId: string) => Promise<void>;
}

/**
 * Students Tab Component
 * Displays a list of students in the class with search and remove functionality
 */
const StudentsTab: React.FC<StudentsTabProps> = ({ 
  students, 
  loading,
  removeStudent
}) => {
  const [searchText, setSearchText] = useState('');
  const [removingStudent, setRemovingStudent] = useState<string | null>(null);
  
  // Handle student removal
  const handleRemoveStudent = (student: User) => {
    confirm({
      title: 'Remove Student',
      icon: <DeleteOutlined className="text-red-500" />,
      content: (
        <div>
          <p>Are you sure you want to remove <strong>{student.firstName} {student.lastName}</strong> from this class?</p>
          <p className="text-red-500">This action cannot be undone.</p>
        </div>
      ),
      okText: 'Remove',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setRemovingStudent(student._id);
          await removeStudent(student._id);
          message.success(`${student.firstName} ${student.lastName} has been removed from the class`);
        } catch (error: any) {
          message.error(error.message || 'Failed to remove student');
        } finally {
          setRemovingStudent(null);
        }
      },
    });
  };

  // Filter students based on search text
  const filteredStudents = students.filter(
    (student) =>
      student.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.username?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Student columns for the table
  const studentColumns = [
    {
      title: 'Name',
      key: 'name',
      render: (student: User) => (
        <div className="flex items-center">
          <div className="bg-blue-100 p-1 rounded-full mr-2">
            <UserOutlined className="text-blue-500" />
          </div>
          <span className="font-medium">{student.firstName} {student.lastName}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <div className="flex items-center">
          <MailOutlined className="text-gray-400 mr-2" />
          <span>{email}</span>
        </div>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Status',
      key: 'status',
      render: (student: User) => (
        <Tag color={student.isVerified ? 'green' : 'orange'}>
          {student.isVerified ? 'Verified' : 'Unverified'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (student: User) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          size="small"
          onClick={() => handleRemoveStudent(student)}
          loading={removingStudent === student._id}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-4">
        <Text>Total Students: {students.length}</Text>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search students by name, email, or username..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          className="max-w-md"
        />
      </div>

      {/* Students Table */}
      <Table
        columns={studentColumns}
        dataSource={filteredStudents}
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
                  <Text type="secondary">No students in this class yet</Text>
                  <div className="mt-2 text-gray-500">
                    Share the join code with your students so they can join the class
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

export default StudentsTab;
