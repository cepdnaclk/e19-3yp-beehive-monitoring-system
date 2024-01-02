// This is the Auth Context file. It will be used to create a context for the authentication of the user.

// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../Services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     AuthService.getCurrentUser()
    //         .then(user => {
    //             setCurrentUser(user);
    //             setIsLoading(false);
    //         })
    //         .catch(error => {
    //             console.error("Failed to fetch current user:", error);
    //             setIsLoading(false);
    //         });
    // }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const user = await AuthService.login(email, password);
            setCurrentUser(user);
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email, password) => {
        setIsLoading(true);
        try {
            const user = await AuthService.register(email, password);
            setCurrentUser(user);
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        AuthService.logout();
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
