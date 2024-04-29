<script setup lang="ts">
import useDark from './use-dark'

const isDark = useDark()
</script>

<template>
    <article
        class="flex justify-between flex-col lg:flex-row-reverse items-center w-full max-w-6xl mx-auto my-8 gap-12">
        <section class="flex flex-col w-full max-w-lg">
            <header class="flex flex-col justify-center items-start">
                <h2
                    class="text-2xl md:text-3xl leading-tight font-medium text-gray-400 mb-2"
                >
                    找不到你要找的东西？
                </h2>
                <h2
                    class="text-5xl leading-tight font-semibold text-gray-400 mb-4 bg-clip-text text-transparent bg-gradient-to-tl from-fuchsia-500 to-blue-500"
                >
                    加入社区
                </h2>
            </header>
            <p class="text-xl text-gray-400 w-full max-w-lg mb-4">
                Elysia 是 Bun 第一个 Web 框架最大的社区之一。
            </p>
            <p class="text-xl text-gray-400 w-full max-w-lg">
                你可以向我们的社区和维护人员提问、提出新功能建议或报告 bug。
            </p>
        </section>
        <section class="flex flex-col w-full max-w-xl rounded-lg overflow-hidden">
        <iframe class="w-full h-64"
            :src="'https://discord.com/widget?id=1044804142461362206&theme=' + (isDark ? 'dark' : 'light')"
            allowtransparency="true"
            frameborder="0"
            loading="lazy"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts" />
        </section>
    </article>
</template>
