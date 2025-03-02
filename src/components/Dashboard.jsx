import React, { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import api from '../api';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setDashboardData(res.data))
      .catch(err => console.error(err));

    api.get('/dashboard/visualizations')
      .then(res => {
        const { clients_by_plan, weight_trend } = res.data;
        setChartData({ clients_by_plan, weight_trend });
      })
      .catch(err => console.error(err));
  }, []);

  const pieData = {
    labels: ['One-One', 'Nutrition'],
    datasets: [
      {
        data: chartData ? [chartData.clients_by_plan.one_one, chartData.clients_by_plan.nutrition] : [0, 0],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const lineData = {
    labels: chartData ? chartData.weight_trend.map(item => item.date) : [],
    datasets: [
      {
        label: 'Weight Trend',
        data: chartData ? chartData.weight_trend.map(item => item.weight) : [],
        fill: false,
        borderColor: '#742774'
      }
    ]
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {dashboardData ? (
        <div className="row">
          <div className="col-md-4">
            <div className="card text-white bg-primary mb-3">
              <div className="card-header">Total Clients</div>
              <div className="card-body">
                <h5 className="card-title">{dashboardData.client_count}</h5>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-warning mb-3">
              <div className="card-header">Expiring Clients (Next 2 weeks)</div>
              <div className="card-body">
                <h5 className="card-title">{dashboardData.expiring_clients}</h5>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-header">Visualizations</div>
              <div className="card-body">
                {chartData ? (
                  <>
                    <h5>Clients by Plan Type</h5>
                    <Pie data={pieData} />
                    <h5 className="mt-4">Overall Weight Trend</h5>
                    <Line data={lineData} />
                  </>
                ) : (
                  <p>Loading charts...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading dashboard data...</p>
      )}
    </div>
  );
};

export default Dashboard;
