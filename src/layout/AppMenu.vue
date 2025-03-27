<script setup>
import { ref } from 'vue';

import { useAuthStore } from '../stores/AuthStore';
import AppMenuItem from './AppMenuItem.vue';
const authStore = useAuthStore();
const model = ref([
    {
        label: 'Menu',

        items: [
            { label: 'Trang chủ', icon: 'pi pi-fw pi-home', to: '/admin' },
            { label: 'Trang chủ người dùng', icon: 'pi pi-fw pi-globe', to: '/' },
            {
                label: 'Quản lý người dùng',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Người dùng',
                        to: '/admin/user'
                    },
                    {
                        label: 'Vai trò',
                        to: '/admin/role'
                    },

                    {
                        label: 'Quyền',
                        to: '/admin/permission'
                    }
                ]
            },
            {
                label: 'Quản lý',
                icon: 'pi pi-fw pi-sitemap',
                items: [
                    {
                        label: 'Chiến dịch',
                        to: '/admin/campaign'
                    },
                    {
                        label: 'Dự án',
                        to: '/admin/project'
                    },
                    {
                        label: 'Người đồng hành',
                        to: '/admin/companion'
                    },
                    {
                        label: 'Tổ chức',
                        to: '/admin/organization'
                    },
                    {
                        label: 'Thông báo',
                        to: '/admin/notification'
                    },
                    {
                        label: 'Gửi thư',
                        to: '/admin/letter'
                    }
                ]
            },
            // {
            //     label: 'Auth',
            //     icon: 'pi pi-fw pi-user',
            //     items: [
            //         {
            //             label: 'Login',
            //             icon: 'pi pi-fw pi-sign-in',
            //             to: '/login'
            //         },
            //         {
            //             label: 'Error',
            //             icon: 'pi pi-fw pi-times-circle',
            //             to: '/error'
            //         },
            //         {
            //             label: 'Access Denied',
            //             icon: 'pi pi-fw pi-lock',
            //             to: '/access'
            //         }
            //     ]
            // },
            {
                label: 'Đăng xuất',
                icon: 'pi pi-fw pi-sign-out',
                command: () => {
                    authStore.logout();
                }
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
