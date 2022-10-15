import { Button } from "antd";
import React from "react";
import PublishTable from "../../../components/publish-manage/PublishTable";
import usePublish from "../../../components/publish-manage/usePublish";

export default function Sunset() {
  const { dataSource, handleDelete } = usePublish(3);
  return (
    <PublishTable
      dataSource={dataSource}
      button={(item) => (
        <Button type="danger" onClick={() => handleDelete(item)}>
          删除
        </Button>
      )}
    ></PublishTable>
  );
}
