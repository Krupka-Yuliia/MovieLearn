import React from "react";
import { Layout, Menu, Button, Typography } from "antd";
import { UserOutlined, LogoutOutlined, HomeOutlined, VideoCameraOutlined } from "@ant-design/icons";
import "./Layout.css";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        {
            key: '/home',
            icon: <HomeOutlined />,
            label: 'Home',
            onClick: () => navigate('/home'),
        },
        {
            key: '/movies',
            icon: <VideoCameraOutlined />,
            label: 'Movies List',
            onClick: () => navigate('/movies'),
        },
        {
            key: '/account',
            icon: <UserOutlined />,
            label: 'Account',
            onClick: () => navigate('/account'),
        },
    ];

    const handleLogout = () => {
        window.location.href = "http://localhost:8080/logout";
    };

    return (
        <Sider className="sidebar" width={200}>
            <div className="sidebar-content">
                <div className="sidebar-container">
                    <Title level={4} className="sidebar-title">
                        <span className="sidebar-title-movie">Movie</span>
                        <span className="sidebar-title-learn">Learn</span>
                    </Title>
                    <Menu
                        mode="vertical"
                        selectedKeys={[location.pathname]}
                        className="sidebar-menu"
                        items={items}
                    />
                </div>
                <Button
                    type="primary"
                    className="sidebar-logout"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                >
                    Log Out
                </Button>
            </div>
        </Sider>
    );
};

export default Sidebar;
