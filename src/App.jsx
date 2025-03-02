import React from 'react';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientsTable from './components/ClientsTable';
import ClientDetails from './components/ClientDetails';
import AddClientForm from './components/AddClientForm';
import { Routes, Route } from 'react-router-dom';

const { Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<ClientsTable />} />
              <Route path="/clients/:id" element={<ClientDetails />} />
              <Route path="/add-client" element={<AddClientForm />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
