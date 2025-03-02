import React from 'react';
import { Form, InputNumber, Input, Button, Row, Col, message } from 'antd';
import axios from 'axios';

const CheckinForm = ({ clientId, onAdd }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    axios.post(`http://localhost:8000/checkins/${clientId}`, values)
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
        {['weight', 'chest', 'left_arm', 'right_arm', 'waist', 'left_thigh', 'right_thigh', 'neck', 'shoulder'].map(field => (
          <Col span={8} key={field}>
            <Form.Item label={field.replace('_', ' ')} name={field} rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} step={0.1} />
            </Form.Item>
          </Col>
        ))}
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
