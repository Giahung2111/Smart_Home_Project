import React, { useEffect, useState } from "react";
import { Layout, Menu, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MenuItem } from "./menuItems/MenuItem";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";


const { Header, Content, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState("Dashboard");

  useEffect(() => {
    const findPath = MenuItem.find((item) => item.path === location.pathname);

    if (findPath) {
      setActiveKey(findPath.key);
    }
  }, [location.pathname]);

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        style={{
          minHeight: "100vh",
          height: "100vh",
        }}
      >
        <div className="user-info flex items-center justify-start text-white gap-[10px] my-5 mx-2">
          <div className="px-2 py-1 rounded-lg bg-secondary font-bold text-lg">
            JD
          </div>
          <div>JOHN DOE</div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          items={MenuItem.map((item) => {
            return {
              ...item,
              onClick: () => {
                navigate(item.path);
              },
            };
          })}
          className="admin-menu"
        />
        <div className="user-info flex items-start justify-center rounded-xl  bg-tertiary gap-[10px] my-5 mx-2">
          <div className="px-2 py-1 my-2 text-white rounded-full bg-secondary font-bold text-lg ">
            JD
          </div>
          <div className="my-2">
            JOHN DOE
            <p className="text-sm font-thin">Admin</p>
          </div>
        </div>
      </Sider>
      <Layout style={{ paddingBottom: "20px" }}>
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              height: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
