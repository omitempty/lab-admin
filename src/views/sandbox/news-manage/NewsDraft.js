import { useEffect, useState } from "react";
import { Table, Button, Modal, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { confirm } = Modal;

export default function NewsDraft() {
  const [loading, setLoading] = useState(true);
  const [newsList, setNewsList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("token"));

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => <b>{id}</b>,
    },
    {
      title: "报告标题",
      // dataIndex: "title",
      render: (news) => (
        <Link to={`/news-manage/preview/${news.id}`}>{news.title}</Link>
      ),
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "报告分类",
      dataIndex: "category",
      render: (category) => category.title,
    },
    {
      title: "操作",
      render: (news) => (
        <div>
          <Button
            type="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(news)}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              navigate(`/news-manage/update/${news.id}`);
            }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<UploadOutlined />}
            onClick={() => handleCheck(news)}
          />
        </div>
      ),
    },
  ];

  // 需要强制触发重新渲染或者替换list，kerwin好像没展示这步？
  // kerwin的逻辑是提交审核之后跳转到审核列表，所以没有重新渲染的必要
  // 现在我们的网站存在的问题是每次跳转都要重新发送axios请求，效率有点低
  const handleCheck = (news) => {
    const url = `/news/${news.id}`;
    console.log(url);
    axios
      .patch(url, {
        auditState: 1,
      })
      .then(() => {
        navigate("/audit-manage/list");
        notification.info({
          message: "提示",
          description: "您可以到审核列表中查看您的报告",
          placement: "bottomRight",
        });
      })
      .catch((error) => {
        console.log(error);
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

  const handleDelete = (item) => {
    console.log(item);
    setLoading(true);
    const url = `http://localhost:5000/news/${item.id}`;
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

  useEffect(() => {
    // 后端没有给userId，这里暂时只能用author做过滤
    // 不能依赖于局部变量，每次渲染都会造成局部变量引用变化，再次引发渲染
    axios
      .get(`/news?auditState=0&author=${user.username}&_expand=category`)
      .then((res) => {
        console.log(res.data);
        setNewsList(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [refresh]);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={newsList}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 10 }}
        scroll={{ y: "650px" }}
        loading={loading}
      />
    </div>
  );
}
