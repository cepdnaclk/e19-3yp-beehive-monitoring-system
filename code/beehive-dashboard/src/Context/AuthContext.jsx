// This is the Auth Context file. It will be used to create a context for the authentication of the user.

// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../Services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(false);
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
        var result = false;
        try {
            const user = await AuthService.login(email, password);
            //save access token in storage
            console.log(user);
            localStorage.setItem("user", JSON.stringify(user.accessToken));
            result = true;
            setCurrentUser(user);


            
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
            
        }
        if (result) {
            return true;
        }
        else {
            return false;
        }
    };

    // Returns a boolean like login does. It previously returned nothing, so the
    // caller had no way to tell success from failure.
    const register = async (username, email, password) => {
        setIsLoading(true);
        let result = false;
        try {
            const user = await AuthService.register(username, email, password);
            setCurrentUser(user);
            result = true;
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setIsLoading(false);
        }
        return result;
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
