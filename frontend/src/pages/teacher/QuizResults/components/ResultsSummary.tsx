import React from 'react';
import { Row, Col, Card, Statistic, Typography, Progress, Divider } from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  TrophyOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { Quiz, QuizSubmission } from '../../../../constants/types';

const { Title, Text, Paragraph } = Typography;

interface ResultsSummaryProps {
  quiz: Quiz;
  submissions: QuizSubmission[];
}

/**
 * Results Summary Component
 * Displays summary statistics for quiz results
 */
const ResultsSummary: React.FC<ResultsSummaryProps> = ({ quiz, submissions }) => {
  // Calculate statistics
  const totalStudents = submissions.length;
  const completedSubmissions = submissions.filter(s => s.status === 'completed' || s.status === 'graded');
  const completionRate = totalStudents > 0 ? (completedSubmissions.length / totalStudents) * 100 : 0;
  
  // Calculate average score
  const scoresWithValues = completedSubmissions.filter(s => s.score !== undefined);
  const averageScore = scoresWithValues.length > 0
    ? scoresWithValues.reduce((sum, s) => sum + (s.score || 0), 0) / scoresWithValues.length
    : 0;
  
  // Calculate pass rate (if quiz has a passing score)
  const passingScore = quiz.passingScore || 60; // Default to 60% if not specified
  const passedSubmissions = scoresWithValues.filter(s => (s.score || 0) >= passingScore);
  const passRate = scoresWithValues.length > 0
    ? (passedSubmissions.length / scoresWithValues.length) * 100
    : 0;
  
  // Get highest and lowest scores
  const highestScore = scoresWithValues.length > 0
    ? Math.max(...scoresWithValues.map(s => s.score || 0))
    : 0;
  const lowestScore = scoresWithValues.length > 0
    ? Math.min(...scoresWithValues.map(s => s.score || 0))
    : 0;
  
  return (
    <div>
      <Title level={4} className="mb-6">Quiz Performance Summary</Title>
      
      <Row gutter={[16, 16]}>
        {/* Participation Stats */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="h-full">
            <Statistic
              title="Total Submissions"
              value={totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Divider />
            <div>
              <Text type="secondary">Completion Rate</Text>
              <Progress 
                percent={Math.round(completionRate)} 
                status="active" 
                size="small" 
              />
            </div>
          </Card>
        </Col>
        
        {/* Average Score */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="h-full">
            <Statistic
              title="Average Score"
              value={averageScore}
              precision={1}
              suffix="%"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Divider />
            <div>
              <Text type="secondary">Pass Rate</Text>
              <Progress 
                percent={Math.round(passRate)} 
                status={passRate >= 70 ? "success" : "exception"} 
                size="small" 
              />
            </div>
          </Card>
        </Col>
        
        {/* Highest Score */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="h-full">
            <Statistic
              title="Highest Score"
              value={highestScore}
              precision={1}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <Divider />
            <div>
              <Text type="secondary">Lowest Score</Text>
              <Progress 
                percent={Math.round(lowestScore)} 
                status={lowestScore >= passingScore ? "success" : "exception"} 
                size="small" 
              />
            </div>
          </Card>
        </Col>
        
        {/* Pass/Fail */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="h-full">
            <Row gutter={[8, 0]}>
              <Col span={12}>
                <Statistic
                  title="Passed"
                  value={passedSubmissions.length}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Failed"
                  value={scoresWithValues.length - passedSubmissions.length}
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<CloseCircleOutlined />}
                />
              </Col>
            </Row>
            <Divider />
            <div>
              <Text type="secondary">Passing Score: {passingScore}%</Text>
            </div>
          </Card>
        </Col>
      </Row>
      
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <Paragraph className="text-gray-500">
          <strong>Note:</strong> These statistics are based on {completedSubmissions.length} completed submissions out of {totalStudents} total submissions.
          {scoresWithValues.length < completedSubmissions.length && (
            <span> Some submissions may not have been graded yet.</span>
          )}
        </Paragraph>
      </div>
    </div>
  );
};

export default ResultsSummary;
