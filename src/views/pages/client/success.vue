<template>
    <div class="login-container bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <!-- <div class="hearts">
            <span style="--i: 1"></span>
            <span style="--i: 2"></span>
            <span style="--i: 3"></span>
            <span style="--i: 4"></span>
            <span style="--i: 5"></span>
            <span style="--i: 6"></span>
            <span style="--i: 7"></span>
            <span style="--i: 8"></span>
            <span style="--i: 9"></span>
            <span style="--i: 10"></span>
            <span style="--i: 11"></span>
            <span style="--i: 12"></span>
            <span style="--i: 24"></span>
            <span style="--i: 10"></span>
            <span style="--i: 14"></span>
        </div> -->

        <div class="login-particles"></div>

        <div class="flex flex-col items-center justify-center" :class="{ 'fade-in': fadeIn }">
            <div class="login-card-wrapper" style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, #22c55e 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="login-card w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center space-y-6">
                        <div class="inline-block logo-animation">
                            <i class="pi pi-check-circle text-green-500" style="font-size: 80px"></i>
                        </div>
                        <h1 class="text-surface-900 dark:text-surface-0 text-3xl font-medium title-animation">Thanh toán thành công!</h1>

                        <div class="space-y-4 form-animation">
                            <p class="text-gray-600 text-lg">Cảm ơn bạn đã đóng góp. Sự ủng hộ của bạn sẽ giúp đỡ được rất nhiều hoàn cảnh khó khăn.</p>

                            <p class="text-gray-500">Bạn có thể xem chi tiết đóng góp trong trang cá nhân</p>
                            <Button label="Quay về dự án" @click="router.push(`/detail/${projectId}`)" severity="success" />
                            <div class="countdown text-gray-600">
                                Tự động quay lại sau
                                <span class="inline-block min-w-[40px] font-bold text-green-600 bg-green-50 rounded-full px-3 py-1">
                                    {{ countdown }}
                                </span>
                                giây
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const countdown = ref(10);
const projectId = route.params.id;
const fadeIn = ref(false);

onMounted(() => {
    fadeIn.value = true;
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
.login-container {
    position: relative;
    background: linear-gradient(135deg, #dcfce7 20%, #ffffff 80%);
}

.login-card-wrapper {
    position: relative;
    z-index: 1;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.login-card-wrapper:hover {
    transform: translateY(-5px);
}

.login-card {
    position: relative;
    overflow: hidden;
}

.success-button {
    background: linear-gradient(45deg, #22c55e, #4ade80);
    border: none;
    transition: all 0.3s ease;
}

.success-button:hover {
    background: linear-gradient(45deg, #4ade80, #22c55e);
    transform: scale(1.02);
}

/* Animation classes */
.fade-in {
    animation: fadeIn 0.8s ease-in;
}

.logo-animation {
    animation: bounce 2s infinite;
}

.title-animation {
    animation: slideInDown 1s ease;
}

.form-animation {
    animation: fadeInLeft 1s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes bounce {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

@keyframes slideInDown {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes fadeInLeft {
    from {
        transform: translateX(-50px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Hearts animation */
.hearts {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    overflow: hidden;
    top: 0;
    left: 0;
}

.hearts span {
    position: absolute;
    display: block;
    width: 30px;
    height: 30px;
    background: #22c55e;
    transform: rotate(45deg);
    animation: animate 15s linear infinite;
    animation-duration: calc(125s / var(--i));
    opacity: 0.3;
    left: calc(var(--i) * 7%);
}

.hearts span::before,
.hearts span::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    background: #22c55e;
    border-radius: 50%;
}

.hearts span::before {
    top: -15px;
    left: 0;
}

.hearts span::after {
    left: -15px;
    top: 0;
}

@keyframes animate {
    0% {
        transform: translateY(100vh) rotate(45deg) scale(0);
    }
    20% {
        transform: translateY(80vh) rotate(45deg) scale(0.6);
    }
    40% {
        transform: translateY(60vh) rotate(45deg) scale(0.8);
    }
    60% {
        transform: translateY(40vh) rotate(45deg) scale(0.9);
    }
    80% {
        transform: translateY(20vh) rotate(45deg) scale(0.95);
    }
    100% {
        transform: translateY(-10vh) rotate(45deg) scale(1);
    }
}
</style>
