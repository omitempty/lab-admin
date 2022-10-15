import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import Login from "../views/login/Login";
import Home from "../views/sandbox/home/Home";
import NewsAdd from "../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../views/sandbox/news-manage/NewsCategory";
import NewsSandbox from "../views/sandbox/NewsSandbox";
import Rights from "../views/sandbox/right-manage/Rights";
import Roles from "../views/sandbox/right-manage/Roles";
import Users from "../views/sandbox/user-manage/Users";
import Unpublished from "../views/sandbox/publish-manage/Unpublished";
import Published from "../views/sandbox/publish-manage/Published";
import Sunset from "../views/sandbox/publish-manage/Sunset";
import Audit from "../views/sandbox/audit-manage/Audit";
import AuditList from "../views/sandbox/audit-manage/AuditList";
import NoPermission from "../views/sandbox/no-permission/NoPermission";

import axios from "axios";
import NewsPriview from "../views/sandbox/news-manage/NewsPreview";
import NewsUpdate from "../views/sandbox/news-manage/NewsUpdate";
import Info from "../views/sandbox/informaiton/Info";

const routeMap = {
  "/home": Home,
  "/user-manage/list": Users,
  "/right-manage/role/list": Roles,
  "/right-manage/right/list": Rights,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/news-manage/preview/:id": NewsPriview,
  "/news-manage/update/:id": NewsUpdate,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset,
  "/information/:id": Info,
};

export default function Router() {
  const user = JSON.parse(localStorage.getItem("token"));
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    Promise.all([axios.get("/rights"), axios.get("/children")])
      .then((res) => {
        const data = [...res[0].data, ...res[1].data];
        setRoutes(data);
      })
      .catch((error) => console.log(error));
  }, []);
  const checkPermission = (item) => {
    const index = routes.findIndex((route) => route.key === item);
    return (
      index >= 0 &&
      (routes[index].pagepermisson || routes[index].routepermisson)
    );
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <NewsSandbox />
            </AuthGuard>
          }
        >
          {user &&
            routes.length > 0 &&
            user.role.rights.map((item) => {
              return (
                routeMap[item] &&
                checkPermission(item) && (
                  <Route
                    path={item}
                    key={item}
                    element={React.createElement(routeMap[item])}
                  />
                )
              );
            })}
          {/* <Route path="home" element={<Home />} />
          <Route path="user-manage/list" element={<Users />} />
          <Route path="right-manage/role/list" element={<Roles />} />
          <Route path="right-manage/right/list" element={<Rights />} />
          <Route index element={<Navigate to="home" />} /> */}
          {user && routes.length > 0 && (
            <Route index element={<Navigate to="home" />} />
          )}
          {user && routes.length > 0 && (
            <Route path="*" element={<NoPermission />} />
          )}
        </Route>
      </Routes>
    </HashRouter>
  );
}
