<template>
    <div class="w-10/12 mx-auto">
        <div class="flex justify-between mt-10 gap-5">
            <div class="w-[62%]">
                <h2 class="text-[25px] font-medium text-gray-800 mb-3">{{ detail.name }}</h2>
                <div class="w-full shadow-lg rounded-2xl overflow-hidden">
                    <Galleria :value="detail.listImage" :responsiveOptions="responsiveOptions" :numVisible="5" :circular="true" containerStyle="w-full">
                        <template #item="slotProps">
                            <img :src="linkUploads(slotProps.item)" :alt="slotProps.item" class="w-[90%] object-contain rounded-2xl" />
                        </template>
                        <template #thumbnail="slotProps">
                            <img :src="linkUploads(slotProps.item)" :alt="slotProps.item" style="width: 90%; display: block; border-radius: 5px; height: 100px" />
                        </template>
                    </Galleria>
                </div>
                <div class="mt-8">
                    <Tabs value="0">
                        <TabList>
                            <Tab value="0">Câu chuyện</Tab>
                            <Tab value="2">Danh sách ủng hộ</Tab>
                            <Tab value="3">Tương tác</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel value="0">
                                <p class="m-0" v-html="detail.description"></p>
                            </TabPanel>
                            <TabPanel value="2">
                                <div
                                    class="rounded-xl overflow-hidden"
                                    style="
                                        box-shadow:
                                            rgba(0, 0, 0, 0.16) 0px 7px 20px 0px,
                                            rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
                                    "
                                >
                                    <div class="bg-[#F4F4F4] h-14 flex items-center">
                                        <span class="text-orange-600 font-bold text-xl border-b-2 border-orange-600 h-full px-4 flex items-center">Danh sách ủng hộ</span>
                                    </div>

                                    <DataTable
                                        :value="payment"
                                        paginator
                                        :rows="pagination.pageSize"
                                        :totalRecords="pagination.total"
                                        @page="
                                            () => {
                                                pagination.page = event.page;
                                                pagination.pageSize = event.rows;
                                                getDonation();
                                            }
                                        "
                                        :rowsPerPageOptions="[5, 10, 20, 50]"
                                        tableStyle="width: 100%"
                                    >
                                        <template #header>
                                            <IconField>
                                                <InputIcon>
                                                    <i class="pi pi-search" />
                                                </InputIcon>
                                                <InputText class="w-full" placeholder="Nhập tên hoặc email người ủng hộ" v-model="pagination.search" @keyup.enter="getDonation" />
                                            </IconField>
                                        </template>
                                        <Column field="name" header="Người ủng hộ" style="width: 40%">
                                            <template #body="slotProps">
                                                {{ slotProps.data.isAnonymous ? 'Ẩn danh' : slotProps.data.buyerName }}
                                            </template>
                                        </Column>
                                        <Column field="amount" header="Số tiền ủng hộ">
                                            <template #body="slotProps"> {{ parseNum(slotProps.data.amount) }} VNĐ </template>
                                        </Column>
                                        <Column field="createdAt" header="Thời gian ủng hộ">
                                            <template #body="slotProps">
                                                {{ format(slotProps.data.createdAt, 'dd/MM/yyyy HH:mm') }}
                                            </template>
                                        </Column>
                                    </DataTable>
                                </div>
                            </TabPanel>
                            <TabPanel value="3">
                                <p>
                                    <Comment :projectId="router.params.id" />
                                </p>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </div>
            <div class="w-[38%]">
                <div
                    class="w-full rounded-2xl overflow-hidden"
                    style="
                        box-shadow:
                            rgba(0, 0, 0, 0.16) 0px 7px 25px 0px,
                            rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
                    "
                >
                    <div class="px-5 py-7 border-b-4 border-gray-200">
                        <div class="w-full flex gap-2">
                            <div class="min-w-20 max-w-20 min-h-20 max-h-20">
                                <img :src="linkUploads(detail.organization?.avatar) || 'https://placehold.co/50x50'" alt="" class="w-full h-full object-cover rounded-full" />
                            </div>
                            <div class="w-full flex flex-col gap-1">
                                <p class="text-gray-500 font-medium">Tiền ủng hộ được chuyển đến</p>
                                <router-link to="/" class="text-orange-500 font-bold text-lg">{{ detail.organization?.name }}</router-link>
                            </div>
                        </div>
                        <div class="w-full mt-2">
                            <router-link to="/" class="text-orange-500 text-sm font-semibold underline">Xem sao kê tài khoản -></router-link>
                        </div>
                    </div>
                    <div class="px-5 py-7">
                        <div class="flex">
                            <div class="w-1/2 flex gap-2">
                                <div class="min-w-14 h-14">
                                    <img src="../../../assets/Img/icon/iconTarget.svg" alt="" class="w-full h-full object-cover rounded-full" />
                                </div>
                                <div class="w-full flex flex-col">
                                    <p class="text-gray-500 font-medium">Mục tiêu chiến dịch</p>
                                    <p class="text-gray-800 font-semibold text-xl">{{ parseNum(detail.goalAmount) }}</p>
                                </div>
                            </div>
                            <div class="w-1/2 flex gap-2">
                                <div class="min-w-14 h-14">
                                    <img src="../../../assets/Img/icon/iconTime.svg" alt="" class="w-full h-full object-cover rounded-full" />
                                </div>
                                <div class="w-full flex flex-col">
                                    <p class="text-gray-500 font-medium">Thời gian còn lại</p>
                                    <p class="text-gray-800 font-semibold text-xl">{{ Math.ceil((new Date(detail.endDate) - new Date()) / (1000 * 60 * 60 * 24)) }} ngày</p>
                                </div>
                            </div>
                        </div>
                        <div class="w-full mt-6 flex gap-2 items-center">
                            <i class="pi pi-map-marker" style="font-size: 20px"></i>
                            <span>{{ detail.detailAddress }} </span>
                        </div>
                        <div class="w-full mt-6 flex gap-2 items-center">
                            <div class="w-full bg-gray-200 rounded-full h-[13px]">
                                <div class="bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 h-[13px] rounded-full" :style="{ width: `${(detail.currentAmount / detail.goalAmount) * 100}%` }"></div>
                            </div>
                        </div>
                        <div class="w-full mt-6 flex gap-2 items-center justify-between">
                            <span
                                >Đã đạt được <span class="text-orange-600 font-semibold text-xl">{{ parseNum(detail.currentAmount) }} VND</span></span
                            >

                            <span class="text-gray-800">{{ roundToTwoDecimals((detail.currentAmount / detail.goalAmount) * 100) + '%' }}</span>
                        </div>
                        <div v-if="detail.status != 'DMT'">
                            <div class="w-full mt-6 flex gap-2 items-center">
                                <Button label="Đồng hành gây quỹ" variant="outlined" class="w-1/2 !rounded-2xl" size="large" />
                                <Button label="Ủng hộ" class="w-1/2 !rounded-2xl" size="large" as="RouterLink" :to="`/info-donate/${detail._id}`" />
                            </div>
                            <a
                                :href="`https://www.facebook.com/share_channel/?type=reshare&link=${url}&source_surface=external_reshare&display&hashtag=%23thiennguyen`"
                                target="_blank"
                                class="w-full mt-6 flex gap-2 items-center italic text-orange-600 hover:underline"
                                >Chia sẻ chiến dịch để lan tỏa yêu thương đến mọi người <i class="pi pi-share-alt"></i
                            ></a>
                        </div>
                        <div class="mt-4" v-else>
                            <a class="w-full" :href="`https://www.facebook.com/share_channel/?type=reshare&link=${url}&source_surface=external_reshare&display&hashtag=%23thiennguyen`" target="_blank">
                                <Button label="Chia sẻ  " variant="outlined" class="w-full !rounded-2xl" size="large" />
                            </a>
                        </div>
                    </div>
                </div>

                <div
                    class="w-full rounded-2xl overflow-hidden mt-12"
                    style="
                        box-shadow:
                            rgba(0, 0, 0, 0.16) 0px 7px 25px 0px,
                            rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
                    "
                >
                    <div class="px-5 py-7">
                        <h2 class="text-gray-700 font-semibold text-lg mb-4">Đồng hành gây quỹ <span class="text-orange-500 font-semibold text-lg">(14)</span></h2>
                        <div class="overflow-y-auto max-h-[500px]">
                            <template v-for="(item, index) in userCampaign" :key="index">
                                <router-link to="/detail/companions/d" class="w-full flex gap-2 items-center mb-4">
                                    <div class="min-w-[65px] h-[65px] p-1 border-2 border-red-500 rounded-full relative">
                                        <img :src="item.avatar" alt="" class="w-full h-full object-cover rounded-full" />
                                        <img v-if="index === 0" src="../../../assets/Img/icon/rank1.svg" alt="" class="absolute bottom-0 right-0 w-7 h-7 object-cover" />
                                        <img v-if="index === 1" src="../../../assets/Img/icon/rank2.svg" alt="" class="absolute bottom-0 right-0 w-7 h-7 object-cover" />
                                        <img v-if="index === 2" src="../../../assets/Img/icon/rank3.svg" alt="" class="absolute bottom-0 right-0 w-7 h-7 object-cover" />
                                    </div>
                                    <div class="w-full flex flex-col gap-1">
                                        <p class="text-gray-800 font-semibold text-base">{{ item.name }}</p>
                                        <p class="text-gray-700 italic">Đã kêu gọi {{ parseNum(item.amount) }}</p>
                                        <p class="text-gray-500 italic">Ngày bắt đầu: {{ item.startDate }}</p>
                                    </div>
                                </router-link>
                            </template>
                        </div>
                    </div>
                </div>
                <div
                    class="w-full rounded-2xl overflow-hidden mt-12"
                    style="
                        box-shadow:
                            rgba(0, 0, 0, 0.16) 0px 7px 25px 0px,
                            rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
                    "
                >
                    <div class="px-5 pt-7 py-7 border-b-4 border-gray-200">
                        <h2 class="text-gray-700 font-semibold text-lg">Thông tin người vận động</h2>
                    </div>
                    <div class="px-5 py-7">
                        <div class="w-full flex gap-2 mb-2">
                            <div class="max-w-20 max-h-20 min-w-20 min-h-20">
                                <img :src="detail?.organization?.avatar ? linkUploads(detail?.organization?.avatar) : 'https://placehold.co/50x50'" alt="" class="w-full h-full object-cover rounded-full" />
                            </div>
                            <div class="w-full flex flex-col gap-1">
                                <router-link to="/" class="text-orange-500 font-bold text-lg">{{ detail?.organization?.name }} </router-link>
                                <div>
                                    <span class="text-white font-medium bg-orange-400 rounded-full px-2 py-1 text-sm">{{ detail?.organization?.type === 'CN' ? 'Cá nhân' : 'Tổ chức' }}</span>
                                </div>
                            </div>
                        </div>
                        <a :href="`tel:${detail?.organization?.phoneNumber}`" target="_blank" class="w-full flex gap-2 mt-5" v-if="detail?.organization?.phoneNumber"
                            ><img src="../../../assets/Img/icon/phone.svg" alt="" class="w-6 h-6" /> {{ detail?.organization?.phoneNumber }}</a
                        >
                        <a :href="`mailto:${detail?.organization?.email}`" target="_blank" class="w-full flex gap-2 mt-5" v-if="detail?.organization?.email"
                            ><img src="../../../assets/Img/icon/gmail.svg" alt="" class="w-6 h-6" /> {{ detail?.organization?.email }}</a
                        >
                        <a :href="`${detail?.organization?.facebook}`" target="_blank" class="w-full flex gap-2 mt-3" v-if="detail?.organization?.facebook"
                            ><img src="../../../assets/Img/icon/fb.svg" alt="" class="w-6 h-6" /> {{ detail?.organization?.facebook }}</a
                        >
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full h-[6px] bg-gray-100 mt-10 rounded-full"></div>
        <div class="w-full mt-5">
            <div class="flex justify-between">
                <div class="w-1/2">
                    <h2 class="text-gray-800 font-semibold text-xl">Bản đồ thiện nguyện</h2>
                </div>
                <RouterLink :to="`/category/${detail?.campaign?._id}`" class="text-orange-600 text-xl hover:underline">Xem tất cả</RouterLink>
            </div>
            <div class="flex gap-6 mt-5 pb-16">
                <div class="w-1/3" v-for="(item, index) in projectByCampaign" :key="index">
                    <CardProject
                        :imageUrl="linkUploads(item.image)"
                        :title="item.name"
                        :amount="item.currentAmount || 0"
                        :link="item._id"
                        :progress="(item.currentAmount / item.goalAmount) * 100 || 0"
                        :supporters="23"
                        :daysLeft="Math.ceil((new Date(item.endDate) - new Date()) / (1000 * 60 * 60 * 24))"
                    />
                </div>
            </div>
        </div>
    </div>
    <Loading v-if="isLoading" />
