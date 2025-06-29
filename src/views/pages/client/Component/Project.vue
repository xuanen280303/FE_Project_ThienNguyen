<template>
    <div class="rounded-lg">
        <DataTable
            ref="dt"
            lazy
            v-model:expandedRows="expandedRows"
            dataKey="_id"
            :value="valueData"
            :paginator="true"
            @rowExpand="onRowExpand"
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
                    <div>
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

                        <Button label="Làm mới" icon="pi pi-refresh" severity="secondary" @click="resetFilter" class="mr-2" />
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
                    </div>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="keySearch" placeholder="Tìm kiếm..." @change="handleFilter" />
                    </IconField>
                </div>
            </template>
            <Column expander style="width: 5rem" />
            <template #expansion="{ data }">
                <div>
                    <div class="overflow-hidden">
                        <div class="h-14 flex items-center">
                            <span class="text-orange-600 font-bold text-xl border-b-2 border-orange-600 h-full px-4 flex items-center">Danh sách ủng hộ</span>
                        </div>
                        <DataTable
                            :value="payment"
                            :loading="isLoadingDetail"
                            paginator
                            lazy
                            :rows="paginationDetail.pageSize"
                            :totalRecords="paginationDetail.total"
                            @page="
                                (event) => {
                                    paginationDetail.page = event.page;
                                    paginationDetail.pageSize = event.rows;
                                    getDonation(data._id);
                                }
                            "
                            :rowsPerPageOptions="[5, 10, 20, 50]"
                            tableStyle="width: 100%"
                        >
                            <template #header>
                                <div class="flex gap-2 justify-between">
                                    <div class="w-2/3 flex gap-2">
                                        <IconField>
                                            <InputIcon>
                                                <i class="pi pi-search" />
                                            </InputIcon>
                                            <InputText class="w-full" placeholder="Nhập tên hoặc email người ủng hộ" v-model="paginationDetail.search" @keyup.enter="getDonation(data._id)" />
                                        </IconField>
                                        <Select
                                            v-model="paginationDetail.status"
                                            :options="[
                                                { label: 'Tất cả', value: null },
                                                { label: 'Chờ thanh toán', value: 'PENDING' },
                                                { label: 'Đã thanh toán', value: 'PAID' },
                                                { label: 'Đã hủy', value: 'CANCELLED' }
                                            ]"
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Trạng thái"
                                            @change="getDonation(data._id)"
                                        />
                                    </div>
                                    <div class="flex gap-2">
                                        <Button label="Xuất file excel" icon="pi pi-file-excel" class="mr-2" @click="exportDataDetail(data)" />
                                        <Button label="Xuất file pdf" icon="pi pi-file-pdf" severity="info" class="mr-2" @click="printStore.generatePDFImport(data)" />
                                    </div>
                                </div>
                            </template>
                            <Column field="name" header="Người ủng hộ" style="width: 40%">
                                <template #body="slotProps">
                                    {{ slotProps.data.isAnonymous ? 'Ẩn danh' : slotProps.data.buyerName }}
                                </template>
                            </Column>
                            <Column field="amount" header="Số tiền ủng hộ">
                                <template #body="slotProps"> {{ parseNum(slotProps.data.amount) }} VNĐ </template>
                            </Column>
                            <Column field="createdAt" header="Thời gian ủng hộ">
                                <template #body="slotProps">
                                    {{ format(slotProps.data.createdAt, 'dd/MM/yyyy HH:mm') }}
                                </template>
                            </Column>
                            <Column field="status" header="Trạng thái">
                                <template #body="slotProps"> {{ getStatusDonation(slotProps.data.status) }} </template>
                            </Column>
                            <Column header="Chức năng" headerStyle="max-width: 4rem">
                                <template #body="slotProps">
                                    <Button icon="pi pi-envelope" outlined rounded class="mr-2" @click="sendThankYouLetter(slotProps.data)" v-tooltip="'Gửi thư cảm ơn'" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
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
            <Column header="Bởi" style="min-width: 8rem">
                <template #body="slotProps">
                    {{ slotProps.data.type ? (slotProps.data.type == 'CN' ? slotProps.data.user?.name : slotProps.data.organization?.name) : '--' }}
                </template>
            </Column>
            <Column field="status" header="Trạng thái" style="min-width: 7rem">
                <template #body="slotProps">
                    {{ getStatus(slotProps.data.status) }}
                </template>
            </Column>
            <Column field="startDate" header="Ngày bắt đầu" style="min-width: 12rem">
                <template #body="slotProps">
                    {{ slotProps.data.startDate ? format(slotProps.data.startDate, 'dd/MM/yyyy') + ' lúc ' + format(slotProps.data.startDate, 'HH:mm') : '--' }}
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
                    <DetailProject :data="slotProps.data" />
                    <Button icon="pi pi-external-link" outlined rounded class="mr-2" @click="() => router.push(`/detail/${slotProps.data._id}`)" v-tooltip="'Link dự án'" />
                </template>
            </Column>
        </DataTable>
    </div>

    <!-- Dialog gửi thư cảm ơn -->
    <Dialog v-model:visible="isEventLetterDialog" :style="{ width: '1200px' }" :modal="true">
        <template #header>
            <h4 class="m-0 text-lg font-bold flex align-items-center gap-2">Gửi thư cảm ơn</h4>
        </template>
        <div class="flex flex-col gap-4">
            <div v-if="eventDataLetter.typeTemporary == 'TC'">
                <label for="type" class="block font-bold mb-1">Đại diện gửi thư <small class="text-red-500">*</small></label>
                <Select
                    id="type"
                    v-model="eventDataLetter.type"
                    :options="dataGetAllOption.type"
                    optionLabel="label"
                    optionValue="value"
                    required="true"
                    @change="handleChangeType"
                    autofocus
                    :invalid="submitted && !eventDataLetter.type"
                    fluid
                    placeholder="Vui lòng chọn thuộc loại"
                />
            </div>
            <div>
                <label for="title" class="block font-bold mb-1">Tiêu đề <small class="text-red-500">*</small></label>
                <InputText id="title" v-model="eventDataLetter.title" required="true" autofocus fluid placeholder="Tiêu đề" />
            </div>
            <div class="w-full">
                <label class="block font-bold mb-1">Nội dung <small class="text-red-500">*</small></label>
                <RichTextEditor v-model="eventDataLetter.message" />
            </div>
        </div>

        <template #footer>
            <Button label="Huỷ" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Gửi đi" icon="pi pi-check" @click="saveData" :loading="isLoadingData" />
        </template>
    </Dialog>

    <Loading v-if="isLoading" />
