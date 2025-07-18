<script setup lang="ts">
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

<template>
    <article id="features" class="fern-gap" ref="scope">
        <div
            class="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 w-full mb-6 sm:mb-12"
        >
            <motion.h2
                class="text-5xl sm:text-6xl text-left text-gray-700 dark:text-gray-300 font-medium leading-[3.5rem] sm:leading-[4.5rem]"
                v-bind="flyIn()"
            >
                <span
                    class="text-gray-500 dark:text-gray-400 font-medium text-xl"
                >
                    总结一下
                </span>
                <br />
                提供
                <span
                    class="text-gradient font-semibold from-purple-500 to-sky-400"
                >
                    最好的
                </span>
                <br />
                给予勇敢的人
            </motion.h2>
            <p
                class="w-full sm:w-1/2 lg:max-w-lg lg:w-full lg:pr-24 dark:text-gray-400 dark:font-medium"
                v-bind="flyIn(0.1)"
            >
                <motion.span class="inline-block mb-2" v-bind="flyIn(0.2)">
                    对于建设者、发明家和有远见的人来说
                </motion.span>
                <br />
                <motion.span class="inline-block" v-bind="flyIn(0.3)">
                    我们花费了数年时间研究 JavaScript 框架的优点和缺点，所有这一切都是为了提供一次非凡的体验。
                </motion.span>
            </p>
        </div>
        <div class="list">
            <motion.section v-bind="flyIn(0.2)">
                <h3>光速</h3>
                <h4 class="text-purple-400">比 Express 快 21 倍。</h4>
                <p>由 Bun 超级加速，</p>
                <p>Elysia 是表现最佳的 JavaScript 框架之一。</p>
            </motion.section>
            <motion.section v-bind="flyIn(0.3)">
                <h3>安全</h3>
                <h4 class="text-blue-400">动态的类型安全</h4>
                <p>从类型到运行时构建</p>
                <p>
                    Elysia 学习你的代码库，适应，用你的类型强制执行
                </p>
            </motion.section>
            <motion.section v-bind="flyIn(0.4)">
                <h3>生产</h3>
                <h4 class="text-teal-400">今天最好的体验</h4>
                <p>
                    人体工程学设计，以开发者体验为优先。没有任何技术废话。
                </p>
            </motion.section>
        </div>
        <motion.h5
            class="text-right text-base mt-6 text-gray-400/75"
            v-bind="flyIn(0.5)"
        >
            这些是我们建立 Elysia 的基础，<br />
            为了提供最好的体验。
        </motion.h5>
    </article>
</template>

<style>
@reference "../../tailwind.css";

