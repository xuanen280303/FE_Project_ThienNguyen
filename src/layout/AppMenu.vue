<script setup>
import { ref } from 'vue'

import AppMenuItem from './AppMenuItem.vue'

const model = ref([
  {
    label: 'Menu',
    items: [
      { label: 'Trang chủ', icon: 'pi pi-fw pi-home', to: '/admin' },
      { label: 'Media', icon: 'pi pi-fw pi-image', to: '/media' },
      { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/charts' },
      {
        label: 'Trang chủ người dùng',
        icon: 'pi pi-fw pi-globe',
        to: '/',
      },
      {
        label: 'Auth',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-fw pi-sign-in',
            to: '/login',
          },
          {
            label: 'Error',
            icon: 'pi pi-fw pi-times-circle',
            to: '/error',
          },
          {
            label: 'Access Denied',
            icon: 'pi pi-fw pi-lock',
            to: '/access',
          },
        ],
      },
      {
        label: 'Crud',
        icon: 'pi pi-fw pi-pencil',
        to: '/crud',
      },
      {
        label: 'Not Found',
        icon: 'pi pi-fw pi-exclamation-circle',
        to: '/notfound',
      },
      {
        label: 'Empty',
        icon: 'pi pi-fw pi-circle-off',
        to: '/empty',
      },
    ],
  },
])
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
