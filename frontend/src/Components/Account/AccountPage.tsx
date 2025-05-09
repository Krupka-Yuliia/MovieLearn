import {useEffect, useState} from "react";
import {Layout, Typography, Avatar, Card, Button, Space} from "antd";
import Sidebar from "../Layout/Sidebar";
import TopBar from "../Layout/TopBar";
import FooterBar from "../Layout/Footer";
import "./AccountPage.css";
import "../Layout/Layout.css";
import {useNavigate} from "react-router-dom";
import {EditOutlined} from "@ant-design/icons";
import {message as antMessage} from "antd";

const {Content} = Layout;
const {Title, Text} = Typography;

interface Interest {
    name: string;
}

interface User {
    name?: string;
    lastName?: string;
    email?: string;
    picture?: string;
    englishLevel?: string;
    interests?: Interest[];
    error?: string;
}

const AccountPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [moviesStarted, setMoviesStarted] = useState<number>(0);
    const [customMessage, contextHolder] = antMessage.useMessage();
    const navigate = useNavigate();

    useEffect(() => {
        const successMessage = localStorage.getItem("updateSuccess");
        if (successMessage) {
            customMessage.success(successMessage);
            localStorage.removeItem("updateSuccess");
        }

        fetch("/api/users/account", {credentials: "include"})
            .then((res) => res.json())
            .then((data: User) => setUser(data))
            .catch((error) => console.error("Error fetching user data:", error));

        fetch("/api/movies/count", {credentials: "include"})
            .then((res) => res.json())
            .then((count: number) => {
                setMoviesStarted(count);
            })
            .catch((error) => console.error("Error fetching movie count:", error));
    }, [customMessage]);


    if (user?.error) {
        navigate("/");
        return null;
    }

    return (
        <Layout className="layout">
            {contextHolder}
            <Sidebar/>
            <Layout>
                <TopBar/>
                <Content className="content">
                    <div className="profile-container">
                        <div className="profile-header">
                            <Avatar src="/api/users/profile-picture" size={80}/>
                            <Title level={4}>{`${user?.name || ""} ${user?.lastName || ""}`}</Title>
                        </div>
                        <Card className="profile-card">
                            <Space direction="vertical" size="large" style={{width: "100%"}}>
                                <ProfileDetail label="Email:" value={user?.email || "Not available"}/>
                                <ProfileDetail label="English level:" value={user?.englishLevel || "Not set"}/>
                                <ProfileDetail label="Movies started:" value={moviesStarted || 0}/>


                                <div className="profile-detail">
                                    <Text className="profile-label">Interests:</Text>
                                    <div className="interests-badges">
                                        {user?.interests && user.interests.length > 0 ? (
                                            user.interests.map((interest, index) => (
                                                <span key={index} className="interest-badge">
                          {interest.name}
                        </span>
                                            ))
                                        ) : (
                                            <Text>Not set</Text>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    className="update-profile-btn"
                                    icon={<EditOutlined/>}
                                    onClick={() => navigate("/account/update")}
                                >
                                    Update Profile
                                </Button>
                            </Space>
                        </Card>
                    </div>
                </Content>
                <FooterBar/>
            </Layout>
        </Layout>
    );
};

const ProfileDetail = ({label, value}: { label: string; value: string | number }) => (
    <div className="profile-detail">
        <Text className="profile-label">{label}</Text>
        <Text>{value}</Text>
    </div>
);

export default AccountPage;
