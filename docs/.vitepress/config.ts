import { defineConfig } from 'vitepress'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'

const description =
    '适合人体工程学的框架，由 Bun 提供支持的 TypeScript 框架，具有端到端类型安全、统一的类型系统和出色的开发人员体验。'

export default defineConfig({
    lang: 'zh-Hans',
    title: 'Elysia 中文文档',
    titleTemplate: ':title - Elysia 中文文档',
    // description,
    ignoreDeadLinks: true,
    lastUpdated: true,
    markdown: {
        theme: {
            light: 'github-light',
            dark: 'github-dark'
        },
        codeTransformers: [transformerTwoslash()]
    },
    // ![INFO] uncomment for support hot reload on WSL - https://github.com/vitejs/vite/issues/1153#issuecomment-785467271
    vite: {
        server: {
            watch: {
                usePolling: true
            }
        }
    },

    sitemap: {
        hostname: 'https://elysia.zhcndoc.com'
    },

    locales: {
        root: {
            label: '简体中文',
            lang: 'zh'
        },
        en: {
            label: 'English',
            lang: 'en',
            link: 'https://elysiajs.com/'
        }
    },

    head: [
        ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
        [
            'link',
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
                crossorigin: ''
            }
        ],
        [
            'link',
            {
                href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
                rel: 'stylesheet'
            }
        ],
        [
            'meta',
            {
                name: 'viewport',
                content: 'width=device-width,initial-scale=1,user-scalable=no'
            }
        ],
        [
            'link',
            {
                rel: 'icon',
                href: '/assets/elysia.png'
            }
        ],
        [
            'meta',
            {
                property: 'og:image',
                content: 'https://elysiajs.com/assets/cover.jpg'
            }
        ],
        [
            'meta',
            {
                property: 'og:image:width',
                content: '1920'
            }
        ],
        [
            'meta',
            {
                property: 'og:image:height',
                content: '1080'
            }
        ],
        [
            'meta',
            {
                property: 'twitter:card',
                content: 'summary_large_image'
            }
        ],
        [
            'meta',
            {
                property: 'twitter:image',
                content: 'https://elysiajs.com/assets/cover.jpg'
            }
        ],
        [
            'meta',
            {
                property: 'og:title',
                content: 'ElysiaJS'
            }
        ],
        [
            'meta',
            {
                property: 'og:description',
                content: description
            }
        ]
    ],
    themeConfig: {
        search: {
            provider: 'algolia',
            options: {
                appId: 'RML70T85IJ',
                apiKey: 'dd33b18207d400c7f571e7104ef9c028',
                indexName: 'elysia',
                locales: {
                    root: {
                        placeholder: '搜索文档',
                        translations: {
                            button: {
                                buttonText: '搜索文档',
                                buttonAriaLabel: '搜索文档'
                            },
                            modal: {
                                searchBox: {
                                    resetButtonTitle: '清除查询条件',
                                    resetButtonAriaLabel: '清除查询条件',
                                    cancelButtonText: '取消',
                                    cancelButtonAriaLabel: '取消'
                                },
                                startScreen: {
                                    recentSearchesTitle: '搜索历史',
                                    noRecentSearchesText: '没有搜索历史',
                                    saveRecentSearchButtonTitle:
                                        '保存至搜索历史',
                                    removeRecentSearchButtonTitle:
                                        '从搜索历史中移除',
                                    favoriteSearchesTitle: '收藏',
                                    removeFavoriteSearchButtonTitle:
                                        '从收藏中移除'
                                },
                                errorScreen: {
                                    titleText: '无法获取结果',
                                    helpText: '你可能需要检查你的网络连接'
                                },
                                footer: {
                                    selectText: '选择',
                                    navigateText: '切换',
                                    closeText: '关闭',
                                    searchByText: '搜索提供者'
                                },
                                noResultsScreen: {
                                    noResultsText: '无法找到相关结果',
                                    suggestedQueryText: '你可以尝试查询',
                                    reportMissingResultsText:
                                        '你认为该查询应该有结果？',
                                    reportMissingResultsLinkText: '点击反馈'
                                }
                            }
                        }
                    }
                }
            }
        },
        logo: '/assets/elysia.svg',
        nav: [
            {
                text: '快速入门',
                link: '/quick-start'
            },
            {
                text: '插件',
                link: '/plugins/overview'
            },
            {
                text: '博客',
                link: '/blog'
            }
        ],
        sidebar: [
            {
                text: '👋 入门',
                collapsed: true,
                items: [
                    {
                        text: '简介',
                        link: '/at-glance'
                    },
                    {
                        text: '快速开始',
                        link: '/quick-start'
                    },
                    {
                        text: '内容纲要',
                        link: '/table-of-content'
                    }
                ]
            },
            {
                text: '✨ 基础',
                collapsed: true,
                items: [
                    {
                        text: 'Route',
                        link: '/essential/route'
                    },
                    {
                        text: 'Path',
                        link: '/essential/path'
                    },
                    {
                        text: 'Handler',
                        link: '/essential/handler'
                    },
                    {
                        text: 'Context',
                        link: '/essential/context'
                    },
                    {
                        text: '生命周期',
                        link: '/essential/life-cycle'
                    },
                    {
                        text: 'Schema',
                        link: '/essential/schema'
                    },
                    {
                        text: '插件',
                        link: '/essential/plugin'
                    },
                    {
                        text: '作用域',
                        link: '/essential/scope'
                    }
                ]
            },
            {
                text: '🔎 校验',
                collapsed: true,
                items: [
                    {
                        text: '概述',
                        link: '/validation/overview'
                    },
                    {
                        text: '模式类型',
                        link: '/validation/schema-type'
                    },
                    {
                        text: '原始类型',
                        link: '/validation/primitive-type'
                    },
                    {
                        text: 'Elysia 类型',
                        link: '/validation/elysia-type'
                    },
                    {
                        text: '错误提供程序',
                        link: '/validation/error-provider'
                    },
                    {
                        text: '参考模型',
                        link: '/validation/reference-model'
                    }
                ]
            },
            {
                text: '⏳ 生命周期',
                collapsed: true,
                items: [
                    {
                        text: '概览',
                        link: '/life-cycle/overview'
                    },
                    {
                        text: 'On Request',
                        link: '/life-cycle/request'
                    },
                    {
                        text: 'Parse',
                        link: '/life-cycle/parse'
                    },
                    {
                        text: 'Transform',
                        link: '/life-cycle/transform'
                    },
                    {
                        text: 'Before Handle',
                        link: '/life-cycle/before-handle'
                    },
                    {
                        text: 'After Handle',
                        link: '/life-cycle/after-handle'
                    },
                    {
                        text: 'Map Response',
                        link: '/life-cycle/map-response'
                    },
                    {
                        text: 'On Error',
                        link: '/life-cycle/on-error'
                    },
                    {
                        text: 'On Response',
                        link: '/life-cycle/on-response'
                    },
                    {
                        text: 'Trace',
                        link: '/life-cycle/trace'
                    }
                ]
            },
            {
                text: '🧭 模式',
                collapsed: true,
                items: [
                    {
                        text: '分组路由',
                        link: '/patterns/group'
                    },
                    {
                        text: 'Cookie',
                        link: '/patterns/cookie'
                    },
                    {
                        text: 'Cookie 签名',
                        link: '/patterns/cookie-signature'
                    },
                    {
                        text: 'Web Socket',
                        link: '/patterns/websocket'
                    },
                    {
                        text: '文档',
                        link: '/patterns/documentation'
                    },
                    {
                        text: '单元测试',
                        link: '/patterns/unit-test'
                    },
                    {
                        text: '挂载',
                        link: '/patterns/mount'
                    },
                    {
                        text: '延迟加载模块',
                        link: '/patterns/lazy-loading-module'
                    },
                    {
                        text: '宏',
                        link: '/patterns/macro'
                    },
                    {
                        text: 'MVC 模式',
                        link: '/patterns/mvc'
                    }
                ]
            },
            {
                text: '🪴 Eden',
                collapsed: true,
                items: [
                    {
                        text: '概述',
                        link: '/eden/overview.md'
                    },
                    {
                        text: '安装',
                        link: '/eden/installation.md'
                    },
                    {
                        text: 'Eden Treaty',
                        collapsed: false,
                        items: [
                            {
                                text: '概述',
                                link: '/eden/treaty/overview'
                            },
                            {
                                text: '参数',
                                link: '/eden/treaty/parameters'
                            },
                            {
                                text: '响应',
                                link: '/eden/treaty/response'
                            },
                            {
                                text: 'Web Socket',
                                link: '/eden/treaty/websocket'
                            },
                            {
                                text: '配置',
                                link: '/eden/treaty/config'
                            },
                            {
                                text: '单元测试',
                                link: '/eden/treaty/unit-test'
                            },
                            {
                                text: 'Legacy (Treaty 1)',
                                link: '/eden/treaty/legacy.md'
                            }
                        ]
                    },
                    {
                        text: 'Eden Fetch',
                        link: '/eden/fetch.md'
                    }
                ]
            },
            {
                text: '🔌 插件',
                link: '/plugins/overview',
                collapsed: true,
                items: [
                    {
                        text: 'Bearer',
                        link: '/plugins/bearer'
                    },
                    {
                        text: 'CORS',
                        link: '/plugins/cors'
                    },
                    {
                        text: 'Cron',
                        link: '/plugins/cron'
                    },
                    {
                        text: 'GraphQL Apollo',
                        link: '/plugins/graphql-apollo'
                    },
                    {
                        text: 'GraphQL Yoga',
                        link: '/plugins/graphql-yoga'
                    },
                    {
                        text: 'HTML',
                        link: '/plugins/html'
                    },
                    {
                        text: 'JWT',
                        link: '/plugins/jwt'
                    },
                    {
                        text: 'Server Timing',
                        link: '/plugins/server-timing'
                    },
                    {
                        text: 'Static',
                        link: '/plugins/static'
                    },
                    {
                        text: 'Stream',
                        link: '/plugins/stream'
                    },
                    {
                        text: 'Swagger',
                        link: '/plugins/swagger'
                    },
                    {
                        text: 'trpc',
                        link: '/plugins/trpc'
                    }
                ]
            },
            {
                text: '📦 集成',
                collapsed: true,
                items: [
                    {
                        text: 'Docker',
                        link: '/integrations/docker'
                    },
                    {
                        text: 'Nextjs',
                        link: '/integrations/nextjs'
                    },
                    {
                        text: 'Expo',
                        link: '/integrations/expo'
                    },
                    {
                        text: 'Astro',
                        link: '/integrations/astro'
                    },
                    {
                        text: 'SvelteKit',
                        link: '/integrations/sveltekit'
                    },
                    {
                        text: 'Drizzle',
                        link: '/integrations/drizzle'
                    }
                    // {
                    //     text: 'Cheat Sheet',
                    //     link: '/integrations/cheat-sheet'
                    // }
                ]
            }
        ],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/elysiajs/elysia' },
            { icon: 'twitter', link: 'https://twitter.com/elysiajs' },
            { icon: 'discord', link: 'https://discord.gg/eaFJ2KDJck' }
        ],
        editLink: {
            text: '在 GitHub 上编辑此页面',
            pattern:
                'https://github.com/ikxin/elysia/edit/main/docs/:path'
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        outline: {
            label: '页面导航'
        },

        lastUpdated: {
            text: '最后更新于',
            formatOptions: {
                dateStyle: 'short',
                timeStyle: 'medium'
            }
        },
        langMenuLabel: '多语言',
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式'
    }
})
