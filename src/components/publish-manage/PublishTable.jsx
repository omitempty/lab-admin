import React from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
export default function PublishTable(props) {
  const columns = [
    {
      title: "报告标题",
      render: (item) => (
        <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
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
      render: (item) => props.button(item),
    },
  ];

  return (
    <Table
      columns={columns}
      pagination={{
        pageSize: 10,
      }}
      scroll={{ y: "650px" }}
      rowKey={(item) => item.id}
      dataSource={props.dataSource}
    ></Table>
  );
}
