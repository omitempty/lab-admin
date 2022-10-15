import React, { useState, useEffect } from "react";
import { Descriptions, PageHeader } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Info() {
  const [user, setUser] = useState(null);
  const params = useParams();

  useEffect(() => {
    axios
      .get(`/users/${params.id}?_expand=role`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => console.log(error));
  }, [params.id]);

  return (
    <div className="site-page-header-ghost-wrapper">
      {user && (
        <>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={user.username}
            subTitle={user.role.roleName}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="性别">{user.sex}</Descriptions.Item>
              <Descriptions.Item label="地址">{user.address}</Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {user.telephone}
              </Descriptions.Item>
              <Descriptions.Item label="电子邮件">
                {user.email}
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              paddingLeft: "20px",
              gap: "50px",
            }}
          >
            <div>
              <h2>个人头像</h2>
              <img src={user.avatar} alt="avatar" style={{ width: "150px" }} />
            </div>
            <div style={{ width: "60%" }}>
              <h2>个人简介</h2>
              <p
                style={{
                  border: "2px solid lightgray",
                  borderRadius: "5px",
                  fontSize: "17px",
                  padding: "20px",
                }}
              >
                {user.profile}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
