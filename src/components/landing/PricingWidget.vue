<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <div class="w-[95%] lg:w-[80%] mx-auto my-6 lg:my-20">
        <div class="flex justify-between mb-6 items-end">
            <div class="font-bold text-[38px]"><span class="bg-[#BCFF1E] text-[#006139] px-5 py-3 rounded-2xl">Sự kiện</span> thiện nguyện</div>
            <router-link to="/" class="text-gray-500 font-semibold mb-2 text-xl hover:underline">Xem tất cả <i class="pi pi-arrow-right"></i></router-link>
        </div>

        <div class="grid grid-rows-5 gap-4 grid-cols-12 justify-between mt-20 md:mt-0 bg-[#F7F7F7] rounded-2xl p-8">
            <div class="row-span-5 col-span-6">
                <img src="https://static.thiennguyen.app/public/news/photo/2025/2/8/934f30b9-f890-4914-894a-f09c25a80b4b.jpg" alt="#" class="w-full h-[600px] rounded-2xl object-cover mb-6" />
                <h3 class="font-medium text-gray-700 text-4xl mb-4 line-clamp-2">Kỷ niệm 20 năm thành lập PanNature</h3>
                <div class="text-lg font-medium text-[#6f6f6f]">
                    <p><i class="pi pi-calendar mb-4"></i> 23/12/2024 - 23/12/2025</p>
                    <p><i class="pi pi-map-marker"></i> Thôn Lưu Đông, Phúc Túc, Phú Xuyên, Hà Nội.</p>
                </div>
            </div>
            <div class="col-span-6 border-b border-gray-300 flex justify-between pb-5">
                <div class="w-full">
                    <title class="line-clamp-2 mb-3 text-[20px] font-[550]">Xây ước mơ cho Em</title>
                    <div class="text-base font-medium text-[#6f6f6f]">
                        <p><i class="pi pi-calendar mb-3"></i> 05/09/2024 - 05/09/2025</p>
                        <p><i class="pi pi-map-marker"></i> An Giang.</p>
                    </div>
                </div>
                <div class="min-w-[140px] max-w-[140px] min-h-14">
                    <img src="https://static.thiennguyen.app/public/news/photo/2024/9/5/7c70628d-59c1-4716-8cb4-a8483151f841.jpg" alt="#" class="w-full h-full object-cover rounded-2xl" />
                </div>
            </div>
            <div class="col-span-6 border-b border-gray-300 flex justify-between pb-5">
                <div class="w-full">
                    <title class="line-clamp-2 mb-3 text-[20px] font-[550]">Quyên góp 7 triệu đồng mua tôn lợp lại nhà tình thương cho bà Ka Sáu</title>
                    <div class="text-base font-medium text-[#6f6f6f]">
                        <p><i class="pi pi-calendar mb-3"></i> 07/01/2025 - 07/01/2026</p>
                        <p><i class="pi pi-map-marker"></i> 2686 Đường Giao Lộ Đoạn Quay Đầu Hùng Vương,Phường Vân Phú,Thành phố Việt Trì,Tỉnh Phú Thọ.</p>
                    </div>
                </div>
                <div class="min-w-[140px] max-w-[140px] min-h-14">
                    <img src="https://static.thiennguyen.app/public/news/photo/2022/9/20/940704d5-f136-4562-b034-125ccf8fa26c.jpg" alt="#" class="w-full h-full object-cover rounded-2xl" />
                </div>
            </div>
            <div class="col-span-6 border-b border-gray-300 flex justify-between pb-5">
                <div class="w-full">
                    <title class="line-clamp-2 mb-3 text-[20px] font-[550]">Vận động 200 phần quà Tết cho Đồng bào dân tộc thiểu số, khó khăn.</title>
                    <div class="text-base font-medium text-[#6f6f6f]">
                        <p><i class="pi pi-calendar mb-3"></i> 19/01/2025</p>
                        <p><i class="pi pi-map-marker"></i> Bưu Điện Hàm Thuận Bắc,Thị trấn Ma Lâm,Huyện Hàm Thuận Bắc,Tỉnh Bình Thuận.</p>
                    </div>
                </div>
                <div class="min-w-[140px] max-w-[140px] min-h-14">
                    <img src="https://static.thiennguyen.app/public/news/photo/2024/11/4/5ba57240-a193-4d6b-93c0-2887e59f616f.jpg" alt="#" class="w-full h-full object-cover rounded-2xl" />
                </div>
            </div>
            <div class="col-span-6 border-b border-gray-300 flex justify-between pb-5">
                <div class="w-full">
                    <title class="line-clamp-2 mb-3 text-[20px] font-[550]">Khai trương Thư Viện Ước Mơ Tại An Giang</title>
                    <div class="text-base font-medium text-[#6f6f6f]">
                        <p><i class="pi pi-calendar mb-3"></i> 10/03/2025</p>
                        <p><i class="pi pi-map-marker"></i> Trường Tiểu Học B Núi Tô,Xã Núi Tô,Huyện Tri Tôn,Tỉnh An Giang.</p>
                    </div>
                </div>
                <div class="min-w-[140px] max-w-[140px] min-h-14">
                    <img src="https://static.thiennguyen.app/public/news/photo/2025/4/7/70741604-c72e-4935-9503-b7607b0cfacc.jpg" alt="#" class="w-full h-full object-cover rounded-2xl" />
                </div>
            </div>
            <div class="col-span-6 border-b border-gray-300 flex justify-between pb-5">
                <div class="w-full">
                    <title class="line-clamp-2 mb-3 text-[20px] font-[550]">Cùng ENEU - Góp Yêu Thương - Tô Hồng Bản Nhỏ - điểm trường bản Gioòng - xã Thượng Nông</title>
                    <div class="text-base font-medium text-[#6f6f6f]">
                        <p><i class="pi pi-calendar mb-3"></i> 31/03/2025 - 20/09/2025</p>
                        <p><i class="pi pi-map-marker"></i> Tuyên Quang.</p>
                    </div>
                </div>
                <div class="min-w-[140px] max-w-[140px] min-h-14">
                    <img src="https://static.thiennguyen.app/public/news/photo/2025/3/31/7375ccc7-7717-4d0c-9564-5204032f3767.jpg" alt="#" class="w-full h-full object-cover rounded-2xl" />
                </div>
            </div>
        </div>
    </div>
    <div class="mt-20 bg-[#FBFBFB] py-10">
        <div class="w-[95%] lg:w-[80%] flex mx-auto gap-4">
            <div class="w-3/12 text-lg font-[550] text-gray-700 pr-10">Được hơn 1463 tổ chức, cá nhân tin dùng</div>
            <img class="w-9/12" src="../../assets/Img/Home/brand.png" alt="" />
        </div>
    </div>
    <div class="mt-20 bg-[#F5F5F5] py-10">
        <div class="w-[95%] lg:w-[80%] flex mx-auto gap-6 justify-center">
            <Button label="Khám phá chiến dịch" @click="router.push('/category')" class="h-[50px] !text-xl !rounded-2xl w-60" :pt:label:class="'!font-semibold'"> </Button>
            <Button label="Bắt đầu gây quỹ " class="h-[50px] !text-xl !rounded-2xl !bg-[#3841EB] !border-0 w-60" :pt:label:class="'!font-semibold'"> </Button>
        </div>
    </div>
</template>
