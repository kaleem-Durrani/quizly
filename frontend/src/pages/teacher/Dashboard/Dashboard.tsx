import React, { useState } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  List,
  Button,
  Skeleton,
  Empty,
  Badge,
} from "antd";
import {
  TeamOutlined,
  FileOutlined,
  CalendarOutlined,
  PlusOutlined,
  UserOutlined,
  RightOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTES, generatePath } from "../../../constants/routes";
import { useTeacherQuery } from "../../../hooks/useTeacherQuery";
import { Class, Quiz } from "../../../constants/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

/**
 * Teacher Dashboard page component
 * Displays overview statistics and quick actions for teachers
 */
const Dashboard: React.FC = () => {
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    limit: 5,
    search: "",
  });

  // Use the teacher query hooks
  const { profileQuery, getClassesQuery, getQuizzesQuery } = useTeacherQuery();

  // Get data from queries
  const classesQuery = getClassesQuery(paginationParams);
  const quizzesQuery = getQuizzesQuery(paginationParams);

  const classes = classesQuery.data?.data || [];
  const quizzes = quizzesQuery.data?.data || [];

  // Calculate statistics
  const classCount = classesQuery.data?.totalItems || 0;
  const quizCount = quizzesQuery.data?.totalItems || 0;

  // Filter active quizzes (those with a future due date)
  const activeQuizzes = quizzes.filter(
    (quiz) => quiz.dueDate && dayjs(quiz.dueDate).isAfter(dayjs())
  );
  const activeQuizCount = activeQuizzes.length;

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
          Teacher Dashboard
        </Title>
        <Paragraph className="text-gray-500">
          Welcome back, {profileQuery.data?.data?.firstName || "Teacher"}!
          Here's an overview of your classes and quizzes.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={8}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-lg font-medium">My Classes</span>}
              value={classCount}
              prefix={<TeamOutlined className="text-blue-500" />}
              loading={classesQuery.isLoading}
            />
            <div className="mt-4">
              <Link to={ROUTES.TEACHER.CREATE_CLASS}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="btn-gradient"
                >
                  Create Class
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-lg font-medium">My Quizzes</span>}
              value={quizCount}
              prefix={<FileOutlined className="text-green-500" />}
              loading={quizzesQuery.isLoading}
            />
            <div className="mt-4">
              <Link to={ROUTES.TEACHER.CREATE_QUIZ}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="btn-gradient"
                >
                  Create Quiz
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={
                <span className="text-lg font-medium">Active Quizzes</span>
              }
              value={activeQuizCount}
              prefix={<CalendarOutlined className="text-purple-500" />}
              loading={quizzesQuery.isLoading}
            />
            <div className="mt-4">
              <Link to={ROUTES.TEACHER.QUIZZES}>
                <Button type="default">View Active Quizzes</Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            className="shadow-sm hover:shadow-md transition-shadow"
            title={
              <div className="flex items-center">
                <TeamOutlined className="mr-2 text-blue-500" />
                <span className="text-lg font-medium">Recent Classes</span>
              </div>
            }
            extra={
              <Link to={ROUTES.TEACHER.CLASSES}>
                <Button type="link">View All</Button>
              </Link>
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
                      to={generatePath(ROUTES.TEACHER.CLASS_DETAIL, {
                        id: item._id,
                      })}
                      className="w-full"
                    >
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <div className="font-medium text-blue-600">
                            {item.name}
                          </div>
                          <div className="text-gray-500 text-sm flex items-center">
                            <UserOutlined className="mr-1" />
                            <span>{item.studentCount || 0} students</span>
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
                      No classes found
                    </Text>
                    <Link to={ROUTES.TEACHER.CREATE_CLASS}>
                      <Button type="primary" className="btn-gradient">
                        Create a Class
                      </Button>
                    </Link>
                  </div>
                }
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            className="shadow-sm hover:shadow-md transition-shadow"
            title={
              <div className="flex items-center">
                <FileOutlined className="mr-2 text-green-500" />
                <span className="text-lg font-medium">Upcoming Quizzes</span>
              </div>
            }
            extra={
              <Link to={ROUTES.TEACHER.QUIZZES}>
                <Button type="link">View All</Button>
              </Link>
            }
            loading={quizzesQuery.isLoading}
          >
            {quizzesQuery.isLoading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : activeQuizzes.length > 0 ? (
              <List
                dataSource={activeQuizzes}
                renderItem={(item: Quiz) => (
                  <List.Item className="hover:bg-gray-50 rounded-lg transition-colors">
                    <Link
                      to={generatePath(ROUTES.TEACHER.QUIZ_DETAIL, {
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
                  <div className="text-center py-4">
                    <Text type="secondary" className="block mb-4">
                      No upcoming quizzes
                    </Text>
                    <Link to={ROUTES.TEACHER.CREATE_QUIZ}>
                      <Button type="primary" className="btn-gradient">
                        Create a Quiz
                      </Button>
                    </Link>
                  </div>
                }
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
