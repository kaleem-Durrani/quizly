import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

/**
 * 404 Not Found page component
 * Displayed when a route doesn't exist
 */
const NotFound: React.FC = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link to={ROUTES.HOME}>
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
};

export default NotFound;
