<template>
    <link rel="preload" as="image" href="/assets/elysia_v.webp" />
    <Ray
        class="h-[60vh] -top-16 pointer-events-none opacity-[.35] dark:opacity-50"
    />
    <div
        id="splash"
        class="pointer-events-none absolute top-[-70vh] max-w-full justify-center w-full h-screen opacity-25 block gradient"
    ></div>
    <header
        class="relative flex flex-col justify-center items-center w-full px-6 pt-6 md:pt-0 mb-16 md:mb-8 overflow-hidden"
        style="min-height: calc(100vh - 64px)"
    >
        <!-- <h1
            class="text-3xl leading-relaxed font-semibold text-center text-transparent mr-auto md:mx-auto bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
        >
            ElysiaJS
        </h1> -->
        <img
            src="/assets/elysia_v.webp"
            alt="Curved text logo saying 'Elysia JS'"
            class="max-w-[40ch] w-full object-contain object-left md:object-center mr-auto md:mr-0"
            style="aspect-ratio: 1.5 / 1"
        />
        <h2
            class="relative text-4xl md:text-6xl md:leading-tight font-bold md:text-center leading-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400 mb-6"
        >
            人体工程学框架
            <span
                class="absolute w-10 md:w-12 h-10 md:h-12 bottom-0 mb-4 ml-2 md:ml-0 md:mb-10 text-indigo-400"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none" />
                    <path
                        d="M138.7,175.5l-19.2,52.1a8,8,0,0,1-15,0L85.3,175.5a8.1,8.1,0,0,0-4.8-4.8L28.4,151.5a8,8,0,0,1,0-15l52.1-19.2a8.1,8.1,0,0,0,4.8-4.8l19.2-52.1a8,8,0,0,1,15,0l19.2,52.1a8.1,8.1,0,0,0,4.8,4.8l52.1,19.2a8,8,0,0,1,0,15l-52.1,19.2A8.1,8.1,0,0,0,138.7,175.5Z"
                        fill="currentcolor"
                        stroke="currentcolor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="0"
                    />
                    <line
                        x1="176"
                        y1="16"
                        x2="176"
                        y2="64"
                        fill="none"
                        stroke="currentcolor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="16"
                    />
                    <line
                        x1="200"
                        y1="40"
                        x2="152"
                        y2="40"
                        fill="none"
                        stroke="currentcolor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="16"
                    />
                    <line
                        x1="224"
                        y1="72"
                        x2="224"
                        y2="104"
                        fill="none"
                        stroke="currentcolor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="16"
                    />
                    <line
                        x1="240"
                        y1="88"
                        x2="208"
                        y2="88"
                        fill="none"
                        stroke="currentcolor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="16"
                    />
                </svg>
            </span>
        </h2>
        <h3
            class="text-xl md:text-2xl text-gray-500 dark:text-gray-400 !leading-normal text-left md:text-center w-full max-w-[49rem]"
        >
            具有 TypeScript
            <span
                class="text-transparent font-semibold bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
                >端到端的类型安全</span
            >，统一的类型系统和出色的开发人员体验。由 Bun 提供加速支持。
        </h3>
        <section
            class="flex flex-col sm:flex-row items-start sm:items-center w-full md:w-auto gap-4 mt-10 mb-12"
        >
            <a
                class="text-white font-medium text-lg bg-blue-500 px-6 py-2.5 rounded-full"
                href="/at-glance"
            >
                开始使用
            </a>
            <div class="relative flex flex-1 gap-3 text-blue-500">
                <code
                    class="text-blue-500 font-mono font-medium text-lg bg-blue-200/25 dark:bg-blue-500/20 px-6 py-2.5 rounded-full"
                >
                    bun create elysia app
                </code>
                <button
                    class="hidden sm:inline-flex p-3 rounded-2xl active:rounded-full hover:bg-blue-200/25 focus:bg-blue-200/25 active:bg-blue-200/50 hover:dark:bg-blue-500/20 focus:dark:bg-blue-500/20 active:dark:bg-blue-500/20 transition-all"
                    @click="copied = true"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-copy"
                    >
                        <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                        />
                        <path
                            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                        />
                    </svg>
                </button>
                <p v-if="copied" className="absolute -bottom-8 right-0">
                    已复制
                </p>
            </div>
        </section>
        <p class="flex justify-center items-center gap-2 text-gray-400">
            了解为什么开发人员喜欢 Elysia
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-6 h-6 motion-safe:animate-bounce"
            >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
        </p>
    </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import Ray from './ray.vue'

const copied = ref(false)
watch(copied, (value) => {
    // [INFO] navigator.clipboard available only in secure contexts.
    if (value && window.isSecureContext) {
        navigator.clipboard.writeText('bun create elysia app')

        setTimeout(() => {
            copied.value = false
        }, 2000)
    }
})
</script>
