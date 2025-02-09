import { defineStore } from 'pinia';

import accountService from '../service/account.service';
import apiService from '../service/api.service';
import { logoutApi } from '../service/auth.service';
import tokenService from '../service/token.service';

export const useAuthStore = defineStore('auth', () => {
    const logout = async () => {
        try {
            await logoutApi();
            tokenService.removeToken();
            accountService.removeAccount();
            window.location.reload();
        } catch (error) {
            console.error('Đăng xuất thất bại:', error);
            tokenService.removeToken();
            accountService.removeAccount();
            window.location.reload();
        }
    };

    const refreshToken = async () => {
        try {
            const res = await apiService.get(`auth/refresh`);
            if (res.data) {
                const { access_token } = res.data;
                tokenService.updateToken(access_token);
                return access_token;
            }
        } catch (error) {}
    };

    return { logout, refreshToken };
});
