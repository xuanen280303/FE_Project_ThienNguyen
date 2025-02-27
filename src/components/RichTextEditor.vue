<template>
    <textarea id="editor"></textarea>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
    modelValue: String,
    height: {
        type: [Number, String],
        default: 500
    },
    readonly: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'onInit', 'onChange', 'onBlur']);
const editorId = ref('editor');

const init = {
    selector: `#${editorId.value}`,
    height: props.height,
    menubar: true,
    language: 'vi',
    plugins: [
        'advlist',
        'autolink',
        'lists',
        'link',
        'image',
        'charmap',
        'preview',
        'anchor',
        'searchreplace',
        'visualblocks',
        'code',
        'fullscreen',
        'insertdatetime',
        'media',
        'table',
        'help',
        'wordcount',
        'emoticons',
        'codesample',
        'paste',
        'hr',
        'pagebreak',
        'nonbreaking',
        'template',
        'textpattern',
        'print',
        'importcss',
        'quickbars'
    ],
    toolbar1: 'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify',
    toolbar2: 'bullist numlist outdent indent | link image media table | forecolor backcolor removeformat | code fullscreen help',
    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
    base_url: '/tinymce',
    skin_url: '/tinymce/skins/ui/oxide',
    language_url: '/tinymce/langs/vi.js',
    branding: false,
    readonly: props.readonly,
    paste_data_images: true,
    automatic_uploads: true,
    relative_urls: false,
    remove_script_host: false,
    convert_urls: true,

    // Cấu hình menu
    menu: {
        file: { title: 'File', items: 'newdocument print' },
        edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
        insert: { title: 'Insert', items: 'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor | insertdatetime' },
        view: { title: 'View', items: 'code | visualaid visualchars visualblocks | preview fullscreen' },
        format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript | styles blocks fontfamily fontsize align | removeformat' },
        tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | code wordcount' },
        table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' }
    },

    // Cấu hình quickbars (thanh công cụ nhanh khi bôi đen text)
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
    quickbars_insert_toolbar: 'quickimage quicktable',

    // Cấu hình upload ảnh
    images_upload_handler: (blobInfo) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result;
                resolve(base64);
            };
            reader.onerror = () => {
                reject('Không thể đọc file ảnh');
            };
            reader.readAsDataURL(blobInfo.blob());
        });
    },

    // Cấu hình templates
    templates: [
        {
            title: 'Mẫu nội dung 1',
            description: 'Mẫu với 2 cột',
            content: `
                <div class="row" style="display: flex; gap: 20px;">
                    <div style="flex: 1;">Cột 1</div>
                    <div style="flex: 1;">Cột 2</div>
                </div>
            `
        }
    ],

    setup(editor) {
        // Gán giá trị ban đầu
        editor.on('init', () => {
            editor.setContent(props.modelValue || '');
            emit('onInit', editor);
        });

        // Lắng nghe sự kiện thay đổi nội dung
        editor.on('change keyup', () => {
            emit('update:modelValue', editor.getContent());
            emit('onChange', editor.getContent());
        });

        // Sự kiện blur
        editor.on('blur', () => {
            emit('onBlur', editor.getContent());
        });

        // Thêm shortcut keys
        editor.addShortcut('Meta+S', 'Save', () => {
            // Xử lý save
            console.log('Save content');
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

// Cleanup khi component bị hủy
onBeforeUnmount(() => {
    if (window.tinymce) {
        tinymce.get(editorId.value)?.remove();
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

// Đồng bộ khi readonly thay đổi
watch(
    () => props.readonly,
    (newValue) => {
        const editor = tinymce.get(editorId.value);
        if (editor) {
            editor.setMode(newValue ? 'readonly' : 'design');
        }
    }
);
</script>

<style>
/* Tùy chỉnh giao diện TinyMCE nếu cần */
:deep(.tox-tinymce) {
    border-radius: 4px;
}
</style>
