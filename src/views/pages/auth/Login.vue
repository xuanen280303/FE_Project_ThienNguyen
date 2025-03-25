<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';

import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import accountService from '../../../service/account.service';
import apiService from '../../../service/api.service';
import tokenService from '../../../service/token.service';

const toast = useToast();
const router = useRouter();
const dataLogin = ref({
    username: '',
    password: ''
});

const checked = ref(false);
const isLoading = ref(false);
const submitted = ref(false);
const fadeIn = ref(false);

onMounted(async () => {
    fadeIn.value = true;
    const token = await tokenService.getToken();
    if (token.storage) {
        router.push('/');
    }
});

const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
};
const validate = () => {
    const { username, password } = dataLogin.value;
    if (!username || !password) {
        toast.add({ severity: 'error', summary: 'Thông báo lỗi', detail: 'Vui lòng nhập địa chỉ email hợp lệ', life: 3000 });
        return true;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Biểu thức chính quy để kiểm tra định dạng email
    if (!emailPattern.test(username)) {
        toast.add({ severity: 'error', summary: 'Thông báo lỗi', detail: 'Vui lòng nhập địa chỉ email hợp lệ', life: 3000 });
        return true; // Trả về true nếu có lỗi
    }

    return false; // Trả về false nếu không có lỗi
};
const handleLogin = async () => {
    isLoading.value = true;
    submitted.value = true;
    if (validate()) {
        isLoading.value = false;
        return;
    }
    try {
        const res = await apiService.post('auth/login', dataLogin.value);
        if (res.data) {
            tokenService.createToken(res.data.access_token, checked.value);
            await accountService.createAccount(checked.value);
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đăng nhập thành công', life: 3000 });
            router.back();
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Thông báo lỗi', detail: error.response.data.message, life: 3000 });
    } finally {
        submitted.value = true;

        isLoading.value = false;
    }
};

// Thêm hàm xử lý sự kiện nhấn Enter
const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        handleLogin();
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div class="login-container bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="hearts">
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
        </div>

        <div class="login-particles"></div>

        <div class="flex flex-col items-center justify-center" :class="{ 'fade-in': fadeIn }">
            <div class="login-card-wrapper" style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="login-card w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="/Image/favicon.png" alt="" class="logo-animation mb-8 w-16 shrink-0 mx-auto" />

                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4 title-animation">Chào mừng bạn tới Thiện Nguyện</div>
                        <span class="text-muted-color font-medium subtitle-animation">Trang đăng nhập</span>
                    </div>

                    <div class="flex flex-col form-animation">
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Vui lòng nhập địa chỉ Email..." class="w-full md:w-[30rem] input-hover" v-model="dataLogin.username" @keypress="handleKeyPress" />
                        <span class="mb-8">
                            <small class="text-red-500" v-if="submitted && !dataLogin.username">Vui lòng nhập email</small>
                            <small class="text-red-500" v-if="!validateEmail(dataLogin.username) && dataLogin.username">Vui lòng nhập đúng định dạng email</small>
                        </span>

                        <label for="Password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Mật khẩu</label>
                        <Password id="password1" v-model="dataLogin.password" placeholder="Vui lòng nhập mật khẩu..." :toggleMask="true" class="mb-4 input-hover" fluid :feedback="false" @keypress="handleKeyPress" />

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center hover-effect">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Nhớ tài khoản</label>
                            </div>
                            <span class="forgot-password font-medium no-underline ml-2 text-right cursor-pointer">Quên mật khẩu?</span>
                        </div>

                        <Button label="Đăng nhập" class="login-button w-full" @click="handleLogin" :loading="isLoading"></Button>

                        <div class="flex justify-center gap-2 mt-2 signup-link">
                            <p>Bạn chưa có tài khoản?</p>
                            <router-link to="/signup" class="text-orange-600 hover:font-medium hover:shadow-orange-400">Đăng ký ngay</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    position: relative;
    background: linear-gradient(135deg, #ffe6d3b5 20%, #ffffff 80%);
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

.input-hover {
    transition: all 0.3s ease;
}

.input-hover:hover {
    transform: translateX(5px);
}

.login-button {
    background: linear-gradient(45deg, #ff6b6b, #ff8e53);
    border: none;
    transition: all 0.3s ease;
}

.login-button:hover {
    background: linear-gradient(45deg, #ff8e53, #ff6b6b);
    transform: scale(1.02);
}

.forgot-password {
    color: #ff6b6b;
    transition: all 0.3s ease;
}

.forgot-password:hover {
    color: #ff8e53;
    text-decoration: underline;
}

.signup-link a {
    position: relative;
    transition: all 0.3s ease;
}

.signup-link a:hover {
    color: #ff8e53;
}

.signup-link a::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -2px;
    left: 0;
    background-color: #ff8e53;
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.signup-link a:hover::after {
    transform: scaleX(1);
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

.subtitle-animation {
    animation: slideInUp 1s ease;
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

@keyframes slideInUp {
    from {
        transform: translateY(50px);
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

.pi-eye,
.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

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
    background: #ff8763;
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
    background: #ff8763;
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
