import {Layout, Form, Input, Radio, Button, Avatar, message, Card, Space, Upload} from "antd";
import Sidebar from "../Layout/Sidebar";
import TopBar from "../Layout/TopBar";
import FooterBar from "../Layout/Footer";
import "./AccountPage.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {EditOutlined, UploadOutlined} from '@ant-design/icons';

const {Content} = Layout;

const UpdateProfilePage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [originalAvatar, setOriginalAvatar] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const apiBaseUrl = `${window.location.protocol}//localhost:8080`;

    useEffect(() => {
        axios.get("/api/users/account")
            .then(({data}) => {
                setUser(data);
                form.setFieldsValue(data);
                const avatarUrl = `${apiBaseUrl}/api/users/profile-picture?t=${new Date().getTime()}`;
                setPreviewAvatar(avatarUrl);
                setOriginalAvatar(avatarUrl);
            })
            .catch(() => message.error("Error fetching user profile"));
    }, [apiBaseUrl, form]);

    const handleSubmit = async (values: Record<string, unknown>) => {
        try {
            await axios.put("/api/users/account/update", values);
            if (avatarFile) {
                const formData = new FormData();
                formData.append("file", avatarFile);
                await axios.post("/api/users/profile-picture/upload", formData, {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                });
            }
            message.success("Profile updated successfully");
            navigate("/account");
        } catch {
            message.error("Failed to update profile");
        }
    };

    const handleCancel = () => {
        form.resetFields();
        if (user) form.setFieldsValue(user);
        setPreviewAvatar(originalAvatar);
        setAvatarFile(null);
        navigate("/account");
    };

    const uploadProps = {
        beforeUpload: (file: File) => {
            const isImage = file.type.startsWith("image/");
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isImage) {
                message.error("You can only upload image files!");
                return false;
            }
            if (!isLt5M) {
                message.error("Image must be smaller than 5MB!");
                return false;
            }
            const reader = new FileReader();
            reader.onload = (e) => setPreviewAvatar(e.target?.result as string);
            reader.readAsDataURL(file);
            setAvatarFile(file);
            return false;
        },
    };


    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sidebar/>
            <Layout>
                <TopBar/>
                <Content style={{margin: "20px", display: "flex", justifyContent: "center"}}>
                    <div className="profile-container">
                        <div className="profile-header">
                            <Avatar src={previewAvatar || undefined} size={80}/>
                            <Upload {...uploadProps}>
                                <Button
                                    icon={<UploadOutlined/>}
                                    className="yellow-btn-outline"
                                    style={{marginTop: "20px"}}
                                >
                                    Change Avatar
                                </Button>
                            </Upload>
                        </div>
                        <div className="profile-card">
                            <Card className="profile-card">
                                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                                    <Form.Item label="Name" name="name">
                                        <Input placeholder="Enter your name"/>
                                    </Form.Item>
                                    <Form.Item label="Last Name" name="lastName">
                                        <Input placeholder="Enter your last name"/>
                                    </Form.Item>
                                    <Form.Item label="English Level" name="englishLevel">
                                        <Radio.Group>
                                            {["A1", "A2", "B1", "B2", "C1"].map(level => (
                                                <Radio key={level} value={level}>{level}</Radio>
                                            ))}
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item>
                                        <Space style={{display: "flex", justifyContent: "center"}}>
                                            <Button icon={<EditOutlined/>} htmlType="submit" className="yellow-btn">
                                                Update
                                            </Button>
                                            <Button onClick={handleCancel} className="blue-btn">Cancel</Button>
                                        </Space>
                                    </Form.Item>
                                </Form>
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
