<script setup>
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import Loading from '../../../components/Loading.vue';
import apiService from '../../../service/api.service';

onMounted(async () => {
    isLoading.value = true;

    await getAll();
    await getOption();
    isLoading.value = false;
});

const toast = useToast();
const dt = ref();
const keySearch = ref('');
const urlApi = 'notifications';

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
const object = {
    title: '',
    message: '',
    type: 'UPDATE',
    isGlobal: false,
    objInfo: {
        _id: '',
        type: 'APP',
        name: ''
    },
    userIds: []
};
const eventData = ref(object);
const deleteDialog = ref(false);
const options = ref({
    user: [],
    projects: []
});
const valueFilter = ref({
    type: null,
    isGlobal: null,
    sort: false
});

function openEventDialog() {
    eventData.value = object;
    submitted.value = false;
    isEventDialog.value = true;
}

function hideDialog() {
    isEventDialog.value = false;
    eventData.value = {};
    submitted.value = false;
    deleteDialog.value = false;
}

function getData(prod) {
    eventData.value = { ...prod, project: prod.project._id, userInvite: prod.userInvite._id, supporterInvite: prod.supporterInvite.map((item) => item._id) };
    isEventDialog.value = true;
}

async function saveData() {
    submitted.value = true;
    isLoadingData.value = true;
    try {
        if (eventData.value._id) {
            const res = await apiService.patch(urlApi + '/' + eventData.value._id, eventData.value);
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
        } else {
            const res = await apiService.post(urlApi, eventData.value);
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
        }
        getAll();
        hideDialog();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Lỗi không xác định', life: 3000 });
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

const getOption = async () => {
    try {
        const [resUser, resProject] = await Promise.all([apiService.get('users/getAll'), apiService.get('projects/getAll')]);
        options.value.user = resUser.data;
        options.value.projects = resProject.data;
    } catch (error) {
        console.log(error);
    }
};

const getOptionType = (type) => {
    switch (type) {
        case 'UPDATE':
            return 'Cập nhật';
        case 'NOTIFICATION':
            return 'Thông báo';
        case 'WARNING':
            return 'Cảnh báo';
    }
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
                        v-model="valueFilter.type"
                        :options="[
                            { label: 'Tất cả', value: null },
                            { label: 'Thông báo', value: 'NOTIFICATION' },
                            { label: 'Cập nhật', value: 'UPDATE' },
                            { label: 'Cảnh báo', value: 'WARNING' }
                        ]"
                        placeholder="Tất cả"
                        optionLabel="label"
                        optionValue="value"
                        v-tooltip="'Chức năng lọc theo loại thông báo'"
                        @change="handleFilter"
                        class="mr-2"
                    />
                    <Select
                        v-model="valueFilter.isGlobal"
                        :options="[
                            { label: 'Toàn bộ', value: null },
                            { label: 'Cá nhân', value: false },
                            { label: 'Tất cả', value: true }
                        ]"
                        placeholder="Tất cả"
                        optionLabel="label"
                        optionValue="value"
                        v-tooltip="'Chức năng lọc theo loại thông báo'"
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
                        <h4 class="m-0 text-lg font-bold">Trang quản lý thông báo</h4>
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
                <Column field="title" header="Tiêu đề" style="min-width: 12rem"></Column>
                <Column field="type" header="Loại thông báo" style="min-width: 10rem">
                    <template #body="slotProps">
                        {{ getOptionType(slotProps.data.type) }}
                    </template>
                </Column>
                <Column field="isGlobal" header="Đối tượng" style="min-width: 12rem">
                    <template #body="slotProps">
                        {{ slotProps.data.isGlobal ? 'Tất cả' : 'Cá nhân' }}
                    </template>
                </Column>
                <Column field="createdAt" header="Ngày tạo" style="min-width: 12rem">
                    <template #body="slotProps">
                        {{ format(slotProps.data.createdAt, 'dd/MM/yyyy') + ' lúc ' + format(slotProps.data.createdAt, 'HH:mm') }}
                    </template>
                </Column>
                <Column field="isRead" header="Trạng thái" style="min-width: 12rem">
                    <template #body="slotProps">
                        {{ slotProps.data.isRead ? 'Đã đọc' : 'Chưa đọc' }}
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 7rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-eye" outlined rounded class="mr-2" @click="getData(slotProps.data)" v-tooltip="'Chức năng xem chi tiết'" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" v-tooltip="'Chức năng xóa'" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="isEventDialog" :style="{ width: '900px' }" :modal="true">
            <template #header>
                <h4 class="m-0 text-lg font-bold flex align-items-center gap-2">
                    {{ eventData._id ? 'Cập nhật thông báo' : 'Thêm thông báo' }}
                </h4>
            </template>

            <div class="flex flex-col gap-4 mb-2">
                <div>
                    <label for="title" class="block font-bold mb-1">Tiêu đề thông báo</label>
                    <InputText fluid id="title" v-model="eventData.title" :class="{ 'p-invalid': submitted && !eventData.title }" placeholder="Nhập tiêu đề thông báo" />
                    <small v-if="submitted && !eventData.title" class="text-red-500">Tiêu đề là bắt buộc.</small>
                </div>

                <div>
                    <label for="message" class="block font-bold mb-1">Nội dung thông báo</label>
                    <Textarea fluid id="message" v-model="eventData.message" cols="5" rows="5" placeholder="Nhập nội dung thông báo" />
                    <small v-if="submitted && !eventData.message" class="text-red-500">Nội dung là bắt buộc.</small>
                </div>
                <div class="flex gap-4">
                    <div class="w-1/2">
                        <label for="objInfo" class="block font-bold mb-1">Mã mô đun</label>
                        <InputText fluid v-model="eventData.objInfo._id" placeholder="ID ứng dụng" />
                    </div>
                    <div class="w-1/2">
                        <label for="objInfo" class="block font-bold mb-1">Tên mô đun</label>
                        <InputText fluid v-model="eventData.objInfo.name" placeholder="Tên mô đun" />
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="w-1/2">
                        <label for="objInfo" class="block font-bold mb-1">Loại mô đun</label>
                        <InputText fluid v-model="eventData.objInfo.type" placeholder="Loại mô đun" />
                    </div>
                    <div class="w-1/2">
                        <label for="type" class="block font-bold mb-1">Loại thông báo</label>
                        <Select
                            fluid
                            id="type"
                            v-model="eventData.type"
                            :options="[
                                { label: 'Cập nhật', value: 'UPDATE' },
                                { label: 'Thông báo', value: 'NOTIFICATION' },
                                { label: 'Cảnh báo', value: 'WARNING' }
                            ]"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Chọn loại thông báo"
                        />
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <label class="font-bold">Gửi cho tất cả</label>
                    <ToggleSwitch v-model="eventData.isGlobal" :disabled="eventData.userIds.length > 0" />
                </div>
                <div>
                    <label for="userIds" class="block font-bold mb-1">Người nhận thông báo</label>
                    <MultiSelect
                        :disabled="eventData.isGlobal"
                        fluid
                        id="userIds"
                        v-model="eventData.userIds"
                        :options="options.user"
                        optionLabel="name"
                        optionValue="_id"
                        :class="{ 'p-invalid': submitted && !eventData.isGlobal && !eventData.userIds.length }"
                        placeholder="Chọn người nhận thông báo"
                        filter
                    />
                    <small v-if="submitted && !eventData.isGlobal && !eventData.userIds.length" class="text-red-500"> Vui lòng chọn ít nhất một người nhận. </small>
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
