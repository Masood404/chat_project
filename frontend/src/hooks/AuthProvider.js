import { createContext, useContext, useEffect, useState, useMemo, useLayoutEffect } from 'react';
import axiosInstance from '../axiosInstance';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const refreshToken = localStorage.getItem('refreshToken');

    const [isLogged, setIsLogged] = useState(false);

    const login = async (formData) => {
        const { data } = await axiosInstance({
            method: 'POST',
            url: '/token/',
            data: formData
        });

        if (!data.access || !data.refresh) throw data;

        localStorage.setItem('refreshToken', data.refresh);

        setIsLogged(true);
    };

    const logout = () => { 
        localStorage.removeItem('refreshToken'); 
        setIsLogged(false);
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
            
            axiosInstance.interceptors.request.use(
                config => {
                    config.headers.Authorization = `Bearer ${data.access}`;
                    return config;
                },
                error => Promise.reject(error)
            );

            setIsLogged(true);

        } catch (error) {
            logout();
            console.error(error);
        }

    };

    useEffect(() => { refreshAccessToken(); }, []);

    const contextValue = useMemo(() => ({
        isLogged,
        refreshToken,
        login,
        logout
    }), [refreshToken, isLogged]);

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
export { AuthContext, useAuth };