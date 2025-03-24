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
                        <p class="m-0">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                        </p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>
</template>
<script setup>
import Project from './Component/Project.vue';
</script>
<style lang=""></style>