</template>

<script setup>
import DetailProject from '@/components/DetailProject.vue';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { linkUploads } from '../../../../constant/api';
import accountService from '../../../../service/account.service';
import apiService from '../../../../service/api.service';
import { usePrintStore } from '../../../../stores/printStore';
import parseNum from '../../../../utils/parseNum';

const router = useRouter();

const printStore = usePrintStore();
onMounted(async () => {
    isLoading.value = true;
    await getAll();
    isLoading.value = false;
});
const eventDataLetter = ref({});
const submitted = ref(false);
const isEventLetterDialog = ref(false);
const toast = useToast();
const dt = ref();
const keySearch = ref('');
const urlApi = 'projects';
const account = accountService.getAccount().account;
const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
});
const paginationDetail = ref({
    page: 0,
    pageSize: 10,
    total: 0,
    search: '',
    status: null
});
const dataGetAllOption = ref({
    user: [],
    organization: [],
    type: [
        { label: 'Cá nhân', value: 'CN' },
        { label: 'Tổ chức', value: 'TC' }
    ]
});
const payment = ref([]);
const expandedRows = ref({});

const valueData = ref([]);
const isLoading = ref(false);
const isLoadingData = ref(false);
const isEventDialog = ref(false);
const eventData = ref({});

const valueFilter = ref({
    isActive: null,
    sort: false
});

function hideDialog() {
    isEventDialog.value = false;
    isEventLetterDialog.value = false;
    eventData.value = {};
    eventDataLetter.value = {};
    submitted.value = false;
}

