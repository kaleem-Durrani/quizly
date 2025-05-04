import React from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Skeleton,
  Tag,
  Button,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  FileOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTES, generatePath } from "../../../constants/routes";
import { useAdminQuery } from "../../../hooks/useAdminQuery";
import { User, Quiz } from "../../../constants/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

/**
 * Admin Dashboard page component
 * Displays overview statistics and quick actions for administrators
 */
const Dashboard: React.FC = () => {
  // Use the admin query hooks
  const { profileQuery, dashboardQuery } = useAdminQuery();

  // Get dashboard data
  const dashboardData = dashboardQuery.data?.data;
  const isLoading = dashboardQuery.isLoading;

  // Get counts
  const teacherCount = dashboardData?.counts.teachers || 0;
  const studentCount = dashboardData?.counts.students || 0;
  const quizCount = dashboardData?.counts.quizzes || 0;
  const submissionCount = dashboardData?.counts.submissions || 0;

  // Get recent users and quizzes
  const recentUsers = dashboardData?.recentUsers || [];
  const recentQuizzes = dashboardData?.recentQuizzes || [];

  // Format date for display
  const formatDate = (date: string | Date) => {
    return dayjs(date).format("MMM D, YYYY");
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <Title level={2} className="mb-2">
          Admin Dashboard
        </Title>
        <Paragraph className="text-gray-500">
          Welcome back, {profileQuery.data?.data?.firstName || "Admin"}! Here's
          an overview of your platform.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-lg font-medium">Teachers</span>}
              value={teacherCount}
              prefix={<TeamOutlined className="text-blue-500" />}
              loading={isLoading}
            />
            <div className="mt-4">
              <Link to={ROUTES.ADMIN.TEACHERS}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="btn-gradient"
                >
                  Add Teacher
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-lg font-medium">Students</span>}
              value={studentCount}
              prefix={<UserOutlined className="text-green-500" />}
              loading={isLoading}
            />
            <div className="mt-4">
              <Link to={ROUTES.ADMIN.STUDENTS}>
                <Button type="default">View Students</Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-lg font-medium">Quizzes</span>}
              value={quizCount}
              prefix={<FileOutlined className="text-purple-500" />}
              loading={isLoading}
            />
            <div className="mt-4">
              <Link to={ROUTES.ADMIN.QUIZZES}>
                <Button type="default">View Quizzes</Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-lg font-medium">Submissions</span>}
              value={submissionCount}
              prefix={<CheckCircleOutlined className="text-orange-500" />}
              loading={isLoading}
            />
            <div className="mt-4">
              <Link to={ROUTES.ADMIN.SUBJECTS}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="btn-gradient"
                >
                  Add Subject
                </Button>
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
                <UserAddOutlined className="mr-2 text-blue-500" />
                <span className="text-lg font-medium">Recent Users</span>
              </div>
            }
            extra={
              <Link to={ROUTES.ADMIN.TEACHERS}>
                <Button type="link">View All</Button>
              </Link>
            }
            loading={isLoading}
          >
            {isLoading ? (
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            ) : recentUsers.length > 0 ? (
              <List
                dataSource={recentUsers}
                renderItem={(user: User) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<UserOutlined />}
                          className={
                            user.role === "teacher"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }
                        />
                      }
                      title={
                        <div className="flex items-center">
                          <span className="mr-2">
                            {user.firstName} {user.lastName}
                          </span>
                          <Tag
                            color={user.role === "teacher" ? "blue" : "green"}
                          >
                            {user.role === "teacher" ? "Teacher" : "Student"}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div>{user.email}</div>
                          <div className="text-xs text-gray-400">
                            Joined {dayjs(user.createdAt).fromNow()}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-4">
                <Text type="secondary">No recent users</Text>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            className="shadow-sm hover:shadow-md transition-shadow"
            title={
              <div className="flex items-center">
                <FileOutlined className="mr-2 text-purple-500" />
                <span className="text-lg font-medium">Recent Quizzes</span>
              </div>
            }
            extra={
              <Link to={ROUTES.ADMIN.QUIZZES}>
                <Button type="link">View All</Button>
              </Link>
            }
            loading={isLoading}
          >
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : recentQuizzes.length > 0 ? (
              <List
                dataSource={recentQuizzes}
                renderItem={(quiz: Quiz) => (
                  <List.Item>
                    <List.Item.Meta
                      title={quiz.title}
                      description={
                        <div>
                          <div className="flex items-center">
                            <ClockCircleOutlined className="mr-1 text-gray-400" />
                            <span className="text-gray-500 mr-3">
                              Created {dayjs(quiz.createdAt).fromNow()}
                            </span>
                            {quiz.createdBy && (
                              <span className="text-gray-500">
                                by {quiz.createdBy.firstName}{" "}
                                {quiz.createdBy.lastName}
                              </span>
                            )}
                          </div>
                          <div className="mt-1">
                            <Tag color="blue">
                              {quiz.subject?.name || "No Subject"}
                            </Tag>
                            <Tag
                              color={
                                quiz.status === "published" ? "green" : "orange"
                              }
                            >
                              {quiz.status === "published"
                                ? "Published"
                                : "Draft"}
                            </Tag>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-4">
                <Text type="secondary">No recent quizzes</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
