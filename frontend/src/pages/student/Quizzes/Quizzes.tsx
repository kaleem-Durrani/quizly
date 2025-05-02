import React, { useState } from 'react';
import { Typography, Card, List, Button, Input, Select, Tag, Empty } from 'antd';
import { SearchOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { generatePath } from '../../../constants/routes';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * Student Quizzes page component
 * Displays a list of quizzes available to the student
 */
const Quizzes: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [classFilter, setClassFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sample data (will be replaced with API data)
  const quizzes: any[] = [];
  const classes: any[] = [];

  // Filter quizzes based on search text and filters
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || quiz.status === statusFilter;
    const matchesClass = !classFilter || quiz.classId === classFilter;
    return matchesSearch && matchesStatus && matchesClass;
  });

  return (
    <div>
      <Title level={2}>My Quizzes</Title>
      
      <Card>
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Search quizzes..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="flex-1"
            style={{ minWidth: '200px' }}
          />
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: '180px' }}
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="available">Available</Option>
            <Option value="completed">Completed</Option>
          </Select>
          <Select
            placeholder="Filter by class"
            allowClear
            style={{ width: '180px' }}
            onChange={(value) => setClassFilter(value)}
          >
            {classes.map((cls) => (
              <Option key={cls.id} value={cls.id}>{cls.name}</Option>
            ))}
          </Select>
        </div>
        
        {filteredQuizzes.length > 0 ? (
          <List
            dataSource={filteredQuizzes}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Link 
                    key="take" 
                    to={generatePath(ROUTES.STUDENT.QUIZ_DETAIL, { id: item.id })}
                  >
                    <Button type="primary">
                      {item.status === 'completed' ? 'View Results' : 'Take Quiz'}
                    </Button>
                  </Link>
                ]}
              >
                <List.Item.Meta
                  title={
                    <div className="flex items-center">
                      <span>{item.title}</span>
                      {item.status === 'completed' ? (
                        <Tag color="success" className="ml-2">
                          <CheckCircleOutlined /> Completed
                        </Tag>
                      ) : (
                        <Tag color="processing" className="ml-2">
                          <ClockCircleOutlined /> Available
                        </Tag>
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <p>Class: {item.className}</p>
                      <p>Duration: {item.duration} minutes • Questions: {item.questionCount}</p>
                      {item.status === 'completed' && (
                        <p>Your Score: {item.score}%</p>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description={
              <Text>
                {searchText || statusFilter || classFilter
                  ? "No quizzes match your filters"
                  : "No quizzes available"}
              </Text>
            }
          />
        )}
      </Card>
    </div>
  );
};

export default Quizzes;
