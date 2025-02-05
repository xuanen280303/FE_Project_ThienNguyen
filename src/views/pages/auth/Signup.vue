<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const checked = ref(false);
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="/Image/favicon.png" alt="" class="mb-8 w-16 shrink-0 mx-auto" />

                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Chào mừng bạn tới Thiện Nguyện</div>
                        <span class="text-muted-color font-medium">Trang đăng ký</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Vui lòng nhập địa chỉ Email..." class="w-full md:w-[30rem] mb-8" v-model="email" />
                        <label for="Password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Mật khẩu</label>
                        <Password id="password1" v-model="password" placeholder="Vui lòng nhập mật khẩu..." :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Nhớ tài khoản</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Quên mật khẩu?</span>
                        </div>
                        <Button label="Đăng nhập" class="w-full" as="router-link" to="/"></Button>
                        <div class="flex justify-center gap-2 mt-2">
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
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
