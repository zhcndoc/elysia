<template>
    <article class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-12 w-full max-w-6xl">
        <section class="w-full !text-base !font-mono rounded-xl">
            <slot></slot>
        </section>
        <header class="flex flex-col gap-3 w-full">
            <h3
                class="text-5xl leading-tight font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-300 to-sky-300">
                仅需要值
            </h3>
            <p class="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4">
                不需要额外的方法，仅需返回值即可将数据发回客户端。
            </p>
            <p class="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4">
                无论是普通字符串还是复杂的 JSON 数据，只需返回这个值，Elysia 将会处理其余部分。
            </p>
        </header>
    </article>
</template>
