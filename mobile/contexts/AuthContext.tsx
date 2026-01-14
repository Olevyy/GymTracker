// Manages authentication state so the app know if the user is logged in or not.
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken } from "@/services/authService";

type AuthContextType = {
    isAuthenticated: boolean;
    loading: boolean;
    checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: true, // Checking auth status
    checkAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap the app and provide auth state
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const token = await getAccessToken();
            setAuthenticated(!!token);
        } catch {
            setAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };


// Check auth status on app start
    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};