import { Button, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import "./LoginPage.css";
import { useAuth } from "../Auth/AuthContext";

const LoginPage = () => {
    const { login } = useAuth();

    const handleGoogleLogin = () => {
        login();
    };

    return (
        <div className="login-container">
            <Typography.Title className="logo">
                <span className="logo-blue">MOVIE</span>
                <span className="logo-orange">LEARN</span>
            </Typography.Title>

            <Typography.Text className="subtitle">
                Study English with your favorite movies!
            </Typography.Text>

            <Button
                type="primary"
                icon={<GoogleOutlined />}
                size="large"
                className="google-button"
                onClick={handleGoogleLogin}
            >
                Sign In
            </Button>
        </div>
    );
};

export default LoginPage;
