import { apiClient } from '../constant/api';

const moduleName = '/auth';
export const loginApi = async (username, password) => {
    try {
        const res = await apiClient.post(`${moduleName}/login`, {
            username,
            password
        });
        return res.data;
    } catch (err) {}
};

export const loginByGoogleApi = async () => {
    try {
        const res = await apiClient.get(`${moduleName}/google`);
        return res;
    } catch (err) {}
};

export const refreshApi = async () => {
    try {
        const res = await apiClient.get(`${moduleName}/refresh`, {
            withCredentials: true
        });
        return { success: true, data: res.data.data };
    } catch (err) {
        console.error('Error refreshing API:', err);
        return { success: false };
    }
};

export const registerApi = async (user) => {
    try {
        const res = await apiClient.post(`${moduleName}/register`, user);
        return res.data;
    } catch (err) {}
};

export const registerHRApi = async (user) => {
    try {
        const res = await apiClient.post(`${moduleName}/customer/register`, user);
        return res.data;
    } catch (err) {}
};

export const createCompanyApi = async (data) => {
    try {
        const res = await apiClient.post(`${moduleName}/customer/company`, data);
        return res.data;
    } catch (err) {}
};

export const logoutApi = async () => {
    try {
        const res = await apiClient.post(`${moduleName}/logout`);
        return res.data;
    } catch (err) {}
};

export const accountApi = async () => {
    try {
        const res = await apiClient.get(`${moduleName}/account`);
        return res.data;
    } catch (err) {}
};
