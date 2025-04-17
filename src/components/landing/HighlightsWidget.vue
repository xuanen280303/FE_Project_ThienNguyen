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
                    <CardUser :amount="18569000000" description="Quỹ dành cho trẻ em" mail="quytnbs" name="Quỹ Tony Buổi sáng" image="https://static.thiennguyen.app/public/user/profile/2023/10/2/27eda2cc-5b87-4adf-a79c-136c23214654.jpg" />
                </div>
                <div class="w-1/3">
                    <CardUser :amount="76382000000" description="Quỹ vì người nghèo" mail="quyvinguoingheonghean" name="Quỹ vì người nghèo tỉnh Nghệ An" image="https://static.thiennguyen.app/public/user/profile/2024/9/18/7574f73a-23e4-4917-a6b5-383bc0a1ecbf.jpg" />
                </div>
                <div class="w-1/3">
                    <CardUser :amount="125388000000" description="Quỹ vì môi trường biển đảo" mail="higreentruongsa" name="HiGreen Trường Sa" image="https://static.thiennguyen.app/public/user/profile/2025/3/31/41106d54-1e40-4fa6-894b-09494ab6d78e.jpg" />
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
