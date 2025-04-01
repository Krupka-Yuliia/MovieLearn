import {Layout, Typography, Form, Input, Radio, Button, Avatar, message, Card, Space} from "antd";
import Sidebar from "../Layout/Sidebar";
import TopBar from "../Layout/TopBar";
import FooterBar from "../Layout/Footer";
import "./AccountPage.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const {Content} = Layout;
const {Title} = Typography;

const UpdateProfilePage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [user, setUser] = useState<{ name?: string; lastName?: string; englishLevel?: string } | null>(null);

    useEffect(() => {
        axios.get("/api/users/account")
            .then(response => {
                setUser(response.data);
                form.setFieldsValue(response.data);
            })
            .catch(error => {
                console.error("Error fetching user profile:", error);
            });
    }, [form]);

    const handleSubmit = async (values: Record<string, unknown>) => {
        try {
            await axios.put("/api/users/account/update", values);
            setUser(prevUser => ({...prevUser, ...values}));
            message.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            message.error("Failed to update profile");
        }
    };

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sidebar/>
            <Layout>
                <TopBar/>
                <Content style={{margin: "20px", display: "flex", justifyContent: "center"}}>
                    <div className="profile-container">
                        <div className="profile-header">
                            <Avatar
                                src={user ? "/api/users/profile-picture" : undefined}
                                size={80}
                            />
                            <Title level={4}>{user?.name} {user?.lastName}</Title>
                        </div>
                        <div className="profile-card">
                            <Card className="profile-card">
                                <Space direction="vertical" size="large" style={{width: '100%'}}>
                                    <Form form={form} layout="vertical" onFinish={handleSubmit}
                                          className="profile-detail">
                                        <Form.Item label={<span className="profile-label">Name</span>} name="name">
                                            <Input placeholder="example"/>
                                        </Form.Item>
                                        <Form.Item label={<span className="profile-label">Last Name</span>}
                                                   name="lastName">
                                            <Input placeholder="example"/>
                                        </Form.Item>
                                        <Form.Item label={<span className="profile-label">English level</span>}
                                                   name="englishLevel">
                                            <Radio.Group>
                                                <Radio value="A1">A1</Radio>
                                                <Radio value="A2">A2</Radio>
                                                <Radio value="B1">B1</Radio>
                                                <Radio value="B2">B2</Radio>
                                                <Radio value="C1">C1</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item className="submit-container">
                                            <Button htmlType="submit" className="update-profile-btn"
                                                    onClick={() => navigate("/account")}>Update</Button>
                                        </Form.Item>
                                    </Form>
                                </Space>
                            </Card>
                        </div>
                    </div>
                </Content>
                <FooterBar/>
            </Layout>
        </Layout>
    );
};

export default UpdateProfilePage;