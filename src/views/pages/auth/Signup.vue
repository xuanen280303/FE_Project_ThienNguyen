<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';

import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '../../../service/api.service';

const toast = useToast();
const router = useRouter();
const dataRegister = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
});

const isLoading = ref(false);
const submitted = ref(false);
const fadeIn = ref(false);

const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
};

const validate = () => {
    const { email, password, name } = dataRegister.value;

    if (!name) {
        toast.add({ severity: 'error', summary: 'Thông báo lỗi', detail: 'Vui lòng nhập họ tên', life: 3000 });
        return true;
    }

    if (!email) {
        toast.add({ severity: 'error', summary: 'Thông báo lỗi', detail: 'Vui lòng nhập email', life: 3000 });
        return true;
    }

    if (!validateEmail(email)) {
        toast.add({ severity: 'error', summary: 'Thông báo lỗi', detail: 'Vui lòng nhập địa chỉ email hợp lệ', life: 3000 });
        return true;
    }

    if (!password) {
        toast.add({ severity: 'error', summary: 'Thông báo lỗi', detail: 'Vui lòng nhập mật khẩu', life: 3000 });
        return true;
    }

    if (password.length < 6) {
        toast.add({ severity: 'error', summary: 'Thông báo lỗi', detail: 'Mật khẩu phải có ít nhất 6 ký tự', life: 3000 });
        return true;
    }

    if (password !== dataRegister.value.password_confirmation) {
        toast.add({ severity: 'error', summary: 'Thông báo lỗi', detail: 'Mật khẩu không khớp', life: 3000 });
        return true;
    }

    return false;
};

const handleRegister = async () => {
    isLoading.value = true;
    submitted.value = true;

    if (validate()) {
        isLoading.value = false;
        return;
    }

    try {
        const registerData = {
            email: dataRegister.value.email,
            password: dataRegister.value.password,
            name: dataRegister.value.name
        };

        const res = await apiService.post('auth/register', registerData);
        if (res.data) {
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đăng ký thành công', life: 3000 });
            router.push('/login');
        }
    } catch (error) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Thông báo lỗi',
            detail: error.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký',
            life: 3000
        });
    } finally {
        isLoading.value = false;
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
                <div class="login-card w-full bg-surface-0 dark:bg-surface-900 py-10 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="/Image/favicon.png" alt="" class="logo-animation mb-8 w-16 shrink-0 mx-auto" />

                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4 title-animation">Chào mừng bạn tới Thiện Nguyện</div>
                        <span class="text-muted-color font-medium subtitle-animation">Trang đăng ký</span>
                    </div>

                    <div class="flex flex-col form-animation">
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-1">Họ và tên</label>
                        <InputText id="email1" type="text" placeholder="Vui lòng nhập họ và tên..." class="w-full md:w-[30rem] input-hover" v-model="dataRegister.name" />
                        <span class="mb-4">
                            <small class="text-red-500" v-if="submitted && !dataRegister.name">Vui lòng nhập họ và tên</small>
                        </span>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-1">Email</label>
                        <InputText id="email1" type="text" placeholder="Vui lòng nhập địa chỉ Email..." class="w-full md:w-[30rem] input-hover" v-model="dataRegister.email" />
                        <span class="mb-4">
                            <small class="text-red-500" v-if="submitted && !dataRegister.email">Vui lòng nhập email</small>
                            <small class="text-red-500" v-if="!validateEmail(dataRegister.email) && dataRegister.email">Vui lòng nhập đúng định dạng email</small>
                        </span>

                        <label for="Password1" class="block text-surface-900 dark:text-surface-0 font-medium text-lg mb-1">Mật khẩu</label>
                        <Password id="password1" v-model="dataRegister.password" placeholder="Vui lòng nhập mật khẩu..." :toggleMask="true" class="input-hover" fluid :feedback="false" />
                        <span class="mb-4">
                            <small class="text-red-500" v-if="submitted && !dataRegister.password">Vui lòng nhập mật khẩu</small>
                            <small class="text-red-500" v-if="dataRegister.password && dataRegister.password.length < 6">Mật khẩu phải có ít nhất 6 ký tự</small>
                        </span>
                        <label for="Password1" class="block text-surface-900 dark:text-surface-0 font-medium text-lg mb-1">Nhập lại mật khẩu</label>
                        <Password id="password1" v-model="dataRegister.password_confirmation" placeholder="Vui lòng nhập lại mật khẩu..." :toggleMask="true" class="input-hover" fluid :feedback="false" />
                        <span class="mb-8">
                            <small class="text-red-500" v-if="submitted && !dataRegister.password_confirmation">Vui lòng nhập mật khẩu</small>
                            <small class="text-red-500" v-if="dataRegister.password !== dataRegister.password_confirmation">Mật khẩu không khớp</small>
                        </span>

                        <Button label="Đăng ký" class="login-button w-full" @click="handleRegister" :loading="isLoading"></Button>

                        <div class="flex justify-center gap-2 mt-2 signup-link">
                            <p>Bạn đã có tài khoản?</p>
                            <router-link to="/login" class="text-orange-600 hover:font-medium hover:shadow-orange-400">Đăng nhập ngay</router-link>
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
