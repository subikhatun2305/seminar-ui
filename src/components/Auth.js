import axios from 'axios';
import Cookies from 'js-cookie';
import { auth_api } from '../Api/Api';

const axiosInstance = axios.create({
    baseURL: 'auth_api',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
