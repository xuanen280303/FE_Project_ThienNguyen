<template>
    <div class="bg-surface-50 dark:bg-surface-900 p-6">
        <div class="w-full mx-auto card">
            <TabView>
                <!-- Tab thông tin tài khoản -->
                <TabPanel header="Thông tin tài khoản">
                    <div class="flex gap-6 p-6">
                        <!-- Cột trái - Avatar và thông tin cơ bản -->
                        <div class="w-1/4">
                            <div class="flex flex-col items-center gap-4">
                                <div class="relative group w-[200px] h-[200px] border-2 border-orange-500 overflow-hidden rounded-full cursor-pointer" @click="isEditing ? $refs.fileInput.click() : null" :class="{ 'cursor-not-allowed': !isEditing }">
                                    <img :src="avatarData || (userData.avatar ? linkUploads(userData.avatar) : 'https://placehold.co/200x200')" alt="avatar" class="w-full h-full object-cover" />
                                    <div v-if="isEditing" class="absolute bottom-0 right-0 bg-white/40 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <i class="pi pi-camera text-orange-500" style="font-size: 2rem"></i>
                                    </div>
                                </div>
                                <input ref="fileInput" type="file" @change="handleAvatarUpload" accept="image/*" class="hidden" />
                                <h2 class="text-2xl font-bold">{{ userData.name }}</h2>
                                <Badge :value="userData.role?.name" severity="success" />
                            </div>
                        </div>

                        <!-- Cột phải - Thông tin chi tiết -->
                        <div class="w-3/4">
                            <div class="flex justify-end mb-4">
                                <Button v-if="!isEditing" type="button" icon="pi pi-pencil" label="Chỉnh sửa" @click="toggleEdit" class="p-button-secondary" />
                                <div v-else class="flex gap-2">
                                    <Button type="button" icon="pi pi-times" label="Hủy" @click="cancelEdit" class="p-button-outlined p-button-danger" />
                                    <Button type="submit" icon="pi pi-check" label="Lưu thay đổi" @click="updateProfile" :loading="isLoading" />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-x-8 gap-y-6">
                                <!-- Thông tin hiển thị -->
                                <template v-if="!isEditing">
                                    <div v-for="(field, index) in userFields" :key="index" class="flex flex-col gap-2">
                                        <label class="text-sm text-gray-600">{{ field.label }}</label>
                                        <div class="p-2 bg-gray-50 rounded-md min-h-[40px] flex items-center">
                                            <i :class="field.icon" class="mr-2 text-orange-500"></i>
                                            {{ formatFieldValue(field.key) }}
                                        </div>
                                    </div>
                                </template>

                                <!-- Form chỉnh sửa -->
                                <template v-else>
                                    <div v-for="(field, index) in userFields" :key="index" class="flex flex-col gap-2">
                                        <label class="text-sm font-medium">{{ field.label }}</label>
                                        <component :is="field.component" v-model="userData[field.key]" :disabled="field.disabled" :class="field.class" v-bind="field.props || {}" class="w-full" />
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </TabPanel>

                <!-- Tab đổi mật khẩu -->
                <TabPanel header="Đổi mật khẩu">
                    <form @submit.prevent="changePassword" class="max-w-md mx-auto">
                        <div class="flex flex-col gap-4">
                            <div>
                                <label class="block font-bold mb-1">Mật khẩu hiện tại</label>
                                <Password v-model="passwordData.currentPassword" toggleMask class="w-full" />
                            </div>
                            <div>
                                <label class="block font-bold mb-1">Mật khẩu mới</label>
                                <Password v-model="passwordData.newPassword" toggleMask class="w-full" />
                            </div>
                            <div>
                                <label class="block font-bold mb-1">Xác nhận mật khẩu mới</label>
                                <Password v-model="passwordData.confirmPassword" toggleMask class="w-full" />
                            </div>
                            <div class="flex justify-end">
                                <Button type="submit" label="Đổi mật khẩu" icon="pi pi-lock" :loading="isChangingPassword" />
                            </div>
                        </div>
                    </form>
                </TabPanel>
            </TabView>
        </div>
    </div>
</template>

