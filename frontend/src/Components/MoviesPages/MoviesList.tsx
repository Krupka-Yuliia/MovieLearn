import React, {useState, useEffect} from 'react';
import {Layout, Row, Col, Typography, Pagination, Spin} from 'antd';
import './MoviesList.css';
import Sidebar from "../Layout/Sidebar";
import TopBar from "../Layout/TopBar";
import FooterBar from "../Layout/Footer";
import MovieCard from "./MovieCard.tsx";

const {Title, Text} = Typography;

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

    const pageSize = 8;
    const currentMovies = movies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/movies', {
                    credentials: 'include'
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
            <Layout style={{minHeight: "100vh"}}>
                <TopBar/>
                <Row justify="space-between" align="middle" style={{marginBottom: '10px', padding: '20px'}}>
                    <Col>
                        <Title level={3}>Movies List</Title>
                        <Text>Choose your movie to start a lesson!</Text>
                    </Col>
                </Row>

                {movies.length === 0 && !loading && (
                    <Text>No movies available.</Text>
                )}


                {loading ? (
                    <Spin size="large" style={{display: 'block', margin: '20px auto'}}/>
                ) : (
                    <>
                        <Row gutter={[16, 16]}>
                            {currentMovies.map((movie) => (
                                <Col
                                    xs={24} sm={12} md={8} lg={6}
                                    key={movie.id}
                                    style={{display: 'flex', justifyContent: 'center'}}
                                >
                                    <MovieCard movie={movie}/>
                                </Col>
                            ))}
                        </Row>

                        <Row justify="center" style={{marginTop: '10px', marginBottom: '20px'}}>
                            <Pagination
                                current={currentPage}
                                onChange={setCurrentPage}
                                total={movies.length}
                                pageSize={pageSize}
                                showSizeChanger={false}
                            />
                        </Row>
                    </>
                )}

                <FooterBar/>
            </Layout>
        </Layout>
    );
};

export default MoviesList;
