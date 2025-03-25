<template>
    <div class="bg-surface-50 dark:bg-surface-900 p-6">
        <div class="w-full mx-auto card">
            <TabView>
                <!-- Tab thông tin tài khoản -->
                <TabPanel header="Thông tin tài khoản">
                    <div class="flex gap-6 p-6 py-10">
                        <!-- Cột trái - Avatar và thông tin cơ bản -->
                        <div class="w-1/4 flex justify-center">
                            <div class="flex flex-col items-center justify-center gap-3">
                                <div class="relative group w-[180px] h-[180px] border-2 border-orange-500 overflow-hidden rounded-full cursor-pointer" @click="isEditing ? $refs.fileInput.click() : null" :class="{ 'cursor-not-allowed': !isEditing }">
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
                        <div class="w-3/4 pr-10">
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
                                        <div class="p-2 bg-gray-50 rounded-md min-h-[40px] font-base text-lg flex items-center">
                                            <i :class="field.icon" class="mr-2 text-orange-500"></i>
                                            {{ formatFieldValue(field.key) }}
                                        </div>
                                    </div>
                                </template>

                                <!-- Form chỉnh sửa -->
                                <template v-else>
                                    <div v-for="(field, index) in userFields" :key="index" class="flex flex-col gap-2">
                                        <label class="text-sm font-medium">{{ field.label }}</label>
                                        <InputText
                                            :invalid="submit && !userData[field.key]"
                                            v-if="field.component === 'InputText'"
                                            v-model="userData[field.key]"
                                            :disabled="field.disabled"
                                            :class="field.class"
                                            :maxlength="field?.length"
                                            :placeholder="field.props?.placeholder || ''"
                                            class="w-full"
                                        />
                                        <Dropdown
                                            v-if="field.component === 'Dropdown'"
                                            v-model="userData[field.key]"
                                            :options="field.props?.options"
                                            :disabled="field.disabled"
                                            :invalid="submit && !userData[field.key]"
                                            :class="field.class"
                                            :placeholder="field.props?.placeholder || ''"
                                            class="w-full"
                                        />
                                        <DatePicker
                                            :invalid="submit && !userData[field.key]"
                                            v-if="field.component === 'DatePicker'"
                                            v-model="userData[field.key]"
                                            :disabled="field.disabled"
                                            :class="field.class"
                                            dateFormat="dd/mm/yy"
                                            :showIcon="true"
                                            class="w-full"
                                            editable
                                        />
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </TabPanel>

                <!-- Tab đổi mật khẩu -->
                <TabPanel header="Đổi mật khẩu">
                    <div>
                        <form @submit.prevent="changePassword" class="w-9/12 mx-auto py-10 flex gap-32">
                            <div class="flex flex-col gap-6 w-1/2 justify-center">
                                <div class="w-10/12">
                                    <label class="block font-bold mb-1">Mật khẩu hiện tại</label>
                                    <Password v-model="passwordData.oldPassword" toggleMask fluid />
                                </div>
                                <div class="w-10/12">
                                    <label class="block font-bold mb-1">Mật khẩu mới</label>
                                    <Password v-model="passwordData.newPassword" toggleMask fluid />
                                </div>
                                <div class="w-10/12">
                                    <label class="block font-bold mb-1">Xác nhận mật khẩu mới</label>
                                    <Password v-model="passwordData.confirmPassword" toggleMask fluid />
                                </div>
                                <div class="flex justify-end w-10/12">
                                    <Button type="submit" label="Đổi mật khẩu" icon="pi pi-lock" :loading="isChangingPassword" />
                                </div>
                            </div>
                            <div class="w-1/2">
                                <div class="bg-gradient-to-br from-orange-50 to-gray-50 p-6 rounded-lg shadow-sm border border-orange-100 flex flex-col items-center">
                                    <div class="bg-orange-100 rounded-full p-4 mb-5">
                                        <i class="pi pi-shield text-orange-500" style="font-size: 5rem"></i>
                                    </div>
                                    <h3 class="text-xl font-bold mb-4 text-gray-800 relative">
                                        Yêu cầu mật khẩu mạnh
                                        <span class="absolute bottom-0 left-0 w-full h-1 rounded-full"></span>
                                    </h3>
                                    <div class="bg-white p-4 rounded-lg shadow-inner w-full">
                                        <ul class="text-left text-gray-700 space-y-3">
                                            <li class="flex items-center gap-3 transition-all duration-300 hover:translate-x-1">
                                                <i class="pi pi-check-circle text-green-500"></i>
                                                <span>Ít nhất 8 ký tự</span>
                                            </li>
                                            <li class="flex items-center gap-3 transition-all duration-300 hover:translate-x-1">
                                                <i class="pi pi-check-circle text-green-500"></i>
                                                <span>Bao gồm chữ hoa và chữ thường</span>
                                            </li>
                                            <li class="flex items-center gap-3 transition-all duration-300 hover:translate-x-1">
                                                <i class="pi pi-check-circle text-green-500"></i>
                                                <span>Ít nhất 1 số</span>
                                            </li>
                                            <li class="flex items-center gap-3 transition-all duration-300 hover:translate-x-1">
                                                <i class="pi pi-check-circle text-green-500"></i>
                                                <span>Ít nhất 1 ký tự đặc biệt (@, #, $, v.v.)</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="mt-4 text-sm text-gray-600 italic text-center">Mật khẩu mạnh giúp bảo vệ tài khoản của bạn khỏi các mối đe dọa bảo mật</div>
                                </div>
                            </div>
                        </form>
                    </div>
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
import accountService from '../../../service/account.service';
import apiService from '../../../service/api.service';
import parseDate from '../../../utils/parseDate';
const date = ref(null);
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
const submit = ref(false);

const userFields = [
    {
        label: 'Họ và tên',
        key: 'name',
        icon: 'pi pi-user',
        component: 'InputText'
    },
    {
        label: 'Email',
        key: 'email',
        icon: 'pi pi-envelope',
        component: 'InputText',
        disabled: true
    },
    {
        label: 'Số điện thoại',
        key: 'phoneNumber',
        icon: 'pi pi-phone',
        length: 11,
        component: 'InputText'
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
        component: 'DatePicker',
        props: {
            dateFormat: 'dd/mm/yy',
            showIcon: true
        }
    },
    {
        label: 'Địa chỉ',
        key: 'address',
        icon: 'pi pi-map-marker',
        component: 'InputText'
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
    submit.value = false;
};

const cancelEdit = () => {
    isEditing.value = false;
    userData.value = JSON.parse(JSON.stringify(originalUserData.value));
};

// Lấy thông tin user
const getUserInfo = async () => {
    try {
        isLoading.value = true;
        const res = await apiService.get('auth/profile');
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

const validateProfile = () => {
    const { name, email, phoneNumber, dateOfBirth, address, gender } = userData.value;
    if (!name || !email || !phoneNumber || !dateOfBirth || !address) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập đầy đủ thông tin', life: 3000 });
        return false;
    }
    if (!/^0\d{9,10}$/.test(phoneNumber)) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng số 0 và có 10 hoặc 11 chữ số.', life: 3000 });
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Email không hợp lệ. Vui lòng nhập đúng định dạng email.', life: 3000 });
        return false;
    }

    return true;
};
// Cập nhật thông tin
const updateProfile = async () => {
    submit.value = true;
    if (!validateProfile()) return;
    try {
        isLoading.value = true;
        await apiService.patch('users/' + userData.value._id, {
            ...userData.value,
            dateOfBirth: userData.value.dateOfBirth ? parseDate(userData.value.dateOfBirth) : null
        });
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thông tin thành công', life: 3000 });
        isEditing.value = false;
        accountService.updateAccount();
        originalUserData.value = JSON.parse(JSON.stringify(userData.value));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Cập nhật thất bại', life: 3000 });
    } finally {
        isLoading.value = false;
        submit.value = false;
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
const validatePassword = () => {
    if (!passwordData.value.oldPassword || !passwordData.value.newPassword || !passwordData.value.confirmPassword) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập đầy đủ thông tin', life: 3000 });
        return false;
    }
    if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Mật khẩu xác nhận không khớp', life: 3000 });
        return false;
    }
    return true;
};
const changePassword = async () => {
    submit.value = true;
    if (!validatePassword()) return;

    try {
        isChangingPassword.value = true;
        await apiService.post('users/change-password', {
            oldPassword: passwordData.value.oldPassword,
            newPassword: passwordData.value.newPassword
        });
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đổi mật khẩu thành công', life: 3000 });
        passwordData.value = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        };
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Đổi mật khẩu thất bại', life: 3000 });
    } finally {
        isChangingPassword.value = false;
        submit.value = false;
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
