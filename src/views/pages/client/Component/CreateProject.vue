<template>
    <Button @click="openEventDialog" class="h-9 !rounded-xl" label="Tạo chiến dịch" severity="warn" style="background: linear-gradient(88.87deg, #ff6c57 -5.14%, #ff922e 119.29%)"></Button>

    <Dialog v-model:visible="isEventDialog" :style="{ minWidth: '600px' }" :modal="true" header="Tạo chiến dịch">
        <template v-if="account">
            <Stepper value="1">
                <StepList>
                    <Step value="1">Bước 1</Step>
                    <Step value="2">Bước 2</Step>
                </StepList>
                <StepPanels>
                    <StepPanel v-slot="{ activateCallback }" value="1">
                        <div class="flex flex-col gap-4 items-center">
                            <SelectButton :invalid="submitted && !eventData.type" size="large" v-model="eventData.type" :options="dataGetAllOption.type" optionLabel="label" optionValue="value" />
                            <div class="w-2/3" v-if="eventData.type == 'TC'">
                                <Select
                                    :disabled="eventData.type != 'TC'"
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

                        <div class="flex pt-6 justify-between">
                            <Button label="Huỷ" icon="pi pi-times" text @click="hideDialog" />

                            <Button
                                label="Tiếp tục"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                @click="
                                    () => {
                                        nextStep() ? activateCallback('2') : '';
                                    }
                                "
                            />
                        </div>
                    </StepPanel>
                    <StepPanel v-slot="{ activateCallback }" value="2">
                        <div class="w-[1400px]">
                            <div class="w-full flex gap-6 pb-0">
                                <div class="w-1/5">
                                    <label class="block font-bold mb-1">Ảnh nổi bật <small class="text-red-500">*</small></label>
                                    <div class="relative group w-full h-[131px] border border-orange-500 overflow-hidden rounded-lg cursor-pointer" @click="$refs.fileInput.click()">
                                        <img :src="inputData || 'https://placehold.co/128x128'" alt="avatar" class="w-full h-full object-cover" />
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
                                    </div>
                                </div>
                            </div>
                            <div class="flex w-full gap-6 mt-2">
                                <div class="flex flex-col gap-4 w-1/2">
                                    <div>
                                        <label for="name" class="block font-bold mb-1">Tên dự án <small class="text-red-500">*</small></label>
                                        <InputText id="name" v-model="eventData.name" autofocus :invalid="submitted && !eventData.name" fluid placeholder="Vui lòng nhập tên dự án" />
                                    </div>
                                    <div class="flex gap-3 w-full">
                                        <div class="w-1/2">
                                            <label for="role" class="block font-bold mb-1">Tỉnh thành</label>
                                            <Select
                                                id="role"
                                                v-model="eventData.conscious"
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
                                        <div class="w-1/2">
                                            <label for="role" class="block font-bold mb-1">Quận huyện</label>
                                            <Select
                                                :disabled="!eventData.conscious"
                                                id="role"
                                                v-model="eventData.district"
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
                                    </div>

                                    <div class="flex gap-3 w-full">
                                        <div class="w-1/2">
                                            <label for="role" class="block font-bold mb-1">Phường xã</label>
                                            <Select
                                                id="role"
                                                :disabled="!eventData.district"
                                                v-model="eventData.ward"
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
                                        <div class="w-1/2">
                                            <label for="name" class="block font-bold mb-1">Địa chỉ </label>
                                            <InputText id="address" v-model="eventData.address" autofocus :invalid="submitted && !eventData.address" fluid placeholder="Vui lòng nhập địa chỉ" />
                                        </div>
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
                        </div>
                        <div class="flex pt-6 justify-between">
                            <Button label="Quay lại" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')" />
                            <Button label="Gửi yêu cầu" icon="pi pi-check" @click="saveData" :loading="isLoadingData" />
                        </div>
                    </StepPanel>
                </StepPanels>
            </Stepper>
        </template>
        <template v-else>
            <div class="flex flex-col gap-4 items-center">
                <p class="text-xl font-semibold">Vui lòng đăng nhập để tạo chiến dịch</p>
                <Button
                    label="Đăng nhập"
                    icon="pi pi-check"
                    @click="
                        () => {
                            router.push('/login');
                        }
                    "
                />
            </div>
        </template>
    </Dialog>
