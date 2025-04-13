import {Layout, Form, Input, Radio, Button, Avatar, message as antMessage, Card, Space, Upload, Checkbox} from "antd";
import Sidebar from "../Layout/Sidebar";
import TopBar from "../Layout/TopBar";
import FooterBar from "../Layout/Footer";
import "./AccountPage.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {EditOutlined, UploadOutlined} from "@ant-design/icons";

const {Content} = Layout;

const interestsList = [
    "Sport",
    "Fashion",
    "Food",
    "Space",
    "Art",
    "Traveling",
    "Literature",
    "Humor",
    "Music",
    "Science"
];

const UpdateProfilePage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [originalAvatar, setOriginalAvatar] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [customMessage, contextHolder] = antMessage.useMessage();

    const apiBaseUrl = `${window.location.protocol}//localhost:8080`;

    useEffect(() => {
        axios
            .get("/api/users/account")
            .then(({data}) => {
                setUser(data);
                form.setFieldsValue(data);
                const avatarUrl = `${apiBaseUrl}/api/users/profile-picture?t=${new Date().getTime()}`;
                setPreviewAvatar(avatarUrl);
                setOriginalAvatar(avatarUrl);
            })
            .catch(() => customMessage.error("Error fetching user profile"));
    }, [apiBaseUrl, form]);

    interface UserFormValues {
        name?: string;
        lastName?: string;
        englishLevel?: string;
        interests?: string[];
    }

    const handleSubmit = async (values: UserFormValues) => {
        try {
            const updatedInterests = values.interests?.map(name => ({name})) || [];

            const updatedValues = {...values, interests: updatedInterests};

            await axios.put("/api/users/account/update", updatedValues);

            if (avatarFile) {
                const formData = new FormData();
                formData.append("file", avatarFile);
                await axios.put("/api/users/profile-picture/upload", formData, {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                });
            }

            localStorage.setItem("updateSuccess", "Profile updated successfully");
            navigate("/account");
        } catch (err) {
            const errorMessage =
                axios.isAxiosError(err) && err.response?.data?.message
                    ? err.response.data.message
                    : "An error occurred while updating your profile. Please try again.";
            customMessage.error(errorMessage);
        }
    };

    useEffect(() => {
        axios
            .get("/api/users/account")
            .then(({data}) => {
                setUser(data);

                const interests = data.interests?.map((i: { name: string }) => i.name) || [];

                form.setFieldsValue({...data, interests});

                const avatarUrl = `${apiBaseUrl}/api/users/profile-picture?t=${new Date().getTime()}`;
                setPreviewAvatar(avatarUrl);
                setOriginalAvatar(avatarUrl);
            })
            .catch(() => customMessage.error("Error fetching user profile"));
    }, [apiBaseUrl, form]);


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
                customMessage.error("You can only upload image files!");
                return Upload.LIST_IGNORE;
            }
            if (!isLt5M) {
                customMessage.error("Image must be smaller than 5MB!");
                return Upload.LIST_IGNORE;
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
            {contextHolder}
            <Sidebar/>
            <Layout>
                <TopBar/>
                <Content style={{margin: "20px", display: "flex", justifyContent: "center"}}>
                    <div className="profile-container">
                        <div className="profile-header">
                            <Avatar src={previewAvatar || undefined} size={80}/>
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined/>} className="yellow-btn-outline"
                                        style={{marginTop: "20px"}}>
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
                                            {["A1", "A2", "B1", "B2", "C1"].map((level) => (
                                                <Radio key={level} value={level}>
                                                    {level}
                                                </Radio>
                                            ))}
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="Interests" name="interests">
                                        <Checkbox.Group options={interestsList}/>
                                    </Form.Item>
                                    <Form.Item>
                                        <Space style={{display: "flex", justifyContent: "center"}}>
                                            <Button icon={<EditOutlined/>} htmlType="submit" className="yellow-btn">
                                                Update
                                            </Button>
                                            <Button onClick={handleCancel} className="blue-btn">
                                                Cancel
                                            </Button>
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
