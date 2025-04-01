import React from "react";
import { Layout } from "antd";
import "./Layout.css";

const { Footer } = Layout;

const FooterBar: React.FC = () => {
    return (
        <Footer className="footer">
            <span>@ Yuliia Krupka 2025</span>
        </Footer>
    );
};

export default FooterBar;