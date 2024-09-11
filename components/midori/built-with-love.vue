<template>
    <footer
        class="flex flex-col justify-center items-center gap-4 text-sm text-gray-400 dark:text-gray-400 mt-8 mb-4"
    >
        <p>
            <a target="_blank" href="https://www.zhcndoc.com?ref=elysia">
                简中文档
            </a>
            -
            <a target="_blank" href="https://beian.miit.gov.cn">
                沪ICP备2024070610号-3
            </a>
        </p>
    </footer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isToggle = ref(false)
</script>

<style>
.-collpasable {
    transition: height 0.375s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
