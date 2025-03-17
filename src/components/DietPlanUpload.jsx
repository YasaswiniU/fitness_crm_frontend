import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const DietPlanUpload = ({ clientId, onUpload }) => {
  const [fileList, setFileList] = useState([]);

  const handleUpload = () => {
    if (fileList.length === 0) {
      message.error('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', fileList[0]);
    axios.post(`http://127.0.0.1:8000/clients/${clientId}/dietplans`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      message.success('Diet/Workout plan uploaded!');
      setFileList([]);
      onUpload();
    })
    .catch(err => {
      console.error(err);
      message.error('Error uploading file');
    });
  };

  const props = {
    onRemove: file => {
      setFileList([]);
    },
    beforeUpload: file => {
      setFileList([file]);
      return false;
    },
    fileList,
    accept: ".pdf,.doc,.docx"
  };

  return (
    <div>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button type="primary" onClick={handleUpload} style={{ marginTop: 16 }}>
        Upload
      </Button>
    </div>
  );
};


export default DietPlanUpload;
