<script setup>
import DetailProject from '@/components/DetailProject.vue';
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
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
const eventData = ref({
    isActive: true
});
const dataFileInput = ref(null);
const dataFileInputs = ref([]);
const deleteDialog = ref(false);
const valueFilter = ref({
    status: '',
    isActive: null,
    sort: false
});

const dataGetAllOption = ref({
    campaign: [],
    user: [],
    province: [],
    district: [],
    ward: [],
    organization: [],
    type: [
        { label: 'Cá nhân', value: 'CN' },
        { label: 'Tổ chức', value: 'TC' }
    ]
});

const valueStatus = ref([
    { label: 'Chờ xác nhận', value: 'CXN' },
    { label: 'Đang thực hiện', value: 'DTH' },
    { label: 'Đạt mục tiêu', value: 'DMT' },
    { label: 'Đã kết thúc', value: 'DKT' },
    { label: 'Tạm dừng', value: 'TD' }
]);

const originalStatus = ref(null);

const filteredStatusOptions = computed(() => {
    // Nếu chưa có trạng thái ban đầu, trả về tất cả options
    if (!originalStatus.value) return valueStatus.value;

    // Nếu đang ở trạng thái Đạt mục tiêu hoặc Đã kết thúc, chỉ cho phép chọn trạng thái đó
    if (originalStatus.value === 'DMT' || originalStatus.value === 'DKT') {
        return valueStatus.value.filter((option) => option.value === originalStatus.value);
    }

    // Nếu đang ở trạng thái Đang thực hiện, Tạm dừng, không cho phép chọn Chờ xác nhận
    if (originalStatus.value === 'DTH' || originalStatus.value === 'TD') {
        return valueStatus.value.filter((option) => option.value !== 'CXN');
    }

    return valueStatus.value;
});

function openEventDialog() {
    eventData.value = {
        isActive: true,
        listImage: []
    };
    submitted.value = false;
    isEventDialog.value = true;
    dataFileInputs.value = [];
    dataFileInput.value = null;
    inputDatas.value = [];
    inputData.value = null;
}

function hideDialog() {
    isEventDialog.value = false;
    dataFileInputs.value = [];
    dataFileInput.value = null;
    inputDatas.value = [];
    inputData.value = null;
    eventData.value = {
        isActive: true,
        listImage: []
    };
    originalStatus.value = null;
    submitted.value = false;
    deleteDialog.value = false;
}

//-------------------- Sửa dự án admin-------------------- (2)
function getDataDetail(prod) {
    eventData.value = {
        ...prod,
        startDate: new Date(prod.startDate),
        endDate: new Date(prod.endDate),
        organization: prod.organization?._id,
        user: prod.user?._id,
        campaign: prod.campaign?._id
    };
    originalStatus.value = prod.status;
    // originalStatus.value = null;
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
    if (!eventData.value.type) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn hình thức', life: 3000 });
        isValid = false;
    }

    // Kiểm tra tổ chức kêu gọi
    if (!eventData.value.organization && eventData.value.type == 'TC') {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn tổ chức kêu gọi', life: 3000 });
        isValid = false;
    }

    // Kiểm tra tổ chức kêu gọi
    if (!eventData.value.user && eventData.value.type == 'CN') {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn cá nhân kêu gọi', life: 3000 });
        isValid = false;
    }

    // Kiểm tra mô tả
    if (!eventData.value.description?.trim()) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập mô tả', life: 3000 });
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
        // Upload ảnh nổi bật
        if (dataFileInput.value) {
            const res = await apiService.upload(dataFileInput.value, 'projects');
            eventData.value.image = res.data.fileName;
        }

        // Upload danh sách ảnh
        if (dataFileInputs.value.length > 0) {
            if (dataFileInputs.value.length > 20) {
                toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn không quá 20 ảnh', life: 3000 });
                return false;
            }

            const resImages = await apiService.upload(dataFileInputs.value, 'projects', true);
            if (!eventData.value.listImage) {
                eventData.value.listImage = [];
            }
            eventData.value.listImage = [...eventData.value.listImage, ...resImages.data.map((item) => item.fileName)];
        }
        return true;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Lỗi khi upload ảnh', life: 3000 });
        return false;
    }
};

//-------------- Lưu dữ liệu dự án Admin khi sửa hoặc thêm mới (5)-----------------
async function saveData() {
    submitted.value = true;
    const { address, province, district, ward } = eventData.value;
    const mergeLocation = [address, ward?.name, district?.name, province?.name].filter((item) => item && item.trim()).join(', ');
    eventData.value.detailAddress = mergeLocation;
    if (!validate()) {
        return;
    }
    isLoadingData.value = true;
    try {
        const uploadSuccess = await uploadFile();
        if (!uploadSuccess) {
            isLoadingData.value = false;
            return;
        }

        if (eventData.value._id) {
            await apiService.patch(urlApi + '/' + eventData.value._id, eventData.value);
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
        } else {
            await apiService.post(urlApi, eventData.value);
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
        }
        getAll();
        hideDialog();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Lỗi không xác định từ save data', life: 10000 });
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
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Lỗi không xác định từ get all', life: 3000 });
    } finally {
        isLoadingData.value = false;
    }
};
const getAllOption = async () => {
    try {
        const [resCampaign, resUser, resOrganization] = await Promise.all([apiService.get('campaigns/getAll'), apiService.get('users/getAll'), apiService.get('organizations/getAll')]);
        dataGetAllOption.value.campaign = resCampaign.data;
        dataGetAllOption.value.user = resUser.data;
        dataGetAllOption.value.organization = resOrganization.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Lỗi không xác định từ get all option', life: 3000 });
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
            dataGetAllOption.value.province = res.data;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Lỗi không xác định từ lấy tỉnh thành', life: 3000 });
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
        await apiService.delete(urlApi + '/' + eventData.value._id);
        getAll();
        hideDialog();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Lỗi không xác định từ xoá dự án', life: 3000 });
    } finally {
        isLoadingData.value = false;
    }
};

