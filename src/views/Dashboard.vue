<script setup>
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import apiService from '@/service/api.service';
import { onBeforeMount, ref } from 'vue';

const isLoading = ref(false);
const count = ref({});
const countByMonth = ref({});
const newCount = ref({});
const getAll = async () => {
    try {
        isLoading.value = true;
        const results = await Promise.allSettled([apiService.get('statistics/overview?timeframe=all'), apiService.get('statistics/overview?timeframe=week'), apiService.get('statistics/overview?timeframe=month')]);
        const [total, newTotal, totalByMonth] = results.map((result) => (result.status === 'fulfilled' ? result.value : null));
        count.value = total.data;
        newCount.value = newTotal.data;
        countByMonth.value = totalByMonth.data;
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};

onBeforeMount(async () => {
    await getAll();
});
</script>

<template>
    <Loading v-if="isLoading" />

    <div class="grid grid-cols-12 gap-8">
        <StatsWidget :count="count" :newCount="newCount" />

        <div class="col-span-12 xl:col-span-6">
            <RecentSalesWidget :count="countByMonth" />
            <BestSellingWidget />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <RevenueStreamWidget />
            <NotificationsWidget />
        </div>
    </div>
    <ScrollTop />
</template>
