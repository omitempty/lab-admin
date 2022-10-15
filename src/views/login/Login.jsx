import React from "react";
import { Form, Input, Button, message } from "antd";
import style from "../login/Login.module.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const onFinish = (values) => {
    const url = `http://localhost:5000/users?_expand=role&username=${values.username}&password=${values.password}&roleState=true`;
    axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        if (res.data.length > 0) {
          localStorage.setItem("token", JSON.stringify(res.data[0]));
          navigate("/home");
        } else {
          message.error("用户名或密码错误");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className={style.loginContainer}>
      <div className={style.formContainer}>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onFinish}
          autoComplete="on"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: "请输入用户名",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
