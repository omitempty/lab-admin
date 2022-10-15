import React from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../../components/SideMenu";
import TopHeader from "../../components/TopHeader";
import { LoadingOutlined } from "@ant-design/icons";
import "./NewsSandbox.css";

import { Layout, Spin } from "antd";
import { useSelector } from "react-redux";
const { Content } = Layout;

export default function NewsSandbox() {
  const loading = useSelector((state) => state.loading.value);
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
            spinning={loading}
          >
            <Outlet />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
}
