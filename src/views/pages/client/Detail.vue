<template>
    <div class="w-10/12 mx-auto">
        <div class="flex justify-between mt-10 gap-5">
            <div class="w-[62%]">
                <h2 class="text-[25px] font-medium text-gray-800 mb-3">{{ detail.name }}</h2>
                <div class="w-full shadow-lg rounded-2xl overflow-hidden relative">
                    <Galleria :value="detail.listImage" :responsiveOptions="responsiveOptions" :numVisible="5" :circular="true" containerStyle="w-full">
                        <template #item="slotProps">
                            <div class="relative">
                                <div class="absolute bottom-5 left-5 z-50 bg-primary-400 p-2 rounded-xl text-white text-sm font-medium">
                                    {{ detail.campaign?.name }}
                                </div>
                                <img :src="linkUploads(slotProps.item)" :alt="slotProps.item" class="w-full object-contain rounded-2xl" />
                            </div>
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
                            <Tab value="4">Hoạt động (0)</Tab>
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
                                            (event) => {
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
                        <div class="w-full mt-2">
                            <div @click="printStore.generatePDFImport(detail)" class="text-orange-500 text-sm font-semibold underline cursor-pointer">Xem sao kê tài khoản -></div>
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
                                    <p class="text-gray-800 font-semibold text-xl">{{ parseNum(detail.goalAmount) }} VNĐ</p>
                                </div>
                            </div>
                            <div class="w-1/2 flex gap-2">
                                <div class="min-w-14 h-14">
                                    <img src="../../../assets/Img/icon/iconTime.svg" alt="" class="w-full h-full object-cover rounded-full" />
                                </div>
                                <div class="w-full flex flex-col">
                                    <p class="text-gray-500 font-medium">Thời gian còn lại</p>
                                    <p class="text-gray-800 font-semibold text-xl" v-if="detail.status == 'DKT'">Đã kết thúc</p>
                                    <p class="text-gray-800 font-semibold text-xl" v-else>{{ Math.ceil((new Date(detail.endDate) - new Date()) / (1000 * 60 * 60 * 24)) }} ngày</p>
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
                                >Đã đạt được <span class="text-orange-600 font-semibold text-xl">{{ parseNum(detail.currentAmount) }} VNĐ</span></span
                            >

                            <span class="text-gray-800">{{ roundToTwoDecimals((detail.currentAmount / detail.goalAmount) * 100) + '%' }}</span>
                        </div>
                        <div v-if="detail.status != 'DMT' && detail.status != 'DKT' && detail.status != 'CXN' && detail.status != 'TD'">
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
                                    <div class="-min-w-[65px] max-w-[65px] min-h-[65px] max-h-[65px] p-1 border-2 border-red-500 rounded-full relative overflow-hidden aspect-square">
                                        <img :src="item.avatar" alt="" class="w-full h-full object-cover rounded-full" />
                                        <img v-if="index === 0" src="../../../assets/Img/icon/rank1.svg" alt="" class="absolute bottom-0 right-0 w-7 h-7 object-cover" />
                                        <img v-if="index === 1" src="../../../assets/Img/icon/rank2.svg" alt="" class="absolute bottom-0 right-0 w-7 h-7 object-cover" />
                                        <img v-if="index === 2" src="../../../assets/Img/icon/rank3.svg" alt="" class="absolute bottom-0 right-0 w-7 h-7 object-cover" />
                                    </div>
                                    <div class="w-full flex flex-col gap-1">
                                        <p class="text-gray-800 font-semibold text-base">{{ item.name }}</p>
                                        <p class="text-gray-700 italic">Đã kêu gọi {{ parseNum(item.amount) }} VNĐ</p>
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
                    <div class="px-5 py-7" v-if="detail?.type == 'TC'">
                        <div class="w-full flex gap-2 mb-2">
                            <div class="max-w-20 max-h-20 min-w-20 min-h-20">
                                <img :src="detail?.organization?.avatar ? linkUploads(detail?.organization?.avatar) : 'https://placehold.co/50x50'" alt="" class="w-full h-full object-cover rounded-full" />
                            </div>
                            <div class="w-full flex flex-col gap-1">
                                <router-link to="/" class="text-orange-500 font-bold text-lg">{{ detail?.organization?.name }} </router-link>
                                <div>
                                    <span class="text-white font-medium bg-orange-400 rounded-full px-2 py-1 text-sm">{{ detail?.type === 'CN' ? 'Cá nhân' : 'Tổ chức' }}</span>
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
                    <div class="px-5 py-7" v-else>
                        <div class="w-full flex gap-2 mb-2">
                            <div class="max-w-20 max-h-20 min-w-20 min-h-20">
                                <img :src="detail?.user?.avatar ? linkUploads(detail?.user?.avatar) : 'https://placehold.co/50x50'" alt="" class="w-full h-full object-cover rounded-full" />
                            </div>
                            <div class="w-full flex flex-col gap-1">
                                <router-link to="/" class="text-orange-500 font-bold text-lg">{{ detail?.user?.name }} </router-link>
                                <div>
                                    <span class="text-white font-medium bg-orange-400 rounded-full px-2 py-1 text-sm">{{ detail?.type === 'CN' ? 'Cá nhân' : 'Tổ chức' }}</span>
                                </div>
                            </div>
                        </div>
                        <a :href="`tel:${detail?.user?.phoneNumber}`" target="_blank" class="w-full flex gap-2 mt-5" v-if="detail?.user?.phoneNumber"
                            ><img src="../../../assets/Img/icon/phone.svg" alt="" class="w-6 h-6" /> {{ detail?.user?.phoneNumber }}</a
                        >
                        <a :href="`mailto:${detail?.user?.email}`" target="_blank" class="w-full flex gap-2 mt-5" v-if="detail?.user?.email"><img src="../../../assets/Img/icon/gmail.svg" alt="" class="w-6 h-6" /> {{ detail?.user?.email }}</a>
                        <a :href="`${detail?.user?.facebook}`" target="_blank" class="w-full flex gap-2 mt-3" v-if="detail?.user?.facebook"><img src="../../../assets/Img/icon/fb.svg" alt="" class="w-6 h-6" /> {{ detail?.user?.facebook }}</a>
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
                        :supporters="item.totalDonors || 0"
                        :daysLeft="Math.ceil((new Date(item.endDate) - new Date()) / (1000 * 60 * 60 * 24))"
                    />
                </div>
            </div>
        </div>
    </div>
    <Loading v-if="isLoading" />
</template>
<script setup>
import { usePrintStore } from '@/stores/printStore';
import { format } from 'date-fns';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Comment from '../../../components/Comment.vue';
import CardProject from '../../../components/dashboard/CardProject.vue';
import { linkUploads } from '../../../constant/api';
import accountService from '../../../service/account.service';
import apiService from '../../../service/api.service';
import parseNum from '../../../utils/parseNum';

const printStore = usePrintStore();
const url = ref(window.location.href);
const account = accountService.getAccount().account;
const payment = ref([]);
const userCampaign = ref([
    {
        avatar: 'https://images.kienthuc.net.vn/zoom/800/uploaded/thutrang/2023_06_25/1/danh-tinh-hai-co-gai-xinh-dep-giau-co-ai-cung-nguong-mo.png',
        name: 'Trần Minh Châu',
        amount: 25000000,
        startDate: '24/12/2024'
    },
    {
        avatar: 'https://phunuvietnam.mediacdn.vn/179072216278405120/2023/2/2/z407811279454704d3b10be2c47b86e5bd170832bde562-16753562253021567389777.jpg',
        name: 'Nguyễn Duy Quang',
        amount: 3700000,
        startDate: '03/01/2025'
    },
    {
        avatar: 'https://cdn.pixabay.com/photo/2022/10/17/15/02/photography-7527978_1280.jpg',
        name: 'Trần Quốc Anh',
        amount: 900000,
        startDate: '09/10/2024'
    },
    {
        avatar: 'https://cdn-media.sforum.vn/storage/app/media/anh-nguoi-mau-thumb.jpg',
        name: 'Phạm Chi',
        amount: 800000,
        startDate: '05/08/2024'
    },
    {
        avatar: 'https://cdn.24h.com.vn/upload/4-2020/images/2020-11-11/Nu-sinh-Nhan-van-la-nguoi-mau-anh-tuoi-20-mon-mon-dep-xinh-khong-kem-dich-Le-Nhiet-Ba-107368862_2653859988196507_3262836775669550024_n-1605081022-435-width960height960.jpg',
        name: 'Mai Hoa',
        amount: 500000,
        startDate: '06/06/2024'
    },
    {
        avatar: 'https://kiddo.vn/wp-content/uploads/2024/02/anh-em-be-han-quoc-cute-dang-yeu-vo-tu-cung-muon-xiu-1051.jpg',
        name: 'Kim Loan Trần',
        amount: 85000,
        startDate: '20/02/2025'
    },
    {
        avatar: 'https://uploads.nguoidothi.net.vn/content/56b553eb-922a-4c4f-80e1-1229ef7594a2.jpg',
        name: 'Phương Thảo',
        amount: 800000,
        startDate: '28/03/2025'
    },
    {
        avatar: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474053GiS/anh-avatar-be-gai-cute-nguoi-that_043409747.jpg',
        name: 'Hương Giang Phạm',
        amount: 60000,
        startDate: '16/05/2025'
    },
    {
        avatar: 'https://gcs.tripi.vn/public-tripi/tripi-feed/img/474026CqT/hinh-anh-nguoi-dep-cho-dien-thoai-9.jpg',
        name: 'Nguyễn Lê Ngọc Thảo',
        amount: 50000,
        startDate: '03/06/2025'
    },
    {
        avatar: 'https://tq1.mediacdn.vn/thumb_w/660/2020/7/9/v2-2850b903c8c007c423210a5a772eacd11440w-15942837525521220309972.jpg',
        name: 'Hoa Hồng Bạch',
        amount: 10000,
        startDate: '30/09/2024'
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
        const res = await apiService.get(`projects/public/${router.params.id}`);
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
        const res = await apiService.get(`projects/public?page=1&pageSize=3&filter=campaign=${detail.value.campaign._id},status!=CXN,_id!=${router.params.id}`);
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
        const res = await apiService.get(`donations/public?filter=project=${router.params.id},status=PAID&page=${pagination.value.page + 1}&pageSize=${pagination.value.pageSize}${pagination.value.search ? `&search=${pagination.value.search}` : ''}`);
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
