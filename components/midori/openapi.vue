<template>
    <article class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-12 w-full max-w-6xl">
        <section class="w-full !text-base !font-mono rounded-xl">
            <slot></slot>
        </section>
        <header class="flex flex-col gap-3 w-full">
            <h3
                class="text-5xl leading-tight font-bold text-transparent bg-clip-text bg-gradient-to-br from-teal-300 to-blue-300">
                OpenAPI / Swagger
            </h3>
            <p class="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4">
                Elysia 自动生成 OpenAPI 3.0 规范，以与跨多种语言的各种工具集成。
            </p>
            <p class="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4">
                由于符合 OpenAPI 标准，Elysia 可以使用 Swagger 插件在一行中生成 Swagger。
            </p>
        </header>
    </article>
</template>
