import React, {useEffect, useState} from "react";
import {Layout, Avatar, Typography, Input, Button} from "antd";
import {useNavigate} from "react-router-dom";
import {SearchOutlined} from "@ant-design/icons";
import "./Layout.css";

const {Header} = Layout;
const {Text} = Typography;
const {Search} = Input;

interface User {
    name?: string;
    lastName?: string;
    picture?: string;
    error?: string;
}

const TopBar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/users/account", {credentials: "include"})
            .then(response => response.json())
            .then((data: User) => setUser(data))
            .catch(error => console.error("Error fetching user data:", error));
    }, []);

    const handleSearch = () => {
        // TO DO
    };

    return (
        <Header className="topbar">
            <div className="topbar-right">
                <div className="topbar-search">
                    <Search
                        placeholder="Search movies..."
                        allowClear
                        enterButton={<Button icon={<SearchOutlined/>}/>}
                        size="middle"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onSearch={handleSearch}
                        className="search-input"
                    />
                </div>

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
            </div>
        </Header>

    );
};

export default TopBar;