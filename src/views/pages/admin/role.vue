<script setup>
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import Loading from '../../../components/Loading.vue';
import apiService from '../../../service/api.service';

onMounted(async () => {
    isLoading.value = true;

    await getAll();
    await getAllPermission();
    isLoading.value = false;
});

const toast = useToast();
const dt = ref();
const keySearch = ref('');
const urlApi = 'roles';

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
const deleteDialog = ref(false);
const isSort = ref(false);
const dataGetAllPermission = ref([]);

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
function getData(prod) {
    // Tạo Set để lưu trữ các permission duy nhất
    const uniquePermissions = new Set(prod.permissions);

    // Duyệt qua dataGetAllPermission để tìm các permission trùng khớp
    dataGetAllPermission.value.forEach((group) => {
        group.items.forEach((item) => {
            if (uniquePermissions.has(item._id)) {
                // Nếu tìm thấy permission trùng khớp, thêm ID cha vào Set
                uniquePermissions.add(group._id.toString());
            }
        });
    });

    // Chuyển Set thành object với format yêu cầu
    const output = Array.from(uniquePermissions).reduce((acc, key) => {
        acc[key] = {
            partialChecked: false,
            checked: true
        };
        return acc;
    }, {});
    console.log(output);
    eventData.value = { ...prod, permissions: output };
    isEventDialog.value = true;
}

const getSelectedPermissions = (value) => {
    return Object.entries(value)
        .filter(([_, value]) => value.checked)
        .map(([key]) => key)
        .filter((id) => isNaN(id));
};

async function saveData() {
    submitted.value = true;
    isLoadingData.value = true;
    try {
        eventData.value.permissions = getSelectedPermissions(eventData.value.permissions);
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
    try {
        const res = await apiService.get(
            urlApi + '?page=' + pagination.value.page + '&pageSize=' + pagination.value.pageSize + (keySearch.value ? '&search=' + keySearch.value : '') + (isSort.value ? '&filter=sort=createdAt' : '&filter=sort=-createdAt')
        );
        valueData.value = res.data.items;
        pagination.value.total = res.data.total;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Lỗi không xác định', life: 3000 });
    } finally {
        isLoadingData.value = false;
    }
};
const getAllPermission = async () => {
    try {
        const res = await apiService.get('permissions/role');
        dataGetAllPermission.value = res.data.items;
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

const getTagSeverity = (method) => {
    switch (method) {
        case 'GET':
            return 'success';
        case 'POST':
            return 'warn';
        case 'PUT':
            return 'info';
        case 'DELETE':
            return 'danger';
        case 'PATCH':
            return 'warning';
        case 'OPTIONS':
            return 'info';
        case 'HEAD':
            return 'info';
        default:
            return 'info';
    }
};

const ConvertFatherGrpData = (data) => {
    if (data) {
        return data.map((el) => ({
            key: el._id,
            data: {
                _id: el._id,
                name: el.name || '',
                method: el.method || '',
                apiPath: el.apiPath || '',
                module: el.module || ''
            },
            children: ConvertFatherGrpData(el.items) || []
        }));
    }
    return [];
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
                    <Button label="Làm mới" icon="pi pi-refresh" severity="secondary" @click="getAll" class="mr-2" />
                    <Button
                        v-if="isSort"
                        label="Mới nhất"
                        icon="pi pi-arrow-down"
                        severity="secondary"
                        @click="
                            () => {
                                isSort = false;
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
                                isSort = true;
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
                        <h4 class="m-0 text-lg font-bold">Trang quản lý quyền tài khoản</h4>
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

                <Column field="name" header="Tên vai trò" style="min-width: 16rem"></Column>
                <Column header="Số quyền" style="min-width: 5rem">
                    <template #body="slotProps">
                        {{ slotProps.data.permissions.length }}
                    </template>
                </Column>
                <Column field="description" header="Mô tả" style="min-width: 16rem"> </Column>
                <Column field="createdAt" header="Ngày tạo" style="min-width: 12rem">
                    <template #body="slotProps">
                        {{ format(slotProps.data.createdAt, 'dd/MM/yyyy') + ' lúc ' + format(slotProps.data.createdAt, 'HH:mm') }}
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 7rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="getData(slotProps.data)" v-tooltip="'Chức năng sửa'" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" v-tooltip="'Chức năng xóa'" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="isEventDialog" :style="{ width: '900px' }" :modal="true">
            <template #header>
                <h4 class="m-0 text-lg font-bold flex align-items-center gap-2">{{ eventData.id ? 'Cập nhật vai trò' : 'Thêm vai trò' }} - <ToggleSwitch v-model="eventData.isActive" /></h4>
            </template>

            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Tên vai trò</label>
                    <InputText id="name" v-model.trim="eventData.name" required="true" autofocus :invalid="submitted && !eventData.name" fluid placeholder="Vui lòng nhập tên vai trò" />

                    <small v-if="submitted && !eventData.name" class="text-red-500">Tên vai trò là bắt buộc.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Mô tả</label>
                    <Textarea id="description" v-model.trim="eventData.description" required="true" autofocus fluid placeholder="Vui lòng nhập mô tả" />
                </div>
                <div>
                    <label for="permissions" class="block font-bold mb-3">Chọn quyền</label>
                    {{ eventData.permissions }}
                    <TreeTable v-model:selectionKeys="eventData.permissions" :value="ConvertFatherGrpData(dataGetAllPermission)" selectionMode="checkbox" tableStyle="min-width: 50rem">
                        <Column field="name" header="Tên quyền" expander style="width: 35%"></Column>
                        <Column field="apiPath" header="API" style="width: 40%"></Column>
                        <Column field="module" header="Mô đun"></Column>
                        <Column field="method" header="Phương thức"> </Column>
                    </TreeTable>
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
