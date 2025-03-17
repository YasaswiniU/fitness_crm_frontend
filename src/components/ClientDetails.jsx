import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, message, Button } from 'antd';
import { Line } from 'react-chartjs-2';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import CheckinForm from './CheckinForm';
import DietPlanUpload from './DietPlanUpload';
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

// Custom tooltip options to show delta
const tooltipCallbacks = {
  callbacks: {
    label: function(context) {
      const index = context.dataIndex;
      const data = context.dataset.data;
      let delta = 0;
      if (index > 0) {
        delta = data[index] - data[index - 1];
      }
      return `${context.dataset.label}: ${context.parsed.y} (Δ: ${delta >= 0 ? '+' : ''}${delta})`;
    }
  }
};

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);

  useEffect(() => {
    fetchClient();
    fetchCheckins();
    fetchDietPlans();
  }, [id]);

  const fetchClient = () => {
    axios.get(`http://127.0.0.1:8000/clients/${id}`)
      .then(res => setClient(res.data))
      .catch(err => {
        console.error(err);
        message.error('Error fetching client details');
      });
  };

  const fetchCheckins = () => {
    axios.get(`http://127.0.0.1:8000/checkins/${id}`)
      .then(res => setCheckins(res.data))
      .catch(err => {
        console.error(err);
        message.error('Error fetching check-ins');
      });
  };

  const fetchDietPlans = () => {
    axios.get(`http://127.0.0.1:8000/api/uploads/${id}`)
      .then(res => setDietPlans(res.data))
      .catch(err => {
        console.error(err);
        message.error('Error fetching diet plans');
      });
  };

  const onNewCheckin = useCallback(() => fetchCheckins(), [id]);
  const onNewDietPlan = useCallback(() => fetchDietPlans(), [id]);

  // Chart data for Weight
  const weightChartData = {
    labels: checkins.map(item => item.date),
    datasets: [
      {
        label: 'Weight',
        data: checkins.map(item => item.weight),
        fill: false,
        tension: 0.1,
        borderColor: 'rgba(75,192,192,1)'
      }
    ]
  };

  // Chart data for Avg Step Count
  const stepChartData = {
    labels: checkins.map(item => item.date),
    datasets: [
      {
        label: 'Avg Step Count',
        data: checkins.map(item => item.avg_step_count),
        fill: false,
        tension: 0.1,
        borderColor: 'rgba(192,75,192,1)'
      }
    ]
  };

  // Helper function to create measurement chart data
  const createMeasurementData = (field, label, color) => ({
    labels: checkins.map(item => item.date),
    datasets: [
      {
        label: label,
        data: checkins.map(item => item[field]),
        fill: false,
        tension: 0.1,
        borderColor: color
      }
    ]
  });

  const chestChartData = createMeasurementData('chest', 'Chest', 'rgba(255,99,132,1)');
  const leftArmChartData = createMeasurementData('left_arm', 'Left Arm', 'rgba(54,162,235,1)');
  const rightArmChartData = createMeasurementData('right_arm', 'Right Arm', 'rgba(255,206,86,1)');
  const waistChartData = createMeasurementData('waist', 'Waist', 'rgba(75,192,192,1)');
  const leftThighChartData = createMeasurementData('left_thigh', 'Left Thigh', 'rgba(153,102,255,1)');
  const rightThighChartData = createMeasurementData('right_thigh', 'Right Thigh', 'rgba(255,159,64,1)');
  const hipsChartData = createMeasurementData('hips', 'Hips', 'rgba(100,150,200,1)');

  // Updated AG Grid column definitions for check-ins table
  const checkinColumnDefs = useMemo(() => [
    { headerName: "Date", field: "date", sortable: true, filter: true },
    { headerName: "Weight", field: "weight" },
    { headerName: "Chest", field: "chest" },
    { headerName: "Left Arm", field: "left_arm" },
    { headerName: "Right Arm", field: "right_arm" },
    { headerName: "Waist", field: "waist" },
    { headerName: "Left Thigh", field: "left_thigh" },
    { headerName: "Right Thigh", field: "right_thigh" },
    { headerName: "Hips", field: "hips" },
    { headerName: "Avg Step Count", field: "avg_step_count" },
    { headerName: "Drop", field: "drop" },
    { headerName: "Total Drop", field: "total_drop" },
    { headerName: "Remarks", field: "remarks" }
  ], []);

  const openDietPlan = (plan) => {
    window.open(`http://127.0.0.1:8000/uploads/${plan.file_name}`, '_blank');
  };

  const onRowClicked = useCallback((event) => {
    const rowData = JSON.stringify(event.data, null, 2);
    navigator.clipboard.writeText(rowData)
      .then(() => message.success("Row data copied to clipboard!"))
      .catch(err => {
        console.error(err);
        message.error("Failed to copy row data");
      });
  }, []);

  return (
    <div>
      <h2>Client Details</h2>
      {client && (
        <Card title={client.name} style={{ marginBottom: 24 }}>
          <p><strong>Email:</strong> {client.email}</p>
          <p><strong>Phone:</strong> {client.phone}</p>
          <p><strong>Plan:</strong> {client.plan_type} - {client.plan_duration} months</p>
          <p><strong>Start Date:</strong> {client.start_date}</p>
          <p><strong>End Date:</strong> {client.end_date}</p>
        </Card>
      )}
      <Card title="Diet/Workout Plan" style={{ marginBottom: 24 }}>
        {dietPlans && dietPlans.length > 0 ? (
          <div>
            <p>
              <strong>Uploaded Plan:</strong> {dietPlans[0].file_name}
            </p>
            <Button type="link" onClick={() => openDietPlan(dietPlans[0])}>
              View Plan
            </Button>
          </div>
        ) : (
          <p>No diet/workout plan uploaded yet.</p>
        )}
        <DietPlanUpload clientId={id} onUpload={onNewDietPlan} />
      </Card>
      <Card title="Weekly Check-ins" style={{ marginBottom: 24 }}>
        <CheckinForm clientId={id} onAdd={onNewCheckin} />
        <div className="ag-theme-balham" style={{ width: '100%', marginTop: 16 }}>
          <AgGridReact
            rowData={checkins}
            columnDefs={checkinColumnDefs}
            domLayout="autoHeight"
            onRowClicked={onRowClicked}
          />
        </div>
      </Card>
      <Card title="Measurement Trends">
        <h3>Weight Trend</h3>
        {checkins.length > 0 ? (
          <Line data={weightChartData} options={tooltipCallbacks} />
        ) : (
          <p>No check-in data available for chart.</p>
        )}
        <h3>Chest Trend</h3>
        {checkins.length > 0 ? (
          <Line data={chestChartData} options={tooltipCallbacks} />
        ) : (
          <p>No check-in data available for chart.</p>
        )}
        <h3>Left Arm Trend</h3>
        {checkins.length > 0 ? (
          <Line data={leftArmChartData} options={tooltipCallbacks} />
        ) : (
          <p>No check-in data available for chart.</p>
        )}
        <h3>Right Arm Trend</h3>
        {checkins.length > 0 ? (
          <Line data={rightArmChartData} options={tooltipCallbacks} />
        ) : (
          <p>No check-in data available for chart.</p>
        )}
        <h3>Waist Trend</h3>
        {checkins.length > 0 ? (
          <Line data={waistChartData} options={tooltipCallbacks} />
        ) : (
          <p>No check-in data available for chart.</p>
        )}
        <h3>Left Thigh Trend</h3>
        {checkins.length > 0 ? (
          <Line data={leftThighChartData} options={tooltipCallbacks} />
        ) : (
          <p>No check-in data available for chart.</p>
        )}
        <h3>Right Thigh Trend</h3>
        {checkins.length > 0 ? (
          <Line data={rightThighChartData} options={tooltipCallbacks} />
        ) : (
          <p>No check-in data available for chart.</p>
        )}
        <h3>Hips Trend</h3>
        {checkins.length > 0 ? (
          <Line data={hipsChartData} options={tooltipCallbacks} />
        ) : (
          <p>No check-in data available for chart.</p>
        )}
        <h3>Avg Step Count Trend</h3>
        {checkins.length > 0 ? (
          <Line data={stepChartData} options={tooltipCallbacks} />
        ) : (
          <p>No check-in data available for chart.</p>
        )}
      </Card>
    </div>
  );
};

export default ClientDetails;