const resetFilter = () => {
    valueFilter.value = {
        isActive: null,
        sort: false,
    };
    getAll();
};
// Hàm lấy tất cả dữ liệu dự án
const getAll = async () => {
    // Bật trạng thái loading
    isLoadingData.value = true;

    // Xử lý điều kiện lọc từ valueFilter
    const conditions = Object.entries(valueFilter.value)
        // Lọc bỏ các giá trị null
        .filter(([key, value]) => value !== null)
        // Chuyển đổi thành chuỗi query params
        .map(([key, value]) => {
            // Xử lý đặc biệt cho trường sort
            if (key === 'sort') {
                return `sort=${value ? 'createdAt' : '-createdAt'}`; // Sắp xếp theo thời gian tạo
            }
            return `${key}=${value}`;
        });

    // Nối các điều kiện lọc thành chuỗi
    const filter = conditions.join(',');

    try {
        // Gọi API lấy dữ liệu với các tham số phân trang, tìm kiếm và lọc
        const res = await apiService.get(urlApi + '/user?page=' + pagination.value.page + '&pageSize=' + pagination.value.pageSize + (keySearch.value ? '&search=' + keySearch.value : '') + (filter ? '&filter=' + filter : ''));
        // Cập nhật dữ liệu và tổng số bản ghi
        valueData.value = res.data.items;
        pagination.value.total = res.data.total;
    } catch (error) {
        // Hiển thị thông báo lỗi nếu có
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Lỗi không xác định từ get all', life: 3000 });
    } finally {
        // Tắt trạng thái loading
        isLoadingData.value = false;
    }
};
const isLoadingDetail = ref(false);
const onRowExpand = (event) => {
    getDonation(event.data._id);
    expandedRows.value = { [event.data._id]: true }; //Mở bảng dữ liệu danh sách ủng hộ
};
const getDonation = async (id) => {
    isLoadingDetail.value = true;
    try {
        const res = await apiService.get(
            `donations?filter=project=${id}${paginationDetail.value.status ? `,status=${paginationDetail.value.status}` : ''}&page=${paginationDetail.value.page + 1}&pageSize=${paginationDetail.value.pageSize}${paginationDetail.value.search ? `&search=${paginationDetail.value.search}` : ''}`
        );
        payment.value = res.data.items;
        paginationDetail.value.total = res.data.total;
    } catch (error) {
        console.log(error);
    } finally {
        isLoadingDetail.value = false;
    }
};
const handlePage = (event) => {
    pagination.value.page = event.page + 1;
    pagination.value.pageSize = event.rows;
    getAll();
};

const handleFilter = () => {
    //Phân trang mặc định là trang 1
    pagination.value.page = 1;
    getAll();
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
const getStatusDonation = (status) => {
    switch (status) {
        case 'PENDING':
            return 'Chờ thanh toán';
        case 'PAID':
            return 'Đã thanh toán';
        case 'CANCELLED':
            return 'Đã hủy';
        default:
            return status;
    }
};

//-------------Xử lý letter------------------------
const sendThankYouLetter = (data) => {
    eventDataLetter.value = {
        user: data.user?._id,
        userSentTemporary: account._id,
        type: data.project?.type == 'CN' ? 'CN' : null,
        typeTemporary: data.project?.type,
        userSent: data.project?.type == 'CN' ? data.project?.user : null,
        organizationTemporary: data.project?.organization
    };
    isEventLetterDialog.value = true;
};
const handleChangeType = () => {
    if (eventDataLetter.value.type == 'TC') {
        eventDataLetter.value.userSent = null;
        eventDataLetter.value.organization = eventDataLetter.value.organizationTemporary;
    } else {
        eventDataLetter.value.userSent = eventDataLetter.value.userSentTemporary;
        eventDataLetter.value.organization = null;
    }
};
const validate = () => {
    if (!eventDataLetter.value.type) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn đại diện gửi thư', life: 3000 });
        return false;
    }
    if (!eventDataLetter.value.title) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập tiêu đề', life: 3000 });
        return false;
    }
    if (!eventDataLetter.value.message) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập nội dung', life: 3000 });
        return false;
    }
    return true;
};
async function saveData() {
    submitted.value = true;
    if (!validate()) return;
    isLoadingData.value = true;
    try {
        await apiService.post('letter', eventDataLetter.value);
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Gửi thư thành công', life: 3000 });
        isEventLetterDialog.value = false;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Lỗi không xác định', life: 10000 });
    } finally {
        isLoadingData.value = false;
    }
}

