import React from 'react';
import { Result, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

/**
 * 500 Server Error page component
 * Displayed when a server error occurs
 */
const ServerError: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong on our server."
      extra={[
        <Button key="back" onClick={handleGoBack}>
          Go Back
        </Button>,
        <Button key="refresh" onClick={handleRefresh}>
          Try Again
        </Button>,
        <Link key="home" to={ROUTES.HOME}>
          <Button type="primary">Back Home</Button>
        </Link>
      ]}
    />
  );
};

export default ServerError;
