<template>
    <section id="beyond" class="fern-gap" ref="scope">
        <article id="opentelemetry">
            <motion.section @mousemove="move" v-bind="flyIn()">
                <div
                    class="pointer"
                    style="width: 1.5px; height: 100%; top: 0%"
                    :style="{ left: `${left}%` }"
                >
                    <p
                        class="absolute top-14 pl-2 text-sm font-semibold font-mono text-sky-500"
                        :style="{ left: left > 80 ? '-4rem' : '0' }"
                    >
                        {{ (left / 4).toFixed(2) }}ms
                    </p>
                </div>
                <p
                    class="absolute z-10 top-2 right-2 text-xs border dark:border-gray-600 px-2 py-1 rounded-full bg-gray-50/40 dark:bg-gray-700/40 backdrop-blur-sm pointer-events-none"
                >
                    POST /character/:id/chat
                </p>
                <p
                    class="absolute z-10 bottom-2 left-2 text-xs px-2 py-1 rounded-full bg-blue-500 text-white font-semibold backdrop-blur-sm pointer-events-none"
                >
                    Playback
                </p>
                <div style="width: 4rem" class="bg-teal-400 text-teal-400">
                    <span>Request</span>
                </div>
                <div
                    style="width: 4rem; margin-left: 4rem"
                    class="bg-teal-400 text-teal-400"
                >
                    <span>Validation</span>
                </div>
                <div
                    style="width: 2rem; margin-left: 6rem"
                    class="bg-teal-400"
                />
                <div
                    style="width: 2rem; margin-left: 8rem"
                    class="bg-cyan-400"
                />
                <div
                    style="width: 5rem; margin-left: 10rem"
                    class="bg-sky-400 text-sky-400"
                >
                    <span>Transaction</span>
                </div>
                <div
                    style="width: 3rem; margin-left: 12rem"
                    class="bg-sky-400"
                />
                <div
                    style="width: 5rem; margin-left: 15rem"
                    class="bg-blue-400 text-blue-400"
                >
                    <span>Upload</span>
                </div>
                <div
                    style="width: 3rem; margin-left: 17rem"
                    class="bg-blue-400"
                />
                <div
                    style="width: 4rem; margin-left: 20rem"
                    class="bg-indigo-400 text-indigo-400"
                >
                    <span>Sync</span>
                </div>
                <div
                    style="width: 4rem; margin-left: 24rem"
                    class="bg-indigo-400"
                />
                <div
                    style="width: 2rem; margin-left: 26rem"
                    class="bg-indigo-400"
                />
                <div
                    style="width: 1rem; margin-left: 27rem"
                    class="bg-purple-400"
                />
            </motion.section>
            <header>
                <motion.h5 v-bind="flyIn(0.1)">
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
                        class="transform scale-90"
                    >
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        />
                    </svg>
                    对于 DevOps
                </motion.h5>
                <motion.h2 class="text-gradient from-sky-400 to-violet-400" v-bind="flyIn(0.2)">
                    OpenTelemetry
                </motion.h2>
                <motion.p v-bind="flyIn(0.3)">
                    Elysia 原生支持 OpenTelemetry。监控功能内置，因此您可以轻松监控您的服务，无论平台如何。
                </motion.p>
            </header>
        </article>
        <article id="e2e-type-safety">
            <motion.section v-bind="flyIn(0.2)">
                <slot />
            </motion.section>
            <header>
                <motion.h5 v-bind="flyIn(0.3)">
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
                        class="transform scale-90"
                    >
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        />
                    </svg>
                    对于前端
                </motion.h5>
                <motion.h2 class="text-gradient from-purple-400 to-rose-400"  v-bind="flyIn(0.4)">
                    端到端类型安全
                </motion.h2>
                <motion.p  v-bind="flyIn(0.5)">
                    像 tRPC 一样，Elysia 提供从后端到前端的类型安全，而无需代码生成。前端和后端之间的交互在编译时和运行时都经过类型检查。
                </motion.p>
            </header>
        </article>
    </section>
</template>

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

const left = ref(47.5)

function move(event: MouseEvent) {
    const element = event.srcElement as HTMLElement
    const rect = element.getBoundingClientRect()
    const mouseX = event.clientX - rect.left

    const _left = (mouseX / rect.width) * 100

    left.value = _left
}
</script>

<style>
@reference "../../tailwind.css";

#beyond {
    @apply flex flex-col md:flex-row justify-between items-start w-full max-w-5xl mx-auto my-8 gap-8 sm:gap-2;

    & > article {
        @apply flex flex-col w-full sm:p-2 rounded-2xl overflow-hidden;

        & > header {
            @apply flex flex-col w-full dark:font-medium;

            & > h2 {
                @apply text-3xl font-semibold mb-4 font-sans;
            }

            & > p {
                @apply leading-relaxed;
            }

            & > h5 {
                @apply flex items-center text-sm font-semibold text-gray-400 mt-5 mb-2 gap-0.5;

                & > svg {
                    transform: scale(0.6);
                }
            }
        }

        & > section {
            @apply max-w-full w-full h-full;
            aspect-ratio: 16 / 9;
        }
    }
}

#opentelemetry {
    & > section {
        @apply relative flex flex-col pl-4 justify-center gap-1.5 bg-gray-50 dark:bg-gray-800 rounded-3xl border dark:border-gray-700 overflow-hidden;

        background-image: linear-gradient(to right, #ddd 1px, transparent 1px);
        background-size: 6rem 6em;
        background-position: 2rem;

        html.dark & {
            background-image: linear-gradient(
                to right,
                #646464 1px,
                transparent 1px
            );
        }

        & > .pointer {
            @apply absolute top-0 flex flex-col bg-sky-400 justify-center gap-1.5;
            will-move: left;
            /* transition: left 0.1s cubic-bezier(0.16, 1, 0.3, 1); */
        }

        & > div {
            @apply relative h-3.5 rounded-xl hover:bg-blue-500 shadow transition-colors pointer-events-none;

            & > span {
                @apply absolute text-xs -translate-y-0.5 font-mono font-semibold;
                left: calc(100% + 0.25rem);
            }
        }
    }
}

#e2e-type-safety {
    & > section {
        @apply rounded-xl border border-y-violet-200 border-x-blue-200 dark:border-y-violet-500/20 dark:border-x-blue-500/20 overflow-hidden bg-white dark:bg-gray-800;

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
                    closest-side at center,
                    var(--color-gray-800) 90%,
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

        & > div {
            @apply !bg-transparent rounded-xl;

            & > pre {
                @apply !p-3 lg:!p-4;
            }
        }
    }
}
</style>
