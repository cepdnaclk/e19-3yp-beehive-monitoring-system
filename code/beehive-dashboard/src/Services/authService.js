// This is the auth service, it is used to make HTTP requests to the backend for auth.
// src/services/AuthService.jsx

import axios from 'axios';
import { PARENT_API_URL } from './config';

const API_URL = `${PARENT_API_URL}/user/`;

// username is required by the backend's registerUser controller. It used to be
// missing from both the signature and the body, so AuthContext's three
// arguments landed one place to the left and every registration was rejected.
const register = async (username, email, password) => {
    const response = await axios.post(API_URL + 'register', { username, email, password });
    if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const login = async (email, password) => {
    const response = await axios.post(API_URL + 'login', { email, password });
    
    if (response.data.accessToken) {
        
        return response.data;
    } else {
        console.log("bad")
        return false;
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export default {
    register,
    login,
    logout,
    getCurrentUser
};
