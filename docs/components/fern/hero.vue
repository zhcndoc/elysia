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
        class="relative flex w-full pt-6 md:pt-0 mb-16 md:mb-8 px-6 overflow-hidden transition-all"
        :class="
            kawaii
                ? 'flex-col lg:flex-row justify-center items-around p-0 lg:px-0'
                : 'flex-col justify-center items-center'
        "
        style="min-height: calc(100vh - 64px)"
    >
        <div
            class="flex flex-col justify-center transition-all"
            :class="
                kawaii
                    ? 'items-start my-auto lg:max-w-5xl xl:max-w-5xl 2xl:max-w-6xl lg:pl-10 lg:pb-6 lg:pr-6'
                    : 'items-center'
            "
            :style="kawaii ? 'zoom: 1.08' : ''"
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
                class="relative md:leading-tight font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-violet-400 mb-6"
                :class="
                    kawaii
                        ? 'text-5xl text-left'
                        : 'text-5xl md:text-6xl md:text-center'
                "
            >
                人体工程学 <br v-if="kawaii" />
                <!-- for -->
                <button
                    type="button"
                    class="appearance-none rounded-lg interact:bg-violet-500/7.5 px-0.5 transition-colors duration-100 text-left"
                    @click="toggleKawaii"
                >
                    {{ kawaii ? '框架' : '框架' }}
                </button>
                <span
                    class="absolute w-10 md:w-12 h-10 md:h-12 bottom-0 mb-4 ml-2 md:ml-0 md:mb-10 text-indigo-400 transition-all"
                    :class="
                        kawaii
                            ? 'md:-translate-x-2 md:translate-y-4 md:scale-80'
                            : ''
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 256"
                    >
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
                class="text-xl md:text-2xl text-gray-500 dark:text-gray-400 !leading-normal text-left w-full max-w-2xl"
                :class="kawaii ? '' : 'md:text-center'"
            >
                具有 TypeScript
                <span
                    class="text-transparent font-semibold bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
                    >端到端的类型安全</span
                >，统一的类型系统和出色的开发人员体验。由 Bun 提供加速支持。
            </h3>
            <section
                class="flex flex-col sm:flex-row items-start sm:items-center w-full md:w-auto gap-4 mt-8 mb-12"
            >
                <a
                    class="text-white font-semibold text-lg bg-pink-400 dark:bg-pink-500 px-6 py-2.5 rounded-full"
                    id="hero-get-started"
                    href="/at-glance"
                >
                    开始使用
                </a>
                <div class="relative flex flex-1 gap-3 text-pink-500">
                    <code
                        class="text-pink-500 font-mono font-medium text-lg bg-pink-200/25 dark:bg-pink-500/20 px-6 py-2.5 rounded-full"
                    >
                        bun create elysia app
                    </code>
                    <button
                        id="hero-copy"
                        class="hidden sm:inline-flex p-3 rounded-xl active:rounded-4xl interact:bg-pink-200/25 active:bg-pink-200/50 interact:dark:bg-pink-500/20 active:dark:bg-pink-500/20 transition-all"
                        :class="{ '!rounded-4xl': copied }"
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
            <p
                class="flex justify-center items-center gap-2 text-gray-400"
                :class="kawaii ? 'mx-auto lg:mx-0' : ''"
            >
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
        </div>
        <div
            class="overflow-hidden flex-1 transition-all select-none pointer-events-none"
            :class="kawaii ? 'lg:flex max-w-4xl' : 'hidden'"
            style="max-height: calc(100vh - 64px)"
        >
            <img
                src="/assets/elysia_chan.webp"
                class="object-cover z-[41] select-none pointer-events-none"
                style="object-position: 50% 7.5%"
            />
        </div>
    </header>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import Ray from './ray.vue'

const kawaii = ref(false)
const toggleKawaii = () => {
    kawaii.value = !kawaii.value

    localStorage.setItem('kawaii', kawaii.value + '')
}

onMounted(() => {
    const search = window.location.search

    if (search.includes('kawaii=true') || search.includes('uwu=true')) {
        localStorage.setItem('kawaii', 'true')
        return (kawaii.value = true)
    }

    if (search.includes('kawaii=false') || search.includes('uwu=false')) {
        localStorage.setItem('kawaii', 'false')
        return (kawaii.value = false)
    }

    if (localStorage.getItem('kawaii') === 'true') return (kawaii.value = true)
})

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

<style>
@reference "../../tailwind.css";

.gradient {
    width: 1100px;
    height: 1100px;
}

.gradient {
    background: radial-gradient(
        ellipse at center,
        #d7e0ff 0%,
        #eaecff 35%,
        transparent 70%
    );
}

.dark .gradient {
    background: radial-gradient(
        ellipse at center,
        #797ee199 0%,
        transparent 70%
    );
}

#hero-get-started,
#hero-copy {
    @apply transform interact:scale-110;
    transition:
        all 0.35s cubic-bezier(0.68, -0.6, 0.32, 1.6),
        color 0.35s ease-out;
}
</style>
