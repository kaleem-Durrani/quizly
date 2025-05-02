import React, { useState } from 'react';
import { Typography, Table, Button, Input, Space, Card, Modal, Form, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { confirm } = Modal;

/**
 * Admin Subjects page component
 * Displays a list of subjects with management options
 */
const Subjects: React.FC = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);

  // Handle subject creation/editing
  const handleSaveSubject = async (values: { name: string; description?: string }) => {
    setLoading(true);
    try {
      if (editingSubject) {
        // Update existing subject
        // API call would go here
        message.success('Subject updated successfully');
      } else {
        // Create new subject
        // API call would go here
        message.success('Subject created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingSubject(null);
    } catch (error) {
      console.error('Error saving subject:', error);
      message.error('Failed to save subject');
    } finally {
      setLoading(false);
    }
  };

  // Handle subject deletion
  const handleDeleteSubject = (subject: any) => {
    confirm({
      title: 'Delete Subject',
      content: `Are you sure you want to delete the subject "${subject.name}"? This action cannot be undone.`,
      onOk: async () => {
        setLoading(true);
        try {
          // API call would go here
          message.success('Subject deleted successfully');
        } catch (error) {
          console.error('Error deleting subject:', error);
          message.error('Failed to delete subject');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Open modal for editing
  const handleEditSubject = (subject: any) => {
    setEditingSubject(subject);
    form.setFieldsValue({
      name: subject.name,
      description: subject.description,
    });
    setModalVisible(true);
  };

  // Open modal for creating
  const handleAddSubject = () => {
    setEditingSubject(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditSubject(record)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger
            onClick={() => handleDeleteSubject(record)}
          />
        </Space>
      ),
    },
  ];

  // Sample data (will be replaced with API data)
  const data: any[] = [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Subjects</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddSubject}
        >
          Add Subject
        </Button>
      </div>
      
      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search subjects..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>
        
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
        />
      </Card>
      
      {/* Subject Form Modal */}
      <Modal
        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveSubject}
        >
          <Form.Item
            name="name"
            label="Subject Name"
            rules={[{ required: true, message: 'Please enter the subject name' }]}
          >
            <Input placeholder="e.g., Mathematics" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea 
              placeholder="Enter a description for this subject" 
              rows={4}
            />
          </Form.Item>
          
          <div className="flex justify-end">
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingSubject ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Subjects;
