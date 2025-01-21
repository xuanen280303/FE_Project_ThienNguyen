<template>
    <div id="features" class="py-6 px-4 lg:px-20 mt-8 mx-0 lg:mx-16">
        <div class="grid grid-cols-12 gap-4 justify-center">
            <div class="col-span-12 text-center mt-15 mb-6">
                <div class="text-gray-700 font-bold mb-2 text-[35px] font-mono">Chiến dịch gây quỹ nổi bật</div>
            </div>
            <div class="col-span-12 flex justify-between">
                <div class="text-gray-700 font-bold mb-2 text-2xl">Chiến dịch của Tổ chức</div>
                <router-link to="/" class="text-gray-500 font-semibold mb-2 text-xl hover:underline">Xem tất cả <i class="pi pi-arrow-right"></i></router-link>
            </div>
            <div class="col-span-12">
                <Carousel
                    :pt:pcprevbutton:root:style="{ display: 'none' }"
                    :pt:pcNextButton:root:style="{ display: 'none' }"
                    :value="dataOrganizations"
                    :numVisible="3"
                    :numScroll="1"
                    :responsiveOptions="responsiveOptions"
                    circular
                    :autoplayInterval="10000"
                    showNavigators
                >
                    <template #item="slotProps">
                        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                            <CardProject imageUrl="/Image/cardImage.jpg" :title="slotProps.data.title" :amount="slotProps.data.amount" :progress="slotProps.data.progress" :supporters="slotProps.data.supporters" :daysLeft="slotProps.data.daysLeft" />
                        </div>
                    </template>
                </Carousel>
            </div>
            <div class="col-span-12 flex justify-between">
                <div class="text-gray-700 font-bold mb-2 text-2xl">Chiến dịch của Tổ chức</div>
                <router-link to="/" class="text-gray-500 font-semibold mb-2 text-xl hover:underline">Xem tất cả <i class="pi pi-arrow-right"></i></router-link>
            </div>
            <div class="col-span-12">
                <Carousel
                    :pt:pcprevbutton:root:style="{ display: 'none' }"
                    :pt:pcNextButton:root:style="{ display: 'none' }"
                    :value="dataOrganizations"
                    :numVisible="3"
                    :numScroll="1"
                    class="transition-all duration-300"
                    :responsiveOptions="responsiveOptions"
                    circular
                    showNavigators
                >
                    <template #item="slotProps">
                        <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                            <CardProject imageUrl="/Image/cardImage.jpg" :title="slotProps.data.title" :amount="slotProps.data.amount" :progress="slotProps.data.progress" :supporters="slotProps.data.supporters" :daysLeft="slotProps.data.daysLeft" />
                        </div>
                    </template>
                </Carousel>
            </div>
            <div class="col-span-12 text-center mt-15 mb-6 flex justify-center flex-wrap gap-4">
                <div class="text-gray-700 font-bold mb-2 text-[35px] font-mono w-1/2">Đồng hành cùng cộng đồng thiện nguyện minh bạch từ năm 2021</div>
                <div class="w-full flex gap-20">
                    <div class="w-1/3">
                        <img src="../../assets/Img/Home/achievement.png" alt="" />
                    </div>
                    <div class="w-2/3 flex flex-wrap content-center gap-y-24">
                        <div class="w-1/3 flex gap-2">
                            <div class="w-[12px] h-[12px] rounded-full bg-[#999EF5] mt-3"></div>
                            <div class="flex flex-col">
                                <span class="text-2xl font-medium text-start">Tổ chức</span>
                                <span class="text-5xl text-gray-600 font-bold text-start">233</span>
                            </div>
                        </div>
                        <div class="w-1/3 flex gap-2">
                            <div class="w-[12px] h-[12px] rounded-full bg-[#18CBD7] mt-3"></div>
                            <div class="flex flex-col">
                                <span class="text-2xl font-medium text-start">Cá nhân</span>
                                <span class="text-5xl text-gray-600 font-bold text-start">1.228</span>
                            </div>
                        </div>
                        <div class="w-1/3 flex gap-2">
                            <div class="w-[12px] h-[12px] rounded-full bg-[#FF6D6D] mt-3"></div>
                            <div class="flex flex-col">
                                <span class="text-2xl font-medium text-start">Chiến dịch</span>
                                <span class="text-5xl text-gray-600 font-bold text-start">6.052</span>
                            </div>
                        </div>
                        <div class="w-1/3 flex gap-2">
                            <div class="w-[12px] h-[12px] rounded-full bg-[#0DA059] mt-3"></div>
                            <div class="flex flex-col">
                                <span class="text-2xl font-medium text-start">Thành viên</span>
                                <span class="text-5xl text-gray-600 font-bold text-start">1.382.560</span>
                            </div>
                        </div>
                        <div class="w-1/3 flex gap-2">
                            <div class="w-[12px] h-[12px] rounded-full bg-[#FF9D2E] mt-3"></div>
                            <div class="flex flex-col">
                                <span class="text-2xl font-medium text-start">Lượt ủng hộ</span>
                                <span class="text-5xl text-gray-600 font-bold text-start">2.298.906</span>
                            </div>
                        </div>
                        <div class="w-1/3 flex gap-2">
                            <div class="w-[12px] h-[12px] rounded-full bg-[#7AB6FC] mt-3"></div>
                            <div class="flex flex-col">
                                <span class="text-2xl font-medium text-start">Số tiền (tỷ đồng)</span>
                                <span class="text-5xl text-gray-600 font-bold text-start">10.035,28</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const dataOrganizations = ref([
    {
        id: 1,
        title: 'Chung tay hỗ trợ, chăm lo hơn 2000 sinh viên và người lao động khó khăn...',
        amount: 57715000,
        progress: 100,
        supporters: 17,
        daysLeft: 33
    },
    {
        id: 2,
        title: 'Xây dựng thư viện cho trẻ em vùng cao tại Hà Giang',
        amount: 125000000,
        progress: 75,
        supporters: 42,
        daysLeft: 15
    },
    {
        id: 3,
        title: 'Hỗ trợ người già neo đơn tại Trung tâm Bảo trợ xã hội',
        amount: 85000000,
        progress: 60,
        supporters: 28,
        daysLeft: 25
    },
    {
        id: 4,
        title: 'Quyên góp xây dựng cầu dân sinh tại Đồng Tháp',
        amount: 250000000,
        progress: 40,
        supporters: 89,
        daysLeft: 45
    },
    {
        id: 5,
        title: 'Chương trình "Áo ấm mùa đông" cho trẻ em vùng núi',
        amount: 75000000,
        progress: 85,
        supporters: 63,
        daysLeft: 10
    },
    {
        id: 6,
        title: 'Hỗ trợ phẫu thuật tim bẩm sinh cho trẻ em nghèo',
        amount: 350000000,
        progress: 65,
        supporters: 125,
        daysLeft: 30
    },
    {
        id: 7,
        title: 'Xây dựng trường mầm non cho trẻ em vùng sâu vùng xa',
        amount: 180000000,
        progress: 55,
        supporters: 72,
        daysLeft: 40
    }
]);
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
</script>
