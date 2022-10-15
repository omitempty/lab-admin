import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Avatar } from "antd";
import axios from "axios";
import _ from "lodash";
const { Meta } = Card;

export default function Home() {
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("token"));
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/users?_expand=role&_sort=id")
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          {users.length > 0 &&
            users.map((user) => {
              return (
                <Col span={8} key={user.id}>
                  <Card
                    actions={[
                      <p
                        key="ellipsis"
                        onClick={() => {
                          navigate(`/information/${user.id}`);
                        }}
                        style={{ margin: "0" }}
                      >
                        点击查看详情
                      </p>,
                    ]}
                  >
                    <Meta
                      avatar={<Avatar src={user.avatar} />}
                      title={user.username}
                      description={
                        <>
                          <div>
                            <b>{user.address}</b>
                            <span style={{ paddingLeft: "10px" }}>
                              {user.role.roleName}
                            </span>
                          </div>
                          <div>
                            <span>邮箱: {user.email}</span>
                            <span style={{ paddingLeft: "10px" }}>
                              电话: {user.telephone}
                            </span>
                          </div>
                        </>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
        </Row>
      </div>
    </div>
  );
}
