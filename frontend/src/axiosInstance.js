import axios from 'axios';

export const API_ROOT = 'http://localhost:8000';

const axisoInstance = axios.create({
    baseURL: API_ROOT,
    headers: { 'Content-Type': 'application/json' }
});

export default axisoInstance;