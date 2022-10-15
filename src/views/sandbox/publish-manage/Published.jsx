import { Button } from "antd";
import React from "react";
import PublishTable from "../../../components/publish-manage/PublishTable";
import usePublish from "../../../components/publish-manage/usePublish";

export default function Published() {
  const { dataSource, handleSunset } = usePublish(2);
  return (
    <PublishTable
      dataSource={dataSource}
      button={(item) => (
        <Button type="danger" onClick={() => handleSunset(item)}>
          下线
        </Button>
      )}
    ></PublishTable>
  );
}
