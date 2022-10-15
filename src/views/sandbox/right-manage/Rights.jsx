import { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Switch, Popover } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { confirm } = Modal;

export default function Rights() {
  console.log("render");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [render, setRender] = useState(false);
  const handleSwitch = (item) => {
    console.log(item);
    item.pagepermisson = 1 - item.pagepermisson;
    const url = `http://localhost:5000/${
      item.grade === 1 ? "rights" : "children"
    }/${item.id}`;
    axios
      .patch(url, { pagepermisson: item.pagepermisson })
      .then(() => {
        setRender(!render);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (item) => {
    console.log(item);
    setLoading(true);
    const url = `http://localhost:5000/${
      item.grade === 1 ? "rights" : "children"
    }/${item.id}`;
    console.log(url);
    axios
      .delete(url)
      .then(() => {
        setLoading(false);
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const confirmDelete = (item) => {
    confirm({
      title: "是否删除？",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDelete(item);
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (key) => <b>{key}</b>,
    },
    {
      title: "权限名称",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (key) => <Tag color="orange">{key}</Tag>,
    },
    {
      title: "操作",
      render: (item) => {
        console.log(item);
        return (
          <div>
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteOutlined onClick={() => confirmDelete(item)} />}
            />

            <Popover
              content={
                <Switch
                  checked={item.pagepermisson === 1}
                  onClick={() => handleSwitch(item)}
                />
              }
              title="权限配置"
              trigger={item.pagepermisson !== undefined ? "click" : ""}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined}
              />
            </Popover>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    console.log("fetich");
    axios
      .get("http://localhost:5000/rights?_embed=children")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [refresh]);
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 9 }}
      scroll={{ y: "650px" }}
      loading={loading}
    />
  );
}
