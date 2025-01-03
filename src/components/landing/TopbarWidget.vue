<script setup lang="ts">
import { ref } from 'vue';

function smoothScroll(id: any) {
  document.body.click()
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}
const items = ref([
    {
        label: 'Ủng hộ',
        items: [
            {
                label: 'New',
                icon: 'pi pi-plus',
                command: () => {
                }
            },
            {
                label: 'Print',
                icon: 'pi pi-print',
                command: () => {
                }
            }
        ]
    },
    {
        label: 'Gây quỹ',
        items: [
            {
                label: 'New',
                icon: 'pi pi-plus',
                command: () => {
                }
            },
            {
                label: 'Print',
                icon: 'pi pi-print',
                command: () => {
                }
            }
        ]
    },{
        label: 'Khám phá',
        items: [
            {
                label: 'New',
                icon: 'pi pi-plus',
                command: () => {
                }
            },
            {
                label: 'Print',
                icon: 'pi pi-print',
                command: () => {
                }
            }
        ]
    },{
        label: 'Giới thiệu',
        items: [
            {
                label: 'New',
                icon: 'pi pi-plus',
                command: () => {
                }
            },
            {
                label: 'Print',
                icon: 'pi pi-print',
                command: () => {
                }
            }
        ]
    },
]);
</script>

<template>
  <a class="flex items-center w-[180px] h-[37px] mr-4" href="#">
    <img src="/public/Image/logo.png" alt="" class="h-full object-contain w-full">
  </a>
  <Button
    class="lg:!hidden"
    text
    severity="secondary"
    rounded
    v-styleclass="{
      selector: '@next',
      enterFromClass: 'hidden',
      enterActiveClass: 'animate-scalein',
      leaveToClass: 'hidden',
      leaveActiveClass: 'animate-fadeout',
      hideOnOutsideClick: true,
    }"
  >
    <i class="pi pi-bars !text-2xl"></i>
  </Button>
  <div
    class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border"
  >
  <IconField >
    <InputIcon class="pi pi-search customInputIcon" />
    <InputText  placeholder="Tìm kiếm tên chiến dịch" class="rounded-full customerInput" size="large"/>
</IconField>
  <div class="flex">
    <Menubar :model="items" class="text-base font-medium" />

    <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
      <Button label="Tạo chiện dịch" severity="warn" ></Button>
      <Button label="Đăng nhập" to="/login" as="router-link" text severity="warn" ></Button>
    </div>
  </div>

  </div>
</template>
<style>
.p-menubar{
  border: none !important
}
.customInputIcon	{
  color: orangered !important;
}
.customerInput{
  border-radius: 50px !important;

}

</style>
