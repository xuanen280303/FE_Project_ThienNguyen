<template>
    <div class="p-4">
        <div class="mb-6">
            <div class="flex flex-col space-y-4 p-4 bg-white border border-primary-300 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-800">Thêm Bình Luận Mới</h3>
                <Textarea v-model="newComment.message" placeholder="Nhập bình luận của bạn" autoResize rows="2" cols="30" />

                <Button :loading="isLoading" @click="handleAddComment" class="py-2 px-1" aria-label="Thêm Bình Luận">Thêm Bình Luận</Button>
            </div>
        </div>
        <div class="max-h-[600px] overflow-auto">
            <CommentNode v-for="comment in comments" :key="comment.id" :comment="comment" :projectId="projectId" :getCommentByProjectId="getCommentByProjectId" />
        </div>
    </div>
</template>

<script setup>
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import apiService from '../service/api.service';
import CommentNode from './CommentNode.vue';
const toast = useToast();
const isLoading = ref(false);
const props = defineProps({
    projectId: String
});

onMounted(() => {
    getCommentByProjectId();
});

// Dữ liệu giả
const comments = ref([]);
const getCommentByProjectId = async () => {
    try {
        const res = await apiService.get(`comments?page=1&pageSize=10&filter=project=${props.projectId},sort=-createdAt`);
        comments.value = res.data.items;
    } catch (error) {
        console.log(error);
    }
};

const newComment = ref({
    message: '',
    project: props.projectId
});

const handleAddComment = async () => {
    isLoading.value = true;
    if (newComment.value.message.trim() === '') {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng nhập bình luận', life: 3000 });
    }
    try {
        await apiService.post(`comments`, newComment.value);
        newComment.value = { message: '', project: props.projectId };
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Bình luận đã được thêm', life: 3000 });
        await getCommentByProjectId();
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};

const showReplyForm = ref(false);
const replyContent = ref('');

const reply = () => {
    showReplyForm.value = !showReplyForm.value;
};
</script>

<style>
/* Add any additional styles if needed */
</style>