#features {
    @apply relative max-w-5xl w-full mx-auto mt-4 mb-12;

    & > .list {
        @apply grid sm:grid-cols-2 lg:grid-cols-3 gap-4 z-10;

        & > section {
            @apply relative flex flex-col w-full rounded-3xl p-6 border border-r-blue-100 border-b-purple-100 border-t-purple-200 border-l-blue-200 dark:border-r-blue-300/40 dark:border-b-purple-300/40 dark:border-t-purple-400/50 dark:border-l-blue-400/40 transform hover:-translate-y-2 transition-all ease-out duration-200 dark:text-gray-400;
            box-shadow: 0 7px 40px rgba(48, 160, 255, 0.075);

            &:hover {
                box-shadow: 0 12px 55px rgba(223, 160, 255, 0.2);
            }

            html.dark & {
                box-shadow: 0 7px 40px rgba(48, 160, 255, 0.15);

                &:hover {
                    box-shadow: 0 12px 55px rgba(223, 160, 255, 0.25);
                }
            }

            & > h3 {
                @apply text-2xl font-medium text-gray-700 dark:text-gray-300;
            }

            & > h4 {
                @apply inline-block text-base font-medium mt-0.5 mb-3 dark:text-gray-400/90;
            }

            &:nth-child(1) {
                @apply bg-white dark:bg-gray-900;
                background-image: radial-gradient(
                        closest-side at center,
                        rgba(255, 255, 255, 1) 70%,
                        transparent 150%
                    ),
                    radial-gradient(
                        closest-side at center,
                        rgba(255, 255, 255, 1) 90%,
                        transparent 150%
                    ),
                    radial-gradient(
                        at 9% 67%,
                        hsla(223, 100%, 65%, 0.14) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 22% 0%,
                        hsla(210, 100%, 69%, 0.29) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 97% 49%,
                        hsla(240, 100%, 87%, 0.35) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 100% 75%,
                        hsla(280, 100%, 75%, 0.26) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 75% 100%,
                        hsla(22, 100%, 77%, 0.19) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 40% 100%,
                        hsla(240, 100%, 70%, 0.15) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 72% 0%,
                        hsla(343, 100%, 76%, 0.17) 0px,
                        transparent 50%
                    );

                html.dark & {
                    background-image: radial-gradient(
                            closest-side at center,
                            var(--color-gray-800) 70%,
                            transparent 150%
                        ),
                        radial-gradient(
                            at 9% 67%,
                            hsla(223, 100%, 65%, 0.14) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 22% 0%,
                            hsla(210, 100%, 69%, 0.29) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 97% 49%,
                            hsla(240, 100%, 87%, 0.35) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 100% 75%,
                            hsla(280, 100%, 75%, 0.26) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 75% 100%,
                            hsla(22, 100%, 77%, 0.19) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 40% 100%,
                            hsla(240, 100%, 70%, 0.15) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 72% 0%,
                            hsla(343, 100%, 76%, 0.17) 0px,
                            transparent 50%
                        );
                }
            }

            &:nth-child(2) {
                @apply bg-white dark:bg-gray-900;
                background-image: radial-gradient(
                        closest-side at center,
                        rgba(255, 255, 255, 1) 70%,
                        transparent 150%
                    ),
                    radial-gradient(
                        closest-side at center,
                        rgba(255, 255, 255, 1) 90%,
                        transparent 150%
                    ),
                    radial-gradient(
                        at 7% 95%,
                        hsla(223, 100%, 65%, 0.14) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 89% 10%,
                        hsla(210, 100%, 69%, 0.29) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 30% 0%,
                        hsla(240, 100%, 87%, 0.35) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 100% 54%,
                        hsla(280, 100%, 75%, 0.26) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 61% 0%,
                        hsla(22, 100%, 77%, 0.19) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 2% 48%,
                        hsla(240, 100%, 70%, 0.15) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 80% 100%,
                        hsla(343, 100%, 76%, 0.17) 0px,
                        transparent 50%
                    );

                html.dark & {
                    background-image: radial-gradient(
                            closest-side at center,
                            var(--color-gray-800) 70%,
                            transparent 150%
                        ),
                        radial-gradient(
                            at 7% 95%,
                            hsla(223, 100%, 65%, 0.14) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 89% 10%,
                            hsla(210, 100%, 69%, 0.29) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 30% 0%,
                            hsla(240, 100%, 87%, 0.35) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 100% 54%,
                            hsla(280, 100%, 75%, 0.26) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 61% 0%,
                            hsla(22, 100%, 77%, 0.19) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 2% 48%,
                            hsla(240, 100%, 70%, 0.15) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 80% 100%,
                            hsla(343, 100%, 76%, 0.17) 0px,
                            transparent 50%
                        );
                }
            }

            &:nth-child(3) {
                @apply bg-white dark:bg-gray-900;
                background-image: radial-gradient(
                        closest-side at center,
                        rgba(255, 255, 255, 0.8) 70%,
                        transparent 150%
                    ),
                    radial-gradient(
                        closest-side at center,
                        rgba(255, 255, 255, 0.8) 90%,
                        transparent 150%
                    ),
                    radial-gradient(
                        at 29% 66%,
                        hsla(223, 100%, 65%, 0.14) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 47% 51%,
                        hsla(210, 100%, 69%, 0.29) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 34% 34%,
                        hsla(240, 100%, 87%, 0.35) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 74% 32%,
                        hsla(280, 100%, 75%, 0.26) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 57% 66%,
                        hsla(22, 100%, 77%, 0.19) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 42% 84%,
                        hsla(240, 100%, 70%, 0.15) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 59% 10%,
                        hsla(343, 100%, 76%, 0.17) 0px,
                        transparent 50%
                    );

                html.dark & {
                    background-image: radial-gradient(
                            closest-side at center,
                            var(--color-gray-800) 50%,
                            transparent 120%
                        ),
                        radial-gradient(
                            at 29% 66%,
                            hsla(223, 100%, 65%, 0.14) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 47% 51%,
                            hsla(210, 100%, 69%, 0.29) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 34% 34%,
                            hsla(240, 100%, 87%, 0.35) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 74% 32%,
                            hsla(280, 100%, 75%, 0.26) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 57% 66%,
                            hsla(22, 100%, 77%, 0.19) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 42% 84%,
                            hsla(240, 100%, 70%, 0.15) 0px,
                            transparent 50%
                        ),
                        radial-gradient(
                            at 59% 10%,
                            hsla(343, 100%, 76%, 0.17) 0px,
                            transparent 50%
                        );
                }
            }
        }
    }
}
</style>
