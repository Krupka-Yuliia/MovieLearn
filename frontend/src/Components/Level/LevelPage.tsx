import React from 'react';
import { Button, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LevelPage.css';

const { Title, Text } = Typography;

const LevelPage: React.FC = () => {
    const navigate = useNavigate();

    const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

    const handleLevelSelect = async (level: string) => {
        try {
            await axios.put(`/api/users/level/${level}`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            message.success(`English level set to ${level}`);
            navigate('/interests');
        } catch (error) {
            console.error('Failed to update English level', error);
            message.error('Failed to update English level. Please try again.');
            
        }
    };

    return (
        <div className="login-container">
            <Title className="logo">
                <span className="logo-blue">MOVIE</span>
                <span className="logo-orange">LEARN</span>
            </Title>

            <Text className="subtitle">
                Tell us your level of English
            </Text>

            <div className="buttons">
                {levels.map((level) => (
                    <Button
                        key={level}
                        className="level-button"
                        onClick={() => handleLevelSelect(level)}
                    >
                        {level}
                    </Button>
                ))}
            </div>

            <Text className="subtitle-2">
                Don't worry, you can change it later
            </Text>
        </div>
    );
};

export default LevelPage;