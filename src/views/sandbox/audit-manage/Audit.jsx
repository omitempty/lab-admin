import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

// 这是一个管理页面，需要过滤权限，我们是基于角色的权限过滤
// 区域编辑没有这个页面权限，区域管理员只能审核自己和同个区域的文章，超级管理员没有限制

export default function Audit() {
  const [newsList, setNewsList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const user = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    // 根据用户权限的话只有两种情况，区域编辑不能进入这个页面
    // 业务逻辑不用管太多，主要学的是如何构造页面
    let url;
    if (user.roleId === 1) {
      url = `/news?auditState=1&_expand=role&_expand=category`;
    } else {
      url = `/news?region=${user.region}&auditState=1&_expand=role&_expand=category`;
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

  // 这个把两个操作整合到一个函数的方法还是挺骚的
  // 感觉没什么通用性呢，更好的还是弄一个底层，外面暴露更有可读性的接口
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
