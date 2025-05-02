import React, { useState, useEffect } from 'react';
import { Typography, Card, Form, Input, Button, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const { Title } = Typography;
const { TextArea } = Input;

/**
 * Teacher Edit Class page component
 * Form for editing an existing class
 */
const EditClass: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchingClass, setFetchingClass] = useState(true);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch class data
  useEffect(() => {
    const fetchClass = async () => {
      try {
        // API call would go here
        // const response = await getClassById(id);
        
        // Simulate API response
        const classData = {
          name: 'Sample Class',
          description: 'This is a sample class description',
        };
        
        form.setFieldsValue(classData);
      } catch (error) {
        console.error('Error fetching class:', error);
      } finally {
        setFetchingClass(false);
      }
    };
    
    fetchClass();
  }, [id, form]);

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
      // const response = await updateClass(id, values);
      
      setSuccess(true);
    } catch (error) {
      console.error('Error updating class:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(`${ROUTES.TEACHER.CLASSES}/${id}`)}
          className="mr-4"
        >
          Back to Class
        </Button>
        <Title level={2} className="m-0">Edit Class</Title>
      </div>
      
      <Card>
        {success ? (
          <div>
            <Alert
              type="success"
              message="Class Updated Successfully"
              description="Your class has been updated successfully."
              showIcon
              className="mb-4"
            />
            
            <Button 
              type="primary" 
              onClick={() => navigate(`${ROUTES.TEACHER.CLASSES}/${id}`)}
            >
              Back to Class
            </Button>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={fetchingClass}
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
                Update Class
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default EditClass;
