import React, { useState } from "react";
import {
  Typography,
  Card,
  Form,
  Input,
  Button,
  Alert,
  message,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  TeamOutlined,
  FormOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ROUTES, generatePath } from "../../../constants/routes";
import { useTeacherQuery } from "../../../hooks/useTeacherQuery";
import { CreateClassRequest } from "../../../constants/types";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

/**
 * Teacher Create Class page component
 * Form for creating a new class
 */
const CreateClass: React.FC = () => {
  const [form] = Form.useForm();
  const [success, setSuccess] = useState(false);
  const [classId, setClassId] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const navigate = useNavigate();

  // Use the teacher query hooks
  const { createClassMutation } = useTeacherQuery();

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: CreateClassRequest) => {
    try {
      const response = await createClassMutation.mutateAsync(values);

      if (response.success) {
        setClassId(response.data._id);
        setJoinCode(response.data.joinCode);
        setSuccess(true);
        message.success("Class created successfully");
      } else {
        message.error(response.message || "Failed to create class");
      }
    } catch (error: any) {
      console.error("Error creating class:", error);
      message.error(error.message || "Failed to create class");
    }
  };

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
        <div>
          <Title level={2} className="m-0">
            Create Class
          </Title>
          <Text type="secondary">Create a new class for your students</Text>
        </div>
      </div>

      <Card className="shadow-sm max-w-3xl">
        {success ? (
          <div className="py-4">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircleOutlined className="text-green-500 text-4xl" />
              </div>
            </div>

            <Title level={3} className="text-center mb-6">
              Class Created Successfully!
            </Title>

            <Alert
              type="success"
              message={
                <div className="font-medium">
                  Your new class has been created
                </div>
              }
              description={
                <div>
                  <p>
                    You can now add quizzes and share the join code with your
                    students.
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="font-medium mb-1">Class Join Code:</div>
                    <div className="flex items-center justify-center">
                      <div className="text-2xl font-bold tracking-wider bg-white px-6 py-3 rounded-lg border border-blue-200">
                        {joinCode}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Share this code with your students so they can join your
                      class
                    </div>
                  </div>
                </div>
              }
              showIcon
              className="mb-6"
            />

            <Divider />

            <div className="flex justify-center space-x-4">
              <Button
                icon={<FormOutlined />}
                onClick={() => {
                  setSuccess(false);
                  form.resetFields();
                }}
                size="large"
              >
                Create Another Class
              </Button>
              <Button
                type="primary"
                icon={<TeamOutlined />}
                onClick={() =>
                  navigate(
                    generatePath(ROUTES.TEACHER.CLASS_DETAIL, {
                      id: classId as string,
                    })
                  )
                }
                className="btn-gradient"
                size="large"
              >
                View Class
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <Title level={4} className="mb-2">
                Class Information
              </Title>
              <Text type="secondary">
                Fill in the details below to create a new class. Students will
                be able to join using a generated join code.
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                name="name"
                label="Class Name"
                rules={[
                  { required: true, message: "Please enter a class name" },
                ]}
              >
                <Input
                  placeholder="e.g., Mathematics 101"
                  prefix={<TeamOutlined className="text-gray-400" />}
                  className="py-2"
                />
              </Form.Item>

              <Form.Item name="description" label="Description (Optional)">
                <TextArea
                  placeholder="Enter a description for this class"
                  rows={4}
                  className="py-2"
                />
              </Form.Item>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                <InfoCircleOutlined className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <Paragraph className="text-sm text-gray-600 m-0">
                  A unique join code will be automatically generated for this
                  class. You can share this code with your students so they can
                  join the class.
                </Paragraph>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={createClassMutation.isPending}
                  className="btn-gradient"
                  size="large"
                  icon={<TeamOutlined />}
                >
                  Create Class
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CreateClass;
