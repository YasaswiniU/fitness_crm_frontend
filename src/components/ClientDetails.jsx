import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, message, Button } from 'antd';
import { Line } from 'react-chartjs-2';
import { AgGridReact } from 'ag-grid-react';
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

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);

  // Fetch client info, check-ins, and diet plan(s) on component mount or when id changes
  useEffect(() => {
    fetchClient();
    fetchCheckins();
    fetchDietPlans();
  }, [id]);

  const fetchClient = () => {
    axios.get(`https://fitness-crm-backend.onrender.com/clients/${id}`)
      .then(res => setClient(res.data))
      .catch(err => {
        console.error(err);
        message.error('Error fetching client details');
      });
  };

  const fetchCheckins = () => {
    axios.get(`https://fitness-crm-backend.onrender.com/checkins/${id}`)
      .then(res => setCheckins(res.data))
      .catch(err => {
        console.error(err);
        message.error('Error fetching check-ins');
      });
  };

  const fetchDietPlans = () => {
    axios.get(`https://fitness-crm-backend.onrender.com/api/uploads/${id}`)
    .then(res => setDietPlans(res.data))
      .catch(err => {
        console.error(err);
        message.error('Error fetching diet plans');
      });
  };

  const onNewCheckin = useCallback(() => fetchCheckins(), [id]);
  const onNewDietPlan = useCallback(() => fetchDietPlans(), [id]);

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

  // AG Grid column definitions for check-ins table
  const checkinColumnDefs = useMemo(() => [
    { headerName: "Date", field: "date", sortable: true, filter: true },
    { headerName: "Weight", field: "weight" },
    { headerName: "Chest", field: "chest" },
    { headerName: "Left Arm", field: "left_arm" },
    { headerName: "Right Arm", field: "right_arm" },
    { headerName: "Waist", field: "waist" },
    { headerName: "Left Thigh", field: "left_thigh" },
    { headerName: "Right Thigh", field: "right_thigh" },
    { headerName: "Neck", field: "neck" },
    { headerName: "Shoulder", field: "shoulder" },
    { headerName: "Remarks", field: "remarks" }
  ], []);

  // Function to open the diet plan file in a new tab/window.
  const openDietPlan = (plan) => {
    // Assumes your backend serves static files from /uploads
    window.open(`https://fitness-crm-backend.onrender.com/uploads/${plan.file_name}`, '_blank');
  };

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
        <div className="ag-theme-alpine" style={{ height: 300, width: '100%', marginTop: 16 }}>
          <AgGridReact
            rowData={checkins}
            columnDefs={checkinColumnDefs}
            domLayout="autoHeight"
          />
        </div>
      </Card>
      <Card title="Weight Trend">
        {checkins.length > 0 ? (
          <Line data={weightChartData} />
        ) : (
          <p>No check-in data available for chart.</p>
        )}
      </Card>
    </div>
  );
};

export default ClientDetails;
