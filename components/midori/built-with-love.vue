<template>
    <footer
        class="flex justify-center items-center gap-4 text-sm text-gray-400 dark:text-gray-400 my-4"
    >
            <a rel="nofollow" target="__blank" href="https://zeabur.com?referralCode=ikxin&amp;utm_source=ikxin" data-astro-cid-35ed7um5="">
                Deployed on Zeabur
            </a>
            <a rel="nofollow" target="__blank" href="https://beian.miit.gov.cn" data-astro-cid-35ed7um5="">
                沪ICP备2024070610号-3
            </a>
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
