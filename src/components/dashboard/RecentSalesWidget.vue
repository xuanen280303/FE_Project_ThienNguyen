<script setup>
import apiService from '@/service/api.service';
import { format } from 'date-fns';
import { onBeforeMount, ref } from 'vue';

const isLoading = ref(false);
const countByMonth = ref({});
const valueDate = ref('month');
const options = ref([
    { label: 'Tuần', value: 'week' },
    { label: 'Tháng', value: 'month' },
    { label: 'Năm', value: 'year' }
]);
const getAll = async () => {
    try {
        isLoading.value = true;
        const results = await apiService.get(`statistics/overview?timeframe=${valueDate.value}`);
        countByMonth.value = results.data;
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
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl mb-4">Số giao dịch mới theo {{ valueDate === 'year' ? 'năm' : valueDate === 'week' ? 'tuần' : 'tháng' }}</div>
            <Select v-model="valueDate" :options="options" optionLabel="label" optionValue="value" @change="getAll" />
        </div>
        <DataTable :value="countByMonth?.timeStats?.donationSeries" :rows="5" :paginator="true" responsiveLayout="scroll" :loading="isLoading">
            <Column field="date" :header="valueDate === 'year' ? 'Tháng' : 'Ngày'" :sortable="true">
                <template #body="{ data }">
                    {{ valueDate === 'year' ? format(new Date(data.date), 'MM/yyyy') : format(new Date(data.date), 'dd/MM/yyyy') }}
                </template>
            </Column>
            <Column field="count" header="Số giao dịch" :sortable="true"></Column>
            <Column field="amount" header="Số tiền" :sortable="true"> </Column>
        </DataTable>
    </div>
</template>
