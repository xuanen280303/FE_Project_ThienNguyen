<script setup lang="ts">
import FeaturesWidget from '@/components/landing/FeaturesWidget.vue'
import FooterWidget from '@/components/landing/FooterWidget.vue'
import HeroWidget from '@/components/landing/HeroWidget.vue'
import HighlightsWidget from '@/components/landing/HighlightsWidget.vue'
import PricingWidget from '@/components/landing/PricingWidget.vue'
import TopbarWidget from '@/components/landing/TopbarWidget.vue'
import CategoryWidget from '@/components/landing/CategoryWidget.vue'
import FloatingConfigurator from '@/components/FloatingConfigurator.vue'

</script>

<template>
  <div class="bg-surface-0 dark:bg-surface-900">
    <div id="home" class="landing-wrapper">

      <div
        class=" lg:px-44  h-[76px] flex items-center justify-between sticky top-0 z-50 bg-surface-0 dark:bg-surface-900"
      >
        <TopbarWidget />
      </div>
      <FloatingConfigurator />

      <HeroWidget />
      <CategoryWidget/>
      <FeaturesWidget />
      <HighlightsWidget />
      <PricingWidget />
      <FooterWidget />
    </div>
  </div>
</template>
