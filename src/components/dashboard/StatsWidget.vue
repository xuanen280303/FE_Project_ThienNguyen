<template>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Dự án</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ count?.totalProjects }}</div>
                </div>
                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-folder text-blue-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">{{ newCount?.totalProjects }} dự án mới </span>
            <span class="text-muted-color">trong tuần</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Số tiền</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ count?.totalDonationAmount }}</div>
                </div>
                <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">{{ newCount?.totalDonationAmount }} mới </span>
            <span class="text-muted-color">trong tuần</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Tổ chức</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ count?.totalOrganizations }}</div>
                </div>
                <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-users text-cyan-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">{{ newCount?.totalOrganizations }} tổ chức mới </span>
            <span class="text-muted-color">trong tuần</span>
        </div>
    </div>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Người dùng</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ count?.totalUsers }}</div>
                </div>
                <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-user text-purple-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">{{ newCount?.totalUsers }} người dùng mới </span>
            <span class="text-muted-color">trong tuần</span>
        </div>
    </div>
</template>
<script setup>
const props = defineProps(['count', 'newCount']);
</script>
