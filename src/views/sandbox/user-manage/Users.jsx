import { useEffect, useState, useRef } from "react";
import { Table, Switch, Button, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import UserForm from "../../../components/user-manage/UserForm";
import { flushSync } from "react-dom";
const { confirm } = Modal;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [regions, setRegions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [disableRegion, setDisableRegion] = useState(false);
  const addFormRef = useRef(null);
  const updateFormRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("token"));

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
    const url = `http://localhost:5000/users/${item.id}`;
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

  const handleSwitch = (item) => {
    console.log(item);

    const url = `http://localhost:5000/users/${item.id}`;
    axios
      .patch(url, {
        roleState: !item.roleState,
      })
      .then(() => {
        item.roleState = !item.roleState;
        setUsers([...users]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => <b>{id}</b>,
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: ({ roleName }) => roleName,
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      render: (item) => (
        <Switch
          checked={item.roleState}
          onClick={() => handleSwitch(item)}
          disabled={item.default}
        />
      ),
    },
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
              disabled={item.default}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentUser(item);
                flushSync(() => {
                  setOpenUpdateForm(true);
                });
                updateFormRef.current.setFieldsValue(item);
                if (item.roleId === 1) {
                  setDisableRegion(true);
                } else {
                  setDisableRegion(false);
                }
              }}
              disabled={item.default}
            />
          </div>
        );
      },
    },
  ];

  const handleAddUser = () => {
    addFormRef.current
      .validateFields()
      .then((form) => {
        setOpenAddForm(false);
        addFormRef.current.resetFields();
        return axios.post("http://localhost:5000/users", {
          ...form,
          roleState: true,
          default: form.roleId === 1 ? true : false,
        });
      })
      .then((res) => {
        setRefresh(!refresh);
      })
      .catch((error) => console.log(error));
  };

  const handleUpdateUser = () => {
    updateFormRef.current
      .validateFields()
      .then((form) => {
        setOpenUpdateForm(false);
        console.log(form);
        return axios.patch(`http://localhost:5000/users/${currentUser.id}`, {
          ...form,
        });
      })
      .then((res) => {
        setRefresh(!refresh);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/users?_expand=role")
      .then((res) => {
        if (user.roleId === 1) {
          setUsers(res.data);
        } else if (user.roleId === 2) {
          setUsers([...res.data.filter((item) => item.roleId > user.roleId)]);
        } else {
          console.log("unexpected case", user);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [refresh]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/roles")
      .then((res) => setRoles(res.data))
      .catch((error) => console.log(error));

    axios
      .get("http://localhost:5000/regions")
      .then((res) => setRegions(res.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <Button type="primary" onClick={() => setOpenAddForm(true)}>
        添加用户
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 10 }}
        scroll={{ y: "650px" }}
        loading={loading}
      />
      <Modal
        open={openAddForm}
        title="新增用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => setOpenAddForm(false)}
        onOk={handleAddUser}
      >
        <UserForm
          ref={addFormRef}
          {...{ roles, regions, disableRegion, setDisableRegion }}
        ></UserForm>
      </Modal>
      <Modal
        open={openUpdateForm}
        title="修改用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setOpenUpdateForm(false);
        }}
        onOk={handleUpdateUser}
      >
        <UserForm
          ref={updateFormRef}
          {...{ roles, regions, disableRegion, setDisableRegion }}
        ></UserForm>
      </Modal>
    </div>
  );
}
