import { defineStore } from 'pinia';

import { io } from 'socket.io-client';
import { onBeforeUnmount, reactive } from 'vue';
import accountService from '../service/account.service';
import apiService from '../service/api.service';

export const useNotificationStore = defineStore('notification', () => {
    const state = reactive({
        socket: null,
        notifications: [],
        pagination: {
            page: 1,
            pageSize: 10,
            total: 0
        }
    });
    const { account } = accountService.getAccount();

    const getNotification = async () => {
        try {
            const res = await apiService.get(`notifications?page=${state.pagination.page}&pageSize=${state.pagination.pageSize}&filter=sort=-createdAt`);
            state.notifications = res.data.items;
            state.pagination.total = res.data.total;
        } catch (error) {
            console.error('Lấy thông báo thất bại:', error);
        }
    };
    if (account?._id) {
        state.socket = io(import.meta.env.VITE_API_URL + '/websockets', {
            query: { userId: account?._id }
        });
        state.socket.on('connect', async () => {
            getNotification();
        });
        state.socket.on('connect_error', (error) => {
            console.error('Kết nối socket thất bại:', error);
        });
        state.socket.on('notification', async () => {
            await getNotification();
        });
    }

    onBeforeUnmount(() => {
        if (state.socket) {
            state.socket.disconnect();
        }
    });

    return { state, getNotification };
});
