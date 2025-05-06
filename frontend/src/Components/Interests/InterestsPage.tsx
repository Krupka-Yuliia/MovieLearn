import React, {useState, useEffect} from 'react';
import './InterestsPage.css';
import {Typography} from 'antd';
import {useNavigate} from 'react-router-dom';

const {Title, Text} = Typography;
import {message as antMessage} from "antd";

interface Interest {
    id: number;
    name: string;
}

const backupInterests: Interest[] = [
    { id: 1, name: 'Sport' },
    { id: 2, name: 'Fashion' },
    { id: 3, name: 'Food' },
    { id: 4, name: 'Space' },
    { id: 5, name: 'Art' },
    { id: 6, name: 'Traveling' },
    { id: 7, name: 'Literature' },
    { id: 8, name: 'Humor' },
    { id: 9, name: 'Music' },
    { id: 10, name: 'Science' },
];


const Interests: React.FC = () => {
    const navigate = useNavigate();
    const [interestsList, setInterestsList] = useState<Interest[]>(backupInterests); // Initialize with backup
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [customMessage, contextHolder] = antMessage.useMessage();
    const [usingBackup, setUsingBackup] = useState<boolean>(false);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await fetch(`api/interests`, {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setInterestsList(data);
                        setUsingBackup(false);
                    } else {
                        console.warn('Empty interests list received, using fallback');
                        setInterestsList(backupInterests);
                        setUsingBackup(true);
                    }
                } else {
                    console.error('Failed to fetch interests, using fallback');
                    setInterestsList(backupInterests);
                    setUsingBackup(true);
                }
            } catch (error) {
                console.error('Error fetching interests:', error);
                setInterestsList(backupInterests);
                setUsingBackup(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterests();
    });

    const saveInterests = async () => {
        if (selectedInterests.length === 0) {
            customMessage.error("Choose at least one interest");
            return;
        }

        try {
            let saveSuccess = false;

            try {
                const response = await fetch(`api/users/interests`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(selectedInterests),
                    credentials: 'include'
                });

                saveSuccess = response.ok;
            } catch (apiError) {
                console.error('API error:', apiError);
                saveSuccess = false;
            }

            if (saveSuccess) {
                console.log('Interests saved successfully!');
                navigate("/home");
            } else {
                if (usingBackup) {
                    localStorage.setItem('userInterests', JSON.stringify(selectedInterests));
                    console.log('Saved interests using local storage as fallback.');
                    navigate("/home");
                } else {
                    throw new Error('Failed to save interests');
                }
            }
        } catch (error) {
            console.error(error);
            customMessage.error("An error occurred while saving interests");
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
            {contextHolder}
            <Title className="logo">
                <span className="logo-blue">MOVIE</span>
                <span className="logo-orange">LEARN</span>
            </Title>

            <Text className="subtitle">Tell us your interests</Text>
            {usingBackup && (
                <Text type="warning" style={{ marginBottom: '10px' }}>
                    Using backup interests list
                </Text>
            )}
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
            >
                Save Interests
            </button>

        </div>
    );
};

export default Interests;