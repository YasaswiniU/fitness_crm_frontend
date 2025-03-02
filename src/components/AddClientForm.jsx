import React, { useState } from 'react';
import api from '../api';

const AddClientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    initial_weight: '',
    height: '',
    age: '',
    plan_type: 'one-one',
    plan_duration: 3,
    start_date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/clients', formData)
      .then(res => {
        alert('Client added successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          initial_weight: '',
          height: '',
          age: '',
          plan_type: 'one-one',
          plan_duration: 3,
          start_date: ''
        });
      })
      .catch(err => {
        console.error(err);
        alert('Error adding client');
      });
  };

  return (
    <div>
      <h2>Add New Client</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields here */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input required type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
        </div>
        {/* Other input fields... */}
        <button type="submit" className="btn btn-primary">Add Client</button>
      </form>
    </div>
  );
};

export default AddClientForm;
