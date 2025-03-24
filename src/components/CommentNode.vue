<template>
    <div class="border-l-2 border-primary-200 pl-4 mb-4 rounded-lg" :class="{ 'border-none': isReply }">
        <div class="flex items-start mb-2">
            <div class="mr-2">
                <img :src="linkUploads(comment.user.avatar)" alt="avatar" class="w-12 h-12 mt-2 rounded-full border border-primary" />
            </div>
            <div class="flex-1">
                <div class="flex justify-between items-center">
                    <h4 class="font-semibold text-gray-800">{{ comment.user.name }}</h4>
                    <Button v-if="account._id === comment.user._id" icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" aria-label="Xóa bình luận" @click="confirmDelete" />
                </div>
                <p class="text-gray-700">{{ comment.message }}</p>
                <div class="flex space-x-2 mt-2">
                    <button @click="reply" class="text-primary-500 hover:underline" v-if="!isReply">Trả lời</button>
                </div>
            </div>
        </div>
        <div v-if="showReplyForm" class="flex flex-col gap-2">
            <Textarea v-model="newComment.message" placeholder="Nhập bình luận của bạn" autoResize rows="2" cols="30" />
            <div class="flex gap-2">
                <Button label="Gửi" @click="handleAddComment" class="min-w-28 !py-1 !text-base rounded-xl mb-2" />
                <Button label="Hủy" @click="showReplyForm = false" severity="secondary" class="!py-1 !text-base rounded-xl mb-2" />
            </div>
        </div>
        <CommentNode v-for="child in comment.replies" :key="child.id" :comment="child" :projectId="projectId" :isReply="true" :getCommentByProjectId="getCommentByProjectId" />
    </div>
    <ConfirmPopup></ConfirmPopup>
</template>

<script setup>
import { useConfirm, useToast } from 'primevue';
import { ref } from 'vue';
import { linkUploads } from '../constant/api';
import accountService from '../service/account.service';
import apiService from '../service/api.service';
const toast = useToast();
const confirm = useConfirm();
const props = defineProps({
    comment: Object,
    projectId: String,
    isReply: Boolean,
    getCommentByProjectId: Function
});

const account = accountService.getAccount().account;

const showReplyForm = ref(false);

const reply = () => {
    showReplyForm.value = !showReplyForm.value;
};

const newComment = ref({
    message: '',
    project: props.projectId,
    parent: props.comment._id
});

const handleAddComment = async () => {
    if (newComment.value.message.trim() === '') {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập bình luận', life: 3000 });
    }
    try {
        await apiService.post(`comments`, newComment.value);
        newComment.value = { message: '', project: props.projectId, parent: props.comment._id };
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Bình luận đã được thêm', life: 3000 });
        showReplyForm.value = false;
        props.getCommentByProjectId();
    } catch (error) {
        console.log(error);
    }
};

const confirmDelete = () => {
    confirm.require({
        message: 'Bạn có chắc chắn muốn xóa bình luận này?',
        header: 'Xác nhận xóa',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Hủy',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Xóa'
        },
        accept: () => {
            handleDeleteComment();
        }
    });
};

const handleDeleteComment = async () => {
    try {
        await apiService.delete(`comments/${props.comment._id}`);
        await props.getCommentByProjectId();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Bình luận đã được xóa', life: 3000 });
    } catch (error) {
        console.log(error);
    }
};
</script>
<!-- 
<script setup>
import { useToast } from 'primevue';
import { ref } from 'vue';
import { linkUploads } from '../constant/api';
import accountService from '../service/account.service';
import apiService from '../service/api.service';
const toast = useToast();
const props = defineProps({
    comment: Object,
    projectId: String,
    isReply: Boolean,
    getCommentByProjectId: Function
});
const { account } = accountService.getAccount().account;
const showReplyForm = ref(false);

const reply = () => {
    showReplyForm.value = !showReplyForm.value;
};

const newComment = ref({
    message: '',
    project: props.projectId,
    parent: props.comment._id
});

const handleAddComment = async () => {
    if (newComment.value.message.trim() === '') {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập bình luận', life: 3000 });
    }
    try {
        await apiService.post(`comments`, newComment.value);
        newComment.value = { message: '', project: props.projectId, parent: props.comment._id };
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Bình luận đã được thêm', life: 3000 });
        showReplyForm.value = false;
        props.getCommentByProjectId();
    } catch (error) {
        console.log(error);
    }
};
</script>

<style>
/* Add any additional styles if needed */
</style> -->
