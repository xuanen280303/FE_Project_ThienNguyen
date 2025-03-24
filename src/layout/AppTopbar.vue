<script setup>
import { useLayout } from '@/layout/composables/layout';
import { linkUploads } from '../constant/api';
import accountService from '../service/account.service';
import AppConfigurator from './AppConfigurator.vue';
const { account } = accountService.getAccount();

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/admin" class="layout-topbar-logo">
                <img src="/Image/logo.png" alt="" class="w-56 h-15" />
            </router-link>
        </div>

        <div class="layout-topbar-actions flex items-center gap-4">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <Chip :label="account?.name" :image="linkUploads(account?.avatar)" :pt:image:class="'!w-10 !h-10 border border-primary !bg-white'" class="!rounded-full" />
            </div>
        </div>
    </div>
</template>
