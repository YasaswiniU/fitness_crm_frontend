import React, { useState } from 'react';
import api from '../api';

const DietPlanUpload = ({ clientId, onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    api.post(`/clients/${clientId}/dietplans`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(res => {
      alert('Diet/Workout plan uploaded!');
      setFile(null);
      onUpload();
    })
    .catch(err => {
      console.error(err);
      alert('Error uploading file');
    });
  };

  return (
    <form onSubmit={handleUpload}>
      <div className="mb-3">
        <input required type="file" className="form-control" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
      </div>
      <button type="submit" className="btn btn-secondary">Upload</button>
    </form>
  );
};

export default DietPlanUpload;
