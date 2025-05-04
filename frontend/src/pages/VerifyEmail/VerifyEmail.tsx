import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
  Space,
  message,
} from "antd";
import { MailOutlined, KeyOutlined, SafetyOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuthQuery } from "../../hooks/useAuthQuery";
import { useAuth } from "../../contexts/AuthContext";

const { Title, Text, Paragraph } = Typography;

/**
 * Email Verification page component
 * Handles OTP verification for new accounts
 */
const VerifyEmail: React.FC = () => {
  const [form] = Form.useForm();
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuthStatus } = useAuth();

  // Get email from location state if available
  const initialEmail = location.state?.email || "";

  // Use the auth query hook
  const { verifyEmailMutation, resendOTPMutation } = useAuthQuery();
  const loading = verifyEmailMutation.isPending;
  const resending = resendOTPMutation.isPending;

  useEffect(() => {
    // Start countdown timer if needed
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: { email: string; otp: string }) => {
    setErrorMessage(null);

    try {
      const response = await verifyEmailMutation.mutateAsync({
        email: values.email,
        otp: values.otp,
      });

      if (response.success) {
        message.success("Email verified successfully!");
        // Refresh auth status and redirect to dashboard
        await checkAuthStatus();
        navigate(ROUTES.STUDENT.DASHBOARD);
      } else {
        setErrorMessage(
          response.message || "Verification failed. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setErrorMessage(
        error.message || "Verification failed. Please try again."
      );
    }
  };

  /**
   * Handle OTP resend
   */
  const handleResendOTP = async () => {
    const email = form.getFieldValue("email");
    if (!email) {
      form.setFields([
        {
          name: "email",
          errors: ["Please enter your email to resend the code"],
        },
      ]);
      return;
    }

    setErrorMessage(null);

    try {
      const response = await resendOTPMutation.mutateAsync(email);

      if (response.success) {
        message.success("Verification code sent! Please check your email.");
        // Start countdown for resend button
        setCountdown(60);
      } else {
        setErrorMessage(
          response.message ||
            "Failed to send verification code. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      setErrorMessage(
        error.message || "Failed to send verification code. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-primary">
      <div className="relative w-full max-w-md">
        {/* Glassmorphism effect */}
        <div className="absolute -inset-1 bg-gradient-accent rounded-2xl blur-lg opacity-50"></div>

        <Card className="glass-card relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <SafetyOutlined style={{ fontSize: 28 }} />
            </div>
            <Title level={2} className="!mb-1">
              Verify Your Email
            </Title>
            <Text type="secondary">
              Enter the verification code sent to your email
            </Text>
          </div>

          {errorMessage && (
            <Alert
              message="Verification Error"
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
            name="verifyEmail"
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
              label="Verification Code"
              rules={[
                {
                  required: true,
                  message: "Please enter the verification code",
                },
                { len: 6, message: "Verification code must be 6 characters" },
              ]}
            >
              <Input
                prefix={<KeyOutlined className="text-gray-400" />}
                placeholder="6-digit code"
                className="py-2"
                maxLength={6}
              />
            </Form.Item>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
              <MailOutlined className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <Paragraph className="text-sm text-gray-600 m-0">
                We've sent a verification code to your email. If you don't see
                it, check your spam folder or request a new code.
              </Paragraph>
            </div>

            <Form.Item>
              <Space direction="vertical" className="w-full">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="btn-gradient h-12"
                  block
                >
                  Verify Email
                </Button>

                <Button
                  type="link"
                  block
                  onClick={handleResendOTP}
                  disabled={countdown > 0}
                  loading={resending}
                >
                  {countdown > 0
                    ? `Resend Code (${countdown}s)`
                    : "Resend Verification Code"}
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Text type="secondary">Want to use a different account? </Text>
            <Link
              to={ROUTES.REGISTER}
              className="text-blue-600 hover:text-blue-800"
            >
              Register again
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
