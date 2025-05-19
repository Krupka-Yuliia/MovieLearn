import React, {useState, useEffect, useRef} from 'react';
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
    FormInstance,
} from 'antd';
import {UploadOutlined, SaveFilled, CloseOutlined} from '@ant-design/icons';
import Sidebar from '../Layout/Sidebar';
import TopBar from '../Layout/TopBar';
import Footer from '../Layout/Footer';
import '../Layout/Layout.css';
import './MoviesList.css';
import axios, {AxiosError} from 'axios';
import {useNavigate, useParams} from "react-router-dom";

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
}

interface Movie {
    id: number;
    title: string;
    description: string;
    genres: string[];
    image: string | null;
}

interface ApiError {
    message?: string;
}

const UpdateMovieForm: React.FC = () => {
    const formRef = useRef<FormInstance>(null);
    const [form] = Form.useForm();
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [scriptFile, setScriptFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get<Genre[]>('/api/genres');
                setGenres(response.data);
            } catch (error) {
                message.error('Error loading genres');
                console.error('Error loading genres:', error);
            }
        };

        void fetchGenres();
    }, []);

    useEffect(() => {
        const fetchMovie = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get<Movie>(`/api/movies/${id}`);
                setMovie(response.data);

                form.setFieldsValue({
                    title: response.data.title,
                    description: response.data.description,
                    genres: response.data.genres,
                });
            } catch (error) {
                message.error('Error fetching movie');
                console.error('Fetch error:', error);
                navigate('/movies');
            } finally {
                setLoading(false);
            }
        };

        void fetchMovie();
    }, [id, navigate, form]);

    const handleSubmit = async (values: FormValues) => {
        if (!id) return;
        setSubmitting(true);

        try {
            const movieData = {
                title: values.title,
                description: values.description,
                genres: values.genres
            };

            await axios.put(`/api/movies/${id}`, movieData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const uploadPromises = [];

            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);

                uploadPromises.push(
                    axios.post(`/api/movies/${id}/image`, imageFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                );
            }

            if (scriptFile) {
                const scriptFormData = new FormData();
                scriptFormData.append('script', scriptFile);

                uploadPromises.push(
                    axios.post(`/api/movies/${id}/script`, scriptFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                );
            }

            if (uploadPromises.length > 0) {
                await Promise.all(uploadPromises);
            }

            message.success('Movie updated successfully!');

            form.resetFields();
            setImageFile(null);
            setScriptFile(null);

            navigate('/movies');
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response) {
                message.error(`Error updating movie: ${axiosError.response.data?.message || 'Server error'}`);
            } else if (axiosError.request) {
                message.error('Error connecting to server. Please check your internet connection.');
            } else {
                message.error(`Error updating movie: ${axiosError.message}`);
            }
            console.error('Error updating movie:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (form.isFieldsTouched()) {
            if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                resetFormAndNavigate();
            }
        } else {
            resetFormAndNavigate();
        }
    };

    const resetFormAndNavigate = () => {
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
            return false;
        }

        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
            return false;
        }

        setImageFile(file);
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
            return false;
        }

        if (!isLt5M) {
            message.error('Script must be smaller than 5MB!');
            return false;
        }

        setScriptFile(file);
        return false;
    };

    return (
        <Layout className="layout">
            <Sidebar/>
            <Layout>
                <TopBar/>

                <div className="add-movie-page">
                    <Title level={2} className="add-movie-title">
                        Update Movie
                    </Title>

                    <Card className="movie-form-card">
                        {loading ? (
                            <div className="loading-spinner">
                                <Spin size="large"/>
                            </div>
                        ) : (
                            <Form
                                ref={formRef}
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                initialValues={{
                                    title: movie?.title || '',
                                    description: movie?.description || '',
                                    genres: movie?.genres || []
                                }}
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
                                            icon={<SaveFilled/>}
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

export default UpdateMovieForm;