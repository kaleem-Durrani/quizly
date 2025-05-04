import React, { useState } from "react";
import { Typography, Card, Button, Tabs, Spin, Empty, Alert } from "antd";
import {
  ArrowLeftOutlined,
  BarChartOutlined,
  TeamOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { useQuizQuery } from "../../../hooks/useQuizQuery";

// Import components
import ResultsSummary from "./components/ResultsSummary";
import StudentResultsList from "./components/StudentResultsList";
import QuestionAnalytics from "./components/QuestionAnalytics";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * Teacher Quiz Results page component
 * Displays results of a quiz for all students
 */
const QuizResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  // Use the quiz query hooks
  const { getQuizByIdQuery, getQuizSubmissionsQuery } = useQuizQuery();

  // Fetch quiz data
  const quizQuery = getQuizByIdQuery(id || "");
  const quiz = quizQuery.data?.data;
  const isQuizLoading = quizQuery.isLoading;

  // Fetch quiz submissions
  const submissionsQuery = getQuizSubmissionsQuery(id || "");
  const submissions = submissionsQuery.data?.data || [];
  const isSubmissionsLoading = submissionsQuery.isLoading;

  // Handle student selection
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  // If data is still loading
  if (isQuizLoading || isSubmissionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  // If quiz not found
  if (!quiz) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          message="Quiz Not Found"
          description="The quiz you're looking for doesn't exist or you don't have permission to access it."
          showIcon
        />
        <Button
          type="primary"
          onClick={() => navigate(ROUTES.TEACHER.QUIZZES)}
          className="mt-4"
        >
          Back to Quizzes
        </Button>
      </div>
    );
  }

  // If no submissions yet
  if (submissions.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() =>
              navigate(`${ROUTES.TEACHER.QUIZ_DETAIL.replace(":id", id || "")}`)
            }
            className="mr-4"
            size="large"
          >
            Back to Quiz
          </Button>
          <div>
            <Title level={2} className="m-0">
              Quiz Results: {quiz.title}
            </Title>
            <Text type="secondary">View student performance and analytics</Text>
          </div>
        </div>

        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center py-4">
                <Text type="secondary">No submissions yet</Text>
                <div className="mt-2">
                  <Text type="secondary">
                    Students haven't submitted any answers for this quiz yet.
                  </Text>
                </div>
              </div>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() =>
            navigate(`${ROUTES.TEACHER.QUIZ_DETAIL.replace(":id", id || "")}`)
          }
          className="mr-4"
          size="large"
        >
          Back to Quiz
        </Button>
        <div>
          <Title level={2} className="m-0">
            Quiz Results: {quiz.title}
          </Title>
          <Text type="secondary">View student performance and analytics</Text>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="bg-white p-4 rounded-lg shadow-sm"
      >
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Summary
            </span>
          }
          key="summary"
        >
          <ResultsSummary quiz={quiz} submissions={submissions} />
        </TabPane>

        <TabPane
          tab={
            <span>
              <TeamOutlined />
              Student Results
            </span>
          }
          key="students"
        >
          <StudentResultsList
            quiz={quiz}
            submissions={submissions}
            onStudentSelect={handleStudentSelect}
            selectedStudentId={selectedStudentId}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <QuestionCircleOutlined />
              Question Analytics
            </span>
          }
          key="questions"
        >
          <QuestionAnalytics quiz={quiz} submissions={submissions} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default QuizResults;
