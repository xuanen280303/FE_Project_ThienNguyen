<template>
    <div class="bg-surface-50 dark:bg-surface-900 p-10">
        <div class="w-full mx-auto card">
            <Tabs value="0">
                <TabList>
                    <Tab value="0">Dự án</Tab>
                    <Tab value="1">Thư gửi</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <Project />
                    </TabPanel>
                    <TabPanel value="1">
                        <Letter />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>
</template>
<script setup>
import Letter from './Component/Letter.vue';
import Project from './Component/Project.vue';
</script>
<style lang=""></style>
