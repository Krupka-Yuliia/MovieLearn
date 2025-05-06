import React, {useState, useEffect} from 'react';
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
import {SaveFilled, CloseOutlined} from '@ant-design/icons';
import Sidebar from '../Layout/Sidebar';
import TopBar from '../Layout/TopBar';
import Footer from '../Layout/Footer';
import '../Layout/Layout.css';
import './InterestsPage.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const {Title} = Typography;

interface Interest {
    id: number;
    name: string;
    displayName: string;
}

interface FormValues {
    name: string;
}

const NewInterestForm: React.FC = () => {
    const [form] = Form.useForm();
    const [Interests, setInterests] = useState<Interest[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [editingInterest, setEditingInterest] = useState<Interest | null>(null);
    const navigate = useNavigate();

    const fetchInterests = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Interest[]>('/api/interests');
            setInterests(response.data);
        } catch (error) {
            message.error('Error loading Interests');
            console.error('Error loading Interests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterests();
    }, []);

    const handleSubmit = async (values: FormValues) => {
        setSubmitting(true);

        try {
            const formData = {name: values.name};

            if (editingInterest) {
                await axios.put(`/api/interests/${editingInterest.id}`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                message.success('Interest updated successfully!');
            } else {
                await axios.post('/api/interests', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                message.success('Interest added successfully!');
            }

            form.resetFields();
            setEditingInterest(null);
            fetchInterests();

        } catch (error) {
            message.error('Error saving Interest');
            console.error('Error saving Interest:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setEditingInterest(null);
        navigate('/movies');
    };

    const handleEdit = (Interest: Interest) => {
        setEditingInterest(Interest);
        form.setFieldsValue({name: Interest.name});
    };

    const handleDelete = async (InterestId: number) => {
        try {
            await axios.delete(`/api/interests/${InterestId}`);
            message.success('Interest deleted');
            fetchInterests();
        } catch (error) {
            message.error('Error deleting Interest');
            console.error('Delete error:', error);
        }
    };

    return (
        <Layout className="layout">
            <Sidebar/>
            <Layout>
                <TopBar/>
                <div className="add-Interest-container">
                    <Title level={2} className="add-Interest-title">
                        {editingInterest ? 'Update Interest' : 'New Interest'}
                    </Title>

                    <Card className="Interest-form-card">
                        {loading ? (
                            <div className="loading-spinner">
                                <Spin size="large"/>
                            </div>
                        ) : (
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                            >
                                <Form.Item
                                    name="name"
                                    label="Interest Name"
                                    rules={[
                                        {required: true, message: 'Please enter a Interest'},
                                        {min: 2, message: 'Name must be at least 2 characters'},
                                        {max: 50, message: 'Name must be at most 50 characters'},
                                    ]}
                                >
                                    <Input placeholder="Enter Interest"/>
                                </Form.Item>

                                <Form.Item>
                                    <Space className="centered-buttons">
                                        <Button
                                            className="yellow-btn"
                                            htmlType="submit"
                                            loading={submitting}
                                            icon={<SaveFilled/>}
                                        >
                                            {editingInterest ? 'Update' : 'Save'}
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

                        <Title level={3}>Interests List</Title>
                        {loading ? (
                            <Spin/>
                        ) : (
                            <List
                                bordered
                                dataSource={Interests}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[
                                            <Button type="link" key="edit"
                                                    onClick={() => handleEdit(item)}>Edit</Button>,
                                            <Button
                                                danger
                                                type="link"
                                                key="delete"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this Interest?')) {
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
                                className="Interests-list"
                            />
                        )}
                    </Card>
                </div>
                <Footer/>
            </Layout>
        </Layout>
    );
};

export default NewInterestForm;
