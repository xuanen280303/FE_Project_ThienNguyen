<template>
    <!------------ Sắp xếp thứ tự các phần trang chủ --------------->
    <FloatingConfigurator />

    <HeroWidget />    <!-- 1. Banner đầu trang -->
    <CategoryWidget />  <!-- 2. Phần danh mục -->
    <FeaturesWidget />  <!-- 3. Phần chiến dịch gây quỹ nổi bật/ đồng hành cùng thiện nguyện-->
    <HighlightsWidget /> <!-- 4. Phần tổ chức/cá nhân gây quỹ nổi bật -->
    <PricingWidget /> <!-- 5. Phần sự kiện thiện nguyện/ các tổ chức -->
</template>
<script setup>
import FloatingConfigurator from '../../../components/FloatingConfigurator.vue';
import CategoryWidget from '../../../components/landing/CategoryWidget.vue';
import FeaturesWidget from '../../../components/landing/FeaturesWidget.vue';
import HeroWidget from '../../../components/landing/HeroWidget.vue'; 
import HighlightsWidget from '../../../components/landing/HighlightsWidget.vue';
import PricingWidget from '../../../components/landing/PricingWidget.vue';
</script>
