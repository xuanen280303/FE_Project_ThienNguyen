<script setup lang="ts">
import { ref } from 'vue';
import { linkUploads } from '../../constant/api';
import router from '../../router';
import accountService from '../../service/account.service';
import tokenService from '../../service/token.service';
import { useAuthStore } from '../../stores/AuthStore';
import { useNotificationStore } from '../../stores/Notification';

const authStore = useAuthStore();
const { state } = useNotificationStore();
function smoothScroll(id: any) {
    document.body.click();
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
const items = ref([
    {
        label: 'Ủng hộ',
        items: [
            {
                label: 'New',
                icon: 'pi pi-plus',
                command: () => {}
            },
            {
                label: 'Print',
                icon: 'pi pi-print',
                command: () => {}
            }
        ]
    },
    {
        label: 'Gây quỹ',
        items: [
            {
                label: 'New',
                icon: 'pi pi-plus',
                command: () => {}
            },
            {
                label: 'Print',
                icon: 'pi pi-print',
                command: () => {}
            }
        ]
    },
    {
        label: 'Khám phá',
        items: [
            {
                label: 'New',
                icon: 'pi pi-plus',
                command: () => {}
            },
            {
                label: 'Print',
                icon: 'pi pi-print',
                command: () => {}
            }
        ]
    },
    {
        label: 'Giới thiệu',
        items: [
            {
                label: 'New',
                icon: 'pi pi-plus',
                command: () => {}
            },
            {
                label: 'Print',
                icon: 'pi pi-print',
                command: () => {}
            }
        ]
    }
]);
const { account } = accountService.getAccount();
const menu = ref();
const itemAccount = ref([
    {
        label: 'Tài khoản',
        items: [
            {
                label: 'Quản lý',
                icon: 'pi pi-fw pi-users',
                command: () => {
                    router.push('/admin');
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

const toggle = (event) => {
    menu.value.toggle(event);
};

const op = ref();
const toggleNotification = (event) => {
    op.value.toggle(event);
};
</script>

<template>
    <router-link class="flex items-center w-[180px] h-[37px] mr-4" to="/">
        <img src="/Image/logo.png" alt="" class="h-full object-contain w-full" />
    </router-link>
    <Button
        class="lg:!hidden"
        text
        severity="secondary"
        rounded
        v-styleclass="{
            selector: '@next',
            enterFromClass: 'hidden',
            enterActiveClass: 'animate-scalein',
            leaveToClass: 'hidden',
            leaveActiveClass: 'animate-fadeout',
            hideOnOutsideClick: true
        }"
    >
        <i class="pi pi-bars !text-2xl"></i>
    </Button>
    <div class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
        <IconField>
            <InputIcon class="pi pi-search customInputIcon" />
            <InputText placeholder="Tìm kiếm tên chiến dịch" class="rounded-full customerInput" size="large" />
        </IconField>
        <div class="flex">
            <Menubar :model="items" class="text-base font-medium" />

            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2 items-center">
                <Button class="h-9 !rounded-xl" label="Tạo chiến dịch" severity="warn" style="background: linear-gradient(88.87deg, #ff6c57 -5.14%, #ff922e 119.29%)"></Button>
                <div class="pt-2 px-2">
                    <OverlayBadge :value="state.notifications.length > 0 ? state.notifications.filter((item) => item.isRead === false).length : 0" @click="toggleNotification">
                        <i class="pi pi-bell" style="font-size: 1.7rem" />
                    </OverlayBadge>
                    <Popover ref="op">
                        <div class="flex flex-col gap-2 w-[30rem]">
                            <span class="font-medium block mb-1">Thông báo</span>
                            <ul class="list-none p-0 m-0 flex flex-col max-h-[30rem] overflow-y-auto">
                                <li v-for="item in state.notifications" :key="item._id" class="flex items-center gap-2 py-2 px-1 rounded-md hover:bg-surface-200 dark:hover:bg-surface-700 cursor-pointer transition-colors duration-200">
                                    <div class="min-w-14 min-h-14 max-w-14 max-h-14 rounded-full overflow-hidden border-primary border">
                                        <img :src="`https://placehold.co/500x550`" class="w-full h-full" />
                                    </div>
                                    <div class="flex flex-col gap-1 justify-start flex-1">
                                        <span class="font-medium" :class="{ 'text-primary dark:text-primary': !item.isRead }">{{ item.title }}</span>
                                        <div class="text-sm text-surface-500 dark:text-surface-400">
                                            {{ item.message }}
                                        </div>
                                    </div>
                                    <div v-if="!item.isRead" class="w-3 h-3 rounded-full bg-primary"></div>
                                </li>
                            </ul>
                        </div>
                    </Popover>
                </div>

                <Button label="Đăng nhập" to="/login" as="router-link" text severity="warn" v-if="!tokenService.getToken().storage"></Button>
                <Chip :label="account?.name" :image="linkUploads(account?.avatar)" :pt:image:class="'!w-11 !h-11 border border-primary !bg-white'" class="!rounded-full" aria-controls="overlay_menu" @click="toggle" v-else />
                <Menu ref="menu" id="overlay_menu" :model="itemAccount" :popup="true" />
            </div>
        </div>
    </div>
</template>
<style>
.p-menubar {
    border: none !important;
}
.customInputIcon {
    color: orangered !important;
}
.customerInput {
    border-radius: 50px !important;
}
</style>
