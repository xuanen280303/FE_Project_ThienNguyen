<script setup lang="ts">
import CardUser from '../dashboard/CardUser.vue';
</script>

<template>
    <div class="theme-users">
        <div class="w-[78%] m-auto">
            <div class="flex justify-between">
                <div class="text-5xl font-bold text-white">Tổ chức, cá nhân gây quỹ nổi bật</div>
                <router-link to="/" class="text-white font-semibold mb-2 text-xl hover:underline">Xem tất cả <i class="pi pi-arrow-right"></i></router-link>
            </div>
            <div class="w-full flex gap-7 mt-16">
                <div class="w-1/3">
                    <CardUser />
                </div>
                <div class="w-1/3">
                    <CardUser />
                </div>
                <div class="w-1/3">
                    <CardUser />
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.theme-users {
    padding: 80px 0;
    background-image: url(../../assets/Img/Home/theme.png);
    background-size: cover;
    background-repeat: no-repeat;
}
</style>
