import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./Components/Registration/LoginPage.tsx";
import AccountPage from "./Components/Account/AccountPage.tsx";
import LevelPage from "./Components/Level/LevelPage.tsx";
import UpdateAccountPage from "./Components/Account/UpdateAccountPage.tsx";
import InterestsPage from "./Components/Interests/InterestsPage.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/account" element={<AccountPage/>}/>
                <Route path="/level" element={<LevelPage/>}/>
                <Route path="/interests" element={<InterestsPage/>}/>
                <Route path="/account/update" element={<UpdateAccountPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
