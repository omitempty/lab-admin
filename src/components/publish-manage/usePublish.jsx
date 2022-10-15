import axios from "axios";
import { useState, useEffect } from "react";
import { notification } from "antd";

export default function usePublish(publishState) {
  const [dataSource, setDataSource] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const user = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const url = `/news?publishState=${publishState}&author=${user.username}&_expand=category`;
    axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        setDataSource(res.data);
      })
      .catch((error) => console.log(error));
  }, [refresh]);

  const handlePublish = (item) => {
    const url = `/news/${item.id}`;
    axios
      .patch(url, { publishState: 2 })
      .then(() => {
        setRefresh(!refresh);
        notification.info({
          message: "通知",
          description: "你可以到【个人信息-已发布】中查看您的报告",
          placement: "bottomRight",
        });
      })
      .catch((error) => console.log(error));
  };

  const handleSunset = (item) => {
    const url = `/news/${item.id}`;
    axios
      .patch(url, { publishState: 3 })
      .then(() => {
        setRefresh(!refresh);
        notification.info({
          message: "通知",
          description: "你可以到【个人信息-已发布】中查看您的报告",
          placement: "bottomRight",
        });
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (item) => {
    const url = `/news/${item.id}`;
    axios
      .delete(url)
      .then(() => {
        setRefresh(!refresh);
        notification.info({
          message: "通知",
          description: "删除成功",
          placement: "bottomRight",
        });
      })
      .catch((error) => console.log(error));
  };

  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete,
  };
}
