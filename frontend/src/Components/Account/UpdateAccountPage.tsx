import {Layout, Form, Input, Radio, Button, Avatar, message as antMessage, Card, Space, Upload, Checkbox} from "antd";
import Sidebar from "../Layout/Sidebar";
import TopBar from "../Layout/TopBar";
import FooterBar from "../Layout/Footer";
import "./AccountPage.css";
import "../Layout/Layout.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {EditOutlined, UploadOutlined} from "@ant-design/icons";
import type {UploadFile} from 'antd/es/upload/interface';


const {Content} = Layout;

interface Interest {
    id: number;
    name: string;
}

interface User {
    name: string;
    lastName: string;
    englishLevel: string;
    interests: Interest[];
}


const DEFAULT_INTERESTS = [
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
    const [user, setUser] = useState<User | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [originalAvatar, setOriginalAvatar] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [customMessage, contextHolder] = antMessage.useMessage();
    const [interestsList, setInterestsList] = useState<string[]>(DEFAULT_INTERESTS);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const apiBaseUrl = `${window.location.protocol}//localhost:8080`;

    useEffect(() => {
        axios
            .get<Interest[]>(`${apiBaseUrl}/api/interests`, {withCredentials: true})
            .then(res => {
                setInterestsList(res.data.map(i => i.name));
            })
            .catch((error: unknown) => {
                if (axios.isAxiosError(error)) console.error(error);
                else console.error(error);
            });
    }, [apiBaseUrl]);

    useEffect(() => {
        axios
            .get<User>('/api/users/account', {withCredentials: true})
            .then(res => {
                const data = res.data;
                setUser(data);
                form.setFieldsValue({
                    ...data,
                    interests: data.interests.map(i => i.name),
                });
                const url = `${apiBaseUrl}/api/users/profile-picture?t=${Date.now()}`;
                setPreviewAvatar(url);
                setOriginalAvatar(url);
            })
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
        // Reset the fileList when canceling
        setFileList([]);
        navigate("/account");
    };

    // Modified upload props with file list control
    const uploadProps = {
        fileList: fileList,
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

            // Clear previous file and add new one
            setFileList([{
                uid: '-1',
                name: file.name,
                status: 'done',
                url: URL.createObjectURL(file)
            }]);

            const reader = new FileReader();
            reader.onload = (e) => setPreviewAvatar(e.target?.result as string);
            reader.readAsDataURL(file);
            setAvatarFile(file);
            return false;
        },
        onRemove: () => {
            setFileList([]);
            setAvatarFile(null);
            setPreviewAvatar(originalAvatar);
            return true;
        },
        maxCount: 1
    };

    return (
        <Layout className="layout">
            {contextHolder}
            <Sidebar/>
            <Layout>
                <TopBar/>
                <Content className="content">
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