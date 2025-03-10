<template>
    <div class="error-container">
        <div class="error-content animate__animated animate__fadeIn">
            <i class="fas fa-times-circle error-icon animate__animated animate__headShake"></i>
            <h1 class="animate__animated animate__fadeInDown">Thanh toán thất bại!</h1>
            <p class="animate__animated animate__fadeInUp">Đã xảy ra lỗi trong quá trình thanh toán</p>
            <p class="countdown animate__animated animate__fadeInUp">
                Tự động chuyển hướng sau <span class="timer">{{ countdown }}</span> giây
            </p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const countdown = ref(5);

onMounted(() => {
    // Lấy ID từ URL
    const projectId = route.params.id || route.query.id;

    // Đếm ngược và chuyển hướng
    const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(timer);
            router.push(`/info-donate/${projectId}`);
        }
    }, 1000);
});
</script>

<style scoped>
.error-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.error-content {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.error-content:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.error-icon {
    font-size: 6rem;
    color: #dc3545;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
}

.error-icon:hover {
    transform: scale(1.1);
}

h1 {
    color: #dc3545;
    margin-bottom: 1.5rem;
    font-size: 2.5rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

p {
    color: #6c757d;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    line-height: 1.6;
}

.countdown {
    margin-top: 2rem;
}

.timer {
    font-size: 1.5rem;
    font-weight: bold;
    color: #dc3545;
    background: #fff0f3;
    padding: 5px 15px;
    border-radius: 20px;
    display: inline-block;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

/* Add animate.css classes */
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
