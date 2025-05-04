import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  List,
  Button,
  Input,
  Modal,
  Form,
  message,
  Skeleton,
  Empty,
  Badge,
  Spin,
} from "antd";
import {
  BookOutlined,
  FileOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTES, generatePath } from "../../../constants/routes";
import { useStudentQuery } from "../../../hooks/useStudentQuery";
import { Class, Quiz, QuizSubmission } from "../../../constants/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

/**
 * Student Dashboard page component
 * Displays overview of classes and quizzes for students
 */
const Dashboard: React.FC = () => {
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    limit: 5,
    search: "",
  });

  // Use the student query hooks
  const { profileQuery, getClassesQuery, getQuizzesQuery, joinClassMutation } =
    useStudentQuery();

  // Get data from queries
  const classesQuery = getClassesQuery(paginationParams);
  const quizzesQuery = getQuizzesQuery(paginationParams);

  const classes = classesQuery.data?.data || [];
  const upcomingQuizzes = quizzesQuery.data?.data || [];

  // Mock recent results for now (would be replaced with actual API data)
  const recentResults: {
    quizId: string;
    quizTitle: string;
    score: number;
    completedAt: string;
  }[] = [];

  /**
   * Handle join class form submission
   * @param values Form values
   */
  const handleJoinClass = async (values: { joinCode: string }) => {
    try {
      const response = await joinClassMutation.mutateAsync(values.joinCode);

      if (response.success) {
        message.success("Successfully joined the class");
        setJoinModalVisible(false);
        form.resetFields();
      } else {
        message.error(response.message || "Failed to join class");
      }
    } catch (error: any) {
      console.error("Error joining class:", error);
      message.error(
        error.message ||
          "Failed to join class. Please check the join code and try again."
      );
    }
  };

  // Format the due date for quizzes
  const formatDueDate = (dueDate: string | Date) => {
    return dayjs(dueDate).format("MMM D, YYYY [at] h:mm A");
  };

  // Check if a quiz is due soon (within 24 hours)
  const isQuizDueSoon = (dueDate: string | Date) => {
    const now = dayjs();
    const due = dayjs(dueDate);
    return due.diff(now, "hour") <= 24 && due.diff(now, "hour") > 0;
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <Title level={2} className="mb-2">
          Student Dashboard
        </Title>
        <Paragraph className="text-gray-500">
          Welcome back, {profileQuery.data?.data?.firstName || "Student"}!
          Here's an overview of your classes and quizzes.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} md={12}>
          <Card
            className="h-full shadow-sm hover:shadow-md transition-shadow"
            title={
              <div className="flex items-center">
                <BookOutlined className="mr-2 text-blue-500" />
                <span className="text-lg font-medium">My Classes</span>
              </div>
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setJoinModalVisible(true)}
                className="btn-gradient"
              >
                Join Class
              </Button>
            }
            loading={classesQuery.isLoading}
          >
            {classesQuery.isLoading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : classes.length > 0 ? (
              <List
                dataSource={classes}
                renderItem={(item: Class) => (
                  <List.Item className="hover:bg-gray-50 rounded-lg transition-colors">
                    <Link
                      to={generatePath(ROUTES.STUDENT.CLASS_DETAIL, {
                        id: item._id,
                      })}
                      className="w-full"
                    >
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <div className="font-medium text-blue-600">
                            {item.name}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {item.teacherName || "Teacher"}
                          </div>
                        </div>
                        <RightOutlined className="text-gray-400" />
                      </div>
                    </Link>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center py-4">
                    <Text type="secondary" className="block mb-4">
                      You haven't joined any classes yet
                    </Text>
                    <Button
                      type="primary"
                      onClick={() => setJoinModalVisible(true)}
                      className="btn-gradient"
                    >
                      Join a Class
                    </Button>
                  </div>
                }
              />
            )}

            {classes.length > 0 && (
              <div className="mt-4 text-center">
                <Link to={ROUTES.STUDENT.CLASSES}>
                  <Button type="link">View All Classes</Button>
                </Link>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            className="h-full shadow-sm hover:shadow-md transition-shadow"
            title={
              <div className="flex items-center">
                <FileOutlined className="mr-2 text-green-500" />
                <span className="text-lg font-medium">Upcoming Quizzes</span>
              </div>
            }
            extra={
              <Link to={ROUTES.STUDENT.QUIZZES}>
                <Button type="link">View All</Button>
              </Link>
            }
            loading={quizzesQuery.isLoading}
          >
            {quizzesQuery.isLoading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : upcomingQuizzes.length > 0 ? (
              <List
                dataSource={upcomingQuizzes}
                renderItem={(item: Quiz) => (
                  <List.Item className="hover:bg-gray-50 rounded-lg transition-colors">
                    <Link
                      to={generatePath(ROUTES.STUDENT.QUIZ_DETAIL, {
                        id: item._id,
                      })}
                      className="w-full"
                    >
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <div className="font-medium text-green-600">
                            {item.title}
                            {item.dueDate && isQuizDueSoon(item.dueDate) && (
                              <Badge
                                count="Due Soon"
                                style={{ backgroundColor: "#faad14" }}
                                className="ml-2"
                              />
                            )}
                          </div>
                          <div className="text-gray-500 text-sm flex items-center">
                            <span className="mr-2">
                              {item.className || "Class"}
                            </span>
                            {item.dueDate && (
                              <>
                                <ClockCircleOutlined className="mr-1" />
                                <span>Due: {formatDueDate(item.dueDate)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <RightOutlined className="text-gray-400" />
                      </div>
                    </Link>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center py-8">
                    <Text type="secondary">No upcoming quizzes</Text>
                    <div className="mt-2 text-gray-500">
                      Check back later or join more classes to see quizzes
                    </div>
                  </div>
                }
              />
            )}
          </Card>
        </Col>
      </Row>

      <Card
        className="shadow-sm hover:shadow-md transition-shadow"
        title={
          <div className="flex items-center">
            <TrophyOutlined className="mr-2 text-purple-500" />
            <span className="text-lg font-medium">Recent Quiz Results</span>
          </div>
        }
        extra={
          <Link to={ROUTES.STUDENT.RESULTS}>
            <Button type="link">View All</Button>
          </Link>
        }
      >
        {recentResults.length > 0 ? (
          <List
            dataSource={recentResults}
            renderItem={(item) => (
              <List.Item className="hover:bg-gray-50 rounded-lg transition-colors">
                <Link
                  to={generatePath(ROUTES.STUDENT.QUIZ_RESULT, {
                    id: item.quizId,
                  })}
                  className="w-full"
                >
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <div className="font-medium text-purple-600">
                        {item.quizTitle}
                      </div>
                      <div className="text-gray-500 text-sm flex items-center">
                        <CheckCircleOutlined className="mr-1 text-green-500" />
                        <span className="mr-3">Score: {item.score}%</span>
                        <span>
                          Completed: {dayjs(item.completedAt).fromNow()}
                        </span>
                      </div>
                    </div>
                    <RightOutlined className="text-gray-400" />
                  </div>
                </Link>
              </List.Item>
            )}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center py-8">
                <Text type="secondary">No quiz results yet</Text>
                <div className="mt-2 text-gray-500">
                  Complete quizzes to see your results here
                </div>
              </div>
            }
          />
        )}
      </Card>

      {/* Join Class Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <PlusOutlined className="mr-2 text-blue-500" />
            <span>Join a Class</span>
          </div>
        }
        open={joinModalVisible}
        onCancel={() => setJoinModalVisible(false)}
        footer={null}
        className="rounded-lg overflow-hidden"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleJoinClass}
          size="large"
        >
          <Form.Item
            name="joinCode"
            label="Class Join Code"
            rules={[
              { required: true, message: "Please enter the join code" },
              { min: 6, max: 6, message: "Join code must be 6 characters" },
            ]}
          >
            <Input
              placeholder="Enter the 6-character join code"
              className="py-2"
              maxLength={6}
            />
          </Form.Item>

          <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
            <BookOutlined className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <Paragraph className="text-sm text-gray-600 m-0">
              Enter the 6-character code provided by your teacher to join their
              class. Once joined, you'll have access to all quizzes and
              materials for that class.
            </Paragraph>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setJoinModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={joinClassMutation.isPending}
              className="btn-gradient"
            >
              Join Class
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
