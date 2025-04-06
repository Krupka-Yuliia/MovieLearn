import {useEffect, useState} from "react";
import {Layout, Typography, Avatar, Card, Button, Space} from "antd";
import Sidebar from "../Layout/Sidebar";
import TopBar from "../Layout/TopBar";
import FooterBar from "../Layout/Footer";
import "./AccountPage.css";
import {useNavigate} from "react-router-dom";
import {EditOutlined} from "@ant-design/icons";

const {Content} = Layout;
const {Title, Text} = Typography;

interface User {
    name?: string;
    lastName?: string;
    email?: string;
    picture?: string;
    englishLevel?: string;
    moviesStarted?: number;
    error?: string;
}

const AccountPage = () => {
    const [user, setUser] = useState<User | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/users/account", {credentials: "include"})
            .then((res) => res.json())
            .then((data: User) => setUser(data))
            .catch((error) => console.error("Error fetching user data:", error));
    }, []);

    if (user?.error) {
        return (
            <Layout style={{minHeight: "100vh"}}>
                <Sidebar />
                <Layout>
                    <TopBar />
                    <Content style={{margin: "20px", textAlign: "center"}}>
                        <Title>User not authenticated</Title>
                    </Content>
                    <FooterBar />
                </Layout>
            </Layout>
        );
    }

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sidebar />
            <Layout>
                <TopBar />
                <Content style={{margin: "20px", display: "flex", justifyContent: "center"}}>
                    <div className="profile-container">
                        <div className="profile-header">
                            <Avatar src="/api/users/profile-picture" size={80} />
                            <Title level={4}>{`${user?.name || ""} ${user?.lastName || ""}`}</Title>
                        </div>
                        <Card className="profile-card">
                            <Space direction="vertical" size="large" style={{width: "100%"}}>
                                <ProfileDetail label="Email:" value={user?.email || "Not available"} />
                                <ProfileDetail label="English level:" value={user?.englishLevel || "Not set"} />
                                <ProfileDetail label="Movies started:" value={user?.moviesStarted || 0} />
                                <Button
                                    className="update-profile-btn"
                                    icon={<EditOutlined />}
                                    onClick={() => navigate("/account/update")}
                                >
                                    Update Profile
                                </Button>
                            </Space>
                        </Card>
                    </div>
                </Content>
                <FooterBar />
            </Layout>
        </Layout>
    );
};

const ProfileDetail = ({label, value}: {label: string; value: string | number}) => (
    <div className="profile-detail">
        <Text className="profile-label">{label}</Text>
        <Text>{value}</Text>
    </div>
);

export default AccountPage;
