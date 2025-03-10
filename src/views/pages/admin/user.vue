<script setup>
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import Loading from '../../../components/Loading.vue';
import { linkUploads } from '../../../constant/api';
import apiService from '../../../service/api.service';
import parseDate from '../../../utils/parseDate';

onMounted(async () => {
    isLoading.value = true;

    await getAll();
    await getAllOption();
    isLoading.value = false;
});

const toast = useToast();
const dt = ref();
const keySearch = ref('');
const urlApi = 'users';

const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
});
const valueData = ref([]);
const isLoading = ref(false);
const isLoadingData = ref(false);
const submitted = ref(false);
const isEventDialog = ref(false);
const eventData = ref({});
const dataFileInput = ref(null);
const deleteDialog = ref(false);
const valueFilter = ref({
    isActive: null,
    sort: false
});

const dataGetAllOption = ref({
    role: []
});
function openEventDialog() {
    eventData.value = {};
    submitted.value = false;
    isEventDialog.value = true;
}

function hideDialog() {
    isEventDialog.value = false;
    eventData.value = {};
    submitted.value = false;
    deleteDialog.value = false;
}

function getDataDetail(prod) {
    eventData.value = { ...prod, role: prod.role._id, dateOfBirth: prod.dateOfBirth ? format(prod.dateOfBirth, 'dd/MM/yyyy') : null };
    isEventDialog.value = true;
    avatarData.value = null;
}

const validate = () => {
    const phoneRegex = /^0\d{9,10}$/;
    if (!phoneRegex.test(eventData.value.phoneNumber)) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Số điện thoại bắt đầu bằng số 0 và có 10-11 chữ số', life: 5000 });
        return false;
    }

    return true;
};
const uploadFile = async () => {
    if (!dataFileInput.value) return;
    try {
        const res = await apiService.upload(dataFileInput.value, 'users');
        eventData.value.avatar = res.data.fileName;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Lỗi không xác định', life: 10000 });
    }
};

async function saveData() {
    submitted.value = true;
    isLoadingData.value = true;
    if (!validate()) {
        isLoadingData.value = false;
        return;
    }
    try {
        await uploadFile();
        eventData.value.password ? eventData.value.password : delete eventData.value.password;
        if (eventData.value._id) {
            const res = await apiService.patch(urlApi + '/' + eventData.value._id, { ...eventData.value, dateOfBirth: parseDate(eventData.value.dateOfBirth) });

            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
        } else {
            const res = await apiService.post(urlApi, eventData.value);
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
        }
        getAll();
        hideDialog();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Lỗi không xác định', life: 10000 });
    } finally {
        isLoadingData.value = false;
    }
}

const getAll = async () => {
    isLoadingData.value = true;
    const conditions = Object.entries(valueFilter.value)
        .filter(([key, value]) => value !== null)
        .map(([key, value]) => {
            if (key === 'sort') {
                return `sort=${value ? 'createdAt' : '-createdAt'}`;
            }
            return `${key}=${value}`;
        });

    const filter = conditions.join(',');
    try {
        const res = await apiService.get(urlApi + '?page=' + pagination.value.page + '&pageSize=' + pagination.value.pageSize + (keySearch.value ? '&search=' + keySearch.value : '') + (filter ? '&filter=' + filter : ''));
        valueData.value = res.data.items;
        pagination.value.total = res.data.total;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Lỗi không xác định', life: 3000 });
    } finally {
        isLoadingData.value = false;
    }
};
const getAllOption = async () => {
    try {
        const res = await apiService.get('roles/getAll');
        dataGetAllOption.value.role = res.data.items;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Lỗi không xác định', life: 3000 });
    }
};
const handlePage = (event) => {
    pagination.value.page = event.page + 1;
    pagination.value.pageSize = event.rows;
    getAll();
};
const handleFilter = () => {
    pagination.value.page = 1;
    getAll();
};

function confirmDeleteProduct(prod) {
    eventData.value = prod;
    deleteDialog.value = true;
}

const deleteProduct = async () => {
    isLoadingData.value = true;
    try {
        const res = await apiService.delete(urlApi + '/' + eventData.value._id);
        getAll();
        hideDialog();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Lỗi không xác định', life: 3000 });
    } finally {
        isLoadingData.value = false;
    }
};

const avatarData = ref(null);
const UploadFileLocal = async (event) => {
    const file = event.target.files[0];
    dataFileInput.value = file;
    avatarData.value = URL.createObjectURL(file);
    console.log(avatarData.value);
};
</script>

