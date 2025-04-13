import React, { useState } from 'react';
import { Layout, Row, Col, Card, Typography, Pagination } from 'antd';
import './MoviesList.css';
import Sidebar from "../Layout/Sidebar";
import TopBar from "../Layout/TopBar";
import FooterBar from "../Layout/Footer";

const { Title, Text } = Typography;

interface Movie {
    id: number;
    title: string;
    genre: string;
    image: string;
}

const MoviesList: React.FC = () => {
    const movieData: Movie[] = Array.from({ length: 64 }, (_, index) => ({
        id: index + 1,
        title: "Movie Title Example",
        genre: "movie genre",
        image: "https://via.placeholder.com/300x200?text=Arctic+Fox+4",
    }));

    const pageSize = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const currentMovies = movieData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <>
            <Layout>
                <Sidebar />
                <Layout style={{minHeight: "100vh"}}>
                    <TopBar />
                    <Row justify="space-between" align="middle" style={{ marginBottom: '10px' , padding: '20px'}}>
                        <Col>
                            <Title level={3}>Movies List</Title>
                            <Text>Choose your movie to start a lesson!</Text>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        {currentMovies.map((movie) => (
                            <Col
                                xs={24} sm={12} md={8} lg={6}
                                key={movie.id}
                                style={{ display: 'flex', justifyContent: 'center' }}
                            >
                                <Card
                                    hoverable
                                    style={{ width: 250 }}
                                    cover={
                                        <img
                                            alt="movie cover"
                                            src={movie.image}
                                            style={{ height: 200, objectFit: 'cover' }}
                                        />
                                    }
                                >
                                    <Card.Meta title={movie.title} description={movie.genre} />
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Row justify="center" style={{ marginTop: '10px', marginBottom: '20px' }}>
                        <Pagination
                            current={currentPage}
                            onChange={setCurrentPage}
                            total={movieData.length}
                            pageSize={pageSize}
                            showSizeChanger={false}
                        />
                    </Row>

                    <FooterBar />
                </Layout>
            </Layout>
        </>
    );
};

export default MoviesList;
