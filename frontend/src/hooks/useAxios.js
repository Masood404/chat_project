import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosInstance';

const useAxios = (initialConfig) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (config) => {
    setLoading(true);
    try {
        const response = await axiosInstance(config);
        setData(response.data);
    } catch (err) {
        setError(err);
    } finally {
        setLoading(false);
    }
    }, []);

    useEffect(() => {
    if (initialConfig) {
        fetchData(initialConfig);
    }
    }, [initialConfig, fetchData]);

    return { data, error, loading, fetchData };
};

export default useAxios;
