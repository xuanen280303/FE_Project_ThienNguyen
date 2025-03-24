div
<script setup>
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import SentLetter from '../../../../components/landing/SentLetter.vue';
import accountService from '../../../../service/account.service';
import apiService from '../../../../service/api.service';
onMounted(async () => {
    isLoading.value = true;
    await getAll();
    await getAllOption();
    isLoading.value = false;
});

const account = accountService.getAccount()?.account;
const toast = useToast();
const dt = ref();
const keySearch = ref('');
const urlApi = 'letter';

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
    byUser: true,
    sort: false
});
const dataGetAllOption = ref({
    user: [],
    organization: [],
    type: [
        { label: 'Cá nhân', value: 'CN' },
        { label: 'Tổ chức', value: 'TC' }
    ]
});

function openEventDialog() {
    eventData.value = {};
    dataFileInput.value = null;
    submitted.value = false;
    isEventDialog.value = true;
    imageData.value = null;
}

function hideDialog() {
    isEventDialog.value = false;
    eventData.value = {};
    dataFileInput.value = null;
    submitted.value = false;
    deleteDialog.value = false;
}
const visibleLetter = ref(false);
const letter = ref({});
function getDataDetail(prod) {
    visibleLetter.value = true;
    letter.value = prod;
}

const uploadFile = async () => {
    if (!dataFileInput.value) return;
    try {
        const res = await apiService.upload(dataFileInput.value, 'campaign');
        eventData.value.image = res.data.fileName;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Lỗi không xác định', life: 10000 });
    }
};
const getAllOption = async () => {
    try {
        const [resUser, resOrganization] = await Promise.all([apiService.get('users/getAll'), apiService.get('organizations/getAll')]);
        dataGetAllOption.value.user = resUser.data;
        dataGetAllOption.value.organization = resOrganization.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Lỗi không xác định từ get all option', life: 3000 });
    }
};
async function saveData() {
    submitted.value = true;
    isLoadingData.value = true;
    try {
        await uploadFile();
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
            if (key === 'byUser') {
                if (value) {
                    return `createdBy._id=${account._id}`;
                } else {
                    return `user=${account._id}`;
                }
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

const imageData = ref(null);
const UploadFileLocal = async (event) => {
    const file = event.target.files[0];
    dataFileInput.value = file;
    imageData.value = URL.createObjectURL(file);
};
</script>

<template>
    <Loading v-if="isLoading" />
    <div>
        <!-- <Button label="Thêm" icon="pi pi-plus" class="mr-2" @click="openEventDialog" /> -->

        <div>
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
                    <Toolbar>
                        <template #start>
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="keySearch" placeholder="Tìm kiếm..." @change="handleFilter" />
                            </IconField>
                        </template>
                        <template #end>
                            <Select
                                v-model="valueFilter.byUser"
                                :options="[
                                    { label: 'Thư gửi đi', value: true },
                                    { label: 'Thư được nhận', value: false }
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
                </template>

                <Column header="STT" style="min-width: 5rem">
                    <template #body="slotProps">
                        {{ (pagination.page - 1) * pagination.pageSize + slotProps.index + 1 }}
                    </template>
                </Column>
                <Column field="title" header="Tiêu đề" style="min-width: 15rem"></Column>
                <Column field="user" header="Người nhận" style="min-width: 15rem">
                    <template #body="{ data }">
                        {{ data.user.name }}
                    </template>
                </Column>
                <Column header="Người gửi" style="min-width: 15rem">
                    <template #body="{ data }">
                        {{ data.type == 'CN' ? 'Cá nhân: ' + data.userSent.name : 'Tổ chức: ' + data.organization.name }}
                    </template>
                </Column>

                <Column field="createdAt" header="Ngày tạo" style="min-width: 12rem">
                    <template #body="slotProps">
                        {{ format(slotProps.data.createdAt, 'dd/MM/yyyy') + ' lúc ' + format(slotProps.data.createdAt, 'HH:mm') }}
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 7rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-eye" outlined rounded class="mr-2" @click="getDataDetail(slotProps.data)" v-tooltip="'Xem thư'" />
                    </template>
                </Column>
            </DataTable>
        </div>
        <SentLetter :letter="letter" :visibleLetter="visibleLetter" @update:visibleLetter="visibleLetter = $event" />
        <Dialog v-model:visible="isEventDialog" :style="{ width: '1200px' }" :modal="true">
            <template #header>
                <h4 class="m-0 text-lg font-bold flex align-items-center gap-2">
                    {{ eventData?.id ? 'Sửa thư' : 'Gửi thư' }}
                </h4>
            </template>
            <div class="flex flex-col gap-4">
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
                        <label for="organization" class="block font-bold mb-1">{{ eventData.type == 'CN' ? 'Cá nhân' : 'Tổ chức' }} <small class="text-red-500">*</small></label>
                        <Select
                            v-if="eventData.type == 'CN'"
                            :disabled="!eventData.type"
                            id="userSent"
                            v-model="eventData.userSent"
                            :options="dataGetAllOption.user"
                            optionLabel="name"
                            optionValue="_id"
                            required="true"
                            autofocus
                            :invalid="submitted && !eventData.userSent"
                            filter
                            fluid
                            placeholder="Vui lòng chọn người gửi"
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
                            placeholder="Vui lòng chọn tổ chức gửi"
                        />
                    </div>
                </div>
                <div>
                    <label for="user" class="block font-bold mb-1">Người nhận</label>
                    <Select
                        id="user"
                        v-model="eventData.user"
                        :options="dataGetAllOption.user"
                        optionLabel="name"
                        optionValue="_id"
                        required="true"
                        autofocus
                        :invalid="submitted && !eventData.user"
                        filter
                        fluid
                        placeholder="Vui lòng chọn người nhận"
                    />
                </div>
                <div>
                    <label for="title" class="block font-bold mb-1">Tiêu đề</label>
                    <InputText id="title" v-model="eventData.title" required="true" autofocus fluid placeholder="Tiêu đề" />
                </div>
                <div class="w-full">
                    <label class="block font-bold mb-1">Nội dung <small class="text-red-500">*</small></label>
                    <RichTextEditor v-model="eventData.message" />
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
