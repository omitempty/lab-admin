import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Audit() {
  const [newsList, setNewsList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const user = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    let url;
    if (user.roleId === 1) {
      url = `/news?auditState=1&_expand=role&_expand=category`;
    } else {
      url = `/news?auditState=1&_expand=role&_expand=category`;
    }
    console.log(url);
    axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        setNewsList(res.data);
      })
      .catch((error) => console.log(error));
  }, [refresh]);

  const handleAudit = (item, auditState, publishState) => {
    const url = `/news/${item.id}`;
    axios
      .patch(url, {
        auditState,
        publishState,
      })
      .then(() => {
        setRefresh(!refresh);
      })
      .catch((error) => console.log(error));
  };

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
      title: "操作",
      render: (item) => {
        return (
          <>
            <Button type="primary" onClick={() => handleAudit(item, 2, 1)}>
              通过
            </Button>
            <Button type="danger" onClick={() => handleAudit(item, 3, 0)}>
              驳回
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={newsList}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 10 }}
      ></Table>
    </div>
  );
}
