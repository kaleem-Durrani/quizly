import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Button,
  Steps,
  message,
  Modal,
  Spin,
  Progress,
  Space,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES, generatePath } from "../../../constants/routes";
import { useStudentQuery } from "../../../hooks/useStudentQuery";
import { Question, QuizWithQuestions } from "../../../constants/types";

// Import components
import QuizTimer from "./components/QuizTimer";
import QuestionDisplay from "./components/QuestionDisplay";
import QuizSubmitConfirmation from "./components/QuizSubmitConfirmation";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { confirm } = Modal;

/**
 * Student Take Quiz page component
 * Interface for students to take a quiz
 */
const TakeQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Use the student query hooks
  const { startQuizQuery, submitQuizMutation } = useStudentQuery();

  // Fetch quiz data
  const quizQuery = startQuizQuery(id || "");
  const quiz = quizQuery.data?.data?.quiz as QuizWithQuestions;
  const questions = quiz?.questions || [];
  const isLoading = quizQuery.isLoading;

  // Set initial time remaining when quiz loads
  useEffect(() => {
    if (quiz?.duration) {
      setTimeRemaining(quiz.duration * 60); // Convert minutes to seconds
    }
  }, [quiz]);

  /**
   * Handle answer change
   * @param questionId Question ID
   * @param answer Student's answer
   */
  const handleAnswerChange = (
    questionId: string,
    answer: string | string[]
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  /**
   * Navigate to the next question
   */
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowConfirmation(true);
    }
  };

  /**
   * Navigate to the previous question
   */
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Handle quiz submission
   */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    try {
      await submitQuizMutation.mutateAsync({
        quizId: id || "",
        answers,
      });

      message.success("Quiz submitted successfully!");
      navigate(generatePath(ROUTES.STUDENT.QUIZ_RESULTS, { id: id || "" }));
    } catch (error: any) {
      message.error(error.message || "Failed to submit quiz");
      setIsSubmitting(false);
    }
  };

  /**
   * Handle time expiration
   */
  const handleTimeExpired = () => {
    confirm({
      title: "Time's Up!",
      icon: <ExclamationCircleOutlined />,
      content:
        "Your time for this quiz has expired. Your answers will be submitted automatically.",
      okText: "Submit Now",
      cancelButtonProps: { style: { display: "none" } },
      onOk: handleSubmit,
    });
  };

  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  // If quiz is still loading
  if (isLoading) {
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
          onClick={() => navigate(ROUTES.STUDENT.QUIZZES)}
          className="mt-4"
        >
          Back to Quizzes
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={2} className="m-0">
            {quiz.title}
          </Title>
          <Text type="secondary">
            Answer all questions to complete the quiz
          </Text>
        </div>

        {timeRemaining !== null && (
          <QuizTimer
            initialTime={timeRemaining}
            onTimeExpired={handleTimeExpired}
          />
        )}
      </div>

      <div className="flex mb-6">
        <Card className="w-full">
          <div className="flex justify-between items-center mb-4">
            <Text strong>Your Progress</Text>
            <Text>
              {answeredCount} of {questions.length} questions answered
            </Text>
          </div>
          <Progress percent={progressPercent} status="active" />
        </Card>
      </div>

      <Card className="mb-6">
        <Steps current={currentStep} className="mb-8">
          {questions.map((question, index) => (
            <Step
              key={question._id}
              title={`Question ${index + 1}`}
              status={answers[question._id] ? "finish" : "wait"}
              icon={answers[question._id] ? <CheckCircleOutlined /> : undefined}
            />
          ))}
        </Steps>

        {questions.length > 0 && (
          <QuestionDisplay
            question={questions[currentStep]}
            answer={answers[questions[currentStep]?._id] || ""}
            onChange={handleAnswerChange}
          />
        )}

        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            icon={<ArrowLeftOutlined />}
          >
            Previous
          </Button>

          <Button type="primary" onClick={handleNext} className="btn-gradient">
            {currentStep < questions.length - 1 ? (
              <>
                Next <ArrowRightOutlined />
              </>
            ) : (
              "Finish Quiz"
            )}
          </Button>
        </div>
      </Card>

      <QuizSubmitConfirmation
        visible={showConfirmation}
        answeredCount={answeredCount}
        totalCount={questions.length}
        isSubmitting={isSubmitting}
        onCancel={() => setShowConfirmation(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TakeQuiz;
