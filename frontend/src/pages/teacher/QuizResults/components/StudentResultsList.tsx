import React, { useState } from 'react';
import { Table, Button, Tag, Typography, Input, Space, Modal } from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Quiz, QuizSubmission } from '../../../../constants/types';
import StudentDetailModal from './StudentDetailModal';

const { Text } = Typography;
const { Search } = Input;

interface StudentResultsListProps {
  quiz: Quiz;
  submissions: QuizSubmission[];
  onStudentSelect: (studentId: string) => void;
  selectedStudentId: string | null;
}

/**
 * Student Results List Component
 * Displays a table of student quiz results
 */
const StudentResultsList: React.FC<StudentResultsListProps> = ({ 
  quiz, 
  submissions, 
  onStudentSelect,
  selectedStudentId
}) => {
  const [searchText, setSearchText] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null);
  
  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
  };
  
  // Handle view details
  const handleViewDetails = (submission: QuizSubmission) => {
    setSelectedSubmission(submission);
    onStudentSelect(submission.studentId);
    setShowDetailModal(true);
  };
  
  // Filter submissions based on search text
  const filteredSubmissions = submissions.filter(submission => {
    const student = submission.studentId; // In a real app, this would be a student object with name
    return student.toLowerCase().includes(searchText.toLowerCase());
  });
  
  // Table columns
  const columns = [
    {
      title: 'Student',
      dataIndex: 'studentId',
      key: 'student',
      render: (studentId: string) => (
        <Text strong>{studentId}</Text> // In a real app, this would show the student's name
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let icon = null;
        
        switch (status) {
          case 'completed':
            color = 'blue';
            icon = <CheckCircleOutlined />;
            break;
          case 'graded':
            color = 'green';
            icon = <CheckCircleOutlined />;
            break;
          case 'in_progress':
            color = 'orange';
            icon = <ClockCircleOutlined />;
            break;
          default:
            color = 'default';
        }
        
        return (
          <Tag color={color} icon={icon}>
            {status.toUpperCase().replace('_', ' ')}
          </Tag>
        );
      },
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number | undefined, record: QuizSubmission) => {
        if (score === undefined) {
          return <Text type="secondary">Not graded</Text>;
        }
        
        const passingScore = quiz.passingScore || 60;
        const isPassed = score >= passingScore;
        
        return (
          <div className="flex items-center">
            <Text 
              strong 
              style={{ color: isPassed ? '#52c41a' : '#ff4d4f' }}
            >
              {score}%
            </Text>
            {isPassed ? (
              <CheckCircleOutlined className="ml-2 text-green-500" />
            ) : (
              <CloseCircleOutlined className="ml-2 text-red-500" />
            )}
          </div>
        );
      },
    },
    {
      title: 'Submission Time',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (endTime: Date | undefined) => {
        if (!endTime) {
          return <Text type="secondary">In progress</Text>;
        }
        
        return new Date(endTime).toLocaleString();
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: QuizSubmission) => (
        <Button 
          icon={<EyeOutlined />} 
          onClick={() => handleViewDetails(record)}
          type="primary"
          size="small"
        >
          View Details
        </Button>
      ),
    },
  ];
  
  return (
    <div>
      <div className="mb-4">
        <Search
          placeholder="Search by student name"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ maxWidth: 400 }}
        />
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredSubmissions}
        rowKey="_id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}
      />
      
      {selectedSubmission && (
        <StudentDetailModal
          visible={showDetailModal}
          submission={selectedSubmission}
          quiz={quiz}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default StudentResultsList;
