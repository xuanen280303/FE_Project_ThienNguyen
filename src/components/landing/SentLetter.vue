<template>
    <Dialog v-model:visible="props.visibleLetter" :modal="true" :showHeader="false" class="letter-dialog" :style="{ width: '700px', padding: '0' }">
        <div class="bg-white pt-5 rounded-xl">
            <!-- Header với nút đóng -->
            <div class="flex justify-between items-center mb-5">
                <div class="flex items-center gap-3">
                    <i class="pi pi-envelope text-2xl text-orange-500"></i>
                    <h2 class="text-2xl font-bold text-gray-800">{{ letter.title }}</h2>
                </div>
                <Button icon="pi pi-times" @click="$emit('update:visibleLetter', false)" text rounded class="hover:bg-gray-100" />
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
<script setup>
import { linkUploads } from '../../constant/api';

const props = defineProps({
    letter: {
        type: Object,
        required: true
    },
    visibleLetter: {
        type: Boolean,
        required: true
    }
});
defineEmits(['update:visibleLetter']);
</script>
<style lang=""></style>
