import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  Button,
  Input,
  Space,
  Card,
  Modal,
  Form,
  message,
  Tag,
  Tooltip,
  Empty,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAdminQuery } from "../../../hooks/useAdminQuery";
import { Subject } from "../../../constants/types";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

/**
 * Admin Subjects page component
 * Displays a list of subjects with management options
 */
const Subjects: React.FC = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  // Use the admin query hooks
  const {
    getSubjectsQuery,
    createSubjectMutation,
    updateSubjectMutation,
    deleteSubjectMutation,
  } = useAdminQuery();

  // Get subjects data
  const { data: subjectsData, isLoading: isLoadingSubjects } =
    getSubjectsQuery(paginationParams);
  const subjects = subjectsData?.data || [];
  const totalSubjects = subjectsData?.totalItems || 0;

  // Update search after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setPaginationParams((prev) => ({ ...prev, search: searchText, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Handle pagination change
  const handleTableChange = (pagination: any) => {
    setPaginationParams((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  // Handle subject creation/editing
  const handleSaveSubject = async (values: {
    name: string;
    description?: string;
  }) => {
    try {
      if (editingSubject) {
        // Update existing subject
        const response = await updateSubjectMutation.mutateAsync({
          subjectId: editingSubject._id,
          data: values,
        });

        if (response.success) {
          message.success("Subject updated successfully");
          setModalVisible(false);
          form.resetFields();
          setEditingSubject(null);
        } else {
          message.error(response.message || "Failed to update subject");
        }
      } else {
        // Create new subject
        const response = await createSubjectMutation.mutateAsync(values);

        if (response.success) {
          message.success("Subject created successfully");
          setModalVisible(false);
          form.resetFields();
        } else {
          message.error(response.message || "Failed to create subject");
        }
      }
    } catch (error: any) {
      console.error("Error saving subject:", error);
      message.error(error.message || "Failed to save subject");
    }
  };

  // Handle subject deletion
  const handleDeleteSubject = (subject: Subject) => {
    confirm({
      title: "Delete Subject",
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: (
        <div>
          <p>
            Are you sure you want to delete the subject{" "}
            <strong>"{subject.name}"</strong>?
          </p>
          <p className="text-red-500">
            This action cannot be undone and may affect quizzes using this
            subject.
          </p>
        </div>
      ),
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const response = await deleteSubjectMutation.mutateAsync(subject._id);

          if (response.success) {
            message.success("Subject deleted successfully");
          } else {
            message.error(response.message || "Failed to delete subject");
          }
        } catch (error: any) {
          console.error("Error deleting subject:", error);
          message.error(error.message || "Failed to delete subject");
        }
      },
    });
  };

  // Open modal for editing
  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    form.setFieldsValue({
      name: subject.name,
      description: subject.description,
    });
    setModalVisible(true);
  };

  // Open modal for creating
  const handleAddSubject = () => {
    setEditingSubject(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Format date for display
  const formatDate = (date: string | Date) => {
    return dayjs(date).format("MMM D, YYYY");
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Subject) => (
        <div className="flex items-center">
          <BookOutlined className="text-blue-500 mr-2" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: { showTitle: false },
      render: (description: string) => (
        <Tooltip title={description || "No description provided"}>
          <div className="max-w-md truncate">
            {description || (
              <Text type="secondary" italic>
                No description
              </Text>
            )}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Quizzes",
      dataIndex: "quizCount",
      key: "quizCount",
      render: (quizCount: number) => (
        <Tag color={quizCount > 0 ? "blue" : "default"}>
          {quizCount || 0} {quizCount === 1 ? "Quiz" : "Quizzes"}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Subject) => (
        <Space size="small">
          <Tooltip title="Edit Subject">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditSubject(record)}
              className="hover:text-blue-500 hover:border-blue-500"
            />
          </Tooltip>
          <Tooltip title="Delete Subject">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => handleDeleteSubject(record)}
              disabled={record.quizCount > 0}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="mb-1">
            Subjects
          </Title>
          <Text type="secondary">Manage subjects for quizzes</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddSubject}
          className="btn-gradient"
          size="large"
        >
          Add Subject
        </Button>
      </div>

      <Card className="shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Search subjects..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="max-w-md"
            size="large"
          />
        </div>

        <Table
          columns={columns}
          dataSource={subjects}
          rowKey="_id"
          loading={
            isLoadingSubjects ||
            createSubjectMutation.isPending ||
            updateSubjectMutation.isPending ||
            deleteSubjectMutation.isPending
          }
          pagination={{
            current: paginationParams.page,
            pageSize: paginationParams.limit,
            total: totalSubjects,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => `Total ${total} subjects`,
          }}
          onChange={handleTableChange}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center py-4">
                    <Text type="secondary">No subjects found</Text>
                    <div className="mt-2">
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddSubject}
                        className="btn-gradient"
                      >
                        Add Subject
                      </Button>
                    </div>
                  </div>
                }
              />
            ),
          }}
        />
      </Card>

      {/* Subject Form Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <BookOutlined className="text-blue-500 mr-2" />
            <span>{editingSubject ? "Edit Subject" : "Add Subject"}</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        className="rounded-lg overflow-hidden"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveSubject}
          size="large"
        >
          <Form.Item
            name="name"
            label="Subject Name"
            rules={[
              { required: true, message: "Please enter the subject name" },
            ]}
          >
            <Input placeholder="e.g., Mathematics" className="py-2" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="Enter a description for this subject"
              rows={4}
              className="py-2"
            />
          </Form.Item>

          <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
            <InfoCircleOutlined className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <Paragraph className="text-sm text-gray-600 m-0">
              Subjects are used to categorize quizzes. Teachers can select a
              subject when creating a quiz, and students can filter quizzes by
              subject.
            </Paragraph>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={
                createSubjectMutation.isPending ||
                updateSubjectMutation.isPending
              }
              className="btn-gradient"
            >
              {editingSubject ? "Update Subject" : "Create Subject"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Subjects;
