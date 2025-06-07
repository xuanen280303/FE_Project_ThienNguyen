<template>
    <div class="bg-[#F9F3EE] gap-5">
        <div class="flex flex-wrap w-[85%] mx-auto py-10">
            <div class="w-5/12 bg-white shadow-lg rounded-2xl">
                <div class="px-5 py-5 border-b-4 border-[#F9F3EE]">
                    <div class="w-full flex gap-2" v-if="detail.type == 'TC'">
                        <div class="min-w-20 max-w-20 min-h-20 max-h-20">
                            <img :src="linkUploads(detail.organization?.avatar) || 'https://placehold.co/50x50'" alt="" class="w-full h-full object-cover rounded-full" />
                        </div>
                        <div class="w-full flex flex-col gap-1">
                            <p class="text-gray-500 font-medium">Tiền ủng hộ được chuyển đến</p>
                            <router-link to="/" class="text-orange-500 font-bold text-lg">{{ detail.organization?.name }}</router-link>
                        </div>
                    </div>
                    <div class="w-full flex gap-2" v-else>
                        <div class="min-w-20 max-w-20 min-h-20 max-h-20">
                            <img :src="linkUploads(detail.user?.avatar) || 'https://placehold.co/50x50'" alt="" class="w-full h-full object-cover rounded-full" />
                        </div>
                        <div class="w-full flex flex-col gap-1">
                            <p class="text-gray-500 font-medium">Tiền ủng hộ được chuyển đến</p>
                            <router-link to="/" class="text-orange-500 font-bold text-lg">{{ detail.user?.name }}</router-link>
                        </div>
                    </div>
                </div>
                <div class="p-5 flex flex-col gap-4">
                    <p>Bạn đang ủng hộ cho chiến dịch</p>
                    <div class="w-full flex justify-center rounded-3xl h-[320px] relative">
                        <p class="absolute top-2 left-2 font-medium bg-gray-100 px-3 py-1 rounded-full">Còn {{ Math.ceil((new Date(detail.endDate) - new Date()) / (1000 * 60 * 60 * 24)) }} ngày</p>
                        <img :src="detail?.image ? linkUploads(detail?.image) : 'https://placehold.co/50x50'" alt="" class="w-full h-full object-contain rounded-3xl bg-orange-100" />
                    </div>
                    <h4 class="text-xl font-semibold text-zinc-800">{{ detail.name }}</h4>
                    <div class="flex flex-col gap-2">
                        <div class="flex justify-between text-base">
                            <p>
                                Đã đạt được <span class="text-primary-500 font-bold text-xl">{{ parseNum(detail.currentAmount) }} VND</span>
                            </p>
                            <p class="font-bold">{{ roundToTwoDecimals((detail.currentAmount / detail.goalAmount) * 100) + '%' }}</p>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-[10px]">
                            <div class="bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 h-[10px] rounded-full" :style="{ width: `${(detail.currentAmount / detail.goalAmount) * 100}%` }"></div>
                        </div>
                        <div class="flex justify-between text-base">
                            <p class="text-zinc-500">
                                Của mục tiêu <span class="text-zinc-800 font-medium text-base">{{ parseNum(detail.goalAmount) }} VND</span>
                            </p>
                            <p class="text-zinc-500">
                                <span class="text-zinc-800 font-medium text-base">{{ detail.totalDonors || 0 }} lượt ủng hộ</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-7/12 pl-10 flex flex-col gap-7">
                <h3 class="text-xl font-medium">Thông tin ủng hộ</h3>
                <div class="flex flex-col gap-1">
                    <label for="total" class="text-[13px]">Nhập số tiền ủng hộ <small class="text-red-500">*</small> </label>
                    <InputGroup>
                        <InputNumber :invalid="submitted && !dataDonate.amount" v-model="dataDonate.amount" size="large" :pt:pcinputtext:root:class="'h-[58px] !rounded-s-2xl !border-r-0 !text-primary-500 !text-xl font-semibold'" />
                        <InputGroupAddon class="!text-primary font-bold" :pt:root:class="'!rounded-e-2xl !border-l-none'">VNĐ</InputGroupAddon>
                    </InputGroup>
                    <div class="flex gap-5 mt-3">
                        <div v-for="amount in amounts" :key="amount" class="w-1/4">
                            <div class="relative">
                                <input type="radio" :id="'amount-' + amount" :value="amount" v-model="dataDonate.amount" class="hidden peer" />
                                <label :for="'amount-' + amount" class="block bg-gray-50 rounded-2xl px-3 py-2 shadow-lg text-center text-lg font-semibold cursor-pointer hover:bg-orange-400 peer-checked:bg-orange-500 peer-checked:text-white">
                                    {{ amount.toLocaleString() }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <label for="name" class="text-[13px]">Lời chúc </label>
                    <InputText v-model="dataDonate.note" placeholder="Nhập lời chúc trao gửi yêu thương" size="large" class="!rounded-xl" />
                </div>
                <h3 class="text-xl font-medium">Thông tin của bạn</h3>
                <div class="flex flex-col gap-1">
                    <label for="name" class="text-[13px]">Họ và Tên</label>
                    <InputText v-model="dataDonate.buyerName" placeholder="Họ tên" size="large" class="!rounded-xl" />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="email" class="text-[13px]">Địa chỉ Email</label>
                    <InputText v-model="dataDonate.buyerEmail" placeholder="Nhập địa chỉ email" size="large" class="!rounded-xl" />
                    <p class="text-[13px] text-gray-500">Bạn sẽ nhận được một email xác nhận về thông tin đóng góp của mình</p>
                </div>
                <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                        <Checkbox v-model="dataDonate.isAnonymous" inputId="ingredient1" name="pizza" binary />
                        <label for="ingredient1"> Ủng hộ ẩn danh </label>
                    </div>
                </div>
                <div class="mt-5">
                    <Button @click="handleDonate" :loading="isLoadingBtn" label="Ủng hộ" class="w-full !rounded-2xl h-[45px] !text-xl" style="background: linear-gradient(88.87deg, #ff922e -5.14%, #ff6c57 119.29%)" />
                    <p class="text-[13px] font-semibold text-center mt-5">Bằng việc ủng hộ, bạn đã đồng ý với <a href="#" class="text-primary-500">Điều khoản và Điều kiện</a> của chúng tôi</p>
                </div>
            </div>
        </div>
    </div>
    <Loading v-if="isLoading" />
</template>
<script setup>
import { InputGroup, InputGroupAddon, InputNumber, useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { linkUploads } from '../../../constant/api';
import accountService from '../../../service/account.service';
import apiService from '../../../service/api.service';
import parseNum from '../../../utils/parseNum';
const amounts = [50000, 100000, 200000, 500000];
const toast = useToast();
const router = useRoute();
const isLoading = ref(false);
const detail = ref({});
const { account } = accountService.getAccount();
const getDetail = async () => {
    try {
        isLoading.value = true;
        const res = await apiService.get(`projects/public/${router.params.id}`);
        detail.value = res.data;
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    getDetail();
});
const roundToTwoDecimals = (num) => {
    if (typeof num !== 'number') return 0; // Trả về 0 nếu không phải là số
    return Math.round((num + Number.EPSILON) * 100) / 100; // Làm tròn đến 2 chữ số thập phân
};
const dataDonate = ref({
    amount: 0,
    buyerName: account?.name,
    buyerEmail: account?.email,
    note: '',
    user: account?._id || null,
    isAnonymous: false,
    cancelUrl: window.location.origin + '/cancel/' + router.params.id,
    returnUrl: window.location.origin + '/success/' + router.params.id
});
const isLoadingBtn = ref(false);
const submitted = ref(false);
const validate = () => {
    if (!dataDonate.value.amount) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập số tiền ủng hộ', life: 3000 });
        return false;
    }
    if (!dataDonate.value.note) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập lời chúc', life: 3000 });
        return false;
    }
    submitted.value = false;
    return true;
};
const handleDonate = async () => {
    submitted.value = true;
    if (!validate()) return;
    isLoadingBtn.value = true;
    try {
        const res = await apiService.post(`donations`, { ...dataDonate.value, project: detail.value._id });
        if (res.data.paymentLink?.checkoutUrl) {
            window.location.href = res.data.paymentLink.checkoutUrl;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response.data.message || 'Đã xảy ra lỗi trong quá trình thanh toán', life: 3000 });
    } finally {
        isLoadingBtn.value = false;
    }
};
</script>
<style></style>
