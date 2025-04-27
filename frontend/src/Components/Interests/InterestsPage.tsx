import React, { useState, useEffect } from 'react';
import './InterestsPage.css';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface Interest {
    id: number;
    name: string;
}

const Interests: React.FC = () => {
    const navigate = useNavigate();
    const [interestsList, setInterestsList] = useState<Interest[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const apiBaseUrl = `${window.location.protocol}//localhost:8080`;

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/api/interests`, {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setInterestsList(data);
                } else {
                    console.error('Failed to fetch interests');
                }
            } catch (error) {
                console.error('Error fetching interests:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterests();
    }, [apiBaseUrl]);

    const saveInterests = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/users/interests`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedInterests),
                credentials: 'include'
            });

            if (response.ok) {
                console.log('Interests saved successfully!');
                navigate("/home");
            } else {
                throw new Error('Failed to save interests');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prevState) =>
            prevState.includes(interest)
                ? prevState.filter((item) => item !== interest)
                : [...prevState, interest]
        );
    };

    if (isLoading) {
        return (
            <div className="login-container">
                <Title className="logo">
                    <span className="logo-blue">MOVIE</span>
                    <span className="logo-orange">LEARN</span>
                </Title>
                <Text className="subtitle">Loading interests...</Text>
            </div>
        );
    }

    return (
        <div className="login-container">
            <Title className="logo">
                <span className="logo-blue">MOVIE</span>
                <span className="logo-orange">LEARN</span>
            </Title>

            <Text className="subtitle">Tell us your interests</Text>
            <div className="buttons">
                {interestsList.map((interest) => (
                    <button
                        key={interest.id}
                        className={`interest-button ${
                            selectedInterests.includes(interest.name) ? 'selected' : ''
                        }`}
                        onClick={() => toggleInterest(interest.name)}
                    >
                        {interest.name}
                    </button>
                ))}
            </div>

            <Text className="subtitle-2">Don't worry, you can change it later</Text>
            <button
                className="home-button"
                onClick={saveInterests}
                disabled={selectedInterests.length === 0}
            >
                Save Interests
            </button>
        </div>
    );
};

export default Interests;