<template>
    <Loading v-if="isLoading" />
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Thêm" icon="pi pi-plus" class="mr-2" @click="openEventDialog" />
                </template>

                <template #end>
                    <Select
                        v-model="valueFilter.isActive"
                        :options="[
                            { label: 'Tất cả', value: null },
                            { label: 'Hoạt động', value: true },
                            { label: 'Không hoạt động', value: false }
                        ]"
                        placeholder="Tất cả"
                        optionLabel="label"
                        optionValue="value"
                        @change="handleFilter"
                        class="mr-2"
                    />

                    <Button label="Làm mới" icon="pi pi-refresh" severity="secondary" @click="getAll" class="mr-2" />
                    <Button
                        v-if="valueFilter.sort"
                        label="Mới nhất"
                        icon="pi pi-arrow-down"
                        severity="secondary"
                        @click="
                            () => {
                                valueFilter.sort = false;
                                getAll();
                            }
                        "
                        class="mr-2"
                    />
                    <Button
                        v-else
                        label="Cũ nhất"
                        icon="pi pi-arrow-up"
                        severity="secondary"
                        @click="
                            () => {
                                valueFilter.sort = true;
                                getAll();
                            }
                        "
                        class="mr-2"
                    />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                lazy
                :value="valueData"
                :paginator="true"
                :loading="isLoadingData"
                :rows="pagination.pageSize"
                :page="pagination.page"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25, 50, 100]"
                currentPageReportTemplate="Từ {first} đến {last} trong {totalRecords} dữ liệu"
                :totalRecords="pagination.total"
                @page="handlePage($event)"
            >
                <template #empty>
                    <div class="flex justify-center items-center h-full">
                        <span class="text-gray-500">Không có dữ liệu</span>
                    </div>
                </template>
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0 text-lg font-bold">Trang quản lý tài khoản người dùng</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="keySearch" placeholder="Tìm kiếm..." @change="handleFilter" />
                        </IconField>
                    </div>
                </template>

                <Column header="STT" style="min-width: 5rem">
                    <template #body="slotProps">
                        {{ (pagination.page - 1) * pagination.pageSize + slotProps.index + 1 }}
                    </template>
                </Column>

                <Column field="avatar" header="Ảnh đại diện" style="min-width: 8rem">
                    <template #body="slotProps">
                        <img :src="slotProps.data.avatar ? linkUploads(slotProps.data.avatar) : 'https://placehold.co/80x80'" alt="image" class="rounded-lg w-[80px] h-[80px] object-cover" />
                    </template>
                </Column>
                <Column field="name" header="Tên người dùng" style="min-width: 13rem"></Column>
                <Column field="email" header="Email" style="min-width: 10rem"> </Column>
                <Column field="gender" header="Giới tính" style="min-width: 7rem"> </Column>
                <Column field="phoneNumber" header="Số điện thoại" style="min-width: 9rem"> </Column>
                <Column field="role.name" header="Vai trò" style="min-width: 9rem"> </Column>
                <Column field="createdAt" header="Ngày tạo" style="min-width: 12rem">
                    <template #body="slotProps">
                        {{ format(slotProps.data.createdAt, 'dd/MM/yyyy') + ' lúc ' + format(slotProps.data.createdAt, 'HH:mm') }}
                    </template>
                </Column>
                <Column field="isActive" header="Trạng thái" style="min-width: 8rem">
                    <template #body="slotProps">
                        {{ slotProps.data.isActive ? 'Hoạt động' : 'Không hoạt động' }}
                    </template>
                </Column>

                <Column :exportable="false" style="min-width: 7rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="getDataDetail(slotProps.data)" v-tooltip="'Chức năng sửa'" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" v-tooltip="'Chức năng xóa'" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="isEventDialog" :style="{ width: '1200px' }" :modal="true" maximizable>
            <template #header>
                <h4 class="m-0 text-lg font-bold flex align-items-center gap-2">{{ eventData?.id ? 'Cập nhật tài khoản người dùng' : 'Thêm tài khoản người dùng' }} - <ToggleSwitch v-model="eventData.isActive" id="isActive" /> Trạng thái</h4>
            </template>
            <div class="flex w-full gap-6">
                <div class="flex flex-col gap-4 w-1/2">
                    <div>
                        <label for="name" class="block font-bold mb-1">Tên người dùng <small class="text-red-500">*</small></label>
                        <InputText id="name" v-model="eventData.name" autofocus :invalid="submitted && !eventData.name" fluid placeholder="Vui lòng nhập tên vai trò" />
                    </div>
                    <div>
                        <label for="password" class="block font-bold mb-1">Mật khẩu <small class="text-red-500">*</small></label>
                        <Password id="password" :toggleMask="true" v-model="eventData.password" autofocus :invalid="submitted && !eventData.password && !eventData._id" fluid placeholder="Vui lòng nhập mật khẩu" />
                    </div>

                    <div>
                        <label for="email" class="block font-bold mb-1">Email <small class="text-red-500">*</small></label>
                        <InputText id="email" v-model="eventData.email" autofocus :invalid="submitted && !eventData.email" fluid placeholder="Vui lòng nhập email" />
                    </div>
                    <div class="flex gap-3 w-full">
                        <div class="w-1/2">
                            <label for="phoneNumber" class="block font-bold mb-1">Số điện thoại <small class="text-red-500">*</small></label>
                            <InputText maxlength="11" id="phoneNumber" v-model="eventData.phoneNumber" autofocus :invalid="submitted && !eventData.phoneNumber" fluid placeholder="Vui lòng nhập số điện thoại" />
                        </div>

                        <div class="w-1/2">
                            <label for="gender" class="block font-bold mb-1">Giới tính <small class="text-red-500">*</small></label>
                            <Select id="gender" v-model="eventData.gender" :options="['Nam', 'Nữ', 'Khác']" autofocus :invalid="submitted && !eventData.gender" fluid placeholder="Vui lòng chọn giới tính" />
                        </div>
                    </div>

                    <div>
                        <label for="role" class="block font-bold mb-1">Vai trò <small class="text-red-500">*</small></label>
                        <Select id="role" v-model="eventData.role" :options="dataGetAllOption.role" optionLabel="name" optionValue="_id" required="true" autofocus :invalid="submitted && !eventData.role" fluid placeholder="Vui lòng chọn vai trò" />
                    </div>
                    <div>
                        <label for="address" class="block font-bold mb-1">Địa chỉ</label>
                        <InputText id="address" v-model="eventData.address" required="true" autofocus fluid placeholder="Vui lòng nhập địa chỉ" />
                    </div>
                </div>

                <div class="flex flex-col gap-4 w-1/2">
                    <div class="flex gap-3 justify-between items-end">
                        <div class="w-2/3">
                            <label class="block font-bold mb-1">Link mạng xã hội</label>
                            <div class="gap-3 w-full flex flex-col gap-2">
                                <InputText v-model="eventData.linkYoutube" required="true" autofocus fluid placeholder="Youtube" />
                                <InputText v-model="eventData.linkFacebook" required="true" autofocus fluid placeholder="Facebook" />
                                <InputText v-model="eventData.linkTiktok" required="true" autofocus fluid placeholder="Tiktok" />
                            </div>
                        </div>
                        <div class="w-1/3">
                            <label class="block font-bold mb-1">Ảnh đại diện</label>
                            <div class="relative group w-full h-[131px] border border-orange-500 overflow-hidden rounded-lg cursor-pointer" @click="$refs.fileInput.click()">
                                <img :src="avatarData || (eventData.avatar ? linkUploads(eventData.avatar) : 'https://placehold.co/128x128')" alt="avatar" class="w-full h-full object-cover" />
                                <div class="absolute bottom-0 right-0 bg-white/40 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <i class="pi pi-upload text-orange-500" style="font-size: 2rem"></i>
                                </div>
                            </div>
                            <input ref="fileInput" type="file" @change="UploadFileLocal" accept="image/*" class="hidden" />
                        </div>
                    </div>
                    <div>
                        <label for="dateOfBirth" class="block font-bold mb-1">Ngày sinh</label>

                        <DatePicker dateFormat="dd/mm/yy" id="dateOfBirth" v-model="eventData.dateOfBirth" required="true" autofocus fluid placeholder="Vui lòng nhập ngày sinh" />
                    </div>

                    <div>
                        <label for="description" class="block font-bold mb-1">Mô tả</label>
                        <Textarea id="description" v-model="eventData.description" required="true" autofocus fluid placeholder="Vui lòng nhập mô tả" class="h-[169px]" />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Huỷ" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Lưu" icon="pi pi-check" @click="saveData" :loading="isLoadingData" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Xác nhận xóa" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="eventData">Bạn có chắc chắn muốn xóa {{ eventData.name }} này không?</span>
            </div>
            <template #footer>
                <Button label="Huỷ" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Xóa" icon="pi pi-check" @click="deleteProduct" :loading="isLoadingData" />
            </template>
        </Dialog>
    </div>
</template>
