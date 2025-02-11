<template>
    <Editor v-model="content" :api-key="apiKey" :init="init" @update:modelValue="onChange" />
</template>

<script setup>
import Editor from '@tinymce/tinymce-vue';
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);

const content = ref(props.modelValue);
const apiKey = 'o348ub3qttdqici0zgd5eu35g3z7phk0or295fghmeo35x51'; // Bạn có thể đăng ký API key miễn phí tại https://www.tiny.cloud/

const init = {
    height: 300,
    menubar: false,
    language: 'vi',
    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'],
    toolbar: 'undo redo | formatselect | ' + 'bold italic backcolor | alignleft aligncenter ' + 'alignright alignjustify | bullist numlist outdent indent | ' + 'removeformat | image | help',
    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px }',
    language_url: 'https://cdn.jsdelivr.net/npm/tinymce-lang/langs/vi.js',
    branding: false,
    promotion: false,

    // Thêm cấu hình upload ảnh
    images_upload_url: '/api/upload', // URL API xử lý upload ảnh của bạn
    images_upload_handler: function (blobInfo, progress) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());

            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
                .then((response) => response.json())
                .then((result) => {
                    resolve(result.location); // Trả về URL của ảnh đã upload
                })
                .catch((error) => {
                    reject('Upload thất bại: ' + error);
                });
        });
    },
    automatic_uploads: true,
    file_picker_types: 'image',
    images_reuse_filename: true
};

watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue !== content.value) {
            content.value = newValue;
        }
    }
);

const onChange = (value) => {
    emit('update:modelValue', value);
};
</script>
