import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./Components/Registration/LoginPage.tsx";
import HomePage from "./Components/Home/HomePage.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/home" element={<HomePage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
