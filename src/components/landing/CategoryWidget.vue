<template>
    <div class="mx-5 lg:mx-32 mt-10">
        <Carousel :pt:indicator:class="'hidden'" :value="dataCategory" :numVisible="7" :numScroll="1" :responsiveOptions="responsiveOptions" circular>
            <template #item="slotProps">
                <router-link :to="`/category/${slotProps.data._id}`" class="flex flex-col items-center hover:shadow-2xl hover:border-b-4 border-primary hover:p-0 transition-all duration-100 rounded-lg p-2 max-w-52">
                    <img :src="linkUploads(slotProps.data.image)" :alt="slotProps.data.image" class="w-14" />
                    <p class="text-xl font-semibold mt-5">{{ slotProps.data.name }}</p>
                </router-link>
            </template>
        </Carousel>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { linkUploads } from '../../constant/api';
import apiService from '../../service/api.service';

const responsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 2,
        numScroll: 1
    }
]);

const useCategory = () => {
    const dataCategory = reactive([]);

    const getAll = async () => {
        try {
            const res = await apiService.get('/campaigns?page=1&pageSize=100');
            Object.assign(dataCategory, res.data.items);
        } catch (error) {}
    };
    return { getAll, dataCategory };
};
const { getAll, dataCategory } = useCategory();
onMounted(() => {
    getAll();
});
</script>
