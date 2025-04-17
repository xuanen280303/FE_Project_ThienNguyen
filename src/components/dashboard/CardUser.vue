<template>
    <div class="w-full bg-white rounded-2xl relative pt-[120px] flex flex-col items-center">
        <div class="bg-transparent border-white border-[5px] rounded-full w-[128px] h-[128px] overflow-hidden p-[1px] absolute top-[-30px]">
            <img :src="props.image" class="h-full w-full rounded-full object-cover" alt="" />
        </div>
        <div class="font-semibold text-xl text-gray-600 mb-8">{{ props.name }}</div>
        <div class="bg-[#FFF1E2] py-1 px-2 rounded-full text-orange-500 font-semibold font-sans mb-3">{{ props.mail }}</div>
        <div class="text-gray-500 text-center px-4 mb-5">{{ props.description }}</div>
        <div class="text-base font-semibold text-gray-500 mb-2">Số tiền gây quỹ</div>
        <div class="text-orange-500 text-2xl font-bold mb-5">{{ parseNum(props.amount) }} VNĐ</div>

        <Button icon="pi pi-wifi" label="Theo dõi" class="w-[73%] mb-8 text-xl !rounded-xl !bg-[#FF9F2E] !border-0" :pt:label:class="'!font-semibold'"> </Button>
    </div>
</template>
<script setup>
import parseNum from '@/utils/parseNum';

const props = defineProps(['name', 'image', 'amount', 'mail', 'description']);
</script>
<style lang=""></style>
