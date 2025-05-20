import React, {useState, useEffect, useRef} from 'react';
import {Layout, Row, Col, Typography, Pagination, Spin, Empty, message as antMessage, Select, Space} from 'antd';
import './MoviesList.css';
import '../Layout/Layout.css';
import Sidebar from "../Layout/Sidebar";
import TopBar from "../Layout/TopBar";
import FooterBar from "../Layout/Footer";
import MovieCard from "./MovieCard.tsx";
import {Content} from "antd/es/layout/layout";
import {useLocation} from 'react-router-dom';

const {Title} = Typography;
const {Option} = Select;

interface Movie {
    id: number;
    title: string;
    description: string;
    genres: string[];
    image: string;
}

interface Genre {
    id: number;
    name: string;
    displayName: string;
}

const MoviesList: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [customMessage, contextHolder] = antMessage.useMessage();
    const errorShownRef = useRef(false);
    const successShownRef = useRef(false);

    const location = useLocation();
    const pageSize = 8;
    const currentMovies = filteredMovies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => {
        if (location.state?.errorMessage && !errorShownRef.current) {
            customMessage.error(location.state.errorMessage);
            errorShownRef.current = true;
        }
        if (location.state?.successMessage && !successShownRef.current) {
            customMessage.success(location.state.successMessage);
            successShownRef.current = true;
        }
    }, [location.state, customMessage]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const moviesResponse = await fetch('/api/movies', {
                    credentials: 'include',
                });
                if (!moviesResponse.ok) throw new Error('Failed to fetch movies');
                const moviesData = await moviesResponse.json();
                setMovies(moviesData || []);

                const genresResponse = await fetch('/api/genres', {
                    credentials: 'include',
                });
                if (!genresResponse.ok) throw new Error('Failed to fetch genres');
                const genresData = await genresResponse.json();
                setGenres(genresData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setMovies([]);
                setGenres([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedGenres.length === 0) {
            setFilteredMovies(movies);
        } else {
            const filtered = movies.filter(movie =>
                selectedGenres.some(genre => movie.genres.includes(genre))
            );
            setFilteredMovies(filtered);
        }
        setCurrentPage(1);
    }, [selectedGenres, movies]);

    const handleGenreChange = (value: string[]) => {
        setSelectedGenres(value);
    };

    return (
        <Layout>
            <Sidebar/>
            <Layout className="layout">
                <TopBar/>
                {contextHolder}
                <Content>
                    <Row className="title-row" justify="space-between" align="middle">
                        <Col>
                            <Title level={5} className="subtitle">Choose your movie to start a lesson!</Title>
                        </Col>
                        <Col>
                            <Space>
                                <Select
                                    mode="multiple"
                                    placeholder="Filter by genre"
                                    style={{width: 200}}
                                    onChange={handleGenreChange}
                                    value={selectedGenres}
                                    allowClear
                                >
                                    {genres.map(genre => (
                                        <Option key={genre.name} value={genre.name}>
                                            {genre.displayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Space>
                        </Col>
                    </Row>

                    <div className="movies-container">
                        <div className="movies-list">
                            {loading ? (
                                <Spin size="large" style={{margin: 'auto'}}/>
                            ) : filteredMovies.length === 0 ? (
                                <Empty description={
                                    selectedGenres.length > 0
                                        ? "No movies match the selected genres"
                                        : "No movies available. Please check back later!"
                                }/>
                            ) : (
                                <Row gutter={[12, 12]} style={{width: '100%'}}>
                                    {currentMovies.map((movie) => (
                                        <Col
                                            xs={12}
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
                        {filteredMovies.length > 0 && (
                            <Row className="pagination-row">
                                <Pagination
                                    current={currentPage}
                                    onChange={setCurrentPage}
                                    total={filteredMovies.length}
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