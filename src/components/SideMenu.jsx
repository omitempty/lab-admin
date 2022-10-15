import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/SideMenu.scss";
//antd
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useSelector } from "react-redux";
const { Sider } = Layout;

function getFirstPath(url) {
  let index = url.indexOf("/", 1);
  if (index === -1) {
    return url;
  } else {
    return url.slice(0, index);
  }
}

export default function SideMenu() {
  const collapsed = useSelector((state) => state.collapsed.value);
  const [rights, setRights] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const getItems = (data) => {
      return data
        .filter(
          (item) => item.pagepermisson && user.role.rights.includes(item.key)
        )
        .map((item) => {
          let res = {
            key: item.key,
            icon: <UserOutlined />,
            label: item.title,
            onClick: (e) => {
              navigate(e.key);
            },
          };
          if (item.children?.length > 0) {
            res.children = getItems(item.children);
          }
          return res;
        });
    };
    axios
      .get("http://localhost:5000/rights?_embed=children")
      .then((res) => {
        setRights(getItems(res.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo">{collapsed ? "实验室" : "实验室网站"}</div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={collapsed ? [] : [getFirstPath(location.pathname)]}
        items={rights}
      />
    </Sider>
  );
}
