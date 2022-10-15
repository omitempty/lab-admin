import React, { useEffect, useState } from "react";
import { Descriptions, PageHeader } from "antd";
import { useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";

const auditList = ["未审核", "审核中", "已通过", "未通过"];
const colors = ["", "orange", "green", "red"];

export default function NewsPreview(props) {
  const [news, setNews] = useState(null);
  const params = useParams();

  useEffect(() => {
    axios
      .get(`/news/${params.id}?_expand=role&_expand=category`)
      .then((res) => {
        setNews(res.data);
      })
      .catch((error) => console.log(error));
  }, [params.id]);

  return (
    <div className="site-page-header-ghost-wrapper">
      {news && (
        <>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={news.title}
            subTitle={news.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {news.author}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {moment(news.createTime).format("YYYY/MM/DD HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="审核时间">
                {news.publishTime
                  ? moment(news.publishTime).format("YYYY/MM/DD HH:mm:ss")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="审核状态">
                <span style={{ color: colors[news.auditState] }}>
                  {auditList[news.auditState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="访问数量">
                {news.view}
              </Descriptions.Item>
              <Descriptions.Item label="点赞数量">
                {news.star}
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div
            dangerouslySetInnerHTML={{ __html: news.content }}
            style={{
              border: "1px solid gray",
              borderRadius: "5px",
              margin: "0px 14px",
              padding: "5px 10px",
            }}
          />
        </>
      )}
    </div>
  );
}
