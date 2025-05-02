import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

/**
 * 401 Unauthorized page component
 * Displayed when a user is not authenticated
 */
const Unauthorized: React.FC = () => {
  return (
    <Result
      status="403"
      title="401"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Link to={ROUTES.LOGIN}>
          <Button type="primary">Login</Button>
        </Link>
      }
    />
  );
};

export default Unauthorized;
