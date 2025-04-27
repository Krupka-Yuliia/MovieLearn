import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "./Components/Registration/LoginPage.tsx";
import AccountPage from "./Components/Account/AccountPage.tsx";
import LevelPage from "./Components/Level/LevelPage.tsx";
import UpdateAccountPage from "./Components/Account/UpdateAccountPage.tsx";
import InterestsPage from "./Components/Interests/InterestsPage.tsx";

import {useAuth} from "./Components/Auth/AuthContext";
import {JSX} from "react";
import MoviesList from "./Components/MoviesPages/MoviesList.tsx";
import Home from "./Components/MoviesPages/Home.tsx";
import NewMovieForm from "./Components/MoviesPages/NewMovieForm.tsx";

function PrivateRoute({children}: { children: JSX.Element }) {
    const {user, loading} = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? children : <Navigate to="/login"/>;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/account" element={
                    <PrivateRoute>
                        <AccountPage/>
                    </PrivateRoute>
                }/>
                <Route path="/level" element={
                    <PrivateRoute>
                        <LevelPage/>
                    </PrivateRoute>
                }/>
                <Route path="/interests" element={
                    <PrivateRoute>
                        <InterestsPage/>
                    </PrivateRoute>
                }/>
                <Route path="/account/update" element={
                    <PrivateRoute>
                        <UpdateAccountPage/>
                    </PrivateRoute>
                }/>
                <Route path="/movies" element={
                    <PrivateRoute>
                        <MoviesList/>
                    </PrivateRoute>
                }/>
                <Route path="/home" element={
                    <PrivateRoute>
                        <Home/>
                    </PrivateRoute>
                }/>
                <Route path="/movies/new" element={
                    <PrivateRoute>
                        <NewMovieForm/>
                    </PrivateRoute>
                }/>
            </Routes>
        </Router>
    );
}

export default App;
