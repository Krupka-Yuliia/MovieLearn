import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./Components/Registration/LoginPage.tsx";
import HomePage from "./Components/Home/HomePage.tsx";
import LevelPage from "./Components/Level/LevelPage.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/account" element={<HomePage/>}/>
                <Route path="/level" element={<LevelPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
