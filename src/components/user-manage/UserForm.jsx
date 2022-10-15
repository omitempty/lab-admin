import React, { forwardRef } from "react";
import { Form, Input, Select } from "antd";
const { Option } = Select;

const UserForm = forwardRef((props, ref) => {
  const { disableRegion, setDisableRegion } = props;
  const user = JSON.parse(localStorage.getItem("token"));

  return (
    <Form ref={ref} layout="vertical">
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
        name="roleId"
        label="角色"
        rules={[{ required: true, message: "请选择角色" }]}
      >
        <Select
        >
          {props.roles
            .filter((role) => user.roleId === 1 || role.roleType > user.roleId)
            .map((role) => (
              <Option value={role.id} key={role.id}>
                {role.roleName}
              </Option>
            ))}
        </Select>
      </Form.Item>
    </Form>
  );
});

export default UserForm;