</template>
<script setup>
import { format } from 'date-fns';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Comment from '../../../components/Comment.vue';
import CardProject from '../../../components/dashboard/CardProject.vue';
import { linkUploads } from '../../../constant/api';
import apiService from '../../../service/api.service';
import parseNum from '../../../utils/parseNum';
const url = ref(window.location.href);
const payment = ref([]);
const userCampaign = ref([
    {
        avatar: 'https://placehold.co/50x50',
        name: 'Trần Quốc Anh',
        amount: 100000000,
        startDate: '24/12/2024'
    },
    {
        avatar: 'https://placehold.co/50x50',
        name: 'Trần Quốc Anh',
        amount: 100000000,
        startDate: '24/12/2024'
    },
    {
        avatar: 'https://placehold.co/50x50',
        name: 'Trần Quốc Anh',
        amount: 100000000,
        startDate: '24/12/2024'
    },
    {
        avatar: 'https://placehold.co/50x50',
        name: 'Trần Quốc Anh',
        amount: 100000000,
        startDate: '24/12/2024'
    },
    {
        avatar: 'https://placehold.co/50x50',
        name: 'Trần Quốc Anh',
        amount: 100000000,
        startDate: '24/12/2024'
    },
    {
        avatar: 'https://placehold.co/50x50',
        name: 'Trần Quốc Anh',
        amount: 100000000,
        startDate: '24/12/2024'
    },
    {
        avatar: 'https://placehold.co/50x50',
        name: 'Trần Quốc Anh',
        amount: 100000000,
        startDate: '24/12/2024'
    },
    {
        avatar: 'https://placehold.co/50x50',
        name: 'Trần Quốc Anh',
        amount: 100000000,
        startDate: '24/12/2024'
    },
    {
        avatar: 'https://placehold.co/50x50',
        name: 'Trần Quốc Anh',
        amount: 100000000,
        startDate: '24/12/2024'
    },
    {
        avatar: 'https://placehold.co/50x50',
        name: 'Trần Quốc Anh',
        amount: 100000000,
        startDate: '24/12/2024'
    }
]);
const isLoading = ref(false);
const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 4
    }
]);

