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
const urlApi = 'organizations';

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
const eventData = ref({
    isActive: true,
    users: [
        {
            _id: null,
            type: 'Trưởng nhóm'
        }
    ],
    socialLinks: [
        {
            platformName: null,
            url: null
        }
    ]
});
const dataFileInput = ref(null);
const deleteDialog = ref(false);
const valueFilter = ref({
    isActive: null,
    sort: false
});

const options = ref({
    role: ['Trưởng nhóm', 'Thành viên', 'Phó nhóm'],
    user: []
});
function openEventDialog() {
    eventData.value = {
        isActive: true,
        users: [
            {
                _id: null,
                type: null
            }
        ],
        socialLinks: [
            {
                platformName: null,
                url: null
            }
        ]
    };
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
    eventData.value = { ...prod, dateOfBirth: prod.dateOfBirth ? format(prod.dateOfBirth, 'dd/MM/yyyy') : null };
    isEventDialog.value = true;
    avatarData.value = null;
}

const validate = () => {
    const { phoneNumber, email, name, users, socialLinks, dateOfBirth } = eventData.value;
    const phoneRegex = /^0\d{9,10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Kiểm tra định dạng email
    if (!phoneRegex.test(phoneNumber)) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Số điện thoại bắt đầu bằng số 0 và có 10-11 chữ số', life: 5000 });
        return false;
    }
    if (!emailRegex.test(email)) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Email không hợp lệ', life: 5000 });
        return false;
    }
    if (!name) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Tên tổ chức không được để trống', life: 5000 });
        return false;
    }
    if (!users.length) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Người tham gia không được để trống', life: 5000 });
        return false;
    }
    if (users.length > 0) {
        users.forEach((item) => {
            if (!item._id) {
                toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Người tham gia không được để trống', life: 5000 });
                return false;
            }
            if (!item.type) {
                toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vai trò không được để trống', life: 5000 });
                return false;
            }
        });
    }

    if (socialLinks.length > 0) {
        socialLinks.forEach((item) => {
            if (item.url && !item.platformName) {
                toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Tên mạng xã hội không được để trống', life: 5000 });
                return false;
            } else if (item.platformName && !item.url) {
                toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Đường dẫn mạng xã hội không được để trống', life: 5000 });
                return false;
            }
        });
    }
    if (!dateOfBirth) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn ngày thành lập', life: 5000 });
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
        const res = await apiService.get('users/getAll');
        console.log(res.data);
        options.value.user = res.data;
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

const addUser = () => {
    eventData.value.users.push({
        _id: null,
        type: 'Thành viên'
    });
};

const removeUser = (index) => {
    eventData.value.users.splice(index, 1);
};

const addSocialLink = () => {
    eventData.value.socialLinks.push({
        platformName: null,
        url: null
    });
};

const removeSocialLink = (index) => {
    eventData.value.socialLinks.splice(index, 1);
};