const exportDataDetail = async (project) => {
    if (!project) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không có dữ liệu để xuất', life: 3000 });
        return;
    }
    // Gọi API lấy danh sách quyên góp với các điều kiện:
    // - project: ID của dự án được chọn
    // - status: PAID (chỉ lấy các khoản đã thanh toán)
    const res = await apiService.get(`donations?filter=project=${project._id},status=PAID&page=1&pageSize=9999999999`);
    const donation = res.data.items;
    if (donation.length === 0) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không có dữ liệu để xuất', life: 3000 });
        return;
    }

    //------------------------------------FORMAT file excel-----------------------------------
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sao kê chi tiết quyên góp dự án');
    // Thêm tiêu đề
    const titleRow = worksheet.addRow(['PHIẾU SAO KÊ']);
    titleRow.font = { name: 'Arial', size: 20, bold: true };
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.mergeCells('A1:H1');
    worksheet.getRow(1).height = 40;

    // Đặt độ rộng cột
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    columns.forEach((col) => {
        worksheet.getColumn(col).width = 20;
    });

    const projectInfo = [
        ['Dự án: ' + project.name],
        ['Chiến dịch: ' + project.campaign?.name],
        ['Người/tổ chức kêu gọi: ' + (project.type == 'CN' ? project.user?.name : project.organization?.name)],
        ['Ngày bắt đầu: ' + format(project.startDate, 'dd/MM/yyyy'), '', '', '', 'Ngày kết thúc: ' + format(project.endDate, 'dd/MM/yyyy')],
        ['Mục tiêu quyên góp: ' + parseNum(project.goalAmount) + ' VNĐ'],
        ['Tổng số tiền đã quyên góp: ' + parseNum(project.currentAmount) + ' VNĐ'],
        ['Trạng thái: ' + getStatus(project.status)],
        ['Người tạo sao kê: ' + account.name]
    ];

    projectInfo.forEach((info, index) => {
        const row = worksheet.addRow(info);
        row.font = { name: 'Arial', size: 12 };
        row.alignment = { horizontal: 'left', vertical: 'middle' };
        if (index == 3) {
            worksheet.mergeCells(`A${row.number}:D${row.number}`);
            worksheet.mergeCells(`E${row.number}:H${row.number}`);
            row.height = 25;
        } else {
            worksheet.mergeCells(`A${row.number}:H${row.number}`);
            row.height = 25;
        }
    });

    const headerRow = worksheet.addRow(['STT', 'Tên người ủng hộ', 'Tên tài khoản NH', 'Số tài khoản NH', 'Mã ngân hàng', 'Số tiền', 'Nội dung chuyển khoản', 'Thời gian giao dịch']);
    headerRow.font = { name: 'Arial', size: 11, bold: true };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(headerRow.number).height = 30;
    headerRow.eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    //----- Thêm dữ liệu--------
    donation.forEach((item, index) => {
        const row = worksheet.addRow([
            index + 1,
            item.buyerName,
            item.counterAccountName || '--',
            item.counterAccountNumber || '--',
            item.counterAccountBankId || '--',
            parseNum(item.amount) + ' VNĐ',
            item.description || '--',
            item.transactionDateTime || '--'
        ]);
        row.font = { name: 'Arial', size: 11 };
        row.alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getRow(row.number).height = 20;
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
    });

    // Xuất file
    const now = new Date();
    const fileName = `Phiếu_sao_kê_${format(now, 'dd-MM-yyyy_HH-mm')}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    // Tải xuống file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Xuất file thành công', life: 3000 });
};
</script>

<style></style>
