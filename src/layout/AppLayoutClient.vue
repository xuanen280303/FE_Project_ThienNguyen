<script setup>
import FooterWidget from '@/components/landing/FooterWidget.vue';
import Header from '@/components/landing/Header.vue';
</script>

<template>
    <div class="bg-surface-0 dark:bg-surface-900">
        <div id="home" class="landing-wrapper ">
            <div class="lg:px-44 h-[76px] flex items-center justify-between sticky top-0 z-50 bg-surface-0 dark:bg-surface-900">
                <Header />
            </div>
            <router-view></router-view>
        </div>
        <FooterWidget />
    </div>
</template>
