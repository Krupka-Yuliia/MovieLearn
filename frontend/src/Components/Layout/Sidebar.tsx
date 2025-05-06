import React, {useState} from "react";
import {Layout, Menu, Button, Typography, Drawer, Grid} from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    HomeOutlined,
    VideoCameraOutlined,
    PlusOutlined,
    MenuOutlined,
    CloseOutlined
} from "@ant-design/icons";
import "./Layout.css";
import {useNavigate, useLocation} from "react-router-dom";
import {useAuth} from "../Auth/AuthContext.tsx";

const {Sider} = Layout;
const {Title} = Typography;
const {useBreakpoint} = Grid;

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = useAuth();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const screens = useBreakpoint();

    const items = [
        {
            key: '/home',
            icon: <HomeOutlined/>,
            label: 'Home',
            onClick: () => navigate('/home'),
        },
        {
            key: '/movies',
            icon: <VideoCameraOutlined/>,
            label: 'Movies List',
            onClick: () => navigate('/movies'),
        },
        {
            key: '/account',
            icon: <UserOutlined/>,
            label: 'Account',
            onClick: () => navigate('/account'),
        },
    ];

    if (user?.role === 'ADMIN') {
        items.push({
            key: '/movies/new',
            icon: <PlusOutlined/>,
            label: 'New Movie',
            onClick: () => navigate('/movies/new'),
        });
        items.push({
            key: '/genres/new',
            icon: <PlusOutlined/>,
            label: 'New Genre',
            onClick: () => navigate('/genres/new'),
        });
        items.push({
            key: '/interests/new',
            icon: <PlusOutlined/>,
            label: 'New Interest',
            onClick: () => navigate('/interests/new'),
        });
    }

    const handleLogout = () => {
        window.location.href = "http://localhost:8080/logout";
    };

    const renderMenu = () => (
        <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={items}
            onClick={() => setDrawerVisible(false)}
        />
    );

    if (!screens.md) {
        return (
            <>
                {!drawerVisible && (
                    <Button
                        type="text"
                        icon={<MenuOutlined/>}
                        onClick={() => setDrawerVisible(true)}
                        className="sidebar-menu-button"
                    />
                )}

                <Drawer
                    placement="left"
                    open={drawerVisible}
                    onClose={() => setDrawerVisible(false)}
                    styles={{
                        body: {padding: 0},
                        mask: {backgroundColor: "rgba(0, 0, 0, 0.5)"}
                    }}
                    closable={false}
                    width={240}
                >
                    <div className="drawer-content">
                        <div className="drawer-main">
                            <div className="drawer-header">
                                <Title level={4} className="sidebar-title">
                                    <span className="sidebar-title-movie">Movie</span>
                                    <span className="sidebar-title-learn">Learn</span>
                                </Title>

                                <Button
                                    type="text"
                                    icon={<CloseOutlined/>}
                                    onClick={() => setDrawerVisible(false)}
                                    className="drawer-close-button"
                                />
                            </div>

                            <div className="drawer-menu-container">
                                {renderMenu()}
                            </div>
                        </div>

                        <Button
                            type="primary"
                            icon={<LogoutOutlined/>}
                            className="sidebar-logout"
                            onClick={handleLogout}
                        >
                            Log Out
                        </Button>
                    </div>
                </Drawer>
            </>
        );
    }

    return (
        <Sider className="sidebar" width={200}>
            <div className="sidebar-content">
                <div className="sidebar-container">
                    <Title level={4} className="sidebar-title">
                        <span className="sidebar-title-movie">Movie</span>
                        <span className="sidebar-title-learn">Learn</span>
                    </Title>
                    {renderMenu()}
                </div>

                <Button
                    type="primary"
                    icon={<LogoutOutlined/>}
                    className="sidebar-logout"
                    onClick={handleLogout}
                >
                    Log Out
                </Button>
            </div>
        </Sider>
    );
};

export default Sidebar;
