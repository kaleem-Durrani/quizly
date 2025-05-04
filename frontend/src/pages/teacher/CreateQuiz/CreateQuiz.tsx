import React, { useState } from "react";
import { Typography, Card, Form, Button, message, Spin } from "antd";
import {
  ArrowLeftOutlined,
  FileOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ROUTES, generatePath } from "../../../constants/routes";
import { useQuizQuery } from "../../../hooks/useQuizQuery";
import { useTeacherQuery } from "../../../hooks/useTeacherQuery";
import { useSubjectQuery } from "../../../hooks/useSubjectQuery";
import { CreateQuizRequest, QuizStatus } from "../../../constants/types";
import dayjs from "dayjs";

// Import components
import QuizBasicInfoForm from "./components/QuizBasicInfoForm";
import QuizSettingsForm from "./components/QuizSettingsForm";
import QuizSuccessMessage from "./components/QuizSuccessMessage";

const { Title, Text, Paragraph } = Typography;

/**
 * Teacher Create Quiz page component
 * Form for creating a new quiz
 */
const CreateQuiz: React.FC = () => {
  const [form] = Form.useForm();
  const [success, setSuccess] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Use the query hooks
  const { createQuizMutation } = useQuizQuery();
  const { getClassesQuery } = useTeacherQuery();
  const { getSubjectOptionsQuery } = useSubjectQuery();

  // Get classes and subjects data
  const classesQuery = getClassesQuery({ page: 1, limit: 100, search: "" });
  const classes = classesQuery.data?.data || [];
  const subjectOptions = getSubjectOptionsQuery.data?.data || [];

  // Loading state
  const isLoading = classesQuery.isLoading || getSubjectOptionsQuery.isLoading;

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: any) => {
    try {
      // Transform form values to match API expectations
      const quizData: CreateQuizRequest = {
        title: values.title,
        description: values.description,
        subject: values.subject,
        classId: values.classId,
        duration: values.duration,
        totalMarks: values.totalMarks,
        status: "draft" as QuizStatus,
      };

      // Add date range if provided
      if (values.dateRange && values.dateRange.length === 2) {
        quizData.startDate = values.dateRange[0].toDate();
        quizData.endDate = values.dateRange[1].toDate();
      }

      const response = await createQuizMutation.mutateAsync(quizData);

      if (response.success) {
        setQuizId(response.data._id);
        setSuccess(true);
        message.success("Quiz created successfully");
      } else {
        message.error(response.message || "Failed to create quiz");
      }
    } catch (error: any) {
      console.error("Error creating quiz:", error);
      message.error(error.message || "Failed to create quiz");
    }
  };

  // If no classes are available, show a message
  if (!isLoading && classes.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(ROUTES.TEACHER.DASHBOARD)}
            className="mr-4"
            size="large"
          >
            Back to Dashboard
          </Button>
          <div>
            <Title level={2} className="m-0">
              Create Quiz
            </Title>
            <Text type="secondary">Create a new quiz for your students</Text>
          </div>
        </div>

        <Card className="shadow-sm text-center py-8">
          <FileOutlined className="text-5xl text-gray-400 mb-4" />
          <Title level={4}>You need to create a class first</Title>
          <Paragraph className="text-gray-500 mb-6">
            Before creating a quiz, you need to have at least one class.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<TeamOutlined />}
            onClick={() => navigate(ROUTES.TEACHER.CREATE_CLASS)}
            className="btn-gradient"
          >
            Create a Class
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(ROUTES.TEACHER.QUIZZES)}
          className="mr-4"
          size="large"
        >
          Back to Quizzes
        </Button>
        <div>
          <Title level={2} className="m-0">
            Create Quiz
          </Title>
          <Text type="secondary">Create a new quiz for your students</Text>
        </div>
      </div>

      <Card className="shadow-sm max-w-4xl">
        {isLoading ? (
          <div className="text-center py-12">
            <Spin size="large" />
            <div className="mt-4 text-gray-500">Loading...</div>
          </div>
        ) : success ? (
          <QuizSuccessMessage
            quizId={quizId as string}
            onCreateAnother={() => {
              setSuccess(false);
              form.resetFields();
            }}
          />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            size="large"
            initialValues={{
              duration: 60,
              totalMarks: 100,
            }}
          >
            {/* Basic Quiz Information Section */}
            <QuizBasicInfoForm
              classes={classes}
              subjectOptions={subjectOptions}
            />

            <div className="my-8 border-t border-gray-200"></div>

            {/* Quiz Settings Section */}
            <QuizSettingsForm />

            {/* Form Actions */}
            <Form.Item className="mt-8">
              <Button
                type="primary"
                htmlType="submit"
                loading={createQuizMutation.isPending}
                className="btn-gradient"
                size="large"
                icon={<FileOutlined />}
              >
                Create Quiz
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default CreateQuiz;
