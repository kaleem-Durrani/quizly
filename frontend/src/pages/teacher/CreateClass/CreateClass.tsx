import React, { useState } from 'react';
import { Typography, Card, Form, Input, Button, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const { Title } = Typography;
const { TextArea } = Input;

/**
 * Teacher Create Class page component
 * Form for creating a new class
 */
const CreateClass: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [classId, setClassId] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Handle form submission
   * @param values Form values
   */
  const onFinish = async (values: {
    name: string;
    description?: string;
  }) => {
    setLoading(true);
    try {
      // API call would go here
      // const response = await createClass(values);
      
      // Simulate API response
      setClassId('class123');
      setSuccess(true);
    } catch (error) {
      console.error('Error creating class:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(ROUTES.TEACHER.CLASSES)}
          className="mr-4"
        >
          Back to Classes
        </Button>
        <Title level={2} className="m-0">Create Class</Title>
      </div>
      
      <Card>
        {success ? (
          <div>
            <Alert
              type="success"
              message="Class Created Successfully"
              description="Your new class has been created. You can now add quizzes and share the join code with your students."
              showIcon
              className="mb-4"
            />
            
            <div className="flex space-x-4">
              <Button onClick={() => {
                setSuccess(false);
                form.resetFields();
              }}>
                Create Another Class
              </Button>
              <Button 
                type="primary" 
                onClick={() => navigate(`${ROUTES.TEACHER.CLASSES}/${classId}`)}
              >
                View Class
              </Button>
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              label="Class Name"
              rules={[{ required: true, message: 'Please enter a class name' }]}
            >
              <Input placeholder="e.g., Mathematics 101" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="Description (Optional)"
            >
              <TextArea 
                placeholder="Enter a description for this class" 
                rows={4}
              />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Class
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default CreateClass;
