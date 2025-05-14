import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Radio,
  Card,
  Typography,
  Alert,
  message,
} from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useAuthQuery } from "../../hooks/useAuthQuery";
import { ROUTES } from "../../constants/routes";
import { UserRole } from "../../constants/types";

const { Title, Text } = Typography;

/**
 * Login page component
 * Handles user authentication for all user types
 */
const Login = () => {
  const [form] = Form.useForm();
  const [userType, setUserType] = useState<UserRole>("student");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Use the auth query hook
  const { loginMutation, authStatusQuery } = useAuthQuery();
  const loading = loginMutation.isPending;

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

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: { email: string; password: string }) => {
    setErrorMessage(null);

    try {
      const response = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
        role: userType,
      });

      if (response.success && response.data) {
        message.success("Login successful!");

        // Redirect based on user type
        if (userType === "admin") {
          navigate(ROUTES.ADMIN.DASHBOARD);
        } else if (userType === "teacher") {
          navigate(ROUTES.TEACHER.DASHBOARD);
        } else {
          navigate(ROUTES.STUDENT.DASHBOARD);
        }
      } else {
        setErrorMessage(
          response.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific error messages
      if (error.message.includes("Invalid credentials")) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else if (error.message.includes("Email not verified")) {
        setErrorMessage(
          "Your email is not verified. Please check your email for verification instructions."
        );
      } else if (error.message.includes("Student not found")) {
        setErrorMessage(
          "No account found with this email. Please check your email or register."
        );
      } else {
        setErrorMessage(error.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="relative w-full max-w-md">
        {/* Glassmorphism effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-50"></div>

        <Card className="relative w-full backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-xl overflow-hidden">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <LoginOutlined style={{ fontSize: 28 }} />
            </div>
            <Title level={2} className="!mb-1">
              Welcome to Quizly
            </Title>
            <Text type="secondary">Sign in to continue</Text>
          </div>

          {errorMessage && (
            <Alert
              message="Login Error"
              description={errorMessage}
              type="error"
              showIcon
              closable
              className="mb-6"
              onClose={() => setErrorMessage(null)}
            />
          )}

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            size="large"
          >
            <div className="mb-6">
              <Radio.Group
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full flex"
                buttonStyle="solid"
                size="large"
              >
                <Radio.Button value="student" className="flex-1 text-center">
                  Student
                </Radio.Button>
                <Radio.Button value="teacher" className="flex-1 text-center">
                  Teacher
                </Radio.Button>
                <Radio.Button value="admin" className="flex-1 text-center">
                  Admin
                </Radio.Button>
              </Radio.Group>
            </div>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Email"
                className="py-2"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="py-2"
              />
            </Form.Item>

            <Form.Item className="mb-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            {userType === "student" && (
              <div className="mb-3">
                <Text>Don't have an account? </Text>
                <RouterLink
                  to={ROUTES.REGISTER}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Register now
                </RouterLink>
              </div>
            )}
            <RouterLink
              to={ROUTES.FORGOT_PASSWORD}
              className="text-blue-600 hover:text-blue-800"
            >
              Forgot password?
            </RouterLink>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
