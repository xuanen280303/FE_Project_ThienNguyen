<script setup>
import { format } from 'date-fns';
import { onMounted, ref } from 'vue';
import apiService from '../../service/api.service';

const isLoading = ref(false);
const data = ref([]);
onMounted(() => {
    getAll();
});
const filter = {
    timeframe: null,
    startDate: null,
    endDate: null
};
const valueFilter = ref(JSON.parse(JSON.stringify(filter)));
const timeframeOptions = ref([
    { name: 'Tuần này', value: 'week' },
    { name: 'Tháng này', value: 'month' },
    { name: 'Năm này', value: 'year' },
    { name: 'Tất cả', value: 'all' }
]);
const getAll = async () => {
    const conditions = Object.entries(valueFilter.value)
        .filter(([key, value]) => value !== null)
        .map(([key, value]) => {
            if (key === 'startDate') {
                return `startDate=${format(value, 'yyyy-MM-dd')}`;
            }
            if (key === 'endDate') {
                return `endDate=${format(value, 'yyyy-MM-dd')}`;
            }
            return `${key}=${value}`;
        });

    const filter = conditions.join('&');
    try {
        isLoading.value = true;
        const res = await apiService.get(`statistics/organizations${filter ? `?${filter}` : ''}`);
        data.value = res.data;
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};

const resetFilter = () => {
    valueFilter.value = JSON.parse(JSON.stringify(filter));
    getAll();
};

const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
};
</script>

<template>
    <div class="card shadow-md">
        <div class="flex items-center justify-between mb-6">
            <div class="font-semibold text-2xl text-gray-800">
                <i class="pi pi-chart-bar mr-2 text-orange-500"></i>
                Thống kê tổ chức sôi nổi
            </div>
            <div>
                <Button icon="pi pi-filter" class="p-button-rounded p-button-outlined" @click="toggle" />
                <Popover ref="op" class="shadow-lg">
                    <div class="w-80 p-4">
                        <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-gray-200"><i class="pi pi-filter mr-2"></i>Bộ lọc</h3>
                        <div class="flex flex-col gap-4">
                            <div>
                                <label for="timeframe">Thời gian</label>
                                <Dropdown class="w-full" :options="timeframeOptions" v-model="valueFilter.timeframe" optionLabel="name" optionValue="value" placeholder="Chọn thời gian" />
                            </div>
                            <div>
                                <label for="startDate">Ngày bắt đầu</label>
                                <Calendar class="w-full" v-model="valueFilter.startDate" />
                            </div>
                            <div>
                                <label for="endDate">Ngày kết thúc</label>
                                <Calendar class="w-full" v-model="valueFilter.endDate" />
                            </div>
                            <div class="flex gap-4 mt-2">
                                <Button severity="secondary" outlined label="Mặc định" class="w-1/2 hover:bg-gray-100" @click="resetFilter">
                                    <i class="pi pi-refresh mr-2"></i>
                                </Button>
                                <Button label="Áp dụng" class="w-1/2 bg-orange-500 hover:bg-orange-600" @click="getAll">
                                    <i class="pi pi-check mr-2"></i>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Popover>
            </div>
        </div>

        <ul class="list-none p-0 m-0" v-if="!isLoading">
            <li v-for="(item, index) in data.organizationsByProjects" class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 p-4 hover:bg-gray-50 rounded-lg transition-all duration-300">
                <div class="flex items-center gap-3">
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium text-lg block">
                            {{ item.organization }}
                        </span>
                        <div class="mt-1 text-gray-500">
                            <i class="pi pi-folder mr-2"></i>
                            <span class="font-semibold text-orange-500">{{ item.projectCount }}</span> dự án
                        </div>
                    </div>
                </div>
                <div class="mt-3 md:mt-0">
                    <span
                        class="inline-flex items-center px-4 py-2 rounded-full text-sm"
                        :class="[index === 0 ? 'bg-yellow-100 text-yellow-600' : index === 1 ? 'bg-gray-100 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600']"
                    >
                        <i class="pi pi-star-fill mr-2"></i>
                        Hạng {{ index + 1 }}
                    </span>
                </div>
            </li>
        </ul>
        <div v-else class="flex justify-center items-center min-h-[200px]">
            <ProgressSpinner strokeWidth="4" class="w-12 h-12" />
        </div>
    </div>
</template>
