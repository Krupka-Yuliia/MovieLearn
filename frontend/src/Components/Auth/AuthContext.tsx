import React, {createContext, useContext, useState, useEffect} from "react";

interface AuthContextType {
    user: unknown;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function checkAuth() {
            fetch("/api/users/account", {credentials: "include"})
                .then((res) => res.json())
                .then((data) => {
                    setUser(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setUser(null);
                    setLoading(false);
                });
        }

        checkAuth();
    }, []);

    async function login() {
        window.location.href = "/oauth2/authorization/google";
    }

    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
