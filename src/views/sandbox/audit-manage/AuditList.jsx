import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tag, Table, Button } from "antd";

export default function AuditList() {
  const [newsList, setAuditList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const url = `/news?author=${user.username}&auditState_ne=0&deleteState_le=1&_expand=role&_expand=category`;
    console.log(url);
    axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        setAuditList(res.data);
      })
      .catch((error) => console.log(error));
  }, [refresh]);

  const columns = [
    {
      title: "报告标题",
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
      render: (item) => item.title,
    },
    {
      title: "审核状态",
      dataIndex: "auditState",
      render: (state) => {
        const colors = ["", "orange", "green", "red"];
        const auditList = ["草稿箱", "审核中", "已通过", "未通过"];
        return <Tag color={colors[state]}>{auditList[state]}</Tag>;
      },
    },
    {
      title: "操作",
      render: (item) => {
        const { auditState } = item;
        return (
          <>
            {auditState === 1 && (
              <Button onClick={() => onCancel(item)}>撤销</Button>
            )}
            {auditState === 2 && (
              <Button type="danger" onClick={() => onDelete(item)}>
                删除
              </Button>
            )}
            {auditState === 3 && (
              <Button type="primary" onClick={() => onModify(item)}>
                修改
              </Button>
            )}
          </>
        );
      },
    },
  ];

  const onCancel = (item) => {
    const url = `/news/${item.id}`;
    axios
      .patch(url, {
        auditState: 0,
      })
      .then(() => setRefresh(!refresh))
      .catch((error) => console.log(error));
  };

  const onDelete = (item) => {
    const url = `/news/${item.id}`;
    axios
      .delete(url)
      .then(setRefresh(!refresh))
      .catch((error) => console.log(error));
  };

  const onModify = (item) => {
    const url = `/news-manage/update/${item.id}`;
    navigate(url);
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={newsList}
        pagination={{ pageSize: 10 }}
        rowKey={(item) => item.id}
      ></Table>
    </div>
  );
}
