import React from 'react';
import {Card} from 'antd';
import './MoviesList.css';

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
    const fallbackImage = `https://picsum.photos/250/250?random=${movie.id}`;

    return (
        <Card
            hoverable
            className="movie-card"
            cover={
                <img
                    alt="movie cover"
                    src={movie.image ? movie.image : fallbackImage}
                    className="movie-card-cover"
                />
            }
        >
            <Meta
                title={movie.title}
                description={movie.description.length > 50 ? movie.description.substring(0, 50) + '...' : movie.description}
            />
            <div className="movie-card-genres">
                {movie.genres.join(', ')}
            </div>
        </Card>
    );
};

export default MovieCard;
