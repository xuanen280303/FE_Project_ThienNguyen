<template>
    <div class="success-container">
        <div class="success-content">
            <i class="fas fa-check-circle success-icon"></i>
            <h1>Thanh toán thành công!</h1>
            <p>Cảm ơn bạn đã ủng hộ dự án</p>
            <p>Tự động chuyển hướng sau {{ countdown }} giây</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter(); // Sử dụng useRouter thay vì useRoute
const countdown = ref(5);

onMounted(() => {
    // Lấy ID từ URL
    const projectId = router.currentRoute.value.params.id || router.currentRoute.value.query.id; // Sử dụng currentRoute để lấy params và query
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
.success-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fa;
}

.success-content {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.success-icon {
    font-size: 5rem;
    color: #28a745;
    margin-bottom: 1rem;
}

h1 {
    color: #28a745;
    margin-bottom: 1rem;
}

p {
    color: #6c757d;
    margin-bottom: 0.5rem;
}
</style>
