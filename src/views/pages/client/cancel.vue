<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div class="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl transform transition-all hover:-translate-y-1 duration-300">
            <div class="text-center space-y-6">
                <div class="inline-block animate__animated animate__fadeIn">
                    <i class="pi pi-heart-broken text-7xl text-rose-500 animate__animated animate__headShake"></i>
                </div>

                <h1 class="text-3xl font-bold text-rose-600 animate__animated animate__fadeInDown">Rất tiếc, giao dịch chưa hoàn thành</h1>

                <div class="space-y-4">
                    <p class="text-gray-600 text-lg animate__animated animate__fadeInUp">Chúng tôi rất tiếc vì sự bất tiện này. Mỗi đóng góp của bạn đều là nguồn động viên quý giá cho những hoàn cảnh khó khăn.</p>

                    <p class="text-gray-500 animate__animated animate__fadeInUp">Bạn có thể thử lại hoặc chọn phương thức thanh toán khác</p>

                    <div class="countdown text-gray-600 animate__animated animate__fadeInUp">
                        Tự động quay lại sau
                        <span class="inline-block min-w-[40px] font-bold text-rose-600 bg-rose-50 rounded-full px-3 py-1">
                            {{ countdown }}
                        </span>
                        giây
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiService from '../../../service/api.service';
const router = useRouter();
const route = useRoute();
const countdown = ref(10);

onMounted(() => {
    // Lấy ID từ URL
    const projectId = route.params.id;
    const orderCode = route.query.orderCode;
    const isCancel = route.query.cancel == 'true';
    const updateStatus = async () => {
        try {
            if (isCancel) {
                await apiService.delete('donations/' + orderCode);
            }
        } catch (error) {
            console.log(error);
        }
    };
    updateStatus();
    // Đếm ngược và chuyển hướng
    const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(timer);
            router.push(`/detail/${projectId}`);
        }
    }, 1000);
});
</script>

<style scoped>
.animate__animated {
    animation-duration: 1s;
}

.animate__fadeIn {
    animation-delay: 0.2s;
}

.animate__fadeInDown {
    animation-delay: 0.4s;
}

.animate__fadeInUp {
    animation-delay: 0.6s;
}

.animate__headShake {
    animation-delay: 1s;
    animation-iteration-count: 2;
}
</style>
