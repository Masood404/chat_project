import axiosInstance from "../axiosInstance";
import { UnexpectedResponseData } from "../errors";

import { useEffect, useState } from "react";

const useSearch = (apiEndpoint = '', delay = 300, queryKey = 'q') => {
    const [query, setQuery] = useState('');
    // Debounced query is the actual query getting sent to the api with a delayed effect applied.
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const [results, setResults] = useState([]);

    const [loading, setLoading]= useState(false);

    const search = async () => {
        try {
            // Start the loading state
            setLoading(true);

            const response = await axiosInstance(apiEndpoint + `?${queryKey}=${encodeURIComponent(debouncedQuery)}`);

            if (!response?.data?.results) throw new UnexpectedResponseData(response?.data ?? response);

            setResults(response.data.results);
        }
        catch (error) {
            if (error instanceof UnexpectedResponseData) console.error(error.message);
            else throw error;
        }
        finally {
            // End the loading state
            setLoading(false);
        }
    };

    const handleChange = ({ target: { value } }) => {
        setQuery(value);
    };

    useEffect(() => {
        // Set the debounced query with a delay on change of the inputted query. Essentially the debounce effect.
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, delay);

        return () => clearTimeout(handler);

    }, [query]);

    useEffect(() => {
        // Check for empty debounced query
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }

        // Initiate search
        search();

    }, [debouncedQuery]);

    return { query, debouncedQuery, results, loading, handleChange };
};

export default useSearch;