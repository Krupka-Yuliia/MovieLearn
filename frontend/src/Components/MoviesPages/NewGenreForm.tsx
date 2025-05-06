import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Typography,
    Card,
    Space,
    message,
    Spin,
    Layout,
    List
} from 'antd';
import { SaveFilled, CloseOutlined } from '@ant-design/icons';
import Sidebar from '../Layout/Sidebar';
import TopBar from '../Layout/TopBar';
import Footer from '../Layout/Footer';
import '../Layout/Layout.css';
import './MoviesList.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface Genre {
    id: number;
    name: string;
    displayName: string;
}

interface FormValues {
    name: string;
}

const NewGenreForm: React.FC = () => {
    const [form] = Form.useForm();
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        fetchGenres();
    }, []);

    const handleSubmit = async (values: FormValues) => {
        setSubmitting(true);

        try {
            const formData = { name: values.name };

            if (editingGenre) {
                await axios.put(`/api/genres/${editingGenre.id}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                message.success('Genre updated successfully!');
            } else {
                await axios.post('/api/genres', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                message.success('Genre added successfully!');
            }

            form.resetFields();
            setEditingGenre(null);
            fetchGenres();

        } catch (error) {
            message.error('Error saving genre');
            console.error('Error saving genre:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setEditingGenre(null);
        navigate('/movies');
    };

    const handleEdit = (genre: Genre) => {
        setEditingGenre(genre);
        form.setFieldsValue({ name: genre.name });
    };

    const handleDelete = async (genreId: number) => {
        try {
            await axios.delete(`/api/genres/${genreId}`);
            message.success('Genre deleted');
            fetchGenres();
        } catch (error) {
            message.error('Error deleting genre');
            console.error('Delete error:', error);
        }
    };

    return (
        <Layout className="layout">
            <Sidebar />
            <Layout>
                <TopBar />
                <div className="add-genre-container">
                    <Title level={2} className="add-genre-title">
                        {editingGenre ? 'Update Genre' : 'New Genre'}
                    </Title>

                    <Card className="genre-form-card">
                        {loading ? (
                            <div className="loading-spinner">
                                <Spin size="large" />
                            </div>
                        ) : (
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                            >
                                <Form.Item
                                    name="name"
                                    label="Genre Name"
                                    rules={[
                                        { required: true, message: 'Please enter a genre' },
                                        { min: 2, message: 'Name must be at least 2 characters' },
                                        { max: 50, message: 'Name must be at most 50 characters' },
                                    ]}
                                >
                                    <Input placeholder="Enter genre" />
                                </Form.Item>

                                <Form.Item>
                                    <Space className="centered-buttons">
                                        <Button
                                            className="yellow-btn"
                                            htmlType="submit"
                                            loading={submitting}
                                            icon={<SaveFilled />}
                                        >
                                            {editingGenre ? 'Update' : 'Save'}
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            icon={<CloseOutlined />}
                                            className="blue-btn"
                                        >
                                            Cancel
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        )}

                        <Title level={3}>Genres List</Title>
                        {loading ? (
                            <Spin />
                        ) : (
                            <List
                                bordered
                                dataSource={genres}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[
                                            <Button type="link" key="edit" onClick={() => handleEdit(item)}>Edit</Button>,
                                            <Button
                                                danger
                                                type="link"
                                                key="delete"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this genre?')) {
                                                        handleDelete(item.id);
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>,
                                        ]}
                                    >
                                        <strong>{item.displayName || item.name}</strong>
                                    </List.Item>
                                )}
                                className="genres-list"
                            />
                        )}
                    </Card>
                </div>
                <Footer />
            </Layout>
        </Layout>
    );
};

export default NewGenreForm;
