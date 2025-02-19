<template>
    <textarea id="editor"></textarea>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    modelValue: String
});

const emit = defineEmits(['update:modelValue']);
const editorId = ref('editor');

const init = {
    selector: `#${editorId.value}`,
    height: 300,
    menubar: false,
    language: 'vi',
    plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
    toolbar: 'undo redo | formatselect | bold italic backcolor alignleft aligncenter alignright alignjustify bullist numlist outdent indent removeformat image table help',
    base_url: '/tinymce',
    skin_url: '/tinymce/skins/ui/oxide',
    language_url: '/tinymce/langs/vi.js',
    branding: false,

    setup(editor) {
        // Gán giá trị ban đầu
        editor.on('init', () => {
            editor.setContent(props.modelValue || '');
        });

        // Lắng nghe sự kiện thay đổi nội dung
        editor.on('change keyup', () => {
            emit('update:modelValue', editor.getContent());
        });
    }
};

onMounted(() => {
    if (!window.tinymce) {
        const script = document.createElement('script');
        script.src = '/tinymce/tinymce.min.js';
        script.onload = () => tinymce.init(init);
        document.body.appendChild(script);
    } else {
        tinymce.init(init);
    }
});

// Đồng bộ khi modelValue thay đổi từ bên ngoài
watch(
    () => props.modelValue,
    (newValue) => {
        const editor = tinymce.get(editorId.value);
        if (editor && editor.getContent() !== newValue) {
            editor.setContent(newValue || '');
        }
    }
);
</script>
