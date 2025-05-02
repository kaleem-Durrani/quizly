import { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Avatar, Breadcrumb } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  FileOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';

const { Header, Sider, Content, Footer } = Layout;

/**
 * Main application layout with sidebar navigation
 * Used for authenticated pages
 */
const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Toggle sidebar collapse
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  // Get menu items based on user role
  const getMenuItems = () => {
    if (user?.role === 'admin') {
      return [
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: <Link to={ROUTES.ADMIN.DASHBOARD}>Dashboard</Link>,
        },
        {
          key: 'teachers',
          icon: <TeamOutlined />,
          label: <Link to={ROUTES.ADMIN.TEACHERS}>Teachers</Link>,
        },
        {
          key: 'students',
          icon: <TeamOutlined />,
          label: <Link to={ROUTES.ADMIN.STUDENTS}>Students</Link>,
        },
        {
          key: 'subjects',
          icon: <BookOutlined />,
          label: <Link to={ROUTES.ADMIN.SUBJECTS}>Subjects</Link>,
        },
      ];
    } else if (user?.role === 'teacher') {
      return [
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: <Link to={ROUTES.TEACHER.DASHBOARD}>Dashboard</Link>,
        },
        {
          key: 'classes',
          icon: <TeamOutlined />,
          label: <Link to={ROUTES.TEACHER.CLASSES}>Classes</Link>,
        },
        {
          key: 'quizzes',
          icon: <FileOutlined />,
          label: <Link to={ROUTES.TEACHER.QUIZZES}>Quizzes</Link>,
        },
      ];
    } else {
      // Student menu
      return [
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: <Link to={ROUTES.STUDENT.DASHBOARD}>Dashboard</Link>,
        },
        {
          key: 'classes',
          icon: <TeamOutlined />,
          label: <Link to={ROUTES.STUDENT.CLASSES}>Classes</Link>,
        },
        {
          key: 'quizzes',
          icon: <FileOutlined />,
          label: <Link to={ROUTES.STUDENT.QUIZZES}>Quizzes</Link>,
        },
      ];
    }
  };

  // User dropdown menu
  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile',
        onClick: () => {
          if (user?.role === 'admin') {
            navigate(ROUTES.ADMIN.PROFILE);
          } else if (user?.role === 'teacher') {
            navigate(ROUTES.TEACHER.PROFILE);
          } else {
            navigate(ROUTES.STUDENT.PROFILE);
          }
        },
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Logo */}
        <div className="logo p-4 h-16 flex items-center justify-center">
          <h1 className="text-xl font-bold text-blue-600">
            {collapsed ? 'Q' : 'Quizly'}
          </h1>
        </div>
        
        {/* Navigation Menu */}
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={getMenuItems()}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}>
        {/* Header */}
        <Header className="bg-white p-0 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              className="w-16 h-16"
            />
            <Breadcrumb className="ml-4">
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          
          {/* User dropdown */}
          <div className="mr-6">
            <Dropdown menu={userMenu} placement="bottomRight">
              <div className="flex items-center cursor-pointer">
                <Avatar icon={<UserOutlined />} />
                <span className="ml-2">{user?.firstName} {user?.lastName}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        {/* Main content */}
        <Content className="m-6 p-6 bg-white rounded-lg">
          <Outlet />
        </Content>
        
        {/* Footer */}
        <Footer className="text-center">
          Quizly ©{new Date().getFullYear()} Created by Your Name
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

/* 
NOTE: This is a placeholder implementation using Ant Design components.
You'll need to customize it with your actual design and navigation structure.

Consider:
- Updating the logo and branding
- Adjusting the color scheme
- Adding role-specific navigation items
- Implementing active route highlighting
- Adding notifications or other header elements
*/
