<script setup>
import { format } from 'date-fns';
import { InputNumber } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import Loading from '../../../components/Loading.vue';
import apiService from '../../../service/api.service';
import parseNum from '../../../utils/parseNum';

onMounted(async () => {
    isLoading.value = true;

    await getAll();
    await getOption();
    isLoading.value = false;
});

const toast = useToast();
const dt = ref();
const keySearch = ref('');
const urlApi = 'companions';

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
const eventData = ref({ isActive: true });
const deleteDialog = ref(false);
const options = ref({
    user: [],
    projects: []
});
const valueFilter = ref({
    isActive: null,
    sort: false
});

function openEventDialog() {
    eventData.value = { isActive: true };
    submitted.value = false;
    isEventDialog.value = true;
}

function hideDialog() {
    isEventDialog.value = false;
    eventData.value = { isActive: true };
    submitted.value = false;
    deleteDialog.value = false;
}

function getData(prod) {
    eventData.value = { ...prod, project: prod.project?._id, userInvite: prod.userInvite?._id, supporterInvite: prod.supporterInvite.map((item) => item._id) };
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
                        <h4 class="m-0 text-lg font-bold">Trang quản lý người đồng hành</h4>
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
                <Column field="userInvite.name" header="Người đồng hành" style="min-width: 12rem"></Column>
                <Column field="project.name" header="Dự án" style="min-width: 10rem"></Column>
                <Column field="goalAmount" header="Mục tiêu quyên góp" style="min-width: 12rem">
                    <template #body="slotProps">
                        {{ parseNum(slotProps.data.goalAmount) }}
                    </template>
                </Column>
                <Column field="goalAmount" header="Đạt được" style="min-width: 11rem">
                    <template #body="slotProps">
                        {{ parseNum(slotProps.data.currentAmount) }}
                    </template>
                </Column>
                <Column header="Người cùng ủng hộ" style="min-width: 12rem">
                    <template #body="slotProps">
                        {{ slotProps.data.supporterInvite.length }}
                    </template>
                </Column>
                <Column field="createdAt" header="Ngày tạo" style="min-width: 12rem">
                    <template #body="slotProps">
                        {{ format(slotProps.data.createdAt, 'dd/MM/yyyy') + ' lúc ' + format(slotProps.data.createdAt, 'HH:mm') }}
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="getData(slotProps.data)" v-tooltip="'Chức năng sửa'" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" v-tooltip="'Chức năng xóa'" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="isEventDialog" :style="{ width: '900px' }" :modal="true">
            <template #header>
                <h4 class="m-0 text-lg font-bold flex align-items-center gap-2">{{ eventData._id ? 'Cập nhật người đồng hành' : 'Thêm mới người đồng hành' }} - <ToggleSwitch v-model="eventData.isActive" id="isActive" /> Trạng thái</h4>
            </template>

            <div class="flex flex-col gap-6">
                <div>
                    <label for="userInvite" class="block font-bold mb-3">Người đồng hành</label>
                    <Select filter id="userInvite" :invalid="submitted && !eventData.userInvite" v-model="eventData.userInvite" fluid :options="options.user" optionLabel="name" optionValue="_id" placeholder="Chọn người đồng hành" />
                    <small v-if="submitted && !eventData.userInvite" class="text-red-500">Người đồng hành là bắt buộc.</small>
                </div>
                <div>
                    <label for="project" class="block font-bold mb-3">Tên dự án</label>
                    <Select filter id="project" :invalid="submitted && !eventData.project" v-model="eventData.project" fluid :options="options.projects" optionLabel="name" optionValue="_id" placeholder="Chọn dự án" />
                    <small v-if="submitted && !eventData.project" class="text-red-500">Dự án là bắt buộc.</small>
                </div>
                <div>
                    <label for="goalAmount" class="block font-bold mb-3">Mục tiêu quyên góp</label>
                    <InputNumber id="goalAmount" :invalid="submitted && !eventData.goalAmount" v-model="eventData.goalAmount" fluid placeholder="Nhập mục tiêu quyên góp" :min="1000" />
                    <small v-if="submitted && !eventData.goalAmount" class="text-red-500">Mục tiêu quyên góp là bắt buộc.</small>
                </div>
                <div>
                    <label for="currentAmount" class="block font-bold mb-3">Đạt được</label>
                    <InputNumber id="currentAmount" v-model="eventData.currentAmount" fluid placeholder="Nhập số tiền đạt được" />
                </div>
                <div>
                    <label for="supporterInvite" class="block font-bold mb-3">Người cùng ủng hộ</label>
                    <MultiSelect filter id="supporterInvite" v-model="eventData.supporterInvite" fluid :options="options.user" optionLabel="name" optionValue="_id" placeholder="Chọn người cùng ủng hộ" />
                </div>
            </div>

            <template #footer>
                <Button label="Huỷ" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Lưu" icon="pi pi-check" @click="saveData" :loading="isLoadingData" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteDialog" :style="{ width: '480px' }" header="Xác nhận xóa" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="eventData">Bạn có chắc chắn muốn xóa người đồng hành này không?</span>
            </div>
            <template #footer>
                <Button label="Huỷ" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Xóa" icon="pi pi-check" @click="deleteProduct" :loading="isLoadingData" />
            </template>
        </Dialog>
    </div>
</template>
