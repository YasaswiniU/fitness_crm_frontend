import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { DashboardOutlined, TeamOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  const selectedKeys = [location.pathname === '/' ? '/dashboard' : location.pathname];

  return (
    <Sider collapsible>
      <div className="logo" style={{ height: 32, margin: 16, color: '#fff', fontSize: 20, textAlign: 'center' }}>
        Fitness CRM
      </div>
      <Menu theme="dark" mode="inline" selectedKeys={selectedKeys}>
        <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/clients" icon={<TeamOutlined />}>
          <Link to="/clients">Clients</Link>
        </Menu.Item>
      </Menu>
      <div style={{ padding: '0 16px', marginTop: 'auto', marginBottom: 16 }}>
        <Link to="/add-client">
          <Button type="primary" icon={<PlusOutlined />} block>
            Add Client
          </Button>
        </Link>
      </div>
    </Sider>
  );
};

export default Sidebar;
