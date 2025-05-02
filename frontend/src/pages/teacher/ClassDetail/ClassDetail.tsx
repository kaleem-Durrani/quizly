import React, { useState } from "react";
import {
  Typography,
  Card,
  Tabs,
  Button,
  Table,
  Space,
  Tag,
  Modal,
  message,
  Input,
} from "antd";
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { generatePath } from "../../../constants/routes";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

/**
 * Teacher Class Detail page component
 * Displays detailed information about a class
 */
const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [regeneratingCode, setRegeneratingCode] = useState(false);

  // Handle join code regeneration
  const handleRegenerateJoinCode = () => {
    confirm({
      title: "Regenerate Join Code",
      content:
        "Are you sure you want to regenerate the join code? The old code will no longer work.",
      onOk: async () => {
        setRegeneratingCode(true);
        try {
          // API call would go here
          message.success("Join code regenerated successfully");
        } catch (error) {
          console.error("Error regenerating join code:", error);
          message.error("Failed to regenerate join code");
        } finally {
          setRegeneratingCode(false);
        }
      },
    });
  };

  // Handle student removal
  const handleRemoveStudent = (studentId: string, studentName: string) => {
    confirm({
      title: "Remove Student",
      content: `Are you sure you want to remove ${studentName} from this class?`,
      onOk: async () => {
        setLoading(true);
        try {
          // API call would go here
          message.success(`${studentName} has been removed from the class`);
        } catch (error) {
          console.error("Error removing student:", error);
          message.error("Failed to remove student");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Student columns for the table
  const studentColumns = [
    {
      title: "Name",
      key: "name",
      render: (record: any) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          size="small"
          onClick={() =>
            handleRemoveStudent(
              record.id,
              `${record.firstName} ${record.lastName}`
            )
          }
        >
          Remove
        </Button>
      ),
    },
  ];

  // Quiz columns for the table
  const quizColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (_: any, record: any) => (
        <Link to={generatePath(ROUTES.TEACHER.QUIZ_DETAIL, { id: record.id })}>
          {record.title}
        </Link>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "published") color = "green";
        if (status === "draft") color = "orange";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="small">
          <Link
            to={generatePath(ROUTES.TEACHER.QUIZ_DETAIL, { id: record.id })}
          >
            <Button size="small">View</Button>
          </Link>
          <Link
            to={generatePath(ROUTES.TEACHER.QUIZ_RESULTS, { id: record.id })}
          >
            <Button size="small">Results</Button>
          </Link>
        </Space>
      ),
    },
  ];

  // State for student search
  const [studentSearchText, setStudentSearchText] = useState("");

  // Sample data (will be replaced with API data)
  const classData = {
    name: "Loading...",
    description: "",
    joinCode: "XXXXXX",
    createdAt: "",
  };
  const students: any[] = [];
  const quizzes: any[] = [];

  // Filter students based on search text
  const filteredStudents = students.filter(
    (student) =>
      student.firstName
        ?.toLowerCase()
        .includes(studentSearchText.toLowerCase()) ||
      student.lastName
        ?.toLowerCase()
        .includes(studentSearchText.toLowerCase()) ||
      student.email?.toLowerCase().includes(studentSearchText.toLowerCase()) ||
      student.username?.toLowerCase().includes(studentSearchText.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(ROUTES.TEACHER.CLASSES)}
          className="mr-4"
        >
          Back to Classes
        </Button>
        <Title level={2} className="m-0">
          {classData.name}
        </Title>
      </div>

      <Card className="mb-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="mb-2">
              <Text strong>Join Code: </Text>
              <Tag color="blue" className="text-lg">
                {classData.joinCode}
              </Tag>
              <Button
                icon={<ReloadOutlined />}
                size="small"
                className="ml-2"
                onClick={handleRegenerateJoinCode}
                loading={regeneratingCode}
              >
                Regenerate
              </Button>
            </div>
            <div>
              <Text strong>Description: </Text>
              <Text>{classData.description || "No description"}</Text>
            </div>
          </div>
          <Link to={generatePath(ROUTES.TEACHER.EDIT_CLASS, { id: id || "" })}>
            <Button type="primary">Edit Class</Button>
          </Link>
        </div>
      </Card>

      <Card>
        <Tabs defaultActiveKey="students">
          <TabPane tab="Students" key="students">
            <div className="flex justify-between mb-4">
              <Text>Total Students: {students.length}</Text>
              {/* Note: In a real implementation, we would add a component here to invite students by email */}
            </div>

            <div className="mb-4">
              <Input
                placeholder="Search students..."
                prefix={<SearchOutlined />}
                value={studentSearchText}
                onChange={(e) => setStudentSearchText(e.target.value)}
                allowClear
              />
            </div>

            <Table
              columns={studentColumns}
              dataSource={filteredStudents}
              rowKey="id"
              loading={loading}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
              }}
            />
          </TabPane>

          <TabPane tab="Quizzes" key="quizzes">
            <div className="flex justify-between mb-4">
              <Text>Total Quizzes: {quizzes.length}</Text>
              <Link to={ROUTES.TEACHER.CREATE_QUIZ}>
                <Button type="primary" icon={<PlusOutlined />}>
                  Create Quiz
                </Button>
              </Link>
            </div>
            <Table
              columns={quizColumns}
              dataSource={quizzes}
              rowKey="id"
              loading={loading}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ClassDetail;
