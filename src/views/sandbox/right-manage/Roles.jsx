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
    // 前端更新方法，整个数组更新开销还是不小的？是否可以偷偷更新然后用refresh触发渲染？
    // 前端事实上不太在意内存的拷贝开销，不要盲目套用后端的性能思路
    // setRoles(
    //   roles.map((role) => {
    //     return role.id !== currentRole.id ? role : currentRole;
    //   })
    // );

    // 实验偷偷更新触发重绘，但是感觉应该不行，因为state的引用没变的话react估计根本不会重绘那部分
    // 果然，因为引用没变化，更深的内容直接不比较了，这个跟diff算法有关
    // roles[currentRole.id - 1] = currentRole;
    // setRefresh(!refresh);

    // 偷懒方法，更改后端数据后直接重新重新获取数据
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
      // localhost写成locahost了，还是蛮经常写错的
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
