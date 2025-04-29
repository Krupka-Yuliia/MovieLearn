import React, {useState, useEffect} from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    Upload,
    Typography,
    Card,
    Space,
    message,
    Spin,
    Layout,
    UploadFile
} from 'antd';
import {UploadOutlined, SaveFilled, CloseOutlined} from '@ant-design/icons';
import Sidebar from '../Layout/Sidebar';
import TopBar from '../Layout/TopBar';
import Footer from '../Layout/Footer';
import '../Layout/Layout.css';
import './MoviesList.css';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const {Title} = Typography;
const {TextArea} = Input;
const {Option} = Select;

interface Genre {
    id: number;
    name: string;
    displayName: string;
}

interface FormValues {
    title: string;
    description: string;
    genres: string[];
    image?: UploadFile<unknown>[];
    script?: UploadFile<unknown>[];
}

const NewMovieForm: React.FC = () => {
    const [form] = Form.useForm();
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [scriptFile, setScriptFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenres = async () => {
            setLoading(true);
            try {
                const response = await axios.get<Genre[]>('/api/genres');
                setGenres(response.data);
            } catch (error) {
                message.error('Error loading genres');
                console.error('Error loading genres:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    const handleSubmit = async (values: FormValues) => {
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('genres', values.genres.join(','));

            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (scriptFile) {
                formData.append('script', scriptFile);
            }

            await axios.post('/api/movies', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            message.success('Movie added successfully!');
            form.resetFields();
            setImageFile(null);
            setScriptFile(null);
            navigate('/movies');

        } catch (error) {
            message.error('Error adding movie');
            console.error('Error adding movie:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setImageFile(null);
        setScriptFile(null);
        navigate('/movies');
    };

    const beforeImageUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isImage) {
            message.error('You can only upload image files!');
        }

        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
        }

        if (isImage && isLt2M) {
            setImageFile(file);
        }

        return false;
    };

    const beforeScriptUpload = (file: File) => {
        const isPdf = file.type === 'application/pdf';
        const isDoc = file.type === 'application/msword' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        const isText = file.type === 'text/plain';
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isPdf && !isDoc && !isText) {
            message.error('You can only upload PDF, DOC, DOCX or TXT files!');
        }

        if (!isLt5M) {
            message.error('Script must be smaller than 5MB!');
        }

        if ((isPdf || isDoc || isText) && isLt5M) {
            setScriptFile(file);
        }

        return false;
    };

    return (
        <Layout className="layout">
            <Sidebar/>
            <Layout>
                <TopBar/>

                <div className="add-movie-page">
                    <Title level={2} className="add-movie-title">
                        New movie
                    </Title>

                    <Card className="movie-form-card">
                        {loading ? (
                            <div className="loading-spinner">
                                <Spin size="large"/>
                            </div>
                        ) : (
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                initialValues={{genres: []}}
                            >
                                <Form.Item
                                    name="title"
                                    label="Movie Title"
                                    rules={[
                                        {required: true, message: 'Please enter movie title'},
                                        {min: 2, message: 'Name must be at least 2 characters'},
                                        {max: 50, message: 'Name must be at most 50 characters'},
                                    ]}
                                >
                                    <Input placeholder="Enter movie title" className="dynamic-input"/>
                                </Form.Item>

                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[
                                        {required: true, message: 'Please enter movie description'},
                                        {min: 2, message: 'Description must be at least 2 characters'},
                                        {max: 500, message: 'Description must be at most 500 characters'},
                                    ]}
                                >
                                    <TextArea rows={4} placeholder="Movie description" className="dynamic-input"/>
                                </Form.Item>

                                <Form.Item
                                    name="genres"
                                    label="Genres"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'array',
                                            min: 1,
                                            message: 'Please choose at least one genre',
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select genres"
                                        style={{width: '100%'}}
                                    >
                                        {genres.map((genre) => (
                                            <Option key={genre.name} value={genre.name}>{genre.displayName}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="image"
                                    label="Movie Poster"
                                    rules={[{required: true, message: 'Please upload a movie poster'}]}
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => e && e.fileList}
                                >
                                    <Upload
                                        listType="picture"
                                        maxCount={1}
                                        beforeUpload={beforeImageUpload}
                                        onRemove={() => setImageFile(null)}
                                        fileList={imageFile ? [{
                                            uid: '-1',
                                            name: imageFile.name,
                                            status: 'done',
                                            url: URL.createObjectURL(imageFile)
                                        }] : []}
                                    >
                                        <Button icon={<UploadOutlined/>}>Upload Poster</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item
                                    name="script"
                                    label="Movie Script (PDF, DOC, DOCX, TXT)"
                                    rules={[{required: true, message: 'Please upload a movie script'}]}
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => e && e.fileList}
                                >
                                    <Upload
                                        maxCount={1}
                                        beforeUpload={beforeScriptUpload}
                                        onRemove={() => setScriptFile(null)}
                                        fileList={scriptFile ? [{
                                            uid: '-1',
                                            name: scriptFile.name,
                                            status: 'done'
                                        }] : []}
                                    >
                                        <Button icon={<UploadOutlined/>}>Upload Script</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item>
                                    <Space className="centered-buttons">
                                        <Button
                                            className="yellow-btn"
                                            htmlType="submit"
                                            loading={submitting}
                                            icon=<SaveFilled/>
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            icon={<CloseOutlined/>}
                                            className="blue-btn"
                                        >
                                            Cancel
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        )}
                    </Card>
                </div>
                <Footer/>
            </Layout>
        </Layout>
    );
};

export default NewMovieForm;
