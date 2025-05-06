import React, {useEffect, useState} from "react";
import {Layout, Avatar, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import "./Layout.css";

const {Header} = Layout;
const {Text} = Typography;

interface User {
    name?: string;
    lastName?: string;
    picture?: string;
    error?: string;
}

const TopBar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/users/account", {credentials: "include"})
            .then(response => response.json())
            .then((data: User) => setUser(data))
            .catch(error => console.error("Error fetching user data:", error))
    }, []);

    return (
        <Header className="topbar">

            <div className="topbar-user">
                <Avatar
                    size="small"
                    src={user ? "/api/users/profile-picture" : undefined}
                    icon={!user?.picture}
                    className="topbar-avatar"
                />
                <Text
                    strong
                    className="topbar-username"
                    onClick={() => navigate("/account")}
                >
                    {user?.name} {user?.lastName}
                </Text>
            </div>
        </Header>
    );
};

export default TopBar;
