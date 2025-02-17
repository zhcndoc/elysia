<template>
    <article class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-12 w-full max-w-6xl">
        <section class="w-full !text-base !font-mono rounded-xl">
            <slot></slot>
        </section>
        <header class="flex flex-col gap-3 w-full">
            <h3
                class="text-5xl leading-tight font-bold text-transparent bg-clip-text bg-gradient-to-br from-teal-300 to-blue-300">
                类型安全
            </h3>
            <p class="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4">
                在 TypeBox 的支持下，Elysia 默认强制执行类型严格验证以确保类型完整性。
            </p>
            <p class="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4">
                Elysia 自动将类型推断为 TypeScript，以创建像静态类型语言一样的统一类型系统。
            </p>
        </header>
    </article>
</template>
