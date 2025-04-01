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
            .then(response => response.json())
            .then((data: User) => setUser(data))
            .catch(error => console.error("Error fetching user data:", error))
    }, []);

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sidebar/>
            <Layout>
                <TopBar/>
                <Content style={{margin: "20px", display: "flex", justifyContent: "center"}}>
                    {user?.error ? (
                        <Title>User not authenticated</Title>
                    ) : (
                        <div className="profile-container">
                            <div className="profile-header">
                                <Avatar
                                    src={user ? "/api/users/profile-picture" : undefined}
                                    size={80}
                                />
                                <Title level={4}>{user?.name} {user?.lastName}</Title>
                            </div>

                            <Card className="profile-card">
                                <Space direction="vertical" size="large" style={{width: '100%'}}>
                                    <div className="profile-detail">
                                        <Text className="profile-label">Email:</Text>
                                        <Text>{user?.email}</Text>
                                    </div>

                                    <div className="profile-detail">
                                        <Text className="profile-label">English level:</Text>
                                        <Text>{user?.englishLevel || "Not set"}</Text>
                                    </div>

                                    <div className="profile-detail">
                                        <Text className="profile-label">Movies started:</Text>
                                        <Text>{user?.moviesStarted || 0}</Text>
                                    </div>

                                    <Button
                                        className="update-profile-btn"
                                        onClick={() => navigate("/account/update")}
                                        icon={<EditOutlined/>}
                                    >
                                        Update Profile
                                    </Button>
                                </Space>
                            </Card>
                        </div>
                    )}
                </Content>
                <FooterBar/>
            </Layout>
        </Layout>
    );
};

export default AccountPage;