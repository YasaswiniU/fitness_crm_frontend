import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import CheckinForm from './CheckinForm';
import DietPlanUpload from './DietPlanUpload';
import api from '../api';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

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
    api.get(`/clients/${id}`)
      .then(res => setClient(res.data))
      .catch(err => console.error(err));
  };

  const fetchCheckins = () => {
    api.get(`/clients/${id}/checkins`)
      .then(res => setCheckins(res.data))
      .catch(err => console.error(err));
  };

  const fetchDietPlans = () => {
    api.get(`/clients/${id}/dietplans`)
      .then(res => setDietPlans(res.data))
      .catch(err => console.error(err));
  };

  const onNewCheckin = () => fetchCheckins();
  const onNewDietPlan = () => fetchDietPlans();

  // Prepare data for weight trend chart from check-ins
  const weightTrendData = {
    labels: checkins.map(c => c.date),
    datasets: [
      {
        label: 'Weight',
        data: checkins.map(c => c.weight),
        fill: false,
        borderColor: '#3e95cd'
      }
    ]
  };

  // Example: waist trend chart
  const waistTrendData = {
    labels: checkins.map(c => c.date),
    datasets: [
      {
        label: 'Waist',
        data: checkins.map(c => c.waist),
        fill: false,
        borderColor: '#8e5ea2'
      }
    ]
  };

  return (
    <div>
      <h2>Client Details</h2>
      {client && (
        <div className="card mb-3">
          <div className="card-header">
            {client.name}
          </div>
          <div className="card-body">
            <p>Email: {client.email}</p>
            <p>Phone: {client.phone}</p>
            <p>Plan: {client.plan_type} - {client.plan_duration} months</p>
            <p>Start Date: {client.start_date}</p>
            <p>End Date: {client.end_date}</p>
          </div>
        </div>
      )}
      <h3>Upload Diet/Workout Plan</h3>
      <DietPlanUpload clientId={id} onUpload={onNewDietPlan} />

      {/* Display uploaded diet/workout plans as clickable links */}
      <h3>Diet/Workout Plans</h3>
      {dietPlans && dietPlans.length > 0 ? (
        <ul>
          {dietPlans.map(plan => (
            <li key={plan.id}>
              <a href={`https://your-backend-url.com/uploads/${plan.file_name}`} target="_blank" rel="noopener noreferrer">
                {plan.file_name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No diet/workout plans uploaded yet.</p>
      )}

      <h3>Weekly Check-ins</h3>
      <CheckinForm clientId={id} onAdd={onNewCheckin} />
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Date</th>
            <th>Weight</th>
            <th>Chest</th>
            <th>Left Arm</th>
            <th>Right Arm</th>
            <th>Waist</th>
            <th>Left Thigh</th>
            <th>Right Thigh</th>
            <th>Neck</th>
            <th>Shoulder</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {checkins.map(checkin => (
            <tr key={checkin.id}>
              <td>{checkin.date}</td>
              <td>{checkin.weight}</td>
              <td>{checkin.chest}</td>
              <td>{checkin.left_arm}</td>
              <td>{checkin.right_arm}</td>
              <td>{checkin.waist}</td>
              <td>{checkin.left_thigh}</td>
              <td>{checkin.right_thigh}</td>
              <td>{checkin.neck}</td>
              <td>{checkin.shoulder}</td>
              <td>{checkin.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <h4>Check-in Trends</h4>
        <div className="row">
          <div className="col-md-6">
            <h5>Weight Trend</h5>
            <Line data={weightTrendData} />
          </div>
          <div className="col-md-6">
            <h5>Waist Trend</h5>
            <Line data={waistTrendData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
