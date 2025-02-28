<script setup>
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import Loading from '../../../components/Loading.vue';
import RichTextEditor from '../../../components/RichTextEditor.vue';
import { linkUploads } from '../../../constant/api';
import apiService from '../../../service/api.service';
import { getConscious, getDistrict, getWard } from '../../../service/location.service';

onMounted(async () => {
    isLoading.value = true;
    await Promise.all([getAll(), getAllOption(), getAllLocation()]);
    isLoading.value = false;
});

const toast = useToast();
const dt = ref();
const keySearch = ref('');
const urlApi = 'projects';

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
const dataFileInputs = ref([]);
const deleteDialog = ref(false);
const valueFilter = ref({
    isActive: null,
    sort: false
});

const dataGetAllOption = ref({
    campaign: [],
    user: [],
    conscious: [],
    district: [],
    ward: []
});

function openEventDialog() {
    eventData.value = {};
    submitted.value = false;
    isEventDialog.value = true;
}

function hideDialog() {
    isEventDialog.value = false;
    dataFileInputs.value = [];
    dataFileInput.value = null;
    inputDatas.value = [];
    inputData.value = null;
    eventData.value = {};
    submitted.value = false;
    deleteDialog.value = false;
}

function getDataDetail(prod) {
    eventData.value = {
        ...prod,
        organization: prod.organization?._id,
        campaign: prod.campaign?._id
    };
    isEventDialog.value = true;
}

