import React from "react";
import { Typography, Card, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

const { Title, Text } = Typography;

/**
 * Teacher Quiz Detail page component
 * Displays detailed information about a quiz
 */
const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(ROUTES.TEACHER.QUIZZES)}
          className="mr-4"
        >
          Back to Quizzes
        </Button>
        <Title level={2} className="m-0">
          Quiz Detail Page
        </Title>
      </div>

      <Card>
        <Text>
          This is a placeholder for the Teacher Quiz Detail page. Quiz ID: {id}
        </Text>
      </Card>
    </div>
  );
};

export default QuizDetail;
