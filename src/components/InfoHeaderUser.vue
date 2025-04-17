<template>
    <div>
        <Chip :label="account?.name" :image="linkUploads(account?.avatar)" :pt:image:class="'!w-11 !h-11 border border-primary !bg-white'" class="!rounded-full" aria-controls="overlay_menu" @click="toggle" />
        <Menu ref="menu" id="overlay_menu" :model="itemAccount" :popup="true" />
    </div>
</template>
<script setup>
import { useAuthStore } from '@/stores/AuthStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { linkUploads } from '../constant/api';
import accountService from '../service/account.service';

const menu = ref();
const router = useRouter();
const { account } = accountService.getAccount();
const authStore = useAuthStore();
const toggle = (event) => {
    menu.value.toggle(event);
};
const itemAccount = ref([
    {
        label: 'Tài khoản',
        items: [
            {
                label: 'Trang chủ người dùng',
                icon: 'pi pi-fw pi-globe',
                command: () => {
                    router.push('/');
                }
            },
            ...(account?.role?.name === 'SUPER_ADMIN'
                ? [
                      {
                          label: 'Quản trị',
                          icon: 'pi pi-fw pi-users',
                          command: () => router.push('/admin')
                      }
                  ]
                : []),

            {
                label: 'Quản lý dự án',
                icon: 'pi pi-fw pi-slack',
                command: () => {
                    router.push('/manager');
                }
            },
            {
                label: 'Tài khoản',
                icon: 'pi pi-fw pi-user',
                command: () => {
                    router.push('/manager-account');
                }
            },
            {
                label: 'Đăng xuất',
                icon: 'pi pi-sign-out',
                command: () => {
                    authStore.logout();
                    router.push('/');
                }
            }
        ]
    }
]);
</script>
<style lang=""></style>
