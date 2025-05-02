import React from 'react';
import { Typography, Button, Space } from 'antd';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const { Title, Paragraph } = Typography;

/**
 * Home page component
 * Landing page for the application
 */
const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center max-w-3xl mx-auto">
        <Title>Welcome to Quizly</Title>
        <Paragraph className="text-lg mb-8">
          An interactive platform for creating and taking quizzes
        </Paragraph>
        
        <Space size="large">
          <Button type="primary" size="large">
            <Link to={ROUTES.LOGIN}>Login</Link>
          </Button>
          <Button size="large">
            <Link to={ROUTES.REGISTER}>Register</Link>
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Home;
