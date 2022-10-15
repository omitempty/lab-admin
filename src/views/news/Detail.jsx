import React, { useEffect, useState } from "react";
import { Descriptions, PageHeader, Divider } from "antd";
import { useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { LikeTwoTone } from "@ant-design/icons";

export default function Detail() {
  const [news, setNews] = useState(null);
  const [stared, setStared] = useState(false);
  const params = useParams();

  useEffect(() => {
    let data = null;
    axios
      .get(`/news/${params.id}?_expand=role&_expand=category`)
      .then((res) => {
        data = res.data;
        data.view += 1;
        setNews(data);
        return axios.patch(`/news/${params.id}`, {
          view: data.view,
        });
      })
      .then(() => {
        setNews(data);
      })
      .catch((error) => console.log(error));
  }, [params.id]);

  const handleStar = () => {
    const url = `/news/${news.id}`;
    if (!stared) {
      axios
        .patch(url, {
          star: news.star + 1,
        })
        .then(() => {
          setNews({ ...news, star: news.star + 1 });
          setStared(true);
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .patch(url, {
          star: news.star - 1,
        })
        .then(() => {
          setNews({ ...news, star: news.star - 1 });
          setStared(false);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="site-page-header-ghost-wrapper">
      {news && (
        <>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={news.title}
            subTitle={
              <>
                {news.category.title}
                <LikeTwoTone
                  style={{ paddingLeft: "5px" }}
                  twoToneColor={stared ? "#eb2f96" : ""}
                  onClick={() => handleStar()}
                />
              </>
            }
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {news.author}
              </Descriptions.Item>
              <Descriptions.Item label="审核时间">
                {news.publishTime
                  ? moment(news.publishTime).format("YYYY/MM/DD HH:mm:ss")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="区域">{news.region}</Descriptions.Item>
              <Descriptions.Item label="访问数量">
                {news.view}
              </Descriptions.Item>
              <Descriptions.Item label="点赞数量">
                {news.star}
              </Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <Divider orientation="left" />
          <div
            dangerouslySetInnerHTML={{ __html: news.content }}
            style={{
              margin: "0px 14px",
              padding: "5px 10px",
            }}
          />
        </>
      )}
    </div>
  );
}
