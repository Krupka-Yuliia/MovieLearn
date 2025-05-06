import React from 'react';
import {Card} from 'antd';
import './MoviesList.css';
import {useNavigate} from 'react-router-dom';

const {Meta} = Card;

interface MovieCardProps {
    movie: {
        id: number;
        title: string;
        description: string;
        genres: string[];
        image: string | null;
    };
}

const MovieCard: React.FC<MovieCardProps> = ({movie}) => {
    const navigate = useNavigate();

    const imageSource = movie.image
        ? (movie.image.startsWith('data:image')
            ? movie.image
            : `data:image/jpeg;base64,${movie.image}`)
        : null;

    const handleClick = () => {
        navigate(`/movies/${movie.id}`);
    };

    return (
        <Card
            hoverable
            className="movie-card"
            onClick={handleClick}
            style={{cursor: 'pointer'}}
            cover={
                imageSource ? (
                    <img
                        alt="movie cover"
                        src={imageSource}
                        className="movie-card-cover"
                    />
                ) : (
                    <div
                        style={{
                            width: '100%',
                            height: '150px',
                            backgroundColor: '#d9d9d9',
                        }}
                    />
                )
            }
        >
            <Meta
                title={movie.title}
                description={
                    movie.description.length > 50
                        ? movie.description.substring(0, 50) + '...'
                        : movie.description
                }
            />
            <div className="movie-card-genres">
                {movie.genres.join(', ')}
            </div>
        </Card>
    );
};

export default MovieCard;
