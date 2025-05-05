<template>
    <div class="w-10/12 mx-auto">
        <h1 class="text-2xl font-bold w-full text-center text-[30px] text-orange-500 pt-20">Danh sách chiến dịch gây quỹ</h1>
        <div class="flex justify-center space-x-5 mt-16 text-[16px] font-medium text-gray-500">
            <div class="relative">
                <div
                    class="absolute bottom-0 h-0.5 bg-orange-500 transition-all duration-300"
                    :style="{
                        left: getLeftPosition(),
                        width: '80px'
                    }"
                ></div>
                <button
                    @click="
                        () => {
                            valueFilter.type = '';
                            handleFilter();
                        }
                    "
                    :class="['px-5 py-2', valueFilter.type === '' ? 'text-orange-500' : 'text-gray-500']"
                >
                    Tất cả
                </button>
                <button
                    @click="
                        () => {
                            valueFilter.type = 'TC';
                            handleFilter();
                        }
                    "
                    :class="['px-5 py-2', valueFilter.type === 'TC' ? 'text-orange-500' : 'text-gray-500']"
                >
                    Tổ chức
                </button>
                <button
                    @click="
                        () => {
                            valueFilter.type = 'CN';
                            handleFilter();
                        }
                    "
                    :class="['px-5 py-2', valueFilter.type === 'CN' ? 'text-orange-500' : 'text-gray-500']"
                >
                    Cá nhân
                </button>
            </div>
        </div>
        <div class="flex justify-between">
            <div class="w-1/2 flex gap-4 mt-5">
                <Select @change="handleFilter" size="large" v-model="valueFilter.status" :options="optionStatus" optionValue="value" optionLabel="label" placeholder="Chọn tỉnh trạng" checkmark :highlightOnSelect="false" class="w-full md:w-52" />
                <Select @change="handleFilter" size="large" v-model="valueFilter.campaign" :options="optionCategory" optionLabel="name" optionValue="_id" placeholder="Danh mục" checkmark :highlightOnSelect="false" class="w-full md:w-52" />
                <Button icon="pi pi-sync" variant="outlined" severity="secondary" v-tooltip="'Đặt lại bộ lọc'" @click="handleReset" />
            </div>
            <div class="w-1/2 flex gap-4 mt-5 justify-end">
                <IconField class="w-full md:w-96">
                    <InputText size="large" v-model="keySearch" placeholder="Tìm kiếm tên chiến dịch" class="w-full" @keyup.enter="handleFilter" />
                    <InputIcon class="pi pi-search" />
                </IconField>
            </div>
        </div>
        <div class="mt-10 grid grid-cols-12">
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0" v-for="item in dataCategory" :key="item._id">
                <CardProject
                    :imageUrl="linkUploads(item.image)"
                    :title="item.name"
                    :amount="item.currentAmount || 0"
                    :link="item._id"
                    :progress="(item.currentAmount / item.goalAmount) * 100 || 0"
                    :supporters="item.totalDonors || 0"
                    :daysLeft="Math.ceil((new Date(item.endDate) - new Date()) / (1000 * 60 * 60 * 24))"
                />
            </div>
        </div>
        <div class="flex justify-center pb-8">
            <Button label="Xem thêm" size="large" class="w-64 !rounded-2xl !bg-[#F54A00]" v-if="pagination.page < pagination.total" @click="handlePage" />
        </div>
    </div>
    <Loading v-if="isLoading" />
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { linkUploads } from '../../../constant/api';
import apiService from '../../../service/api.service';

const router = useRoute();
const getLeftPosition = () => {
    switch (valueFilter.value.type) {
        case '':
            return '0px';
        case 'TC':
            return '91px';
        case 'CN':
            return '190px';
        default:
            return '0px';
    }
};
const isLoading = ref(false);
const valueFilter = ref({
    status: 'CXN',
    sort: false,
    type: '',
    campaign: router.params?.id
});
const keySearch = ref('');
const optionStatus = ref([
    { label: 'Tất cả', value: 'CXN' },
    { label: 'Đang thực hiện', value: 'DTH' },
    { label: 'Đạt mục tiêu', value: 'DMT' },
    { label: 'Đã kết thúc', value: 'DKT' },
    { label: 'Tạm dừng', value: 'TD' }
]);
const pagination = ref({
    page: 1,
    pageSize: 9,
    total: 0
});
const optionCategory = ref([]);
const dataCategory = ref([]);
const getCategory = async () => {
    isLoading.value = true;
    const conditions = Object.entries(valueFilter.value)
        .filter(([key, value]) => value !== null && value !== '' && value !== undefined)
        .map(([key, value]) => {
            if (key === 'sort') {
                return `sort=${value ? 'createdAt' : '-createdAt'}`;
            }
            if (key === 'status' && value === 'CXN') {
                return `status!=CXN`;
            }
            return `${key}=${value}`;
        });

    const filter = conditions.join(',');
    try {
        const res = await apiService.get(`projects/public?page=${pagination.value.page}&pageSize=${pagination.value.pageSize}&filter=${filter}&search=${keySearch.value}`);
        pagination.value.total = res.data.total;
        dataCategory.value = res.data.items;
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};
const getAllCategory = async () => {
    try {
        const res = await apiService.get(`campaigns/getAll`);
        optionCategory.value = res.data;
    } catch (error) {
        console.log(error);
    }
};

const handleFilter = () => {
    pagination.value.page = 1;
    getCategory();
};

const handlePage = () => {
    pagination.value.pageSize += 6;
    getCategory();
};
const handleReset = () => {
    valueFilter.value = {
        status: 'CXN',
        sort: false,
        type: '',
        campaign: router.params.id
    };
    keySearch.value = '';
    handleFilter();
};

onMounted(() => {
    Promise.all([getCategory(), getAllCategory()]);
});
</script>
<style></style>
