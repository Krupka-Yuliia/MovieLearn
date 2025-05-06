import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Card, Spin, Typography, Button, Layout, Row, Col, message as antMessage} from 'antd';
import TopBar from "../Layout/TopBar";
import Sidebar from "../Layout/Sidebar";
import FooterBar from "../Layout/Footer";
import {useAuth} from "../Auth/AuthContext.tsx";
import './MoviesList.css';
import axios from "axios";

const {Title} = Typography;
const {Content} = Layout;
const {Meta} = Card;

interface Movie {
    id: number;
    title: string;
    description: string;
    genres: string[];
    image: string | null;
}

const MovieDetails: React.FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const isAdmin = user?.role === 'ADMIN';
    const [message, contextHolder] = antMessage.useMessage();

    useEffect(() => {
        if (!id) {
            message.error('Invalid movie ID');
            navigate('/movies');
            return;
        }

        const fetchMovie = async () => {
            try {
                const response = await fetch(`/api/movies/${id}`, {
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Movie not found');
                const data = await response.json();
                setMovie(data);
            } catch (error) {
                message.error('Error fetching movie');
                console.error('Fetch error:', error);
                navigate('/movies');
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id, navigate, message]);

    const handleDelete = async (movieId: number) => {
        setDeleteLoading(true);
        try {
            await axios.delete(`/api/movies/${movieId}`, {
                withCredentials: true,
            });
            navigate('/movies', {state: {successMessage: 'Movie successfully deleted!'}});
        } catch (error) {
            message.error('Error deleting movie');
            console.error('Delete error:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) return <Spin size="large" className="loading-spinner"/>;
    if (!movie) return null;

    const imageSource = movie.image
        ? movie.image.startsWith('data:image')
            ? movie.image
            : `data:image/jpeg;base64,${movie.image}`
        : undefined;

    return (
        <Layout>
            <Sidebar/>
            <Layout className="layout">
                <TopBar/>
                {contextHolder}
                <Content style={{padding: '30px'}}>
                    <Row justify="center">
                        <Col xs={24} sm={20} md={18} lg={12} xl={10}>
                            <div className="movie-details-container">
                                <Card
                                    hoverable
                                    className="movie-card-big"
                                    cover={
                                        imageSource && (
                                            <img
                                                alt="movie cover"
                                                src={imageSource}
                                                className="movie-card-cover-big"
                                            />
                                        )
                                    }
                                >
                                    <Meta
                                        title={
                                            <Title level={2} className="movie-title-big" style={{textAlign: 'center'}}>
                                                {movie.title}
                                            </Title>
                                        }
                                        description={movie.description}
                                    />
                                    <div className="movie-card-genres">
                                        {movie.genres.join(', ')}
                                    </div>
                                </Card>

                                <div className="button-column">
                                    {isAdmin ? (
                                        <>
                                            <Button className="yellow-btn" block
                                                    onClick={() => navigate(`/movies/edit/${movie.id}`)}>
                                                Edit Movie
                                            </Button>
                                            <Button
                                                danger
                                                block
                                                loading={deleteLoading}
                                                style={{borderRadius: "20px"}}
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this movie?')) {
                                                        handleDelete(movie.id);
                                                    }
                                                }}
                                            >
                                                Delete Movie
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button className="yellow-btn" block>
                                                Study Vocabulary
                                            </Button>
                                            <Button className="yellow-btn" block>
                                                Start Vocabulary Test
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Content>
                <FooterBar/>
            </Layout>
        </Layout>
    );
};

export default MovieDetails;