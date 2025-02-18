import { defineStore } from 'pinia';

import accountService from '../service/account.service';
import apiService from '../service/api.service';
import { logoutApi } from '../service/auth.service';
import tokenService from '../service/token.service';

export const useAuthStore = defineStore('auth', () => {
    const logout = async (isCallApi = true) => {
        try {
            if (isCallApi) {
                await logoutApi();
            }
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
        } catch (error) {
            debugger;
            console.log(error);
            if (error.status == 404 && error.response?.data?.message == 'Token không tồn tại.') {
                alert('Tài khoản đã được đăng nhập từ nơi khác');
                await logout(false);
            }
        }
    };

    return { logout, refreshToken };
});
