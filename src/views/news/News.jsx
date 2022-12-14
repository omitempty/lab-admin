import React, { useState, useEffect } from "react";
import { Card, Col, List, Row, PageHeader } from "antd";
import { Link } from "react-router-dom";
import _ from "lodash";
import axios from "axios";

export default function News() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const url = `/news?publishState=2&_expand=category`;
    axios
      .get(url)
      .then((res) => {
        const group = _.groupBy(res.data, (item) => item.category.title);

        let list = [];
        for (let i in group) {
          if (group[i].length > 0) {
            list.push({
              name: i,
              value: group[i],
            });
          }
        }
        setNewsList(list);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div
      style={{
        width: "95%",
        margin: "0 auto",
      }}
    >
      <PageHeader
        className="site-page-header"
        title="全球大报告"
        subTitle="查看报告"
      />
      ,
      <div className="site-card-wrapper">
        <Row gutter={[16, 16]}>
          {newsList.map((item) => {
            return (
              <Col span={8} key={item.name}>
                <Card title={item.name} bordered hoverable>
                  <List
                    size="small"
                    dataSource={item.value}
                    pagination={{
                      pageSize: 2,
                    }}
                    rowKey={(item) => item.id}
                    renderItem={(item) => (
                      <List.Item>
                        <Link to={`/detail/${item.id}`}>{item.title}</Link>
                      </List.Item>
                    )}
                  ></List>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
