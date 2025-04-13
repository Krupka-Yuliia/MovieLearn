import React, {useState} from 'react';
import './InterestsPage.css';
import {Typography} from 'antd';
import {useNavigate} from 'react-router-dom';

const {Title, Text} = Typography;

const interestsList = [
    'Sport',
    'Fashion',
    'Food',
    'Space',
    'Art',
    'Traveling',
    'Literature',
    'Humor',
    'Music',
    'Science'
];

const Interests: React.FC = () => {
    const navigate = useNavigate();
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const apiBaseUrl = `${window.location.protocol}//localhost:8080`;

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
                navigate("/account");
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

    return (
        <div className="login-container">
            <Title className="logo">
                <span className="logo-blue">MOVIE</span>
                <span className="logo-orange">LEARN</span>
            </Title>

            <Text className="subtitle">Tell us your interests</Text>
            <div className="buttons">
                {interestsList.map((interest, index) => (
                    <button
                        key={index}
                        className={`interest-button ${
                            selectedInterests.includes(interest) ? 'selected' : ''
                        }`}
                        onClick={() => toggleInterest(interest)}
                    >
                        {interest}
                    </button>
                ))}
            </div>

            <Text className="subtitle-2">Don't worry, you can change it later</Text>
            <button className="home-button" onClick={saveInterests}>
                Save Interests
            </button>
        </div>
    );
};

export default Interests;
