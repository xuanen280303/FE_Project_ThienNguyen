<script setup>
import AppConfigurator from './layout/AppConfigurator.vue';
</script>

<template>
    <Toast />
    <AppConfigurator />
    <router-view />
    <ScrollTop size="large" />
</template>

<style>
.p-scrolltop {
    width: 3.5rem !important;
    height: 3.5rem !important;
}
.p-scrolltop-icon {
    width: 1.5rem !important;
    height: 1.5rem !important;
}
</style>
