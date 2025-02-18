<template>
    <div class="w-10/12 mx-auto">
        <div class="flex justify-between mt-10 gap-5">
            <div class="w-[62%]">
                <h2 class="text-[25px] font-medium text-gray-800 mb-3">Quỹ xe cứu thương 0 đông</h2>
                <div class="w-full shadow-lg rounded-2xl overflow-hidden">
                    <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5" :circular="true" containerStyle="w-full">
                        <template #item="slotProps">
                            <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block; border-radius: 15px" />
                        </template>
                        <template #thumbnail="slotProps">
                            <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 90%; display: block; border-radius: 5px" />
                        </template>
                    </Galleria>
                </div>
                <div class="mt-8">
                    <Tabs value="0">
                        <TabList>
                            <Tab value="0">Câu chuyện</Tab>
                            <Tab value="2">Danh sách ủng hộ</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel value="0">
                                <p class="m-0">
                                    Theo Trung tâm Dự báo khí tượng, thủy văn Quốc gia, miền Bắc mùa đông năm nay được dự báo sẽ rét hơn, và điều này đã bắt đầu thể hiện từ những ngày đầu thu. Dưới tác động của hiện tượng La Nina, mùa đông sẽ có
                                    nhiều thay đổi so với năm 2023 (năm chúng ta chịu ảnh hưởng của El Nino). Với vùng cao biên giới, rét đậm, rét hại hay sương mù, mưa phùn vào buổi sáng vẫn diễn ra thường xuyên, biên độ giao động nhiệt độ ngày và
                                    đêm lớn có khi tới hơn 10 độ C, buổi sáng từ 9-10 độ, trưa là 19 -20 độ nhưng tối lại rét hơn, từ 8-9 độ. Có thể ở thành phố thời tiết vào thu dễ chịu, nhưng ở vùng Tây Bắc có độ cao so với mực nước biển là 1000 -
                                    1100m như tỉnh Sơn La thời tiết những ngày này đã trở lạnh. Các em nhỏ vùng cao không có áo ấm, co ro đi tìm cái chữ, mới thấy được con đường tìm kiếm cái chữ để có tương lai đỡ vất vả của các em gian nan như thế
                                    nào. Tiếp nối thành công của 4 chương trình đông ấm, dự án sẽ tiến hành huy động nguồn lực thực hiện chương trình Đông ấm cho em mùa 5 chủ đề “Hơi ấm chuyền tay" cho đến khi hoàn thành kế hoạch đề ra với 11.299 áo
                                    ấm cho tất cả các em nhỏ thuộc hệ sinh thái dự án Nuôi em Mộc Châu. Một lần nữa, Hệ sinh thái dự án Nuôi em Mộc Châu xin được gửi lời tri ân sâu sắc đến toàn thể quý Anh/ Chị nuôi, quý Mạnh thường quân và toàn thể
                                    cộng đồng luôn chung sức, chung lòng để sẻ chia và lan tỏa “hơi ấm yêu thương” đến các em nhỏ vùng cao Sơn La.
                                </p>
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

                                    <DataTable :value="payment" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="width: 100%">
                                        <template #header>
                                            <IconField>
                                                <InputIcon>
                                                    <i class="pi pi-search" />
                                                </InputIcon>
                                                <InputText class="w-full" placeholder="Nhập tên người ủng hộ" />
                                            </IconField>
                                        </template>
                                        <Column field="name" header="Người ủng hộ" style="width: 40%"></Column>
                                        <Column field="total" header="Số tiền ủng hộ"></Column>
                                        <Column field="createdDate" header="Thời gian ủng hộ"></Column>
                                    </DataTable>
                                </div>
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
                            <div class="min-w-20 h-20">
                                <img src="https://placehold.co/50x50" alt="" class="w-full h-full object-cover rounded-full" />
                            </div>
                            <div class="w-full flex flex-col gap-1">
                                <p class="text-gray-500 font-medium">Tiền ủng hộ được chuyển đến</p>
                                <router-link to="/" class="text-orange-500 font-bold text-lg">Dự án Nuôi em Mộc Châu </router-link>
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
                                    <p class="text-gray-800 font-semibold text-xl">100.000.000 VNĐ</p>
                                </div>
                            </div>
                            <div class="w-1/2 flex gap-2">
                                <div class="min-w-14 h-14">
                                    <img src="../../../assets/Img/icon/iconTime.svg" alt="" class="w-full h-full object-cover rounded-full" />
                                </div>
                                <div class="w-full flex flex-col">
                                    <p class="text-gray-500 font-medium">Thời gian còn lại</p>
                                    <p class="text-gray-800 font-semibold text-xl">40 ngày</p>
                                </div>
                            </div>
                        </div>
                        <div class="w-full mt-6 flex gap-2 items-center">
                            <i class="pi pi-map-marker" style="font-size: 20px"></i>
                            <span>Trường Trung Học Cơ Tân Xuân ,Xã Tân Xuân,Huyện Vân Hồ,Tỉnh Sơn La </span>
                        </div>
                        <div class="w-full mt-6 flex gap-2 items-center">
                            <div class="w-full bg-gray-200 rounded-full h-[13px]">
                                <div class="bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 h-[13px] rounded-full" :style="{ width: `20%` }"></div>
                            </div>
                        </div>
                        <div class="w-full mt-6 flex gap-2 items-center">Đã đạt được <span class="text-orange-600 font-semibold text-xl">812.768.616 VND</span></div>
                        <div class="w-full mt-6 flex gap-2 items-center">
                            <Button label="Đồng hành gây quỹ" variant="outlined" class="w-1/2 !rounded-2xl" size="large" />
                            <Button label="Ủng hộ" class="w-1/2 !rounded-2xl" size="large" />
                        </div>
                        <a
                            :href="`https://www.facebook.com/share_channel/?type=reshare&link=${url}&source_surface=external_reshare&display&hashtag=%23thiennguyen`"
                            target="_blank"
                            class="w-full mt-6 flex gap-2 items-center italic text-orange-600 hover:underline"
                            >Chia sẻ chiến dịch để lan tỏa yêu thương đến mọi người <i class="pi pi-share-alt"></i
                        ></a>
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
                                <router-link to="/" class="w-full flex gap-2 items-center mb-4">
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
                            <div class="min-w-20 h-20">
                                <img src="https://placehold.co/50x50" alt="" class="w-full h-full object-cover rounded-full" />
                            </div>
                            <div class="w-full flex flex-col gap-1">
                                <router-link to="/" class="text-orange-500 font-bold text-lg">Dự án Nuôi em Mộc Châu </router-link>
                                <div>
                                    <span class="text-white font-medium bg-orange-400 rounded-full px-2 py-1 text-sm">Cá nhân</span>
                                </div>
                            </div>
                        </div>
                        <a href="mailto:duongtrieuhai@icloud.com" target="_blank" class="w-full flex gap-2 mt-5"><img src="../../../assets/Img/icon/gmail.svg" alt="" class="w-6 h-6" /> duongtrieuhai@icloud.com</a>
                        <a href="https://www.facebook.com/nuoiemmocchau/about" target="_blank" class="w-full flex gap-2 mt-3"><img src="../../../assets/Img/icon/fb.svg" alt="" class="w-6 h-6" />https://www.facebook.com/nuoiemmocchau/about</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full h-[5px] bg-gray-200 mt-10 rounded-full"></div>
        <div class="w-full mt-5">
            <div class="flex justify-between">
                <div class="w-1/2">
                    <h2 class="text-gray-800 font-semibold text-xl">Bản đồ thiện nguyện</h2>
                </div>
                <RouterLink to="/" class="text-orange-600 text-xl hover:underline">Xem tất cả</RouterLink>
            </div>
            <div class="flex gap-6 mt-5">
                <div class="w-1/3">
                    <CardProject imageUrl="/Image/cardImage.jpg" title="Chiến dịch gây quỹ cho người nghèo" amount="100.000.000" progress="50" supporters="100" daysLeft="10" />
                </div>
                <div class="w-1/3">
                    <CardProject imageUrl="/Image/cardImage.jpg" title="Chiến dịch gây quỹ cho người nghèo" amount="100.000.000" progress="50" supporters="100" daysLeft="10" />
                </div>
                <div class="w-1/3">
                    <CardProject imageUrl="/Image/cardImage.jpg" title="Chiến dịch gây quỹ cho người nghèo" amount="100.000.000" progress="50" supporters="100" daysLeft="10" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import CardProject from '../../../components/dashboard/CardProject.vue';
import parseNum from '../../../utils/parseNum';
const url = ref(window.location.href);
const payment = ref([
    {
        name: 'Trần Quốc Anh',
        total: '100.000.000 VNĐ',
        createdDate: '24/12/2024'
    }
]);
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
const images = ref([
    {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg'
    },
    {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg'
    },
    {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg'
    },
    {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg'
    },
    {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg'
    },
    {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria2.jpg'
    }
]);

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
</script>
<style>
.p-galleria {
    border-radius: 15px !important;
}
.p-tabpanels {
    padding: 15px 0 !important;
}
</style>
