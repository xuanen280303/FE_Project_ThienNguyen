<script setup>
import errorIcon from '@/assets/Img/status/error.svg';
import heartIcon from '@/assets/Img/status/heart.svg';
import infoIcon from '@/assets/Img/status/info.svg';
import successIcon from '@/assets/Img/status/success.svg';
import warnIcon from '@/assets/Img/status/warn.svg';
import { useToast } from 'primevue';
import { ref } from 'vue';
import { linkUploads } from '../../constant/api';
import router from '../../router';
import accountService from '../../service/account.service';
import apiService from '../../service/api.service';
import tokenService from '../../service/token.service';
import { useAuthStore } from '../../stores/AuthStore';
import { useNotificationStore } from '../../stores/Notification';
import CreateProject from '../../views/pages/client/Component/CreateProject.vue';
import InfoHeaderUser from '../InfoHeaderUser.vue';
import SentLetter from './SentLetter.vue';
const authStore = useAuthStore();
const { state, getNotification } = useNotificationStore();
const toast = useToast();
function smoothScroll(id) {
    document.body.click();
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
const items = ref([
    {
        label: 'Ủng hộ',
        items: [
            {
                label: 'New',
                icon: 'pi pi-plus',
                command: () => {}
            },
            {
                label: 'Print',
                icon: 'pi pi-print',
                command: () => {}
            }
        ]
    },
    {
        label: 'Gây quỹ',
        items: [
            {
                label: 'New',
                icon: 'pi pi-plus',
                command: () => {}
            },
            {
                label: 'Print',
                icon: 'pi pi-print',
                command: () => {}
            }
        ]
    },
    {
        label: 'Khám phá',
        items: [
            {
                label: 'New',
                icon: 'pi pi-plus',
                command: () => {}
            },
            {
                label: 'Print',
                icon: 'pi pi-print',
                command: () => {}
            }
        ]
    },
    {
        label: 'Giới thiệu',
        items: [
            {
                label: 'New',
                icon: 'pi pi-plus',
                command: () => {}
            },
            {
                label: 'Print',
                icon: 'pi pi-print',
                command: () => {}
            }
        ]
    }
]);
const { account } = accountService.getAccount();

const op = ref();
const toggleNotification = (event) => {
    op.value.toggle(event);
};
const linkNotification = (key) => {
    const icons = {
        SUCCESS: successIcon,
        NOTIFICATION: infoIcon,
        WARNING: warnIcon,
        ERROR: errorIcon,
        HEART: heartIcon
    };
    return icons[key] || infoIcon;
};
const BGNotification = (key) => {
    const icons = {
        SUCCESS: 'bg-[#F1FDF5] border-[#24A955]',
        NOTIFICATION: 'bg-[#F0F7FF]  border-[#2967EB]',
        WARNING: 'border-[#EA580C]  bg-[#FEFCE9]',
        ERROR: 'bg-[#FEF3F3] border-[#DE3333]',
        HEART: 'bg-[#FEF3F3] border-[#DE3333]'
    };
    return icons[key] || 'bg-[#F0F7FF]  border-[#2967EB]';
};

const checkTypeNotification = (objInfo) => {
    const { name, _id, type } = objInfo;
    if (type == 'LETTER') {
        if (name == 'POST') {
            getLetterById(_id);
        }
    } else if (type == 'DONATION') {
        if (name == 'SUCCESS') {
            router.push(`/detail/${_id}`);
        } else if (name == 'ERROR') {
            router.push(`/detail/${_id}`);
        }
    } else if (type == 'PROJECT') {
        if (name == 'SUCCESS') {
            router.push(`/detail/${_id}`);
        }
    }
};
const readNotification = async (item) => {
    try {
        if (item.isRead === false) {
            await apiService.get(`notifications/markAsRead/${item._id}`);
            getNotification();
        }
        checkTypeNotification(item.objInfo);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: error.response.data.message || 'Đã xảy ra lỗi',
            life: 3000
        });
    }
};
const letter = ref({});
const visibleLetter = ref(false);
const getLetterById = async (id) => {
    try {
        const res = await apiService.get(`letter/${id}`);
        letter.value = res.data;
        visibleLetter.value = true;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: error.response.data.message || 'Đã xảy ra lỗi',
            life: 3000
        });
    }
};

const value = ref('');
const itemSearch = ref([]);

const search = async (event) => {
    const res = await apiService.post(`projects/search`, { search: event.query });
    itemSearch.value = res.data;
};
</script>

