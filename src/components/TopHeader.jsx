import React from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Avatar } from "antd";
import { Layout } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reverse } from "../redux/collapsedSlice";
const { Header } = Layout;

function TopHeader(props) {
  const collapsed = useSelector((state) => state.collapsed.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("token"));

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: user.role.roleName,
        },
        {
          key: "2",
          danger: true,
          label: "退出",
          onClick: (item) => {
            console.log(item);
            localStorage.removeItem("token");
            navigate("/login");
          },
        },
      ]}
    />
  );
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: "0 14px",
      }}
    >
      {}
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: () => dispatch(reverse()),
      })}

      <div style={{ float: "right" }}>
        <span style={{ marginRight: "10px" }}>
          欢迎
          <span style={{ color: "#1890ff", padding: "0 3px" }}>
            {user.username}
          </span>
          回来
        </span>
        <Dropdown overlay={menu}>
          <Avatar size="large" src={user.avatar} />
        </Dropdown>
      </div>
    </Header>
  );
}

export default TopHeader;
