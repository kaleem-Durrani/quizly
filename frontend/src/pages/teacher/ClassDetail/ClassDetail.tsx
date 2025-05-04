import React, { useState } from "react";
import { Typography, Card, Tabs, Button, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { useTeacherQuery } from "../../../hooks/useTeacherQuery";
import { useQuizQuery } from "../../../hooks/useQuizQuery";

// Import components
import ClassHeader from "./components/ClassHeader";
import StudentsTab from "./components/StudentsTab";
import QuizzesTab from "./components/QuizzesTab";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * Teacher Class Detail page component
 * Displays detailed information about a class with tabs for students and quizzes
 */
const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");
  const [regeneratingCode, setRegeneratingCode] = useState(false);

  // Use the teacher query hooks
  const {
    getClassByIdQuery,
    getClassStudentsQuery,
    removeStudentMutation,
    regenerateJoinCodeMutation,
  } = useTeacherQuery();

  // Get class data
  const classQuery = getClassByIdQuery(id || "");
  const classData = classQuery.data?.data;

  // Get students data with pagination
  const [studentParams, setStudentParams] = useState({
    page: 1,
    limit: 10,
    search: "",
  });
  const studentsQuery = getClassStudentsQuery(id || "", studentParams);
  const students = studentsQuery.data?.data || [];

  // Get quizzes for this class
  const [quizParams, setQuizParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    classId: id,
  });
  const { getQuizzesQuery } = useQuizQuery();
  const quizzesQuery = getQuizzesQuery(quizParams);
  const quizzes = quizzesQuery.data?.data || [];

  // Loading states
  const isLoading =
    classQuery.isLoading || studentsQuery.isLoading || quizzesQuery.isLoading;

  /**
   * Handle join code regeneration
   */
  const handleRegenerateJoinCode = async () => {
    if (!id) return;

    setRegeneratingCode(true);
    try {
      const response = await regenerateJoinCodeMutation.mutateAsync(id);

      if (response.success) {
        message.success("Join code regenerated successfully");
      } else {
        message.error(response.message || "Failed to regenerate join code");
      }
    } catch (error: any) {
      console.error("Error regenerating join code:", error);
      message.error(error.message || "Failed to regenerate join code");
    } finally {
      setRegeneratingCode(false);
    }
  };

  /**
   * Handle student removal
   */
  const handleRemoveStudent = async (studentId: string) => {
    if (!id) return;

    try {
      const response = await removeStudentMutation.mutateAsync({
        classId: id,
        studentId,
      });

      if (response.success) {
        return Promise.resolve();
      } else {
        return Promise.reject(
          new Error(response.message || "Failed to remove student")
        );
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // If class is not found, show a message
  if (classQuery.isError) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(ROUTES.TEACHER.CLASSES)}
            className="mr-4"
            size="large"
          >
            Back to Classes
          </Button>
          <Title level={2} className="m-0">
            Class Not Found
          </Title>
        </div>

        <Card className="shadow-sm text-center py-8">
          <Text type="danger">
            The class you're looking for doesn't exist or you don't have
            permission to view it.
          </Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(ROUTES.TEACHER.CLASSES)}
          className="mr-4"
          size="large"
        >
          Back to Classes
        </Button>
        <div>
          <Title level={2} className="m-0">
            {isLoading ? "Loading..." : classData?.name}
          </Title>
          <Text type="secondary">Manage your class, students, and quizzes</Text>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Spin size="large" />
          <div className="mt-4 text-gray-500">Loading class data...</div>
        </div>
      ) : classData ? (
        <>
          {/* Class Header with Join Code */}
          <ClassHeader
            classData={classData}
            regenerateJoinCode={handleRegenerateJoinCode}
            regeneratingCode={regeneratingCode}
          />

          {/* Tabs for Students and Quizzes */}
          <Card className="shadow-sm">
            <Tabs
              defaultActiveKey="students"
              activeKey={activeTab}
              onChange={setActiveTab}
              size="large"
              className="class-detail-tabs"
            >
              {/* Students Tab */}
              <TabPane
                tab={
                  <span className="px-2">
                    <span className="text-blue-500 font-medium mr-2">
                      {students.length}
                    </span>
                    Students
                  </span>
                }
                key="students"
              >
                <StudentsTab
                  students={students}
                  loading={
                    studentsQuery.isLoading || removeStudentMutation.isPending
                  }
                  removeStudent={handleRemoveStudent}
                />
              </TabPane>

              {/* Quizzes Tab */}
              <TabPane
                tab={
                  <span className="px-2">
                    <span className="text-green-500 font-medium mr-2">
                      {quizzes.length}
                    </span>
                    Quizzes
                  </span>
                }
                key="quizzes"
              >
                <QuizzesTab
                  quizzes={quizzes}
                  loading={quizzesQuery.isLoading}
                  classId={id || ""}
                />
              </TabPane>
            </Tabs>
          </Card>
        </>
      ) : (
        <Card className="shadow-sm text-center py-8">
          <Text type="danger">
            Failed to load class data. Please try again later.
          </Text>
        </Card>
      )}
    </div>
  );
};

export default ClassDetail;
