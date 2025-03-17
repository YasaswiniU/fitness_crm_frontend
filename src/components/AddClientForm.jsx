import React from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddClientForm = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    axios.post('http://127.0.0.1:8000/clients/', {
      ...values,
      start_date: values.start_date.format('YYYY-MM-DD')
    })
    .then(res => {
      message.success('Client added successfully!');
      navigate('/');
    })
    .catch(err => {
      console.error(err);
      message.error('Error adding client');
    });
  };

  return (
    <div>
      <h2>Add New Client</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Initial Weight" name="initial_weight" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} step={0.1} />
        </Form.Item>
        <Form.Item label="Height" name="height" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} step={0.1} />
        </Form.Item>
        <Form.Item label="Age" name="age" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Plan Type" name="plan_type" rules={[{ required: true }]}>
          <Select>
            <Option value="one-one">One-One</Option>
            <Option value="nutrition">Nutrition</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Plan Duration (months)" name="plan_duration" rules={[{ required: true }]}>
          <Select>
            <Option value={3}>3 Months</Option>
            <Option value={6}>6 Months</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Start Date" name="start_date" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Client
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddClientForm;