</template>
<script setup>
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import accountService from '../../../../service/account.service';
import apiService from '../../../../service/api.service';
import { getConscious, getDistrict, getWard } from '../../../../service/location.service';

const router = useRouter();
const account = accountService.getAccount()?.account;
const toast = useToast();
const dataFileInputs = ref([]);
const dataFileInput = ref(null); // Added missing ref
const isLoading = ref(false);
const isLoadingData = ref(false); // Added missing ref
const submitted = ref(false);
const isEventDialog = ref(false);
const eventData = ref({
    user: account?._id,
    status: 'CXN',
    listImage: [] // Initialize listImage array
});

const urlApi = 'projects'; // Added missing urlApi constant

onMounted(async () => {
    isLoading.value = true;
    await Promise.all([getAllLocation()]);
    isLoading.value = false;
});

const dataGetAllOption = ref({
    campaign: [],
    user: [],
    conscious: [],
    district: [],
    ward: [],
    organization: [],
    type: [
        { label: 'Cá nhân', value: 'CN' },
        { label: 'Tổ chức', value: 'TC' }
    ]
});

function openEventDialog() {
    isEventDialog.value = true;
    if (!account) return;
    eventData.value = {
        user: account?._id,
        status: 'CXN',
        listImage: []
    };
    submitted.value = false;
    getAllOption();
}

function hideDialog() {
    isEventDialog.value = false;
    dataFileInputs.value = [];
    dataFileInput.value = null;
    inputDatas.value = [];
    inputData.value = null;
    eventData.value = {
        user: account?._id,
        status: 'CXN',
        listImage: []
    };
    submitted.value = false;
}

const removeImage = (index) => {
    inputDatas.value.splice(index, 1);
    dataFileInputs.value.splice(index, 1);
};

const removeImageList = (index) => {
    eventData.value.listImage.splice(index, 1);
};

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
    if (!eventData.value.listImage?.length && !dataFileInputs.value.length) {
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
        if (dataFileInputs.value.length > 20) {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn không quá 20 ảnh', life: 3000 });
            return;
        }
        if (dataFileInputs.value.length > 0) {
            const resImages = await apiService.upload(dataFileInputs.value, 'projects', true);
            if (!eventData.value.listImage) {
                eventData.value.listImage = [];
            }
            resImages.data.forEach((item) => eventData.value.listImage.push(item.fileName));
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Lỗi không xác định từ upload file', life: 10000 });
    }
};

const nextStep = () => {
    let isValid = true;
    if (!eventData.value.type) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn Cá nhân hoặc Tổ chức', life: 3000 });
        isValid = false;
    }

    // Kiểm tra tổ chức kêu gọi
    if (!eventData.value.organization && eventData.value.type == 'TC') {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn tổ chức kêu gọi', life: 3000 });
        isValid = false;
    }

    return isValid;
};

async function saveData() {
    submitted.value = true;
    const { address, conscious, district, ward } = eventData.value;
    const mergeLocation = address + ', ' + ward?.name + ', ' + district?.name + ', ' + conscious?.name;
    eventData.value.detailAddress = mergeLocation;
    if (!validate()) {
        return;
    }
    isLoadingData.value = true;
    try {
        await uploadFile();
        await apiService.post(urlApi + '/client', { ...eventData.value });
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm thành công', life: 3000 });
        hideDialog();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data.message || 'Lỗi không xác định từ save data', life: 10000 });
    } finally {
        isLoadingData.value = false;
    }
}

const getAllOption = async () => {
    try {
        const [resCampaign, resOrganization] = await Promise.all([apiService.get('campaigns/getAll'), apiService.get('organizations/getAll')]);
        dataGetAllOption.value.campaign = resCampaign.data;
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
            dataGetAllOption.value.conscious = res.data;
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || 'Lỗi không xác định từ lấy tỉnh thành', life: 3000 });
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
</script>
<style lang=""></style>
