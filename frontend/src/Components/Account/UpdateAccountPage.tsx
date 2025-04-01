import { Layout, Typography } from "antd";
import Sidebar from "../Layout/Sidebar";
import TopBar from "../Layout/TopBar";
import FooterBar from "../Layout/Footer";

const { Content } = Layout;
const { Title } = Typography;

const UpdateProfilePage = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sidebar />
            <Layout>
                <TopBar />
                <Content>
                    <div className="profile-container">
                        <Title level={3}>update page</Title>
                    </div>
                </Content>
                <FooterBar />
            </Layout>
        </Layout>
    );
};

export default UpdateProfilePage;
