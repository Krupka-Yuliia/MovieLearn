import { useEffect, useState } from "react";
import { Typography, Avatar } from "antd";

interface User {
    name?: string;
    lastName?: string;
    email?: string;
    picture?: string;
    error?: string;
}

const HomePage = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetch("/api/users/account", { credentials: "include" })
            .then(response => response.json())
            .then((data: User) => setUser(data))
            .catch(error => console.error("Error fetching user data:", error));
    }, []);

    if (!user) {
        return <Typography.Title>Loading...</Typography.Title>;
    }

    if (user.error) {
        return <Typography.Title>User not authenticated</Typography.Title>;
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
        }}>
            <Avatar src={user.picture} size={100} />
            <Typography.Title> {user.name} {user.lastName}</Typography.Title>
            <Typography.Text>Email: {user.email}</Typography.Text>
        </div>
    );
};

export default HomePage;