<template>
    <router-link class="flex items-center w-[180px] h-[37px] mr-4" to="/">
        <img src="/Image/logo.png" alt="" class="h-full object-contain w-full" />
    </router-link>
    <Button
        class="lg:!hidden"
        text
        severity="secondary"
        rounded
        v-styleclass="{
            selector: '@next',
            enterFromClass: 'hidden',
            enterActiveClass: 'animate-scalein',
            leaveToClass: 'hidden',
            leaveActiveClass: 'animate-fadeout',
            hideOnOutsideClick: true
        }"
    >
        <i class="pi pi-bars !text-2xl"></i>
    </Button>
    <div class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
        <AutoComplete
            v-model="value"
            optionLabel="name"
            :suggestions="itemSearch"
            @complete="search"
            placeholder="Tìm kiếm tên chiến dịch"
            :pt:pcInputText:root:class="'!rounded-full'"
            size="large"
            @item-select="
                (e) => {
                    router.push(`/detail/${e.value._id}`), (value = '');
                }
            "
        >
            <template #option="slotProps">
                <div class="flex items-center gap-4 cursor-pointer max-w-[500px] overflow-hidden hover:bg-gray-50" @click="router.push(`/detail/${slotProps.option._id}`)">
                    <!-- Ảnh dự án -->
                    <img :src="linkUploads(slotProps.option.image)" class="w-14 h-14 object-cover rounded-lg" alt="Project Image" />

                    <!-- Thông tin chính -->
                    <div class="flex flex-col min-w-0">
                        <!-- Tên dự án -->
                        <p class="font-semibold text-gray-800 w-full break-words truncate">
                            {{ slotProps.option.name }}
                        </p>
                        <div class="flex items-center gap-2 text-sm text-gray-600 mt-1" v-if="slotProps.option.type == 'TC'">
                            <img :src="linkUploads(slotProps.option.organization?.avatar)" class="w-5 h-5 rounded-full" alt="Org Avatar" />
                            <span>{{ slotProps.option.organization?.name }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600 mt-1" v-else>
                            <img :src="linkUploads(slotProps.option.user?.avatar)" class="w-5 h-5 rounded-full" alt="Org Avatar" />
                            <span>{{ slotProps.option.user?.name }}</span>
                        </div>
                        <!-- Địa chỉ và tiến độ -->
                        <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <!-- Thông tin tổ chức -->
                            <div class="flex items-center gap-1">
                                <i class="pi pi-map-marker"></i>
                                <span>{{ slotProps.option.conscious?.name }}</span>
                            </div>
                            <!-- Tiến độ quyên góp -->
                            <div class="flex items-center gap-1">
                                <i class="pi pi-heart-fill text-red-500"></i>
                                <span>{{ new Intl.NumberFormat('vi-VN').format(slotProps.option.currentAmount) }}đ</span>
                                <span>/</span>
                                <span>{{ new Intl.NumberFormat('vi-VN').format(slotProps.option.goalAmount) }}đ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </AutoComplete>
        <div class="flex">
            <Menubar :model="items" class="text-base font-medium" />

            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2 items-center">
                <!-- <Button class="h-9 !rounded-xl" label="Tạo chiến dịch" severity="warn" style="background: linear-gradient(88.87deg, #ff6c57 -5.14%, #ff922e 119.29%)"></Button> -->
                <CreateProject />
                <div class="pt-2 px-2">
                    <OverlayBadge v-if="account" :value="state.notifications.length > 0 ? state.notifications.filter((item) => item.isRead === false).length : 0" @click="toggleNotification">
                        <i class="pi pi-bell" style="font-size: 1.7rem" />
                    </OverlayBadge>
                    <Popover ref="op">
                        <div class="flex flex-col gap-2 w-[30rem]">
                            <span class="font-medium block mb-1">Thông báo</span>
                            <ul class="list-none p-0 m-0 flex flex-col max-h-[30rem] overflow-y-auto">
                                <template v-if="state.notifications.length > 0">
                                    <li
                                        @click="readNotification(item)"
                                        v-for="item in state.notifications"
                                        :key="item._id"
                                        class="flex items-center gap-2 py-2 px-1 rounded-md hover:bg-surface-200 dark:hover:bg-surface-700 cursor-pointer transition-colors duration-200"
                                    >
                                        <div :class="BGNotification(item.type)" class="min-w-14 min-h-14 max-w-14 max-h-14 rounded-full overflow-hidden border flex justify-center items-center">
                                            <img :src="linkNotification(item.type)" class="w-5/12 h-5/12" />
                                        </div>
                                        <div class="flex flex-col gap-1 justify-start flex-1">
                                            <span class="font-medium" :class="{ 'text-primary dark:text-primary': !item.isRead }">{{ item.title }}</span>
                                            <div class="text-sm text-surface-500 dark:text-surface-400">
                                                {{ item.message }}
                                            </div>
                                        </div>
                                        <div v-if="!item.isRead" class="w-3 h-3 rounded-full bg-primary"></div>
                                    </li>
                                </template>
                                <template v-else>
                                    <li class="flex items-center justify-center py-4 text-gray-500">Không có thông báo nào</li>
                                </template>
                            </ul>
                        </div>
                    </Popover>
                </div>

                <Button label="Đăng nhập" to="/login" as="router-link" text severity="warn" v-if="!tokenService.getToken().storage"></Button>
                <InfoHeaderUser v-else />
            </div>
        </div>
    </div>
    <SentLetter :letter="letter" :visibleLetter="visibleLetter" @update:visibleLetter="visibleLetter = $event" />
</template>
<style>
.p-menubar {
    border: none !important;
}
.customInputIcon {
    color: orangered !important;
}
.customerInput {
    border-radius: 50px !important;
}
.letter-dialog {
    max-height: 90vh;
}

.letter-dialog :deep(.p-dialog-content) {
    padding: 0;
    border-radius: 1rem;
}

.prose {
    max-height: 50vh;
    overflow-y: auto;
    padding: 1rem;
    background: #fafafa;
    border-radius: 0.5rem;
}
</style>
