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
            <div class="font-semibold text-2xl text-gray-800">
                <i class="pi pi-chart-bar mr-2 text-orange-500"></i>
                Số giao dịch mới theo <span class="text-orange-500">{{ valueDate === 'year' ? 'NĂM' : valueDate === 'week' ? 'TUẦN' : 'THÁNG' }}</span>
            </div>
            <Select v-model="valueDate" :options="options" optionLabel="label" optionValue="value" @change="getAll" />
        </div>
        <DataTable v-if="!isLoading" :value="countByMonth?.timeStats?.donationSeries" :rows="5" :paginator="true" responsiveLayout="scroll">
            <Column field="date" :header="valueDate === 'year' ? 'Tháng' : 'Ngày'" :sortable="true">
                <template #body="{ data }">
                    {{ valueDate === 'year' ? format(new Date(data.date), 'MM/yyyy') : format(new Date(data.date), 'dd/MM/yyyy') }}
                </template>
            </Column>
            <Column field="count" header="Số giao dịch" :sortable="true"></Column>
            <Column field="amount" header="Số tiền" :sortable="true"> </Column>
        </DataTable>
        <div v-else class="flex justify-center items-center min-h-[200px]">
            <ProgressSpinner strokeWidth="4" class="w-12 h-12" />
        </div>
    </div>
</template>
