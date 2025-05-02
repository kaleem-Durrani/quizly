import React from 'react';
import { Result, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * 403 Forbidden page component
 * Displayed when a user doesn't have permission to access a resource
 */
const Forbidden: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // Determine dashboard route based on user role
  const getDashboardRoute = () => {
    if (!user) return ROUTES.HOME;
    
    switch (user.role) {
      case 'admin':
        return ROUTES.ADMIN.DASHBOARD;
      case 'teacher':
        return ROUTES.TEACHER.DASHBOARD;
      case 'student':
        return ROUTES.STUDENT.DASHBOARD;
      default:
        return ROUTES.HOME;
    }
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you don't have permission to access this page."
      extra={[
        <Button key="back" onClick={handleGoBack}>
          Go Back
        </Button>,
        <Link key="dashboard" to={getDashboardRoute()}>
          <Button type="primary">Go to Dashboard</Button>
        </Link>
      ]}
    />
  );
};

export default Forbidden;