const getOptionsUser = (users, currentIndex) => {
    // Lấy danh sách ID người dùng đã được chọn (trừ người dùng ở ô hiện tại)
    const selectedUserIds = eventData.value.users.map((user, index) => (index !== currentIndex ? user._id : null)).filter((id) => id !== null);

    // Lọc ra những người dùng chưa được chọn
    return users.filter((user) => !selectedUserIds.includes(user._id));
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
                        <h4 class="m-0 text-lg font-bold">Trang quản lý tổ chức</h4>
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
                <Column field="phoneNumber" header="Số điện thoại" style="min-width: 9rem"> </Column>
                <Column header="Thành viên" style="min-width: 9rem">
                    <template #body="{ data }"> {{ data.users.length }} người </template>
                </Column>
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
                <h4 class="m-0 text-lg font-bold flex align-items-center gap-2">
                    {{ eventData?._id ? 'Cập nhật tổ chức' : 'Thêm tổ chức' }}
                    -
                    <ToggleSwitch v-model="eventData.isActive" id="isActive" /> Trạng thái
                </h4>
            </template>
            <div class="flex w-full gap-6">
                <div class="flex flex-col gap-4 w-1/2">
                    <div>
                        <label for="name" class="block font-bold mb-1">Tên tổ chức <small class="text-red-500">*</small></label>
                        <InputText id="name" v-model="eventData.name" autofocus :invalid="submitted && !eventData.name" fluid placeholder="Vui lòng nhập tên tổ chức" />
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
                            <label for="dateOfBirth" class="block font-bold mb-1">Ngày thành lập <small class="text-red-500">*</small></label>

                            <DatePicker dateFormat="dd/mm/yy" id="dateOfBirth" v-model="eventData.dateOfBirth" :invalid="submitted && !eventData.dateOfBirth" required="true" autofocus fluid placeholder="Vui lòng nhập ngày thành lập" />
                        </div>
                    </div>

                    <div>
                        <label for="address" class="block font-bold mb-1">Địa chỉ</label>
                        <InputText id="address" v-model="eventData.address" required="true" autofocus fluid placeholder="Vui lòng nhập địa chỉ" />
                    </div>
                    <template v-for="(item, index) in eventData.socialLinks" :key="index">
                        <div class="flex gap-3">
                            <div class="w-4/12">
                                <label :for="'platformName-' + index" class="block font-bold mb-1">Tên mạng xã hội</label>
                                <InputText :id="'platformName-' + index" v-model="item.platformName" required :invalid="submitted && !item.platformName && item.url" fluid placeholder="Vui lòng nhập tên mạng xã hội" />
                            </div>
                            <div class="w-7/12">
                                <label :for="'url-' + index" class="block font-bold mb-1">Đường dẫn mạng xã hội</label>
                                <InputText :id="'url-' + index" v-model="item.url" required :invalid="submitted && !item.url && item.platformName" fluid placeholder="Vui lòng nhập đường dẫn mạng xã hội" />
                            </div>
                            <div class="w-1/12">
                                <label class="block font-bold mb-1">&nbsp;</label>
                                <Button icon="pi pi-trash" @click="removeSocialLink(index)" size="small" text />
                            </div>
                        </div>
                    </template>
                    <Button icon="pi pi-plus" label="Thêm mạng xã hội" @click="addSocialLink" size="small" text />
                </div>

                <div class="flex flex-col gap-4 w-1/2">
                    <div class="flex gap-3 justify-between items-end">
                        <div class="w-full">
                            <label class="block font-bold mb-1">Ảnh đại diện</label>
                            <div class="relative group w-full h-[186px] border border-orange-500 overflow-hidden rounded-lg cursor-pointer" @click="$refs.fileInput.click()">
                                <img :src="avatarData || (eventData.avatar ? linkUploads(eventData.avatar) : 'https://placehold.co/128x128')" alt="avatar" class="w-full h-full object-cover" />
                                <div class="absolute bottom-0 right-0 bg-white/40 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <i class="pi pi-upload text-orange-500" style="font-size: 2rem"></i>
                                </div>
                            </div>
                            <input ref="fileInput" type="file" @change="UploadFileLocal" accept="image/*" class="hidden" />
                        </div>
                    </div>
                    <template v-for="(item, index) in eventData.users" :key="item._id">
                        <div class="flex gap-3">
                            <div class="w-6/12">
                                <label :for="'userId-' + index" class="block font-bold mb-1">Người tham gia<small class="text-red-500">*</small></label>
                                <Select
                                    :id="'userId-' + index"
                                    v-model="item._id"
                                    :options="getOptionsUser(options.user, index)"
                                    required
                                    :invalid="submitted && !item._id"
                                    fluid
                                    placeholder="Vui lòng chọn người tham gia"
                                    optionLabel="name"
                                    optionValue="_id"
                                />
                            </div>
                            <div class="w-5/12">
                                <label :for="'role-' + index" class="block font-bold mb-1">Vai trò <small class="text-red-500">*</small></label>
                                <Select :id="'role-' + index" v-model="item.type" :options="options.role" required :invalid="submitted && !item.type" fluid placeholder="Vui lòng chọn vai trò" />
                            </div>
                            <div class="w-1/12">
                                <label class="block font-bold mb-1">&nbsp;</label>
                                <Button icon="pi pi-trash" @click="removeUser(index)" size="small" text :disabled="index === 0" />
                            </div>
                        </div>
                    </template>
                    <Button icon="pi pi-plus" label="Thêm người tham gia" @click="addUser" size="small" text />
                </div>
            </div>
            <div class="mt-2">
                <label for="description" class="block font-bold mb-1">Mô tả</label>
                <Textarea id="description" v-model="eventData.description" required="true" autofocus fluid placeholder="Vui lòng nhập mô tả" class="h-[169px]" />
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
