import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/SideMenu.scss";
//antd
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useSelector } from "react-redux";
const { Sider } = Layout;

// 反复使用的函数可以放在外面，防止被重复定义
function getFirstPath(url) {
  let index = url.indexOf("/", 1);
  if (index === -1) {
    return url;
  } else {
    return url.slice(0, index);
  }
}

export default function SideMenu() {
  // 又改成用redux hook管理状态了，越改越有技术了
  const collapsed = useSelector((state) => state.collapsed.value);
  // const [collapsed, setCollapsed] = useState(false);
  // 这里是最开始写的部分，那时候连state的name都不会改hhh，就是三天前(10.01)
  // const [items, setItems] = useState([]);
  const [rights, setRights] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  // 临时解决方案
  const user = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    // 这个函数不容易啊不容易
    // 注意需要return data.map，不然会是undefined，结果是undefined注意有没有return
    // 递归一开始想不出来可以先写写普通版本再改成递归
    // debug把每步结果console.log出来
    // map似乎没办法忽略元素，filter一遍就好了
    // 用jsx能对每个元素实现更精细的控制
    // 这个函数可能可以用useCallback优化一下
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
              // 最终还是不知道怎么阻止冒泡，但是发现了e.key是不变的
              // console.log(e);
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
        // 在这里处理函数比较好，放在return中处理每次渲染都需要处理一次
        // 其实权限的过滤应该后端来做而不是前端做，但是具体到这种某个操作的实现都不过是业务逻辑的拼接罢了
        // 真正的难点在于整个项目结构的设计
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
        // 每次navigate都会重新渲染组件，因此每次都能拿到最新的path
        // default是非受控属性，因此只会在组件挂载的时候渲染一次，后续collapsed变化是读取不到的
        // 以后可以深入研究下二者的区别，我比较喜欢这种具象的有边界的问题
        defaultOpenKeys={collapsed ? [] : [getFirstPath(location.pathname)]}
        items={rights}
      />
    </Sider>
  );
}
