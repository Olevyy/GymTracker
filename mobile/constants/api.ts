export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://localhost:8000';

export const ENDPOINTS = {
    LOGIN: "/api/users/auth/login/",
    REGISTER: "/api/users/auth/registration/",
    LOGOUT: "/api/users/auth/logout/",
    REFRESH: "/api/users/auth/token/refresh/",
};