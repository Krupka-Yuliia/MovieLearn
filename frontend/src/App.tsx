import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "./Components/Registration/LoginPage.tsx";
import AccountPage from "./Components/Account/AccountPage.tsx";
import LevelPage from "./Components/Level/LevelPage.tsx";
import UpdateAccountPage from "./Components/Account/UpdateAccountPage.tsx";
import InterestsPage from "./Components/Interests/InterestsPage.tsx";

import {useAuth} from "./Components/Auth/AuthContext";
import {JSX, useEffect, useState} from "react";
import Home from "./Components/MoviesPages/Home.tsx";
import MoviesList from "./Components/MoviesPages/MoviesList.tsx";
import NewMovieForm from "./Components/MoviesPages/NewMovieForm.tsx";
import MovieDetails from "./Components/MoviesPages/MovieDetails.tsx";
import NewGenreForm from "./Components/MoviesPages/NewGenreForm.tsx";
import NewInterestsForm from "./Components/Interests/NewInterestsForm.tsx";
import UpdateMovieForm from "./Components/MoviesPages/UpdateMovieForm.tsx";

function PrivateRoute({children, requiredRole}: { children: JSX.Element, requiredRole?: string }) {
    const {user, loading} = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (user && requiredRole && user.role !== requiredRole) {
            setErrorMessage('You do not have the required role to access this page. Redirecting to Movies list.');
        }
    }, [user, requiredRole]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/"/>;
    } else if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/movies" state={{errorMessage}}/>;
    }

    return children;
}


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
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
                <Route path="/home" element={
                    <PrivateRoute>
                        <Home/>
                    </PrivateRoute>
                }/>
                <Route path="/movies" element={
                    <PrivateRoute>
                        <MoviesList/>
                    </PrivateRoute>
                }/>
                <Route path="/movies/new" element={
                    <PrivateRoute requiredRole="ADMIN">
                        <NewMovieForm/>
                    </PrivateRoute>
                }/>
                <Route path="/movies/:id" element={
                    <PrivateRoute>
                        <MovieDetails/>
                    </PrivateRoute>
                }/>
                <Route path="/movies/edit/:id" element={
                    <PrivateRoute requiredRole="ADMIN">
                        <UpdateMovieForm/>
                    </PrivateRoute>
                }/>
                <Route path="/genres/new" element={
                    <PrivateRoute requiredRole="ADMIN">
                        <NewGenreForm/>
                    </PrivateRoute>
                }/>
                <Route path="/interests/new" element={
                    <PrivateRoute requiredRole="ADMIN">
                        <NewInterestsForm/>
                    </PrivateRoute>
                }/>
            </Routes>
        </Router>
    );
}

export default App;
