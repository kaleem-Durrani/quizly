import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  Steps,
  message,
  Alert,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  UserAddOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuthQuery } from "../../hooks/useAuthQuery";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

/**
 * Register page component
 * Handles student registration
 */
const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Use the auth query hook
  const { authStatusQuery } = useAuthQuery();

  // Check if user is already logged in
  useEffect(() => {
    if (authStatusQuery.data?.isAuthenticated && authStatusQuery.data?.user) {
      const user = authStatusQuery.data.user;

      // Redirect to appropriate dashboard
      if (user.role === "admin") {
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else if (user.role === "teacher") {
        navigate(ROUTES.TEACHER.DASHBOARD);
      } else {
        navigate(ROUTES.STUDENT.DASHBOARD);
      }
    }
  }, [authStatusQuery.data, navigate]);

  // Create a custom hook for registration
  const { registerMutation } = useAuthQuery();
  const loading = registerMutation.isPending;

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) => {
    setErrorMessage(null);

    try {
      // Remove confirmPassword as it's not needed for the API
      const { confirmPassword, ...registrationData } = values;

      const response = await registerMutation.mutateAsync(registrationData);

      if (response.success) {
        message.success("Registration successful! Please verify your email.");
        // Navigate to verification page
        navigate(ROUTES.VERIFY_EMAIL, {
          state: { email: values.email },
        });
      } else {
        setErrorMessage(
          response.message || "Registration failed. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrorMessage(
        error.message || "Registration failed. Please try again."
      );
    }
  };

  // Handle next step
  const nextStep = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  };

  // Handle previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-primary">
      <div className="relative w-full max-w-2xl">
        {/* Glassmorphism effect */}
        <div className="absolute -inset-1 bg-gradient-accent rounded-2xl blur-lg opacity-50"></div>

        <Card className="glass-card relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <UserAddOutlined style={{ fontSize: 28 }} />
            </div>
            <Title level={2} className="!mb-1">
              Create an Account
            </Title>
            <Text type="secondary">Join Quizly as a student</Text>
          </div>

          {errorMessage && (
            <Alert
              message="Registration Error"
              description={errorMessage}
              type="error"
              showIcon
              closable
              className="mb-6"
              onClose={() => setErrorMessage(null)}
            />
          )}

          <Steps current={currentStep} className="mb-8">
            <Step title="Account" description="Basic info" />
            <Step title="Profile" description="Personal details" />
            <Step title="Security" description="Password" />
          </Steps>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            scrollToFirstError
            size="large"
          >
            {/* Step 1: Account Information */}
            {currentStep === 0 && (
              <>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: "Please enter a username" },
                    {
                      min: 3,
                      message: "Username must be at least 3 characters",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Choose a username"
                    className="py-2"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Your email address"
                    className="py-2"
                  />
                </Form.Item>

                <div className="flex justify-end mt-6">
                  <Button
                    type="primary"
                    onClick={nextStep}
                    className="btn-gradient h-10 px-8"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 1 && (
              <>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: "Please enter your first name" },
                  ]}
                >
                  <Input
                    prefix={<IdcardOutlined className="text-gray-400" />}
                    placeholder="Your first name"
                    className="py-2"
                  />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: "Please enter your last name" },
                  ]}
                >
                  <Input
                    prefix={<IdcardOutlined className="text-gray-400" />}
                    placeholder="Your last name"
                    className="py-2"
                  />
                </Form.Item>

                <div className="flex justify-between mt-6">
                  <Button onClick={prevStep} className="h-10 px-6">
                    Back
                  </Button>
                  <Button
                    type="primary"
                    onClick={nextStep}
                    className="btn-gradient h-10 px-8"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Security Information */}
            {currentStep === 2 && (
              <>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please enter a password" },
                    {
                      min: 8,
                      message: "Password must be at least 8 characters",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Create a password"
                    className="py-2"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Please confirm your password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The two passwords do not match")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Confirm your password"
                    className="py-2"
                  />
                </Form.Item>

                <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                  <SafetyOutlined className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <Paragraph className="text-sm text-gray-600 m-0">
                    Your password should be at least 8 characters long and
                    include a mix of letters, numbers, and special characters
                    for better security.
                  </Paragraph>
                </div>

                <Paragraph className="text-sm text-gray-500 mb-6">
                  By registering, you agree to our{" "}
                  <a href="#" className="text-blue-600">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600">
                    Privacy Policy
                  </a>
                  .
                </Paragraph>

                <div className="flex justify-between">
                  <Button onClick={prevStep} className="h-10 px-6">
                    Back
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="btn-gradient h-10 px-8"
                  >
                    Register
                  </Button>
                </div>
              </>
            )}
          </Form>

          <Divider className="my-6" />

          <div className="text-center">
            <Text type="secondary">Already have an account? </Text>
            <Link
              to={ROUTES.LOGIN}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
