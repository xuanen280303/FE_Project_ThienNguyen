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
const menu = ref();
const itemAccount = ref([
    {
        label: 'Tài khoản',
        items: [
            {
                label: 'Quản lý',
                icon: 'pi pi-fw pi-users',
                command: () => {
                    router.push('/admin');
                }
            },
            {
                label: 'Đăng xuất',
                icon: 'pi pi-sign-out',
                command: () => {
                    authStore.logout();
                    router.push('/');
                }
            }
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};

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
    }
};
const readNotification = async (item) => {
    try {
        debugger;
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
        <IconField>
            <InputIcon class="pi pi-search customInputIcon" />
            <InputText placeholder="Tìm kiếm tên chiến dịch" class="rounded-full customerInput" size="large" />
        </IconField>
        <div class="flex">
            <Menubar :model="items" class="text-base font-medium" />

            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2 items-center">
                <Button class="h-9 !rounded-xl" label="Tạo chiến dịch" severity="warn" style="background: linear-gradient(88.87deg, #ff6c57 -5.14%, #ff922e 119.29%)"></Button>
                <div class="pt-2 px-2">
                    <OverlayBadge :value="state.notifications.length > 0 ? state.notifications.filter((item) => item.isRead === false).length : 0" @click="toggleNotification">
                        <i class="pi pi-bell" style="font-size: 1.7rem" />
                    </OverlayBadge>
                    <Popover ref="op">
                        <div class="flex flex-col gap-2 w-[30rem]">
                            <span class="font-medium block mb-1">Thông báo</span>
                            <ul class="list-none p-0 m-0 flex flex-col max-h-[30rem] overflow-y-auto">
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
                            </ul>
                        </div>
                    </Popover>
                </div>

                <Button label="Đăng nhập" to="/login" as="router-link" text severity="warn" v-if="!tokenService.getToken().storage"></Button>
                <Chip :label="account?.name" :image="linkUploads(account?.avatar)" :pt:image:class="'!w-11 !h-11 border border-primary !bg-white'" class="!rounded-full" aria-controls="overlay_menu" @click="toggle" v-else />
                <Menu ref="menu" id="overlay_menu" :model="itemAccount" :popup="true" />
            </div>
        </div>
    </div>
    <Dialog v-model:visible="visibleLetter" :modal="true" :showHeader="false" class="letter-dialog" :style="{ width: '700px', padding: '0' }">
        <div class="bg-white pt-5 rounded-xl">
            <!-- Header với nút đóng -->
            <div class="flex justify-between items-center mb-5">
                <div class="flex items-center gap-3">
                    <i class="pi pi-envelope text-2xl text-orange-500"></i>
                    <h2 class="text-2xl font-bold text-gray-800">{{ letter.title }}</h2>
                </div>
                <Button icon="pi pi-times" @click="visibleLetter = false" text rounded class="hover:bg-gray-100" />
            </div>

            <!-- Thông tin người gửi và thời gian -->
            <div class="flex items-center gap-4 mb-3 rounded-lg">
                <img :src="linkUploads(letter.organization?.avatar || letter.userSent?.avatar)" class="w-12 h-12 rounded-full object-cover border-2 border-orange-200" alt="Avatar" />
                <div>
                    <div class="font-semibold text-gray-800">
                        {{ letter.organization ? letter.organization.name : letter.userSent.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                        <i class="pi pi-calendar mr-2"></i>
                        {{
                            new Date(letter.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                        }}
                    </div>
                </div>
            </div>

            <!-- Nội dung thư -->
            <div class="prose max-w-none min-h-[30rem] rounded-lg">
                <div v-html="letter.message" class="text-gray-700 leading-relaxed"></div>
            </div>
        </div>
    </Dialog>
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
