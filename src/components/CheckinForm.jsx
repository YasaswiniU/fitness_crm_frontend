import React from 'react';
import { Form, InputNumber, Input, Button, Row, Col, DatePicker, message } from 'antd';
import axios from 'axios';

const CheckinForm = ({ clientId, onAdd }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // Format date as YYYY-MM-DD
    if(values.date) {
      values.date = values.date.format('YYYY-MM-DD');
    }
    axios.post(`http://127.0.0.1:8000/checkins/${clientId}`, values)
      .then(res => {
        message.success('Check-in added!');
        form.resetFields();
        onAdd();
      })
      .catch(err => {
        console.error(err);
        message.error('Error adding check-in');
      });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select a date' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Weight" name="weight" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} step={0.1} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Chest" name="chest" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} step={0.1} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Left Arm" name="left_arm" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} step={0.1} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Right Arm" name="right_arm" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} step={0.1} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Waist" name="waist" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} step={0.1} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Left Thigh" name="left_thigh" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} step={0.1} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Right Thigh" name="right_thigh" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} step={0.1} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Hips" name="hips" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} step={0.1} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Avg Step Count" name="avg_step_count" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} step={1} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Remarks" name="remarks" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Add Check-in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CheckinForm;