const inputData = ref(null);
const inputDatas = ref([]);
const UploadFileLocal = async (event, images = false) => {
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

const removeImage = (index) => {
    inputDatas.value.splice(index, 1);
    dataFileInputs.value.splice(index, 1);
};

const removeImageList = (index) => {
    eventData.value.listImage.splice(index, 1);
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 2 }).format(value);
};
const formatPercent = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'decimal', maximumFractionDigits: 2 }).format(value);
};
</script>

<template>
    <Loading v-if="isLoading" />

    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Thêm mới" icon="pi pi-plus" class="mr-2" @click="openEventDialog" />
                </template>

                <template #end>
                    <Select v-model="valueFilter.status" placeholder="Tất cả" @change="handleFilter" class="mr-2" :options="[{ label: 'Tất cả', value: '' }, ...filteredStatusOptions]" optionLabel="label" optionValue="value" autofocus />

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

                <Column field="image" header="Ảnh dự án" style="min-width: 8rem">
                    <template #body="slotProps">
                        <img :src="slotProps.data.image ? linkUploads(slotProps.data.image) : 'https://placehold.co/80x80'" alt="image" class="rounded-lg w-[80px] h-[80px] object-cover" />
                    </template>
                </Column>
                <Column field="name" header="Tên dự án" style="min-width: 14rem"></Column>
                <Column field="campaign.name" header="Chiến dịch" style="min-width: 8rem"> </Column>
                <Column header="Bởi" style="min-width: 8rem">
                    <template #body="slotProps">
                        {{ slotProps.data.type ? (slotProps.data.type == 'CN' ? slotProps.data.user?.name : slotProps.data.organization?.name) : '--' }}
                    </template>
                </Column>
                <Column field="status" header="Trạng thái" style="min-width: 10rem">
                    <template #body="slotProps">
                        <Tag v-if="slotProps.data.status === 'CXN'" severity="warning" value="Chờ xác nhận"></Tag>
                        <Tag v-if="slotProps.data.status === 'DTH'" severity="info" value="Đang thực hiện"></Tag>
                        <Tag v-if="slotProps.data.status === 'DMT'" severity="success" value="Đạt mục tiêu"></Tag>
                        <Tag v-if="slotProps.data.status === 'DKT'" severity="danger" value="Đã kết thúc"></Tag>
                        <Tag v-if="slotProps.data.status === 'TD'" severity="help" value="Tạm dừng"></Tag>
                    </template>
                </Column>
                <Column field="currentAmount" header="Tiền đạt được" style="min-width: 7rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data?.currentAmount || 0) }}
                    </template>
                </Column>

                <Column field="percent" header="Tiến độ dự án" style="min-width: 7rem">
                    <template #body="slotProps">{{ formatPercent((slotProps.data?.currentAmount / slotProps.data?.goalAmount) * 100 || 0) }}% </template>
                </Column>
                <Column field="percent" header="Số ngày còn lại" style="min-width: 7rem">
                    <template #body="slotProps">{{
                        Math.ceil((new Date(slotProps.data.endDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 0 ? 'Đã kết thúc' : Math.ceil((new Date(slotProps.data.endDate) - new Date()) / (1000 * 60 * 60 * 24)) + ' ngày'
                    }}</template>
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
                <Column :exportable="false" style="min-width: 13rem" frozen alignFrozen="right">
                    <template #body="slotProps">
                        <!--------------- Sửa dự án ADMIN (1) --------------------->
                        <DetailProject :data="slotProps.data" :isUpdate="true" />
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="getDataDetail(slotProps.data)" v-tooltip="'Chức năng sửa'" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" v-tooltip="'Chức năng xóa'" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!---------------------- Cập nhật dự án admin (3) ------------------>
        <Dialog v-model:visible="isEventDialog" :style="{ width: '1200px' }" :modal="true" maximizable>
            <template #header>
                <h4 class="m-0 text-lg font-bold flex align-items-center gap-2">{{ eventData?._id ? 'Cập nhật dự án' : 'Thêm mới dự án' }} - <ToggleSwitch v-model="eventData.isActive" id="isActive" /> Trạng thái</h4>
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
                        <InputText id="name" v-model="eventData.name" autofocus :invalid="submitted && !eventData.name" fluid placeholder="Vui lòng nhập tên dự án" />
                    </div>
                    <div class="flex gap-3 w-full">
                        <div class="w-1/2">
                            <label for="gender" class="block font-bold mb-1">Trạng thái <small class="text-red-500">*</small></label>
                            <Select id="status" v-model="eventData.status" :options="filteredStatusOptions" optionLabel="label" optionValue="value" autofocus :invalid="submitted && !eventData.status" fluid placeholder="Vui lòng chọn trạng thái" />
                        </div>
                        <div class="w-1/2">
                            <label for="role" class="block font-bold mb-1">Tỉnh, thành phố</label>
                            <Select
                                id="role"
                                v-model="eventData.province"
                                :options="dataGetAllOption.province"
                                optionLabel="full_name"
                                @change="getAllLocation(eventData.province, 'district')"
                                required="true"
                                autofocus
                                filter
                                fluid
                                placeholder="Vui lòng chọn tỉnh thành"
                            />
                        </div>
                    </div>

                    <div class="flex gap-3 w-full">
                        <div class="w-1/2">
                            <label for="role" class="block font-bold mb-1">Quận, huyện</label>
                            <Select
                                :disabled="!eventData.province"
                                id="role"
                                v-model="eventData.district"
                                :options="dataGetAllOption.district"
                                optionLabel="full_name"
                                @change="getAllLocation(eventData.district, 'ward')"
                                required="true"
                                autofocus
                                filter
                                fluid
                                placeholder="Vui lòng chọn quận huyện"
                            />
                        </div>
                        <div class="w-1/2">
                            <label for="role" class="block font-bold mb-1">Phường, xã</label>
                            <Select id="role" :disabled="!eventData.district" v-model="eventData.ward" :options="dataGetAllOption.ward" optionLabel="full_name" required="true" autofocus filter fluid placeholder="Vui lòng chọn phường xã" />
                        </div>
                    </div>

                    <div>
                        <label for="name" class="block font-bold mb-1">Địa chỉ </label>
                        <InputText id="address" v-model="eventData.address" autofocus fluid placeholder="Vui lòng nhập địa chỉ" />
                    </div>
                </div>
                <div class="flex flex-col gap-4 w-1/2">
                    <div>
                        <label for="goalAmount" class="block font-bold mb-1">Mục tiêu quyên góp (VNĐ) <small class="text-red-500">*</small></label>
                        <InputNumber id="goalAmount" v-model="eventData.goalAmount" :min="1" autofocus :invalid="submitted && !eventData.goalAmount" fluid placeholder="Vui lòng nhập mục tiêu quyên góp" />
                    </div>

                    <div class="flex gap-3 w-full">
                        <div class="w-1/2">
                            <label for="startDate" class="block font-bold mb-1">Ngày bắt đầu <small class="text-red-500">*</small></label>
                            <DatePicker
                                id="startDate"
                                showTime
                                hourFormat="24"
                                v-model="eventData.startDate"
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
                                v-model="eventData.endDate"
                                autofocus
                                :invalid="submitted && !eventData.endDate"
                                fluid
                                placeholder="Vui lòng chọn ngày kết thúc"
                            />
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <div class="w-1/3">
                            <label for="type" class="block font-bold mb-1">Thuộc <small class="text-red-500">*</small></label>
                            <Select
                                id="type"
                                v-model="eventData.type"
                                :options="dataGetAllOption.type"
                                optionLabel="label"
                                optionValue="value"
                                required="true"
                                autofocus
                                :invalid="submitted && !eventData.type"
                                fluid
                                placeholder="Vui lòng chọn thuộc loại"
                            />
                        </div>
                        <div class="w-2/3">
                            <label for="organization" class="block font-bold mb-1">{{ eventData.type == 'CN' ? 'Cá nhân kêu gọi' : 'Tổ chức kêu gọi' }} <small class="text-red-500">*</small></label>
                            <Select
                                v-if="eventData.type == 'CN'"
                                :disabled="!eventData.type"
                                id="organization"
                                v-model="eventData.user"
                                :options="dataGetAllOption.user"
                                optionLabel="name"
                                optionValue="_id"
                                required="true"
                                autofocus
                                :invalid="submitted && !eventData.organization"
                                filter
                                fluid
                                placeholder="Vui lòng chọn cá nhân kêu gọi"
                            />
                            <Select
                                v-else
                                :disabled="!eventData.type"
                                id="organization"
                                v-model="eventData.organization"
                                :options="dataGetAllOption.organization"
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
                    </div>

                    <div>
                        <label for="role" class="block font-bold mb-1">Chiến dịch <small class="text-red-500">*</small></label>
                        <Select
                            id="role"
                            v-model="eventData.campaign"
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

        <Dialog v-model:visible="deleteDialog" :style="{ width: '390px' }" header="Xác nhận Xóa" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="eventData">Bạn có chắc chắn muốn xóa dự án này không?</span>
            </div>
            <template #footer>
                <Button label="Huỷ" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Xóa" icon="pi pi-check" @click="deleteProduct" :loading="isLoadingData" />
            </template>
        </Dialog>
    </div>
</template>
