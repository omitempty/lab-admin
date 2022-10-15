import { useEffect, useState } from "react";
import { Table, Tree, Button, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { confirm } = Modal;

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [rights, setRights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisibal, setIsModalVisibal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const confirmDelete = (item) => {
    confirm({
      title: "是否删除？",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDelete(item);
      },
    });
  };

  const handleDelete = (item) => {
    console.log(item);
    setLoading(true);
    const url = `http://localhost:5000/roles/${item.id}`;
    console.log(url);
    axios
      .delete(url)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (key) => <b>{key}</b>,
    },
    { title: "角色", dataIndex: "roleName" },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => confirmDelete(item)}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentRole(item);
                setIsModalVisibal(true);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleOk = () => {
    setIsModalVisibal(false);
    const url = `http://localhost:5000/roles/${currentRole.id}`;
    axios.patch(url, { rights: currentRole.rights }).catch((error) => {
      console.log(error);
    });
    setRefresh(!refresh);
  };

  const handleCancel = () => {
    setIsModalVisibal(false);
  };

  useEffect(() => {
    setLoading(true);
    const url = `http://localhost:5000/roles`;
    axios
      .get(url)
      .then((res) => {
        setRoles(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

    axios
      .get(`http://localhost:5000/rights?_embed=children`)
      .then((res) => {
        console.log(res.data);
        setRights(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={roles}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 5 }}
        scroll={{ y: "650px" }}
        loading={loading}
      />
      <Modal
        title="编辑角色权限"
        open={isModalVisibal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          treeData={rights}
          checkedKeys={currentRole?.rights}
          onCheck={(checkedKeys) => {
            setCurrentRole({ ...currentRole, rights: checkedKeys });
          }}
        />
      </Modal>
    </div>
  );
}
