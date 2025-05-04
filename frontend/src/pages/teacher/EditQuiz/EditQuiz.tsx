import React, { useState, useEffect } from "react";
import { Typography, Card, Button, Tabs, Spin, message, Empty } from "antd";
import {
  ArrowLeftOutlined,
  FormOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { useQuizQuery } from "../../../hooks/useQuizQuery";
import { Quiz, Question } from "../../../constants/types";

// Import components
import QuestionList from "./components/QuestionList";
import QuestionForm from "./components/QuestionForm";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * Teacher Edit Quiz page component
 * Form for editing an existing quiz and managing its questions
 */
const EditQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("questions");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  // Use the quiz query hooks
  const {
    getQuizByIdQuery,
    getQuizQuestionsQuery,
    updateQuizMutation,
    addQuestionsBatchMutation,
    updateQuestionMutation,
    deleteQuestionMutation,
  } = useQuizQuery();

  // Fetch quiz data
  const quizQuery = getQuizByIdQuery(id || "");
  const quiz = quizQuery.data?.data;
  const isLoading = quizQuery.isLoading;

  // Fetch quiz questions
  const questionsQuery = getQuizQuestionsQuery(id || "");
  const questions = questionsQuery.data?.data || [];
  const isQuestionsLoading = questionsQuery.isLoading;

  /**
   * Handle adding a new question
   */
  const handleAddQuestion = () => {
    setSelectedQuestion(null);
    setIsAddingQuestion(true);
    setActiveTab("edit");
  };

  /**
   * Handle editing an existing question
   * @param question The question to edit
   */
  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsAddingQuestion(false);
    setActiveTab("edit");
  };

  /**
   * Handle saving a question (add or update)
   * @param questionData The question data to save
   */
  const handleSaveQuestion = async (questionData: Partial<Question>) => {
    try {
      if (isAddingQuestion) {
        // Add new question
        await addQuestionsBatchMutation.mutateAsync({
          quizId: id || "",
          questions: [questionData as Omit<Question, "_id" | "quizId">],
        });
        message.success("Question added successfully");
      } else if (selectedQuestion) {
        // Update existing question
        await updateQuestionMutation.mutateAsync({
          questionId: selectedQuestion._id,
          questionData,
        });
        message.success("Question updated successfully");
      }

      // Reset state and go back to questions tab
      setSelectedQuestion(null);
      setIsAddingQuestion(false);
      setActiveTab("questions");

      // Refetch questions
      questionsQuery.refetch();
    } catch (error: any) {
      message.error(error.message || "Failed to save question");
    }
  };

  /**
   * Handle deleting a question
   * @param questionId The ID of the question to delete
   */
  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestionMutation.mutateAsync(questionId);
      message.success("Question deleted successfully");

      // Refetch questions
      questionsQuery.refetch();
    } catch (error: any) {
      message.error(error.message || "Failed to delete question");
    }
  };

  /**
   * Handle canceling question edit/add
   */
  const handleCancelEdit = () => {
    setSelectedQuestion(null);
    setIsAddingQuestion(false);
    setActiveTab("questions");
  };

  // If quiz is not found or still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center p-8">
        <Empty
          description="Quiz not found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
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
            Edit Quiz: {quiz.title}
          </Title>
          <Text type="secondary">Manage quiz details and questions</Text>
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
              <QuestionCircleOutlined />
              Questions
            </span>
          }
          key="questions"
        >
          <div className="mb-4 flex justify-between items-center">
            <Title level={4} className="m-0">
              Quiz Questions
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddQuestion}
              className="btn-gradient"
            >
              Add Question
            </Button>
          </div>

          <QuestionList
            questions={questions}
            loading={isQuestionsLoading}
            onEdit={handleEditQuestion}
            onDelete={handleDeleteQuestion}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <FormOutlined />
              {isAddingQuestion ? "Add Question" : "Edit Question"}
            </span>
          }
          key="edit"
          disabled={!isAddingQuestion && !selectedQuestion}
        >
          <QuestionForm
            question={selectedQuestion}
            isAdding={isAddingQuestion}
            onSave={handleSaveQuestion}
            onCancel={handleCancelEdit}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EditQuiz;
