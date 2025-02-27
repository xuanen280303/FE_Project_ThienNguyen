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
                <button @click="activeTab = 'all'" :class="['px-5 py-2', activeTab === 'all' ? 'text-orange-500' : 'text-gray-500']">Tất cả</button>
                <button @click="activeTab = 'organization'" :class="['px-5 py-2', activeTab === 'organization' ? 'text-orange-500' : 'text-gray-500']">Tổ chức</button>
                <button @click="activeTab = 'personal'" :class="['px-5 py-2', activeTab === 'personal' ? 'text-orange-500' : 'text-gray-500']">Cá nhân</button>
            </div>
        </div>
        <div class="flex justify-between">
            <div class="w-1/2 flex gap-4 mt-5">
                <Select size="large" v-model="valueFilter.status" :options="optionStatus" placeholder="Chọn tỉnh" checkmark :highlightOnSelect="false" class="w-full md:w-52" />
                <Select size="large" v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Danh mục" checkmark :highlightOnSelect="false" class="w-full md:w-44" />
                <Button icon="pi pi-sync" variant="outlined" severity="secondary" v-tooltip="'Đặt lại bộ lọc'" />
            </div>
            <div class="w-1/2 flex gap-4 mt-5 justify-end">
                <IconField class="w-full md:w-96">
                    <InputText size="large" v-model="valueFilter.search" placeholder="Tìm kiếm tên chiến dịch" class="w-full" />
                    <InputIcon class="pi pi-search" />
                </IconField>
            </div>
        </div>
        <div class="mt-10 grid grid-cols-12">
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <CardProject imageUrl="/Image/cardImage.jpg" title="Chiến dịch gây quỹ cho người nghèo" amount="100.000.000" progress="50" supporters="100" daysLeft="10" />
            </div>
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <CardProject imageUrl="/Image/cardImage.jpg" title="Chiến dịch gây quỹ cho người nghèo" amount="100.000.000" progress="50" supporters="100" daysLeft="10" />
            </div>
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <CardProject imageUrl="/Image/cardImage.jpg" title="Chiến dịch gây quỹ cho người nghèo" amount="100.000.000" progress="50" supporters="100" daysLeft="10" />
            </div>
            <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                <CardProject imageUrl="/Image/cardImage.jpg" title="Chiến dịch gây quỹ cho người nghèo" amount="100.000.000" progress="50" supporters="100" daysLeft="10" />
            </div>
        </div>
        <div class="flex justify-center pb-8">
            <Button label="Xem thêm" size="large" class="w-64 !rounded-2xl !bg-[#F54A00]" />
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const activeTab = ref('all');

const getLeftPosition = () => {
    switch (activeTab.value) {
        case 'all':
            return '0px';
        case 'organization':
            return '87px';
        case 'personal':
            return '182px';
        default:
            return '0px';
    }
};

const valueFilter = ref({
    status: 'Đang thực hiện'
});
const optionStatus = ['Đang thực hiện', 'Đạt mục tiêu', 'Đã kết thúc', 'Tạm dừng'];
</script>
<style></style>
