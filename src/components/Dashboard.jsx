import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Statistic, message } from 'antd';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/clients/dashboard')
      .then(res => setDashboardData(res.data))
      .catch(err => {
        console.error(err);
        setError('Error fetching dashboard data');
        message.error('Error fetching dashboard data');
      });

    axios.get('http://localhost:8000/checkins/trends')
      .then(res => setTrendData(res.data))
      .catch(err => console.error(err));
  }, []);

  const chartData = {
    labels: trendData.map(item => item.week),
    datasets: [
      {
        label: 'Average Weight',
        data: trendData.map(item => item.avg_weight),
        fill: false,
        tension: 0.1,
        borderColor: 'rgba(75,192,192,1)'
      }
    ]
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {dashboardData ? (
        <>
          {dashboardData.client_count === 0 ? (
            <p>No clients added yet.</p>
          ) : (
            <>
              <Row gutter={16}>
                <Col span={8}>
                  <Card>
                    <Statistic title="Total Clients" value={dashboardData.client_count} />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic title="Expiring Clients (Next 2 weeks)" value={dashboardData.expiring_clients} />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic title="Total Sales" value={dashboardData.sales?.total_sales || 0} />
                  </Card>
                </Col>
              </Row>
              <Card title="Average Weight Trend" style={{ marginTop: 24 }}>
                {trendData.length > 0 ? (
                  <Line data={chartData} />
                ) : (
                  <p>No chart data available.</p>
                )}
              </Card>
            </>
          )}
        </>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Loading dashboard details...</p>
      )}
    </div>
  );
};

export default Dashboard;
