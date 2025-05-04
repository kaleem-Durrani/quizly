import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Alert, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  KeyOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuthQuery } from "../../hooks/useAuthQuery";

const { Title, Text, Paragraph } = Typography;

/**
 * Reset Password page component
 * Handles password reset with OTP
 */
const ResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state if available
  const initialEmail = location.state?.email || "";

  // Use the auth query hook
  const { resetPasswordMutation } = useAuthQuery();
  const loading = resetPasswordMutation.isPending;

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setErrorMessage(null);

    try {
      const { email, otp, newPassword } = values;

      const response = await resetPasswordMutation.mutateAsync({
        email,
        otp,
        newPassword,
      });

      if (response.success) {
        message.success("Password reset successful!");
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 3000);
      } else {
        setErrorMessage(
          response.message || "Password reset failed. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      setErrorMessage(
        error.message || "Password reset failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4 bg-gradient-primary">
      <div className="relative w-full max-w-md">
        {/* Glassmorphism effect */}
        <div className="absolute -inset-1 bg-gradient-accent rounded-2xl blur-lg opacity-50"></div>

        <Card className="glass-card relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <SafetyOutlined style={{ fontSize: 28 }} />
            </div>
            <Title level={2} className="!mb-1">
              Reset Password
            </Title>
            <Text type="secondary">
              Enter the code sent to your email and create a new password
            </Text>
          </div>

          {errorMessage && (
            <Alert
              message="Reset Error"
              description={errorMessage}
              type="error"
              showIcon
              closable
              className="mb-6"
              onClose={() => setErrorMessage(null)}
            />
          )}

          {success ? (
            <div>
              <Alert
                type="success"
                message="Password Reset Successful"
                description="Your password has been reset successfully. You will be redirected to the login page in a few seconds."
                showIcon
                className="mb-6"
              />

              <div className="text-center mt-6">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <Form
              form={form}
              name="resetPassword"
              onFinish={onFinish}
              layout="vertical"
              initialValues={{ email: initialEmail }}
              size="large"
            >
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
                  disabled={!!initialEmail}
                />
              </Form.Item>

              <Form.Item
                name="otp"
                label="Reset Code"
                rules={[
                  { required: true, message: "Please enter the reset code" },
                  { len: 6, message: "Reset code must be 6 characters" },
                ]}
              >
                <Input
                  prefix={<KeyOutlined className="text-gray-400" />}
                  placeholder="6-digit code"
                  className="py-2"
                  maxLength={6}
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: "Please enter a new password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Create a new password"
                  className="py-2"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
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
                  placeholder="Confirm your new password"
                  className="py-2"
                />
              </Form.Item>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                <LockOutlined className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <Paragraph className="text-sm text-gray-600 m-0">
                  Your new password should be at least 8 characters long and
                  include a mix of letters, numbers, and special characters for
                  better security.
                </Paragraph>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="btn-gradient h-12"
                  block
                >
                  Reset Password
                </Button>
              </Form.Item>

              <div className="text-center mt-4">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Back to Login
                </Link>
              </div>
            </Form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
