<template>
    <div class="p-1 rounded-xl hover:shadow-xl hover:p-0 shadow-md transition-all duration-100 group">
        <router-link :to="'/detail/' + link" class="max-w-full overflow-hidden bg-white">
            <!-- Phần hình ảnh -->
            <div class="relative rounded-xl overflow-hidden">
                <img class="w-full h-96 object-cover group-hover:border-4 group-hover:border-primary transition-all duration-100 rounded-2xl" :src="imageUrl || 'https://placehold.co/600x380'" :alt="title" />
                <!-- Progress bar -->
                <div class="absolute bottom-0 left-0 right-0 bg-black/40 p-1 pl-5 m-2 rounded-full flex gap-2">
                    <div class="w-full flex flex-col justify-end mb-2">
                        <div class="flex items-center justify-between text-white text-[13px] font-semibold mb-0.5">
                            <span>{{ formattedNumber(amount) }} đ</span>
                            <span>{{ progress }}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-[4px]">
                            <div class="bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 h-[4px] rounded-full" :style="{ width: `${progress}%` }"></div>
                        </div>
                    </div>
                    <div class="min-w-12 h-12 bg-[#FFFAF5] rounded-full">
                        <img src="/Image/iconDonate.png" alt="#" class="w-full h-full" />
                    </div>
                </div>
            </div>

            <!-- Phần nội dung -->
            <div class="p-4">
                <h3 class="font-semibold text-gray-700 text-lg mb-2 line-clamp-2 min-h-[55px]">{{ title }}</h3>
                <div class="flex items-center justify-between text-gray-600">
                    <span>{{ supporters }} lượt ủng hộ</span>
                    <span>Còn lại {{ formattedNumber(daysLeft) }} ngày</span>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script setup>
defineProps({
    imageUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: [Number, String],
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    supporters: {
        type: [Number, String],
        required: true
    },
    daysLeft: {
        type: [Number, String],
        required: true
    },
    link: {
        type: String,
        required: true
    }
});

const formattedNumber = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value);
};
</script>

<style>
/* Thay đổi màu sắc và độ mờ của thanh tiến trình */
.bg-black {
    background-color: rgba(0, 0, 0, 0.7);
}

.bg-red-600 {
    background-color: #e3342f;
}

.bg-gray-300 {
    background-color: #d1d5db;
}
</style>
