import React, {useState, useEffect, useRef} from 'react';
import {Layout, Row, Col, Typography, Pagination, Spin, Empty, message as antMessage} from 'antd';
import './MoviesList.css';
import '../Layout/Layout.css';

import Sidebar from "../Layout/Sidebar";
import TopBar from "../Layout/TopBar";
import FooterBar from "../Layout/Footer";
import MovieCard from "./MovieCard.tsx";
import {Content} from "antd/es/layout/layout";
import {useLocation} from 'react-router-dom';

const {Title} = Typography;

interface Movie {
    id: number;
    title: string;
    description: string;
    genres: string[];
    image: string;
}

const MoviesList: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [customMessage, contextHolder] = antMessage.useMessage();

    const location = useLocation();
    const errorShownRef = useRef(false);
    const pageSize = 8;
    const currentMovies = movies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => {
        if (location.state?.errorMessage && !errorShownRef.current) {
            customMessage.error(location.state.errorMessage);
            errorShownRef.current = true;
        }
    }, [location.state?.errorMessage, customMessage]);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/movies', {
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Failed to fetch movies');
                const data = await response.json();
                setMovies(data || []);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    return (
        <Layout>
            <Sidebar/>
            <Layout className="layout">
                <TopBar/>
                {contextHolder}
                <Content>
                    <Row className="title-row">
                        <Col>
                            <Title level={4} className="subtitle">Choose your movie to start a lesson!</Title>
                        </Col>
                    </Row>

                    <div className="movies-container">
                        <div className="movies-list">
                            {loading ? (
                                <Spin size="large" style={{margin: 'auto'}}/>
                            ) : movies.length === 0 ? (
                                <Empty description="No movies available. Please check back later!"/>
                            ) : (
                                <Row gutter={[12, 12]} style={{width: '100%'}}>
                                    {currentMovies.map((movie) => (
                                        <Col
                                            xs={24}
                                            sm={12}
                                            md={8}
                                            lg={6}
                                            key={movie.id}
                                            style={{display: 'flex', justifyContent: 'center'}}
                                        >
                                            <MovieCard movie={movie}/>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </div>
                        {movies.length > 0 && (
                            <Row className="pagination-row">
                                <Pagination
                                    current={currentPage}
                                    onChange={setCurrentPage}
                                    total={movies.length}
                                    pageSize={pageSize}
                                    showSizeChanger={false}
                                />
                            </Row>
                        )}
                    </div>
                </Content>
                <FooterBar/>
            </Layout>
        </Layout>
    );
};

export default MoviesList;