const router = useRoute();
const detail = ref({});
const getDetail = async () => {
    isLoading.value = true;
    try {
        const res = await apiService.get(`projects/${router.params.id}`);
        detail.value = res.data;
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};
const projectByCampaign = ref([]);
const getProjectByCampaign = async () => {
    try {
        const res = await apiService.get(`projects?page=1&pageSize=3&filter=campaign=${detail.value.campaign._id}`);
        projectByCampaign.value = res.data.items;
    } catch (error) {
        console.log(error);
    }
};
const pagination = ref({
    page: 0,
    pageSize: 5,
    total: 0,
    search: ''
});
const getDonation = async () => {
    try {
        const res = await apiService.get(`donations?filter=project=${router.params.id}&page=${pagination.value.page + 1}&pageSize=${pagination.value.pageSize}${pagination.value.search ? `&search=${pagination.value.search}` : ''}`);
        payment.value = res.data.items;
        pagination.value.total = res.data.total;
    } catch (error) {
        console.log(error);
    }
};
onMounted(async () => {
    await getDetail();
    await getProjectByCampaign();
    await getDonation();
});

watch(
    () => router.params.id,
    async () => {
        await getDetail();
        await getProjectByCampaign();
    }
);

const roundToTwoDecimals = (num) => {
    if (typeof num !== 'number') return 0; // Trả về 0 nếu không phải là số
    return Math.round((num + Number.EPSILON) * 100) / 100; // Làm tròn đến 2 chữ số thập phân
};
</script>
<style>
.p-galleria {
    border-radius: 15px !important;
}
.p-tabpanels {
    padding: 15px 0 !important;
}
</style>
