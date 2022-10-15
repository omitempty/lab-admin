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

  // 临时解决方案
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
      onFilter: (value, record) => {
        console.log(value);
        return value === record.region;
      },
      filters: [
        ...regions.map((region) => ({
          text: region.title,
          value: region.value,
        })),
        {
          text: "全球",
          value: "全球",
        },
      ],
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

  // form适合做非受控组件，我们用ref拿值，由于嵌套了一层组件，所以需要forwardRef
  const handleAddUser = () => {
    addFormRef.current
      .validateFields()
      .then((form) => {
        setOpenAddForm(false);
        // setDisableRegion(false);
        addFormRef.current.resetFields();
        return axios.post("http://localhost:5000/users", {
          ...form,
          roleState: true,
          default: form.roleId === 1 ? true : false,
        });
      })
      .then((res) => {
        // 直接强行重新渲染users
        setRefresh(!refresh);
      })
      .catch((error) => console.log(error));
  };

  // 只能拿到event没什么用
  const handleUpdateUser = () => {
    updateFormRef.current
      .validateFields()
      .then((form) => {
        setOpenUpdateForm(false);
        console.log(form);
        // 因为form里没有currentUser的id, 所以我们需要一个currentUser来获得id
        return axios.patch(`http://localhost:5000/users/${currentUser.id}`, {
          ...form,
        });
      })
      .then((res) => {
        // 直接强行重新渲染users
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
          setUsers([
            ...res.data.filter(
              (item) => item.roleId > user.roleId && item.region === user.region
            ),
            user,
          ]);
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
      {/* 把Modal再封装进去也没什么好处的感觉，反正状态都得传，函数也要写 */}
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
      {/* 渲染两套组件的方案业务逻辑分得比较开，多渲染一个form也不是多大开销 */}
      <Modal
        open={openUpdateForm}
        title="修改用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setOpenUpdateForm(false);
          // setDisableRegion(false);
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