<script setup>
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { linkUploads } from '../../../constant/api';
import apiService from '../../../service/api.service';
import parseDate from '../../../utils/parseDate';

const toast = useToast();
const isLoading = ref(false);
const isChangingPassword = ref(false);
const avatarData = ref(null);
const userData = ref({});
const passwordData = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});
const isEditing = ref(false);
const originalUserData = ref({});

const userFields = [
    {
        label: 'Họ và tên',
        key: 'name',
        icon: 'pi pi-user',
        component: 'InputText',
        class: 'p-inputtext-sm'
    },
    {
        label: 'Email',
        key: 'email',
        icon: 'pi pi-envelope',
        component: 'InputText',
        disabled: true,
        class: 'p-inputtext-sm'
    },
    {
        label: 'Số điện thoại',
        key: 'phoneNumber',
        icon: 'pi pi-phone',
        component: 'InputText',
        class: 'p-inputtext-sm'
    },
    {
        label: 'Giới tính',
        key: 'gender',
        icon: 'pi pi-users',
        component: 'Dropdown',
        props: {
            options: ['Nam', 'Nữ', 'Khác'],
            placeholder: 'Chọn giới tính'
        }
    },
    {
        label: 'Ngày sinh',
        key: 'dateOfBirth',
        icon: 'pi pi-calendar',
        component: 'Calendar',
        props: {
            dateFormat: 'dd/mm/yy',
            showIcon: true
        }
    },
    {
        label: 'Địa chỉ',
        key: 'address',
        icon: 'pi pi-map-marker',
        component: 'InputText',
        class: 'p-inputtext-sm'
    }
];

const formatFieldValue = (key) => {
    const value = userData.value[key];
    if (!value) return '---';

    if (key === 'dateOfBirth') {
        return format(new Date(value), 'dd/MM/yyyy', { locale: vi });
    }
    return value;
};

const toggleEdit = () => {
    isEditing.value = true;
    originalUserData.value = JSON.parse(JSON.stringify(userData.value));
};

const cancelEdit = () => {
    isEditing.value = false;
    userData.value = JSON.parse(JSON.stringify(originalUserData.value));
};

// Lấy thông tin user
const getUserInfo = async () => {
    try {
        isLoading.value = true;
        const res = await apiService.get('users/profile');
        userData.value = {
            ...res.data,
            dateOfBirth: res.data.dateOfBirth ? new Date(res.data.dateOfBirth) : null
        };
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Không thể lấy thông tin người dùng', life: 3000 });
    } finally {
        isLoading.value = false;
    }
};

// Cập nhật thông tin
const updateProfile = async () => {
    try {
        isLoading.value = true;
        await apiService.patch('users/profile', {
            ...userData.value,
            dateOfBirth: userData.value.dateOfBirth ? parseDate(userData.value.dateOfBirth) : null
        });
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thông tin thành công', life: 3000 });
        isEditing.value = false;
        originalUserData.value = JSON.parse(JSON.stringify(userData.value));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Cập nhật thất bại', life: 3000 });
    } finally {
        isLoading.value = false;
    }
};

// Xử lý upload avatar
const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        isLoading.value = true;
        avatarData.value = URL.createObjectURL(file);
        const res = await apiService.upload(file, 'users');
        userData.value.avatar = res.data.fileName;
        await updateProfile();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải lên ảnh đại diện', life: 3000 });
    } finally {
        isLoading.value = false;
    }
};

// Đổi mật khẩu
const changePassword = async () => {
    if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Mật khẩu xác nhận không khớp', life: 3000 });
        return;
    }

    try {
        isChangingPassword.value = true;
        await apiService.patch('users/change-password', {
            currentPassword: passwordData.value.currentPassword,
            newPassword: passwordData.value.newPassword
        });
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đổi mật khẩu thành công', life: 3000 });
        passwordData.value = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Đổi mật khẩu thất bại', life: 3000 });
    } finally {
        isChangingPassword.value = false;
    }
};

onMounted(() => {
    getUserInfo();
});
</script>

<style scoped>
.p-tabview-nav {
    @apply border-b border-gray-200;
}

.p-tabview-nav-link {
    @apply font-semibold;
}

.p-badge {
    @apply text-sm;
}
</style>
