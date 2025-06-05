<template>
    <!-- Dialog xem chi tiết dự án -->
    <Button icon="pi pi-eye" outlined rounded class="mr-2" @click="getDataDetail(props.data)" v-tooltip="'Xem chi tiết'" />

    <Dialog v-model:visible="isEventDialog" :style="{ width: '1200px' }" :modal="true" maximizable>
        <template #header>
            <h4 class="m-0 text-xl font-bold">Chi tiết dự án</h4>
        </template>

        <div class="mb-8">
            <div class="flex gap-6">
                <div class="w-1/4">
                    <h5 class="text-lg font-semibold">Ảnh nổi bật:</h5>
                    <img :src="eventData.image ? linkUploads(eventData.image) : 'https://placehold.co/128x128'" alt="avatar" class="w-full h-[180px] object-cover rounded-xl" />
                </div>
                <div class="w-3/4">
                    <h5 class="text-lg font-semibold">Danh sách ảnh:</h5>
                    <div class="flex gap-4 overflow-x-auto">
                        <template v-if="eventData.listImage?.length > 0">
                            <img v-for="item in eventData.listImage" :key="item" :src="linkUploads(item)" alt="avatar" class="w-[200px] h-[180px] object-cover rounded-xl flex-shrink-0" />
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-x-12 gap-y-6 mb-8">
            <div>
                <h5 class="text-lg font-semibold mb-4">Thông tin cơ bản</h5>

                <div class="space-y-4">
                    <div>
                        <p class="text-gray-600">Tên dự án:</p>
                        <p class="text-lg">{{ eventData.name || '--' }}</p>
                    </div>

                    <div>
                        <p class="text-gray-600">Trạng thái:</p>
                        <p class="text-lg">{{ getStatus(eventData.status) || '--' }}</p>
                    </div>
                    <div>
                        <p class="text-gray-600">Email người tạo:</p>
                        <p class="text-lg">{{ eventData.createdBy?.email || '--' }}</p>
                    </div>
                    <div>
                        <p class="text-gray-600">Địa chỉ:</p>
                        <p class="text-lg">{{ eventData.address || '--' }}</p>
                        <p class="text-lg">
                            {{ [eventData.ward?.full_name, eventData.district?.full_name, eventData.province?.full_name].filter(Boolean).join(', ') || '--' }}
                        </p>
                    </div>
                    <div>
                        <p class="text-gray-600">Số người đã quyên góp:</p>
                        <p class="text-lg">{{ formatNumber(eventData?.totalDonors || 0) || '--' }} người</p>
                    </div>
                    <div>
                        <p class="text-gray-600">Trạng thái:</p>
                        <p class="text-lg">{{ getStatus(eventData.status) || '--' }}</p>
                    </div>
                </div>
            </div>

            <div>
                <h5 class="text-lg font-semibold mb-4">Thông tin quyên góp</h5>

                <div class="space-y-4">
                    <div>
                        <p class="text-gray-600">Mục tiêu quyên góp:</p>
                        <p class="text-lg font-medium">{{ eventData.goalAmount?.toLocaleString() || '--' }} VNĐ</p>
                    </div>
                    <div>
                        <p class="text-gray-600">Số tiền đã đạt được:</p>
                        <p class="text-lg font-medium">{{ formatNumber(eventData.currentAmount || 0) || '--' }} VNĐ</p>
                    </div>

                    <div>
                        <p class="text-gray-600">
                            Thời gian: {{ Math.ceil((new Date(eventData.endDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 0 ? 'Đã kết thúc' : Math.ceil((new Date(eventData.endDate) - new Date()) / (1000 * 60 * 60 * 24)) + ' ngày' }}
                        </p>
                        <p class="text-lg">Từ: {{ eventData.startDate ? format(new Date(eventData.startDate), 'dd/MM/yyyy HH:mm') : '--' }}</p>
                        <p class="text-lg">Đến: {{ eventData.endDate ? format(new Date(eventData.endDate), 'dd/MM/yyyy HH:mm') : '--' }}</p>
                    </div>

                    <div>
                        <p class="text-gray-600">Thuộc loại:</p>
                        <p class="text-lg">{{ eventData.type === 'CN' ? 'Cá nhân' : 'Tổ chức' }}</p>
                    </div>

                    <div>
                        <p class="text-gray-600">{{ eventData.type === 'CN' ? 'Cá nhân' : 'Tổ chức' }} kêu gọi:</p>
                        <p class="text-lg">{{ eventData.type === 'CN' ? eventData.user?.name : eventData.organization?.name }}</p>
                    </div>

                    <div>
                        <p class="text-gray-600">Chiến dịch:</p>
                        <p class="text-lg">{{ eventData.campaign?.name || '--' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full mt-4">
            <div class="border rounded-lg p-4 space-y-2">
                <p class="font-bold">Mô tả</p>
                <div class="prose max-w-none" v-html="eventData.description"></div>
            </div>
        </div>

        <template #footer>
            <Button label="Đóng" icon="pi pi-times" text @click="hideDialog" />
        </template>
    </Dialog>
</template>
<script setup>
import { linkUploads } from '@/constant/api';
import apiService from '@/service/api.service';
import { format } from 'date-fns';
import { ref } from 'vue';

const props = defineProps(['data']);
const isEventDialog = ref(false);
const eventData = ref({});

async function getDataDetail(prod) {
    try {
        const res = await apiService.get(`projects/${prod._id}`);
        eventData.value = res.data;
    } catch (error) {
        console.log(error);
    }
    isEventDialog.value = true;
}
const getStatus = (status) => {
    switch (status) {
        case 'CXN':
            return 'Chờ xác nhận';
        case 'DTH':
            return 'Đang thực hiện';
        case 'DMT':
            return 'Đạt mục tiêu';
        case 'DKT':
            return 'Đã kết thúc';
        case 'TD':
            return 'Tạm dừng';
        default:
            return status;
    }
};
const getStatusDonation = (status) => {
    switch (status) {
        case 'PENDING':
            return 'Chờ thanh toán';
        case 'PAID':
            return 'Đã thanh toán';
        case 'CANCELLED':
            return 'Đã hủy';
        default:
            return status;
    }
};
const formatNumber = (number) => {
    return number.toLocaleString();
};
</script>
