<template>
    <div class="bg-[#F6F6FA] w-full pt-10">
        <div class="w-10/12 mx-auto flex gap-10">
            <div class="w-1/2 bg-white rounded-xl p-10">
                <div class="flex gap-7">
                    <div class="w-[95px] h-[95px] border-2 border-gray-200 rounded-full">
                        <img src="https://placehold.co/100x100" alt="#" class="w-full h-full rounded-full" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xl text-zinc-500 font-normal">Tài khoản kêu gọi đồng hành </span>
                        <router-link to="/" class="text-2xl font-semibold text-zinc-700 hover:underline">Kate Something</router-link>
                        <div class="mt-2">
                            <span class="bg-green-200 px-3 py-2 rounded-full text-green-600 font-semibold">Đạt mục tiêu</span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2 mt-10">
                    <div class="flex justify-between">
                        <span class="font-normal">Đã đạt được <span class="text-orange-500 font-semibold text-xl">5.200.000 VND</span> </span>
                        <span class="font-bold">65%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-[7px]">
                        <div class="bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 h-[7px] rounded-full" :style="{ width: `20%` }"></div>
                    </div>
                    <div class="text-gray-500 font-medium">Mục tiêu đồng hành: <span class="text-zinc-600">8.000.000 VND</span></div>
                    <div class="w-full mt-6 flex gap-2 items-center">
                        <Button icon="pi pi-share-alt" label="Chia sẻ" severity="success" class="w-1/2 !rounded-2xl" size="large" />
                        <Button label="Ủng hộ" class="w-1/2 !rounded-2xl" size="large" />
                    </div>
                </div>
            </div>
            <div class="w-1/2 bg-white rounded-xl p-10">
                <h2 class="text-xl font-semibold text-orange-500">Đồng hành cùng</h2>
                <h1 class="text-2xl font-semibold text-zinc-800 mt-2">Quynh Thai</h1>
                <div class="mt-4 rounded-lg overflow-hidden w-full h-[260px]"><img src="https://placehold.co/100x100" alt="#" class="w-full h-full rounded-lg object-cover" /></div>
                <h3 class="text-zinc-800 font-semibold text-lg mt-2">Chiến dịch: Lời khẩn cầu của một người mẹ tìm liều thuốc mắc nhất thế giới để cứu mạng con trai!</h3>
                <p class="text-zinc-500 mt-1 text-sm">Còn 62 ngày</p>
            </div>
        </div>
        <div class="w-10/12 mx-auto mt-10">
            <div class="w-full rounded-xl overflow-hidden bg-white">
                <div class="border-b border-gray-200 h-14 flex items-center">
                    <span class="text-orange-600 font-bold text-xl border-b-2 border-orange-600 h-full px-4 flex items-center">Danh sách ủng hộ</span>
                </div>
                <div class="p-4 min-h-[500px]">
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
            </div>
        </div>
    </div>
</template>
<script setup></script>
<style></style>
