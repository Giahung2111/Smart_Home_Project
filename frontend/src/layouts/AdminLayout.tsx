import React, { useEffect, useState } from "react";
import { Layout, Menu, theme, Avatar } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import { getShortenName } from "../utils/util";
import { LayoutMenuConstant } from "../constants/LayoutConstants";

const { Content, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState("Dashboard");
  const userDataString = localStorage.getItem('user');
  const userData = userDataString ? JSON.parse(userDataString) : null;

  useEffect(() => {
    if(!userData) {
      navigate('/login');
    }

    const findPath = LayoutMenuConstant.find((item) => item.path === location.pathname);

    if (findPath) {
      setActiveKey(findPath.key);
    }
  }, [userData, navigate, location.pathname]);

  if(!userData) {
    return null;
  }
  
  return (
    <Layout style={{ backgroundColor: 'var(--background-color)' }}>
      <Sider
        theme="light"
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
          backgroundColor: 'var(--sidebar-bg-color)',
          color: 'var(--text-color)'
        }}
      >
        <div className="user-info flex items-center justify-start text-black gap-[10px] my-5 mx-2 
        bg-white p-2 rounded-lg shadow-md border border-gray-100"
          style={{
            backgroundColor: 'var(--card-bg-color)',
            color: 'var(--text-color)',
            borderColor: 'var(--border-color)'
          }}
        >
          <Avatar 
            shape="square"
            style={{backgroundColor: userData.avatar}}>
            {getShortenName(userData.username)}
          </Avatar>
          <div>{userData.username.toUpperCase()}</div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={LayoutMenuConstant.map((item) => {
            return {
              ...item,
              onClick: () => {
                navigate(item.path);
              },
            };
          })}
          className="admin-menu"
          style={{
            backgroundColor: 'var(--sidebar-bg-color)',
            color: 'var(--text-color)'
          }}
        />
        <div className="user-info flex items-center justify-start text-black gap-[10px] my-5 mx-2
        bg-white p-2 rounded-lg shadow-md border border-gray-100"
          style={{
            backgroundColor: 'var(--card-bg-color)',
            color: 'var(--text-color)',
            borderColor: 'var(--border-color)'
          }}
        >
          <Avatar 
            shape="circle"
            style={{backgroundColor: userData.avatar}}>
            {getShortenName(userData.username)}
          </Avatar>
          <div className="my-2">
            {userData.username.toUpperCase()}
            <p className="text-sm font-thin">{userData.role.toUpperCase()}</p>
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
              backgroundColor: 'var(--card-bg-color)',
              color: 'var(--text-color)',
              boxShadow: '0 1px 3px var(--shadow-color)'
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
