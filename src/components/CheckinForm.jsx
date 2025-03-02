import React, { useState } from 'react';
import api from '../api';

const CheckinForm = ({ clientId, onAdd }) => {
  const [formData, setFormData] = useState({
    weight: '',
    chest: '',
    left_arm: '',
    right_arm: '',
    waist: '',
    left_thigh: '',
    right_thigh: '',
    neck: '',
    shoulder: '',
    remarks: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post(`/clients/${clientId}/checkins`, formData)
      .then(res => {
        alert('Check-in added!');
        setFormData({
          weight: '',
          chest: '',
          left_arm: '',
          right_arm: '',
          waist: '',
          left_thigh: '',
          right_thigh: '',
          neck: '',
          shoulder: '',
          remarks: ''
        });
        onAdd();
      })
      .catch(err => {
        console.error(err);
        alert('Error adding check-in');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-2">
          <input required type="number" step="0.1" className="form-control" name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} />
        </div>
        {/* Additional input fields for chest, left_arm, etc. */}
        <div className="col-md-4">
          <input required type="text" className="form-control" name="remarks" placeholder="Remarks" value={formData.remarks} onChange={handleChange} />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-3">Add Check-in</button>
    </form>
  );
};

export default CheckinForm;
