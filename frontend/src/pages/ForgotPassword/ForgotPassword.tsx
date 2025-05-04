import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Alert, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuthQuery } from "../../hooks/useAuthQuery";

const { Title, Text, Paragraph } = Typography;

/**
 * Forgot Password page component
 * Handles password reset requests
 */
const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use the auth query hook
  const { forgotPasswordMutation } = useAuthQuery();
  const loading = forgotPasswordMutation.isPending;

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: { email: string }) => {
    setErrorMessage(null);

    try {
      const response = await forgotPasswordMutation.mutateAsync(values.email);

      if (response.success) {
        message.success("Reset code sent successfully!");
        setEmail(values.email);
        setSubmitted(true);
      } else {
        setErrorMessage(
          response.message || "Failed to send reset code. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setErrorMessage(
        error.message || "Failed to send reset code. Please try again."
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
              <LockOutlined style={{ fontSize: 28 }} />
            </div>
            <Title level={2} className="!mb-1">
              Forgot Password
            </Title>
            <Text type="secondary">
              Enter your email address and we'll send you a code to reset your
              password
            </Text>
          </div>

          {errorMessage && (
            <Alert
              message="Error"
              description={errorMessage}
              type="error"
              showIcon
              closable
              className="mb-6"
              onClose={() => setErrorMessage(null)}
            />
          )}

          {submitted ? (
            <div>
              <Alert
                type="success"
                message="Reset Code Sent"
                description={`We've sent a password reset code to ${email}. Please check your email and use the code to reset your password.`}
                showIcon
                className="mb-6"
              />

              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                <MailOutlined className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <Paragraph className="text-sm text-gray-600 m-0">
                  If you don't see the email in your inbox, please check your
                  spam folder. The code will expire in 15 minutes.
                </Paragraph>
              </div>

              <div className="text-center mt-6">
                <Link
                  to={ROUTES.RESET_PASSWORD}
                  state={{ email }}
                  className="block mb-4"
                >
                  <Button
                    type="primary"
                    size="large"
                    block
                    className="btn-gradient h-12"
                  >
                    Enter Reset Code
                  </Button>
                </Link>

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
              name="forgotPassword"
              onFinish={onFinish}
              layout="vertical"
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
                />
              </Form.Item>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                <MailOutlined className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <Paragraph className="text-sm text-gray-600 m-0">
                  We'll send a verification code to this email address. You'll
                  use this code to reset your password.
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
                  Send Reset Code
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

export default ForgotPassword;
