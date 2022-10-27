import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Input, Select, message, notification } from "antd";
import axios from "axios";

export default function Unpublished() {
  let user = JSON.parse(localStorage.getItem("token"));
  const [refresh, setRefresh] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    ref.current.setFieldsValue(user);
  }, [refresh]);

  const handleUpdate = (values) => {
    const url = `/users/${user.id}`;
    axios
      .patch(url, { ...values })
      .then((res) => {
        user = { ...user, ...values };
        localStorage.setItem("token", JSON.stringify(user));
        setRefresh(!refresh);
        notification.info({
          message: "通知",
          description: "个人信息修改成功",
          placement: "bottomRight",
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <div style={{ width: "60%", margin: "0 auto" }}>
      <Form ref={ref} layout="vertical" onFinish={handleUpdate}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="地址"
          rules={[{ required: true, message: "请输入地址" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="telephone"
          label="联系方式"
          rules={[{ required: true, message: "请输入联系方式" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ required: true, message: "请输入邮箱" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={["profile"]} label="个人简介">
          <Input.TextArea showCount defaultValue={user.profile} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
