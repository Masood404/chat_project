import { createContext, useContext, useEffect, useState, useMemo, useLayoutEffect } from 'react';
import axiosInstance from '../axiosInstance';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const refreshToken = localStorage.getItem('refreshToken');

    const [accessToken, setAccessToken] = useState(null);

    const [isLoaded, setIsLoaded] = useState(false);

    const login = async (formData) => {
        const { data } = await axiosInstance({
            method: 'POST',
            url: '/token/',
            data: formData
        });

        if (!data.access || !data.refresh) throw data;

        localStorage.setItem('refreshToken', data.refresh);

        setAccessToken(data.access);
    };

    const logout = () => {
        localStorage.removeItem('refreshToken');

        setAccessToken(null);
    };

    const refreshAccessToken = async () => {

        try {
            if (!refreshToken) throw 'Refresh token not found.';

            const { data } = await axiosInstance({
                method: 'POST',
                url: '/token/refresh/',
                data: { refresh: refreshToken }
            });

            if (!data.access) throw data;

            setAccessToken(data.access);

        } catch (error) {
            logout();
            console.error(error);
        }

    };

    useEffect(() => {
        refreshAccessToken()
            .finally(() => { setIsLoaded(true); });
    }, []);

    useLayoutEffect(() => {
        if (accessToken) {
            const requestInterceptor = axiosInstance.interceptors.request.use(
                config => {
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
        isLoaded,
        accessToken,
        refreshToken,
        login,
        logout
    }), [isLoaded, accessToken, refreshToken]);

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
export { AuthContext, useAuth };