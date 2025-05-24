<template>
    <article id="people-tweets" class="fern-gap" ref="scope">
        <motion.h2
            class="sm:text-center text-4xl font-semibold text-gray-700 dark:text-gray-300 leading-[3rem]"
            v-bind="flyIn()"
        >
            <!-- Powered by -->
            <span class="text-gradient from-rose-400 to-orange-400">
                由社区的爱所驱动
            </span>
            <br />
            <!-- <span class="text-gradient from-rose-400 to-amber-400">
                community
            </span> -->
        </motion.h2>
        <section class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-12 pb-8">
            <motion.div
                class="flex flex-col gap-3 lg:mt-12"
                v-bind="flyIn(0.1)"
            >
                <Tweet
                    id="AqueelMiq"
                    user="Aqueel"
                    image="/tweets/aqueel.webp"
                    content="X! 上的面包上的喷气燃料，@shlomiatar 谁构建了框架，对选择正确工具完成工作有独到的眼光。"
                    href="https://x.com/AqueelMiq/status/1822380943279296832"
                />
                <Tweet
                    id="shlomiatar"
                    user="Shlomi Atar"
                    image="/tweets/shlomi.webp"
                    content="感谢 @saltyAom 和强大的 Elysia js，它正在驱动我们的服务器端 UI。"
                    href="https://x.com/shlomiatar/status/1822381556142362734"
                />
                <Tweet
                    id="htmx_org"
                    user="htmx.org"
                    image="/tweets/htmx.webp"
                    content="htmx 在 @bunjavascript、@elysiaJS 和 @tursodatabase 下工作得很好，顺便说一下。"
                    href="https://x.com/htmx_org/status/1792949584769224897"
                />
                <Tweet
                    id="MarcLaventure"
                    user="Marc Laventure"
                    image="/tweets/marc.webp"
                    content="我们自豪地赞助了数十个项目，并且帮助维护仓库，以惊人的速度为开源项目做出贡献。"
                    href="https://x.com/MarcLaventure/status/1773751085792174246"
                />
            </motion.div>
            <motion.div class="flex flex-col gap-3" v-bind="flyIn(0.1)">
                <Tweet
                    id="jarredsumner"
                    user="Jarred Sumner"
                    image="/tweets/jarred.webp"
                    content="你可以使用 Express 与 Bun 一起使用，但通常我们看到人们直接使用 Elysia、Hono 或 Bun.serve()。"
                    href="https://x.com/jarredsumner/status/1781132294692233609"
                />
                <Tweet
                    id="runyasak"
                    user="Runyasak Ch. 💚"
                    image="/tweets/runyasak.webp"
                    content="开始使用 @elysiaJS 创建一个 Discord Bot，发现类型系统非常简单易用。开发体验非常棒，编码也变得很有趣！使用 @DrizzleORM 和 PostgreSQL。比之前使用的要简单得多。ElysiaJS 向我证明了出色的性能和开发体验可以并存。😎"
                    href="https://x.com/runyasak/status/1797618641648968117"
                />
                <Tweet
                    id="hd_nvim"
                    user="Herrington Darkholme"
                    image="/tweets/herrington.webp"
                    content="今天被介绍给了@elysiaJS，看起来相当可靠。现代网络的开端到结束类型安全/保护/交换器都是杀手级特性！（而且它很快）"
                    href="https://x.com/hd_nvim/status/1735182378036027650"
                />
                <Tweet
                    id="scalar"
                    user="scalar.com"
                    image="/tweets/scalar.webp"
                    content="非常兴奋能成为令人惊叹的 @elysiaJS 社区的一员！"
                    href="https://x.com/scalar/status/1744024831014920403"
                />
            </motion.div>
            <motion.div class="flex flex-col gap-3 lg:mt-6" v-bind="flyIn(0.3)">
                <Tweet
                    id="josedonato__"
                    user="José Donato 🦋"
                    image="/tweets/josedonato.webp"
                    content="轻松处理包含约 350k 行的表格。正在努力实现当连接到 @openbb_finance Terminal Pro 时，允许使用 @ag_grid 的服务器端行模型。后端使用 @elysiaJS + @bunjsproject。"
                    href="https://x.com/josedonato__/status/1815706393367703890"
                />
                <Tweet
                    id="pilcrow"
                    user="pilcrowonpaper"
                    image="/tweets/pilcrow.webp"
                    content="恰逢 Bun 1.0 版本发布之际，Lucia 2.5 现在能够开箱即支持 @elysiajs！你也可以直接使用 Bun.serve()。此版本还带来了两个新的 OAuth 提供商，Strava 和 AWS Cognito！"
                    href="https://x.com/pilcrowonpaper/status/1699766618665181308"
                />
                <Tweet
                    id="MikroORM"
                    user="MikroORM"
                    image="/tweets/mikroorm.webp"
                    content="我一直在尝试使用 @bunjavascript 和 @elysiaJS，在发布之前还需要做一些调整，但是下一个版本在与 bun 的 TS 支持检测方面应该会更加原生，例如 CLI 在不安装 ts-node 的情况下也能工作。"
                    href="https://x.com/MikroORM/status/1821993062114967711"
                />
            </motion.div>
        </section>
    </article>
</template>

<script setup lang="ts">
import Tweet from './tweet.vue'

import { ref } from 'vue'
import { useInView, motion } from 'motion-v'
import { useFlyIn } from './animate'

const scope = ref(null)
const isInView = useInView(scope, {
    once: true,
    margin: '0px 0px -35% 0px'
})
const flyIn = useFlyIn(isInView)
</script>

<style>
@reference "../../tailwind.css";

#people-tweets {
    @apply flex flex-col max-w-5xl w-full my-8 mx-auto;
}
</style>