const validate = () => {
    let isValid = true;

    // Kiểm tra tên dự án
    if (!eventData.value.name?.trim()) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập tên dự án', life: 3000 });
        isValid = false;
    }

    // Kiểm tra trạng thái
    if (!eventData.value.status) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn trạng thái', life: 3000 });
        isValid = false;
    }

    // Kiểm tra chiến dịch
    if (!eventData.value.campaign) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn chiến dịch', life: 3000 });
        isValid = false;
    }

    // Kiểm tra mục tiêu quyên góp
    if (!eventData.value.goalAmount) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập mục tiêu quyên góp', life: 3000 });
        isValid = false;
    }

    // Kiểm tra ngày bắt đầu
    if (!eventData.value.startDate) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn ngày bắt đầu', life: 3000 });
        isValid = false;
    }

    // Kiểm tra ngày kết thúc
    if (!eventData.value.endDate) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn ngày kết thúc', life: 3000 });
        isValid = false;
    }

    // Kiểm tra tổ chức kêu gọi
    if (!eventData.value.organization) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn tổ chức kêu gọi', life: 3000 });
        isValid = false;
    }

    // Kiểm tra mô tả
    if (!eventData.value.description?.trim()) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập mô tả', life: 3000 });
        isValid = false;
    }

    // Kiểm tra địa chỉ
    if (!eventData.value.address?.trim()) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập địa chỉ', life: 3000 });
        isValid = false;
    }

    // Kiểm tra địa chỉ chi tiết
    if (!eventData.value.detailAddress?.trim()) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập đầy đủ các trường địa chỉ', life: 3000 });
        isValid = false;
    }

    // Kiểm tra ảnh nổi bật
    if (!eventData.value.image && !dataFileInput.value) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn ảnh nổi bật', life: 3000 });
        isValid = false;
    }

    // Kiểm tra danh sách ảnh
    if (eventData.value.listImage?.length === 0 && dataFileInputs.value.length === 0) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn danh sách ảnh', life: 3000 });
        isValid = false;
    }

    return isValid;
};
const uploadFile = async () => {
    try {
        if (dataFileInput.value) {
            const res = await apiService.upload(dataFileInput.value, 'projects');
            eventData.value.image = res.data.fileName;
        }
        if (dataFileInputs.value.length > 0) {
            const resImages = await Promise.all(dataFileInputs.value.map(async (item) => await apiService.upload(item, 'projects')));
            eventData.value.listImage.push(...resImages.map((item) => item.data.fileName));
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Lỗi không xác định', life: 10000 });
    }
};

async function saveData() {
    submitted.value = true;
    if (!validate()) {
        return;
    }
    isLoadingData.value = true;

    const { address, conscious, district, ward } = eventData.value;
    const mergeLocation = address + ', ' + ward?.name + ', ' + district?.name + ', ' + conscious?.name;
    try {
        await uploadFile();
        if (eventData.value._id) {
            const res = await apiService.patch(urlApi + '/' + eventData.value._id, { ...eventData.value, detailAddress: mergeLocation });
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
        } else {
            const res = await apiService.post(urlApi, { ...eventData.value, detailAddress: mergeLocation });
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
        const [resCampaign, resUser] = await Promise.all([apiService.get('campaigns/getAll'), apiService.get('users/getAll')]);
        dataGetAllOption.value.campaign = resCampaign.data;
        dataGetAllOption.value.user = resUser.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Lỗi không xác định', life: 3000 });
    }
};
const getAllLocation = async (event, type = null) => {
    try {
        if (type === 'district') {
            const res = await getDistrict(event.id);
            dataGetAllOption.value.district = res.data;
            eventData.value.district = null;
        } else if (type === 'ward') {
            const res = await getWard(event.id);
            dataGetAllOption.value.ward = res.data;
            eventData.value.ward = null;
        } else {
            const res = await getConscious();
            dataGetAllOption.value.conscious = res.data;
        }
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

const inputData = ref(null);
const inputDatas = ref([]);
const UploadFileLocal = async (event, images = false) => {
    debugger;
    if (images) {
        const files = Array.from(event.target.files);
        dataFileInputs.value = files;
        files.forEach((file) => {
            inputDatas.value.push(URL.createObjectURL(file));
        });
    } else {
        const file = event.target.files[0];
        dataFileInput.value = file;
        inputData.value = URL.createObjectURL(file);
    }
};

const getStatus = (status) => {
    switch (status) {
        case 'CXN':
            return 'Chờ xác nhận';
        case 'DTH':
            return 'Đang thực hiện';
        case 'DMT':
            return 'Đạt mục tiêu';
        case 'DKT':
            return 'Đã kết thúc';
        case 'TD':
            return 'Tạm dừng';
        default:
            return status;
    }
};
const valueStatus = ref([
    { label: 'Chờ xác nhận', value: 'CXN' },
    { label: 'Đang thực hiện', value: 'DTH' },
    { label: 'Đạt mục tiêu', value: 'DMT' },
    { label: 'Đã kết thúc', value: 'DKT' },
    { label: 'Tạm dừng', value: 'TD' }
]);

const removeImage = (index) => {
    inputDatas.value.splice(index, 1);
    dataFileInputs.value.splice(index, 1);
};

const removeImageList = (index) => {
    eventData.value.listImage.splice(index, 1);
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
                scrollable
                @page="handlePage($event)"
            >
                <template #empty>
                    <div class="flex justify-center items-center h-full">
                        <span class="text-gray-500">Không có dữ liệu</span>
                    </div>
                </template>
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0 text-lg font-bold">Trang quản lý dự án</h4>
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

                <Column field="avatar" header="Ảnh dự án" style="min-width: 8rem">
                    <template #body="slotProps">
                        <img :src="slotProps.data.image ? linkUploads(slotProps.data.image) : 'https://placehold.co/80x80'" alt="image" class="rounded-lg w-[80px] h-[80px] object-cover" />
                    </template>
                </Column>
                <Column field="name" header="Tên dự án" style="min-width: 14rem"></Column>
                <Column field="campaign.name" header="Chiến dịch" style="min-width: 8rem"> </Column>
                <Column field="organization.name" header="Bời" style="min-width: 8rem"> </Column>
                <Column field="status" header="Trạng thái" style="min-width: 7rem">
                    <template #body="slotProps">
                        {{ getStatus(slotProps.data.status) }}
                    </template>
                </Column>
                <Column field="startDate" header="Ngày bắt đầu" style="min-width: 12rem">
                    <template #body="slotProps">
                        {{
                            slotProps.data.startDate ? format(slotProps.data.startDate, 'dd/MM/yyyy') + ' lúc ' + format(slotProps.data.startDate, 'HH:mm') : '--' + ' lúc ' + slotProps.data.startDate ? format(slotProps.data.startDate, 'HH:mm') : '--'
                        }}
                    </template>
                </Column>

                <Column field="endDate" header="Ngày kết thúc" style="min-width: 12rem">
                    <template #body="slotProps">
                        {{ slotProps.data.endDate ? format(slotProps.data.endDate, 'dd/MM/yyyy') + ' lúc ' + format(slotProps.data.endDate, 'HH:mm') : '--' }}
                    </template>
                </Column>

                <Column field="createdAt" header="Ngày tạo" style="min-width: 12rem">
                    <template #body="slotProps">
                        {{ format(slotProps.data.createdAt, 'dd/MM/yyyy') + ' lúc ' + format(slotProps.data.createdAt, 'HH:mm') }}
                    </template>
                </Column>
                <Column field="isActive" header="Tình trạng" style="min-width: 8rem">
                    <template #body="slotProps">
                        {{ slotProps.data.isActive ? 'Hoạt động' : 'Không hoạt động' }}
                    </template>
                </Column>

                <Column :exportable="false" style="min-width: 8rem" frozen alignFrozen="right">
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
            <div class="w-full flex gap-6 mb-4">
                <div class="w-1/5">
                    <label class="block font-bold mb-1">Ảnh nổi bật <small class="text-red-500">*</small></label>
                    <div class="relative group w-full h-[131px] border border-orange-500 overflow-hidden rounded-lg cursor-pointer" @click="$refs.fileInput.click()">
                        <img :src="inputData || (eventData.image ? linkUploads(eventData.image) : 'https://placehold.co/128x128')" alt="avatar" class="w-full h-full object-cover" />
                        <div class="absolute bottom-0 right-0 bg-white/40 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <i class="pi pi-upload text-orange-500" style="font-size: 2rem"></i>
                        </div>
                    </div>
                    <input ref="fileInput" type="file" @change="UploadFileLocal" accept="image/*" class="hidden" />
                </div>
                <div class="w-4/5 flex gap-3">
                    <div class="w-1/6">
                        <label class="block font-bold mb-1">Danh sách ảnh <small class="text-red-500">*</small></label>
                        <div class="relative group w-full h-[131px] border border-orange-500 overflow-hidden rounded-lg cursor-pointer" @click="$refs.fileInputs.click()">
                            <div class="absolute bottom-0 right-0 bg-white/40 w-full h-full flex justify-center items-center opacity-100 transition-opacity duration-300 hover:bg-orange-100">
                                <i class="pi pi-upload text-orange-500" style="font-size: 2rem"></i>
                            </div>
                        </div>
                        <input ref="fileInputs" type="file" @change="UploadFileLocal($event, true)" accept="image/*" class="hidden" multiple />
                    </div>
                    <div class="w-5/6 flex gap-2 overflow-x-auto">
                        <template v-if="inputDatas.length > 0">
                            <template v-for="(item, index) in inputDatas" :key="item">
                                <div class="w-1/5 flex-shrink-0">
                                    <button class="text-red-500 w-full font-bold" v-tooltip="'Xóa ảnh'" @click="removeImage(index)">
                                        <i class="pi pi-times"></i>
                                    </button>

                                    <div class="relative group w-full h-[131px] border border-orange-500 overflow-hidden rounded-lg cursor-pointer">
                                        <img :src="item" alt="avatar" class="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </template>
                        </template>
                        <template v-if="eventData.listImage?.length > 0">
                            <template v-for="(item, index) in eventData.listImage" :key="item">
                                <div class="w-1/5 flex-shrink-0">
                                    <button class="text-red-500 w-full font-bold mb-1" v-tooltip="'Xóa ảnh'" @click="removeImageList(index)">
                                        <i class="pi pi-times"></i>
                                    </button>

                                    <div class="relative group w-full h-[131px] border border-orange-500 overflow-hidden rounded-lg cursor-pointer">
                                        <img :src="linkUploads(item)" alt="avatar" class="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
            <div class="flex w-full gap-6">
                <div class="flex flex-col gap-4 w-1/2">
                    <div>
                        <label for="name" class="block font-bold mb-1">Tên dự án <small class="text-red-500">*</small></label>
                        <InputText id="name" v-model.trim="eventData.name" autofocus :invalid="submitted && !eventData.name" fluid placeholder="Vui lòng nhập tên dự án" />
                    </div>
                    <div class="flex gap-3 w-full">
                        <div class="w-1/2">
                            <label for="gender" class="block font-bold mb-1">Trạng thái <small class="text-red-500">*</small></label>
                            <Select id="status" v-model.trim="eventData.status" :options="valueStatus" optionLabel="label" optionValue="value" autofocus :invalid="submitted && !eventData.status" fluid placeholder="Vui lòng chọn trạng thái" />
                        </div>
                        <div class="w-1/2">
                            <label for="role" class="block font-bold mb-1">Tỉnh thành <small class="text-red-500">*</small></label>
                            <Select
                                id="role"
                                v-model.trim="eventData.conscious"
                                :options="dataGetAllOption.conscious"
                                optionLabel="full_name"
                                @change="getAllLocation(eventData.conscious, 'district')"
                                required="true"
                                autofocus
                                :invalid="submitted && !eventData.conscious"
                                filter
                                fluid
                                placeholder="Vui lòng chọn tỉnh thành"
                            />
                        </div>
                    </div>

                    <div class="flex gap-3 w-full">
                        <div class="w-1/2">
                            <label for="role" class="block font-bold mb-1">Quận huyện<small class="text-red-500">*</small></label>
                            <Select
                                :disabled="!eventData.conscious"
                                id="role"
                                v-model.trim="eventData.district"
                                :options="dataGetAllOption.district"
                                optionLabel="full_name"
                                @change="getAllLocation(eventData.district, 'ward')"
                                required="true"
                                autofocus
                                :invalid="submitted && !eventData.district"
                                filter
                                fluid
                                placeholder="Vui lòng chọn quận huyện"
                            />
                        </div>
                        <div class="w-1/2">
                            <label for="role" class="block font-bold mb-1">Phường xã <small class="text-red-500">*</small></label>
                            <Select
                                id="role"
                                :disabled="!eventData.district"
                                v-model.trim="eventData.ward"
                                :options="dataGetAllOption.ward"
                                optionLabel="full_name"
                                required="true"
                                autofocus
                                :invalid="submitted && !eventData.ward"
                                filter
                                fluid
                                placeholder="Vui lòng chọn phường xã"
                            />
                        </div>
                    </div>

                    <div>
                        <label for="name" class="block font-bold mb-1">Địa chỉ <small class="text-red-500">*</small></label>
                        <InputText id="address" v-model.trim="eventData.address" autofocus :invalid="submitted && !eventData.address" fluid placeholder="Vui lòng nhập địa chỉ" />
                    </div>
                </div>
                <div class="flex flex-col gap-4 w-1/2">
                    <div>
                        <label for="goalAmount" class="block font-bold mb-1">Mục tiêu quyên góp (VNĐ) <small class="text-red-500">*</small></label>
                        <InputNumber id="goalAmount" v-model.trim="eventData.goalAmount" :min="1" autofocus :invalid="submitted && !eventData.goalAmount" fluid placeholder="Vui lòng nhập mục tiêu quyên góp" />
                    </div>

                    <div class="flex gap-3 w-full">
                        <div class="w-1/2">
                            <label for="startDate" class="block font-bold mb-1">Ngày bắt đầu <small class="text-red-500">*</small></label>
                            <DatePicker
                                id="startDate"
                                showTime
                                hourFormat="24"
                                v-model.trim="eventData.startDate"
                                :maxDate="eventData.endDate ? new Date(eventData.endDate) : null"
                                autofocus
                                :invalid="submitted && !eventData.startDate"
                                fluid
                                placeholder="Vui lòng chọn ngày bắt đầu"
                            />
                        </div>

                        <div class="w-1/2">
                            <label for="endDate" class="block font-bold mb-1">Ngày kết thúc <small class="text-red-500">*</small></label>
                            <DatePicker
                                :disabled="!eventData.startDate"
                                id="endDate"
                                showTime
                                hourFormat="24"
                                :minDate="eventData.startDate ? new Date(eventData.startDate) : null"
                                v-model.trim="eventData.endDate"
                                autofocus
                                :invalid="submitted && !eventData.endDate"
                                fluid
                                placeholder="Vui lòng chọn ngày kết thúc"
                            />
                        </div>
                    </div>
                    <div>
                        <label for="organization" class="block font-bold mb-1">Tổ chức kêu gọi <small class="text-red-500">*</small></label>
                        <Select
                            id="organization"
                            v-model.trim="eventData.organization"
                            :options="dataGetAllOption.user"
                            optionLabel="name"
                            optionValue="_id"
                            required="true"
                            autofocus
                            :invalid="submitted && !eventData.organization"
                            filter
                            fluid
                            placeholder="Vui lòng chọn tổ chức kêu gọi"
                        />
                    </div>
                    <div>
                        <label for="role" class="block font-bold mb-1">Chiến dịch <small class="text-red-500">*</small></label>
                        <Select
                            id="role"
                            v-model.trim="eventData.campaign"
                            :options="dataGetAllOption.campaign"
                            optionLabel="name"
                            optionValue="_id"
                            required="true"
                            autofocus
                            :invalid="submitted && !eventData.campaign"
                            filter
                            fluid
                            placeholder="Vui lòng chọn chiến dịch"
                        />
                    </div>
                </div>
            </div>
            <div class="w-full flex gap-6 mb-4 mt-4">
                <div class="w-full">
                    <label class="block font-bold mb-1">Mô tả <small class="text-red-500">*</small></label>
                    <RichTextEditor v-model="eventData.description" />
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
