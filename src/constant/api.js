import accountService from '@/service/account.service';
import tokenService from '@/service/token.service';
import { useAuthStore } from '@/stores/AuthStore';
import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api/v1/',
    headers: tokenService.getToken().header,
    timeout: 15000,
    withCredentials: true
});

// Add a request interceptor
apiClient.interceptors.request.use(
    function (config) {
        const token = tokenService.getToken().header;
        if (token) {
            config.headers['Authorization'] = token['Authorization'];
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Add a response interceptor
apiClient.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            const store = useAuthStore();
            originalRequest._retry = true;
            try {
                const access_token = await store.refreshToken();
                apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
                return apiClient(originalRequest);
            } catch (_error) {
                await store.logout();
                return Promise.reject(_error);
            } finally {
                await accountService.updateAccount();
            }
        }
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout.');
        }
        return Promise.reject(error);
    }
);

export const linkUploads = function (id) {
    return import.meta.env.VITE_API_URL + '/images/' + id;
};
