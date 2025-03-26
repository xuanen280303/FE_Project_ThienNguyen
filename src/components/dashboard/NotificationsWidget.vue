<script setup>
import { format } from 'date-fns';
import { onMounted, ref, watch } from 'vue';
import apiService from '../../service/api.service';

const isLoading = ref(false);
const data = ref([]);
const colorIndex = ref(0);

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
        const res = await apiService.get(`statistics/users${filter ? `?${filter}` : ''}`);
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

const renderColors = [
    { bg: 'bg-red-100', text: 'text-red-600', dark: 'dark:bg-red-400/10 dark:text-red-300' },
    { bg: 'bg-teal-100', text: 'text-teal-600', dark: 'dark:bg-teal-400/10 dark:text-teal-300' },
    { bg: 'bg-cyan-100', text: 'text-cyan-600', dark: 'dark:bg-cyan-400/10 dark:text-cyan-300' },
    { bg: 'bg-pink-100', text: 'text-pink-600', dark: 'dark:bg-pink-400/10 dark:text-pink-300' },
    { bg: 'bg-purple-100', text: 'text-purple-600', dark: 'dark:bg-purple-400/10 dark:text-purple-300' },
    { bg: 'bg-orange-100', text: 'text-orange-600', dark: 'dark:bg-orange-400/10 dark:text-orange-300' },
    { bg: 'bg-lime-100', text: 'text-lime-600', dark: 'dark:bg-lime-400/10 dark:text-lime-300' },
    { bg: 'bg-sky-100', text: 'text-sky-600', dark: 'dark:bg-sky-400/10 dark:text-sky-300' },
    { bg: 'bg-blue-100', text: 'text-blue-600', dark: 'dark:bg-blue-400/10 dark:text-blue-300' },
    { bg: 'bg-green-100', text: 'text-green-600', dark: 'dark:bg-green-400/10 dark:text-green-300' },
    { bg: 'bg-yellow-100', text: 'text-yellow-600', dark: 'dark:bg-yellow-400/10 dark:text-yellow-300' },
    { bg: 'bg-indigo-100', text: 'text-indigo-600', dark: 'dark:bg-indigo-400/10 dark:text-indigo-300' },
    { bg: 'bg-rose-100', text: 'text-rose-600', dark: 'dark:bg-rose-400/10 dark:text-rose-300' },
    { bg: 'bg-fuchsia-100', text: 'text-fuchsia-600', dark: 'dark:bg-fuchsia-400/10 dark:text-fuchsia-300' },
    { bg: 'bg-violet-100', text: 'text-violet-600', dark: 'dark:bg-violet-400/10 dark:text-violet-300' },
    { bg: 'bg-amber-100', text: 'text-amber-600', dark: 'dark:bg-amber-400/10 dark:text-amber-300' },
    { bg: 'bg-emerald-100', text: 'text-emerald-600', dark: 'dark:bg-emerald-400/10 dark:text-emerald-300' },
    { bg: 'bg-slate-100', text: 'text-slate-600', dark: 'dark:bg-slate-400/10 dark:text-slate-300' },
    { bg: 'bg-neutral-100', text: 'text-neutral-600', dark: 'dark:bg-neutral-400/10 dark:text-neutral-300' },
    { bg: 'bg-stone-100', text: 'text-stone-600', dark: 'dark:bg-stone-400/10 dark:text-stone-300' }
];

const getNextColor = () => {
    const color = renderColors[colorIndex.value % renderColors.length];
    colorIndex.value++;
    return color;
};
const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
};
// Reset colorIndex khi data thay đổi
watch(data, () => {
    colorIndex.value = 0;
});
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-6">
            <div class="font-semibold text-2xl text-gray-800">
                <i class="pi pi-chart-bar mr-2 text-orange-500"></i>
                Thống kê số người dùng
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

        <div class="space-y-8" v-if="!isLoading">
            <!-- Vai trò -->
            <div>
                <h3 class="text-lg font-semibold mb-4">Phân loại theo vai trò</h3>
                <ul class="space-y-1">
                    <li v-for="item in data.usersByRole" class="flex items-center p-3 rounded-lg">
                        <div :class="[(color = getNextColor()), color.bg, color.dark, 'w-14 h-14 flex items-center justify-center rounded-full mr-4']">
                            <span :class="[color.text, 'text-xl font-bold']">{{ item.count }}</span>
                        </div>
                        <div class="flex-1">
                            <p class="text-surface-600 dark:text-surface-200 text-sm mb-1">Số lượng</p>
                            <p class="font-medium text-surface-900 dark:text-surface-0">{{ item.role }}</p>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Trạng thái -->
            <div>
                <h3 class="text-lg font-semibold mb-4">Phân loại theo trạng thái</h3>
                <ul class="space-y-1">
                    <li v-for="item in data.usersByStatus" class="flex items-center p-3 rounded-lg">
                        <div :class="[(color = getNextColor()), color.bg, color.dark, 'w-14 h-14 flex items-center justify-center rounded-full mr-4']">
                            <span :class="[color.text, 'text-xl font-bold']">{{ item.count }}</span>
                        </div>
                        <div class="flex-1">
                            <p class="text-surface-600 dark:text-surface-200 text-sm mb-1">Người dùng đang</p>
                            <p class="font-medium text-surface-900 dark:text-surface-0">{{ item.isActive }}</p>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Giới tính -->
            <div>
                <h3 class="text-lg font-semibold mb-4">Phân loại theo giới tính</h3>
                <ul class="space-y-1">
                    <li v-for="item in data.usersByGender" class="flex items-center p-3 rounded-lg">
                        <div :class="[(color = getNextColor()), color.bg, color.dark, 'w-14 h-14 flex items-center justify-center rounded-full mr-4']">
                            <span :class="[color.text, 'text-xl font-bold']">{{ item.count }}</span>
                        </div>
                        <div class="flex-1">
                            <p class="text-surface-600 dark:text-surface-200 text-sm mb-1">Số lượng</p>
                            <p class="font-medium text-surface-900 dark:text-surface-0">{{ item.gender }}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else class="flex justify-center items-center min-h-[200px]">
            <ProgressSpinner strokeWidth="4" class="w-12 h-12" />
        </div>
    </div>
</template>
