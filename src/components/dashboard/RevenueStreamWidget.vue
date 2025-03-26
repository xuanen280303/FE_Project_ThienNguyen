<script setup>
import { useLayout } from '@/layout/composables/layout';
import { format } from 'date-fns';
import { onMounted, ref, watch } from 'vue';
import apiService from '../../service/api.service';

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const chartData = ref(null);
const chartOptions = ref(null);
const year = ref(new Date());
const data = ref({});
const isLoading = ref(false);
const getChartData = async () => {
    try {
        isLoading.value = true;
        const res = await apiService.get(`statistics/donations-by-quarter?year=${format(year.value, 'yyyy')}`);
        data.value = res.data;
        console.log('response', res.data);
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};
async function setChartData() {
    await getChartData();
    const documentStyle = getComputedStyle(document.documentElement);
    data.value.datasets = data.value.datasets.map((item, index) => {
        return {
            type: 'bar',
            ...item,
            backgroundColor: item.label == 'Đang xử lý' ? documentStyle.getPropertyValue('--p-primary-200') : item.label == 'Đã hủy' ? documentStyle.getPropertyValue('--p-primary-300') : documentStyle.getPropertyValue('--p-primary-500'),
            barThickness: 32,
            ...(index === data.value.datasets.length - 1
                ? {
                      borderRadius: {
                          topLeft: 8,
                          topRight: 8
                      },
                      borderSkipped: true
                  }
                : {})
        };
    });

    chartData.value = data.value;
}

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: 'transparent',
                    borderColor: 'transparent'
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: borderColor,
                    borderColor: 'transparent',
                    drawTicks: false
                }
            }
        }
    };
}

watch([getPrimary, getSurface, isDarkTheme], () => {
    setChartData();
    chartOptions.value = setChartOptions();
});

onMounted(() => {
    setChartData();
    chartOptions.value = setChartOptions();
});
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-2xl text-gray-800">
                <i class="pi pi-chart-bar mr-2 text-orange-500"></i>
                Số tiền quyên góp theo quý
            </div>
            <DatePicker v-model="year" view="year" dateFormat="yy" @update:modelValue="setChartData" />
        </div>
        <Chart v-if="!isLoading" type="bar" :data="chartData" :options="chartOptions" class="h-80" />
        <div v-else class="flex justify-center items-center min-h-[200px]">
            <ProgressSpinner strokeWidth="4" class="w-12 h-12" />
        </div>
    </div>
</template>
