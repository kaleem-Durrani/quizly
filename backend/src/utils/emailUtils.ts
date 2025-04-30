import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password generated from Google account
  },
});

/**
 * Send an email using nodemailer
 * @param to Recipient email address
 * @param subject Email subject
 * @param html HTML content of the email
 * @param text Plain text version of the email (optional)
 * @returns Promise that resolves with the nodemailer info object
 */
export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<any> => {
  try {
    const mailOptions = {
      from: `"Quizly" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || '',
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send a verification OTP email to a student
 * @param to Student's email address
 * @param otp One-time password for verification
 * @param firstName Student's first name (optional)
 */
export const sendVerificationEmail = async (
  to: string,
  otp: string,
  firstName?: string
): Promise<any> => {
  const subject = 'Verify Your Quizly Account';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a; text-align: center;">Welcome to Quizly!</h2>
      <p>Hello ${firstName || 'there'},</p>
      <p>Thank you for registering with Quizly. To complete your registration, please use the following verification code:</p>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in 1 hour.</p>
      <p>If you did not request this verification, please ignore this email.</p>
      <p>Best regards,<br>The Quizly Team</p>
    </div>
  `;

  const text = `
    Welcome to Quizly!

    Hello ${firstName || 'there'},

    Thank you for registering with Quizly. To complete your registration, please use the following verification code:

    ${otp}

    This code will expire in 1 hour.

    If you did not request this verification, please ignore this email.

    Best regards,
    The Quizly Team
  `;

  return sendEmail(to, subject, html, text);
};

/**
 * Send a password reset email with OTP
 * @param to User's email address
 * @param otp One-time password for password reset
 * @param firstName User's first name (optional)
 */
export const sendPasswordResetEmail = async (
  to: string,
  otp: string,
  firstName?: string
): Promise<any> => {
  const subject = 'Reset Your Quizly Password';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a; text-align: center;">Reset Your Password</h2>
      <p>Hello ${firstName || 'there'},</p>
      <p>We received a request to reset your password for your Quizly account. Please use the following code to reset your password:</p>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in 1 hour.</p>
      <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      <p>Best regards,<br>The Quizly Team</p>
    </div>
  `;

  const text = `
    Reset Your Password

    Hello ${firstName || 'there'},

    We received a request to reset your password for your Quizly account. Please use the following code to reset your password:

    ${otp}

    This code will expire in 1 hour.

    If you did not request a password reset, please ignore this email or contact support if you have concerns.

    Best regards,
    The Quizly Team
  `;

  return sendEmail(to, subject, html, text);
};

/**
 * Send a welcome email after successful verification
 * @param to User's email address
 * @param firstName User's first name (optional)
 */
export const sendWelcomeEmail = async (
  to: string,
  firstName?: string
): Promise<any> => {
  const subject = 'Welcome to Quizly!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a; text-align: center;">Welcome to Quizly!</h2>
      <p>Hello ${firstName || 'there'},</p>
      <p>Thank you for verifying your email address. Your Quizly account is now fully activated!</p>
      <p>You can now:</p>
      <ul>
        <li>Join classes using join codes</li>
        <li>Take quizzes assigned to your classes</li>
        <li>Track your progress and review your submissions</li>
      </ul>
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The Quizly Team</p>
    </div>
  `;

  const text = `
    Welcome to Quizly!

    Hello ${firstName || 'there'},

    Thank you for verifying your email address. Your Quizly account is now fully activated!

    You can now:
    - Join classes using join codes
    - Take quizzes assigned to your classes
    - Track your progress and review your submissions

    If you have any questions or need assistance, please don't hesitate to contact our support team.

    Best regards,
    The Quizly Team
  `;

  return sendEmail(to, subject, html, text);
};

/**
 * Send initial password to a teacher created by an admin
 * @param to Teacher's email address
 * @param password Initial password
 * @param firstName Teacher's first name (optional)
 * @param lastName Teacher's last name (optional)
 */
export const sendTeacherInitialPasswordEmail = async (
  to: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<any> => {
  const fullName = firstName && lastName
    ? `${firstName} ${lastName}`
    : firstName || 'there';

  const subject = 'Your Quizly Teacher Account';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a; text-align: center;">Welcome to Quizly!</h2>
      <p>Hello ${fullName},</p>
      <p>An administrator has created a teacher account for you on the Quizly platform.</p>
      <p>Here are your login details:</p>
      <ul>
        <li><strong>Email:</strong> ${to}</li>
        <li><strong>Initial Password:</strong> <span style="font-family: monospace; background-color: #f5f5f5; padding: 2px 5px;">${password}</span></li>
      </ul>
      <p style="color: #d9534f; font-weight: bold;">Important: You will be required to change this password when you first log in.</p>
      <p>As a teacher on Quizly, you can:</p>
      <ul>
        <li>Create and manage classes</li>
        <li>Create quizzes and assignments</li>
        <li>Monitor student progress</li>
        <li>Review and grade submissions</li>
      </ul>
      <p>If you have any questions or need assistance, please contact your administrator.</p>
      <p>Best regards,<br>The Quizly Team</p>
    </div>
  `;

  const text = `
    Welcome to Quizly!

    Hello ${fullName},

    An administrator has created a teacher account for you on the Quizly platform.

    Here are your login details:
    - Email: ${to}
    - Initial Password: ${password}

    IMPORTANT: You will be required to change this password when you first log in.

    As a teacher on Quizly, you can:
    - Create and manage classes
    - Create quizzes and assignments
    - Monitor student progress
    - Review and grade submissions

    If you have any questions or need assistance, please contact your administrator.

    Best regards,
    The Quizly Team
  `;

  return sendEmail(to, subject, html, text);
};

/**
 * Send a password reset notification to a teacher
 * @param to Teacher's email address
 * @param newPassword New password
 * @param firstName Teacher's first name (optional)
 */
export const sendTeacherPasswordResetEmail = async (
  to: string,
  newPassword: string,
  firstName?: string
): Promise<any> => {
  const subject = 'Your Quizly Password Has Been Reset';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a; text-align: center;">Password Reset</h2>
      <p>Hello ${firstName || 'there'},</p>
      <p>An administrator has reset your password for your Quizly teacher account.</p>
      <p>Your new password is: <span style="font-family: monospace; background-color: #f5f5f5; padding: 2px 5px;">${newPassword}</span></p>
      <p style="color: #d9534f; font-weight: bold;">Important: You will be required to change this password when you next log in.</p>
      <p>If you did not request this password reset, please contact your administrator immediately.</p>
      <p>Best regards,<br>The Quizly Team</p>
    </div>
  `;

  const text = `
    Password Reset

    Hello ${firstName || 'there'},

    An administrator has reset your password for your Quizly teacher account.

    Your new password is: ${newPassword}

    IMPORTANT: You will be required to change this password when you next log in.

    If you did not request this password reset, please contact your administrator immediately.

    Best regards,
    The Quizly Team
  `;

  return sendEmail(to, subject, html, text);
};

/**
 * Send initial password to a new admin created by another admin
 * @param to Admin's email address
 * @param password Initial password
 * @param firstName Admin's first name (optional)
 * @param lastName Admin's last name (optional)
 */
export const sendAdminInitialPasswordEmail = async (
  to: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<any> => {
  const fullName = firstName && lastName
    ? `${firstName} ${lastName}`
    : firstName || 'there';

  const subject = 'Your Quizly Admin Account';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #4a4a4a; text-align: center;">Welcome to Quizly Admin!</h2>
      <p>Hello ${fullName},</p>
      <p>An administrator has created an admin account for you on the Quizly platform.</p>
      <p>Here are your login details:</p>
      <ul>
        <li><strong>Email:</strong> ${to}</li>
        <li><strong>Initial Password:</strong> <span style="font-family: monospace; background-color: #f5f5f5; padding: 2px 5px;">${password}</span></li>
      </ul>
      <p>As an administrator on Quizly, you have full access to manage the platform, including:</p>
      <ul>
        <li>Creating and managing teacher accounts</li>
        <li>Managing student accounts</li>
        <li>Creating subjects</li>
        <li>Monitoring system usage</li>
        <li>Managing other administrative functions</li>
      </ul>
      <p>If you have any questions, please contact the system administrator.</p>
      <p>Best regards,<br>The Quizly Team</p>
    </div>
  `;

  const text = `
    Welcome to Quizly Admin!

    Hello ${fullName},

    An administrator has created an admin account for you on the Quizly platform.

    Here are your login details:
    - Email: ${to}
    - Initial Password: ${password}

    As an administrator on Quizly, you have full access to manage the platform, including:
    - Creating and managing teacher accounts
    - Managing student accounts
    - Creating subjects
    - Monitoring system usage
    - Managing other administrative functions

    If you have any questions, please contact the system administrator.

    Best regards,
    The Quizly Team
  `;

  return sendEmail(to, subject, html, text);
};
