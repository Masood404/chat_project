import { NotFound, UnexpectedResponseData } from "../errors";

import { createContext, useContext, useEffect, useState, useMemo, useLayoutEffect } from "react";
import axiosInstance from "../axiosInstance";

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const refreshToken = localStorage.getItem('refreshToken');

    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);

    // The state either if the first authentication check is over.
    const [isLoaded, setIsLoaded] = useState(false);
    
    const login = async (formData) => {
        try {
            const { data } = await axiosInstance({
                method: 'POST',
                url: '/token/',
                data: formData
            });
            
            if (!data.access || !data.refresh) throw new UnexpectedResponseData(data);
    
            localStorage.setItem('refreshToken', data.refresh);
            
            setAccessToken(data.access);
        } catch (error) {
            if (error instanceof UnexpectedResponseData) console.error(error.message);
            else throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('refreshToken');

        setAccessToken(null);
    };

    const refreshAccessToken = async () => {

        try {
            if (!refreshToken) throw new NotFound('Refresh token not found.');

            const { data } = await axiosInstance({
                method: 'POST',
                url: '/token/refresh/',
                data: { refresh: refreshToken }
            });

            if (!data.access) throw new UnexpectedResponseData(data);

            setAccessToken(data.access);

        } catch (error) {
            if (error instanceof UnexpectedResponseData) console.error(error.message);
            // Just warn if the refresh token is not found
            else if (error instanceof NotFound) console.warn(error.message);
            else if (error?.response?.status === 401) logout(); 
            else throw error;
        }

    };

    const loadUser = async () => {
        try {
            if (!accessToken) throw new NotFound('Access token not found.');

            const { data } = await axiosInstance('/user/');

            if (!data.id) throw new UnexpectedResponseData(data);

            setUser(data);

        } catch (error) {
            if (error instanceof UnexpectedResponseData || error instanceof NotFound) {
                console.error(error.message);
            }
            // Logout when no user is found
            else if (error?.response?.status === 401) logout();
            else throw error;
        }
    };

    const register = async (formData) => {
        await axiosInstance({
            method: 'POST',
            url: '/users/',
            data: formData
        });
    };

    useEffect(() => {
        refreshAccessToken()
            .finally(() => { 
                // Authentication is check over
                setIsLoaded(true); 
            });
    }, []);

    useEffect(() => {
        if(accessToken) loadUser();
    }, [accessToken]);

    // Synchronous code to set axios interceptors correctly
    useLayoutEffect(() => {
        // If Authorized
        if (accessToken) {
            const requestInterceptor = axiosInstance.interceptors.request.use(
                config => {
                    // Set the Authorization header for the request interceptor
                    config.headers.Authorization = `Bearer ${accessToken}`;
                    return config;
                },
                error => Promise.reject(error)
            );
            
            return () => {
                axiosInstance.interceptors.request.eject(requestInterceptor);
            };
        }

    }, [accessToken]);

    const contextValue = useMemo(() => ({
        user,
        isLoaded,
        accessToken,
        refreshToken,
        login,
        logout,
        register
    }), [user, isLoaded, accessToken, refreshToken]);

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
export { AuthContext, useAuth };

