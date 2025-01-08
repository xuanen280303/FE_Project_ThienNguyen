<template>
    <div class="mx-5 lg:mx-32 mt-10">
        <Carousel :pt:indicator:class="'hidden'" :value="products" :numVisible="7" :numScroll="1" :responsiveOptions="responsiveOptions" circular>
            <template #item="slotProps">
                <div class="flex flex-col items-center">
                    <img :src="slotProps.data.src" :alt="slotProps.data.alt" class="w-14" />
                    <p class="text-xl font-semibold mt-5">{{ slotProps.data.title }}</p>
                </div>
            </template>
        </Carousel>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const products = ref([
    {
        id: 1,
        src: 'Image/icon_category/1.svg',
        alt: 'Image 1',
        title: 'Product 1'
    },
    {
        id: 2,
        src: 'Image/icon_category/2.svg',
        alt: 'Image 1',
        title: 'Product 2'
    },
    {
        id: 3,
        src: 'Image/icon_category/3.svg',
        alt: 'Image 1',
        title: 'Product 3'
    },
    {
        id: 4,
        src: 'Image/icon_category/4.svg',
        alt: 'Image 1',
        title: 'Product 4'
    },
    {
        id: 5,
        src: 'Image/icon_category/5.svg',
        alt: 'Image 1',
        title: 'Product 5'
    },
    {
        id: 6,
        src: 'Image/icon_category/6.svg',
        alt: 'Image 1',
        title: 'Product 6'
    },
    {
        id: 7,
        src: 'Image/icon_category/7.svg',
        alt: 'Image 1',
        title: 'Product 7'
    },
    {
        id: 8,
        src: 'Image/icon_category/8.svg',
        alt: 'Image 1',
        title: 'Product 8'
    }
]);

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
</script>
