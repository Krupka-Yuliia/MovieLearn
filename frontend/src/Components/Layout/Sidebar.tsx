import React from "react";
import {Layout, Menu, Button, Typography} from "antd";
import {UserOutlined, LogoutOutlined, HomeOutlined, VideoCameraOutlined} from "@ant-design/icons";
import "./Layout.css";
import {useNavigate} from "react-router-dom";

const {Sider} = Layout;
const {Title} = Typography;

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        window.location.href = "http://localhost:8080/logout";
    };

    return (
        <Sider className="sidebar" width={200}>
            <div className="sidebar-content">
                <div>
                    <Title level={4} className="sidebar-title">
                        <span className="sidebar-title-movie">Movie</span>
                        <span className="sidebar-title-learn">Learn</span>
                    </Title>
                    <Menu mode="vertical" defaultSelectedKeys={["3"]} className="sidebar-menu">
                        <Menu.Item key="1" icon={<HomeOutlined/>}>Home</Menu.Item>
                        <Menu.Item key="2" icon={<VideoCameraOutlined/>}>Movies List</Menu.Item>
                        <Menu.Item key="3" icon={<UserOutlined/>}
                                   onClick={() => navigate("/account")}>Account</Menu.Item>
                    </Menu>
                </div>
                <Button
                    type="primary"
                    className="sidebar-logout"
                    icon={<LogoutOutlined/>}
                    onClick={handleLogout}
                >
                    Log Out
                </Button>
            </div>
        </Sider>
    );
};

export default Sidebar;
