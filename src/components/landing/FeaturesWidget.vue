<template>
    <div id="features" class="py-6 px-4 lg:px-32 mt-8 mx-0 lg:mx-16">
        <div class="grid grid-cols-12 gap-4 justify-center">
            <div class="col-span-12 text-center mt-15 mb-6">
                <div class="text-gray-700 font-bold mb-2 text-[35px] font-mono">Dự án gây quỹ nổi bật</div>
            </div>
            <!------------------------------------- Chiến dịch của Tổ chức --------------------------------------->
            <div class="col-span-12 flex justify-between">
                <div class="text-gray-700 font-bold mb-2 text-2xl">Dự án của Tổ chức</div>
                <router-link to="/" class="text-gray-500 font-semibold mb-2 text-xl hover:underline">Xem tất cả <i class="pi pi-arrow-right"></i></router-link>
            </div>
            <div class="col-span-12">
                <Carousel
                    :pt:pcprevbutton:root:style="{ display: 'none' }"
                    :pt:pcNextButton:root:style="{ display: 'none' }"
                    :value="state.options.projectsOrganization"
                    :numVisible="3"
                    :numScroll="1"
                    :responsiveOptions="responsiveOptions"
                    circular
                    :autoplayInterval="10000"
                    showNavigators
                >
                    <template #item="slotProps">
                        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                            <CardProject
                                :imageUrl="linkUploads(slotProps.data.image)"
                                :title="slotProps.data.name"
                                :amount="slotProps.data.currentAmount || 0"
                                :link="slotProps.data._id"
                                :progress="(slotProps.data.currentAmount / slotProps.data.goalAmount) * 100 || 0"
                                :supporters="slotProps.data.totalDonors || 0"
                                :daysLeft="Math.ceil((new Date(slotProps.data.endDate) - new Date()) / (1000 * 60 * 60 * 24))"
                            />
                        </div>
                    </template>
                </Carousel>
            </div>
            <!------------------------------------- Chiến dịch của Cá nhân --------------------------------------->
            <div class="col-span-12 flex justify-between">
                <div class="text-gray-700 font-bold mb-2 text-2xl">Dự án của Cá nhân</div>
                <router-link to="/" class="text-gray-500 font-semibold mb-2 text-xl hover:underline">Xem tất cả <i class="pi pi-arrow-right"></i></router-link>
            </div>
            <div class="col-span-12">
                <Carousel
                    :pt:pcprevbutton:root:style="{ display: 'none' }"
                    :pt:pcNextButton:root:style="{ display: 'none' }"
                    :value="state.options.projectsPersonal"
                    :numVisible="3"
                    :numScroll="1"
                    class="transition-all duration-300"
                    :responsiveOptions="responsiveOptions"
                    circular
                    showNavigators
                >
                    <template #item="slotProps">
                        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                            <CardProject
                                :imageUrl="linkUploads(slotProps.data.image)"
                                :link="slotProps.data._id"
                                :title="slotProps.data.name"
                                :amount="slotProps.data.currentAmount || 0"
                                :progress="(slotProps.data.currentAmount / slotProps.data.goalAmount) * 100 || 0"
                                :supporters="slotProps.data.totalDonors || 0"
                                :daysLeft="Math.ceil((new Date(slotProps.data.endDate) - new Date()) / (1000 * 60 * 60 * 24))"
                            />
                        </div>
                    </template>
                </Carousel>
            </div>
            
            <!-- Đồng hành trang chủ -->
            <div class="col-span-12 text-center mt-15 mb-6 flex justify-center flex-wrap gap-4">
                <div class="text-gray-700 font-bold mb-2 text-[35px] font-mono w-1/2">Đồng hành cùng cộng đồng thiện nguyện minh bạch từ năm 2025</div>
                <div class="w-full flex gap-20">
                    <div class="w-1/3">
                        <img src="../../assets/Img/Home/achievement.png" alt="" />
                    </div>
                    <div class="w-2/3 flex flex-wrap content-center gap-y-24">
                        <div class="w-1/3 flex gap-2">
                            <div class="w-[12px] h-[12px] rounded-full bg-[#999EF5] mt-3"></div>
                            <div class="flex flex-col">
                                <span class="text-2xl font-medium text-start">Tổ chức</span>
                                <span class="text-5xl text-gray-600 font-bold text-start">{{ formatNumber(count?.totalOrganizations || 0) }}</span>
                            </div>
                        </div>
                        <div class="w-1/3 flex gap-2">
                            <div class="w-[12px] h-[12px] rounded-full bg-[#18CBD7] mt-3"></div>
                            <div class="flex flex-col">
                                <span class="text-2xl font-medium text-start">Cá nhân</span>
                                <span class="text-5xl text-gray-600 font-bold text-start">{{ formatNumber(count?.totalUsers || 0) }}</span>
                            </div>
                        </div>
                        <div class="w-1/3 flex gap-2">
                            <div class="w-[12px] h-[12px] rounded-full bg-[#FF6D6D] mt-3"></div>
                            <div class="flex flex-col">
                                <span class="text-2xl font-medium text-start">Dự án</span>
                                <span class="text-5xl text-gray-600 font-bold text-start">{{ formatNumber(count?.totalProjects || 0) }}</span>
                            </div>
                        </div>
                        <div class="w-1/3 flex gap-2">
                            <div class="w-[12px] h-[12px] rounded-full bg-[#0DA059] mt-3"></div>
                            <div class="flex flex-col">
                                <span class="text-2xl font-medium text-start">Chiến dịch</span>
                                <span class="text-5xl text-gray-600 font-bold text-start">{{ formatNumber(count?.totalCampaigns || 0) }}</span>
                            </div>
                        </div>
                        <div class="w-1/3 flex gap-2">
                            <div class="w-[12px] h-[12px] rounded-full bg-[#FF9D2E] mt-3"></div>
                            <div class="flex flex-col">
                                <span class="text-2xl font-medium text-start">Lượt ủng hộ</span>
                                <span class="text-5xl text-gray-600 font-bold text-start">{{ formatNumber(count?.totalDonations || 0) }}</span>
                            </div>
                        </div>
                        <div class="w-1/3 flex gap-2">
                            <div class="w-[12px] h-[12px] rounded-full bg-[#7AB6FC] mt-3"></div>
                            <div class="flex flex-col">
                                <span class="text-2xl font-medium text-start">Số tiền</span>
                                <span class="text-5xl text-gray-600 font-bold text-start">{{ count?.totalDonationAmount }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Loading v-if="isLoading" />
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { linkUploads } from '../../constant/api';
import apiService from '../../service/api.service';
const initialState = {
    options: {
        projectsPersonal: [],
        projectsOrganization: []
    }
};
const isLoading = ref(false);
const state = reactive({ ...initialState });
const count = ref({});
const responsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 2,
        numScroll: 1
    }
]);
const formatNumber = (number) => {
    return number.toLocaleString('vi-VN');
};
//------------------------ Hiển thị dữ liệu dự án cá nhân và tổ chức trên trang chủ--------------------------
const useGet = () => {
    const getAll = async () => {
        try {
            isLoading.value = true;
            const results = await Promise.allSettled([
                apiService.get('projects/public?page=1&pageSize=10&filter=sort=-createdAt,type=CN,status!=CXN'),
                apiService.get('projects/public?page=1&pageSize=10&filter=sort=-createdAt,type=TC,status!=CXN'),
                apiService.get('statistics/overview?timeframe=all')
            ]);
            const [resPersonal, resOrganization, total] = results.map((result) => (result.status === 'fulfilled' ? result.value : null));
            count.value = total.data;
            state.options.projectsPersonal = resPersonal.data.items; //Sắp xếp dự án hiển thị đúng thuộc về cá nhân
            state.options.projectsOrganization = resOrganization.data.items; //Sắp xếp dự án hiển thị đúng thuộc về cá nhân
        } catch (error) {
            console.log(error);
        } finally {
            isLoading.value = false;
        }
    };
    return { getAll };
};
const { getAll } = useGet();
onMounted(async () => {
    await getAll();
});
</script>
