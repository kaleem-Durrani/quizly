import React from 'react';
import { Card, Typography, Progress, Divider, Row, Col, List } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { Quiz, QuizSubmission, Question } from '../../../../constants/types';

const { Title, Text, Paragraph } = Typography;

interface QuestionAnalyticsProps {
  quiz: Quiz;
  submissions: QuizSubmission[];
}

/**
 * Question Analytics Component
 * Displays analytics for each question in the quiz
 */
const QuestionAnalytics: React.FC<QuestionAnalyticsProps> = ({ quiz, submissions }) => {
  // Get questions from quiz
  const questions = quiz.questions || [];
  
  // Calculate question statistics
  const getQuestionStats = (questionId: string) => {
    const answeredSubmissions = submissions.filter(s => 
      s.answers.some(a => a.questionId === questionId)
    );
    
    const correctAnswers = answeredSubmissions.filter(s => 
      s.answers.some(a => a.questionId === questionId && a.isCorrect)
    );
    
    const totalAnswered = answeredSubmissions.length;
    const totalCorrect = correctAnswers.length;
    const correctRate = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;
    
    return {
      totalAnswered,
      totalCorrect,
      correctRate
    };
  };
  
  // Get most difficult questions (lowest correct rate)
  const questionStats = questions.map(q => ({
    question: q,
    stats: getQuestionStats(q._id)
  }));
  
  const sortedQuestions = [...questionStats].sort((a, b) => 
    a.stats.correctRate - b.stats.correctRate
  );
  
  const mostDifficultQuestions = sortedQuestions.slice(0, 3);
  
  return (
    <div>
      <Title level={4} className="mb-6">Question Performance Analysis</Title>
      
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} md={8}>
          <Card className="h-full">
            <div className="text-center">
              <Title level={3} className="mb-0">
                {questions.length}
              </Title>
              <Text type="secondary">Total Questions</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card className="h-full">
            <div className="text-center">
              <Title level={3} className="mb-0" style={{ color: '#52c41a' }}>
                {Math.round(questionStats.reduce((sum, q) => sum + q.stats.correctRate, 0) / questions.length)}%
              </Title>
              <Text type="secondary">Average Correct Rate</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card className="h-full">
            <div className="text-center">
              <Title level={3} className="mb-0" style={{ color: '#ff4d4f' }}>
                {mostDifficultQuestions[0]?.stats.correctRate.toFixed(1)}%
              </Title>
              <Text type="secondary">Lowest Correct Rate</Text>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Card className="mb-6">
        <Title level={5}>Most Challenging Questions</Title>
        <Paragraph type="secondary">
          These questions had the lowest percentage of correct answers
        </Paragraph>
        
        <List
          itemLayout="horizontal"
          dataSource={mostDifficultQuestions}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<QuestionCircleOutlined className="text-2xl text-red-500" />}
                title={item.question.text}
                description={
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <Text type="secondary">Correct Rate</Text>
                      <Text>{item.stats.correctRate.toFixed(1)}%</Text>
                    </div>
                    <Progress 
                      percent={item.stats.correctRate} 
                      status={item.stats.correctRate < 50 ? "exception" : "active"} 
                      size="small" 
                    />
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
      
      <Title level={5} className="mb-4">All Questions Performance</Title>
      
      <List
        itemLayout="vertical"
        dataSource={questions}
        renderItem={(question, index) => {
          const stats = getQuestionStats(question._id);
          
          return (
            <Card className="mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                  <Text strong>{index + 1}</Text>
                </div>
                
                <div className="flex-grow">
                  <Paragraph strong className="text-lg mb-2">
                    {question.text}
                  </Paragraph>
                  
                  <div className="flex items-center mb-4">
                    <Tag color="purple">{question.type.replace('_', ' ')}</Tag>
                    <Tag color="blue">{question.marks} {question.marks === 1 ? 'point' : 'points'}</Tag>
                  </div>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="flex items-center mb-2">
                        <CheckCircleOutlined className="text-green-500 mr-2" />
                        <Text>Correct: {stats.totalCorrect} ({Math.round(stats.correctRate)}%)</Text>
                      </div>
                      <Progress 
                        percent={stats.correctRate} 
                        status="success" 
                        size="small" 
                      />
                    </Col>
                    
                    <Col span={12}>
                      <div className="flex items-center mb-2">
                        <CloseCircleOutlined className="text-red-500 mr-2" />
                        <Text>Incorrect: {stats.totalAnswered - stats.totalCorrect} ({Math.round(100 - stats.correctRate)}%)</Text>
                      </div>
                      <Progress 
                        percent={100 - stats.correctRate} 
                        status="exception" 
                        size="small" 
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          );
        }}
      />
    </div>
  );
};

export default QuestionAnalytics;
