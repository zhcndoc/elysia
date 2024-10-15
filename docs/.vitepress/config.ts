import { defineConfig } from 'vitepress'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'

const description =
    '适合人体工程学的框架，由 Bun 提供支持的 TypeScript 框架，具有端到端类型安全、统一的类型系统和出色的开发人员体验。'

export default defineConfig({
    lang: 'zh-CN',
    title: 'Elysia 中文文档',
    titleTemplate: ':title - Elysia 中文文档',
    description,
    ignoreDeadLinks: true,
    lastUpdated: true,
    markdown: {
        theme: {
            light: 'github-light',
            dark: 'github-dark'
        },
        codeTransformers: [transformerTwoslash()]
    },
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
                content: 'https://elysia.zhcndoc.com/assets/cover.jpg'
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
                content: 'https://elysia.zhcndoc.com/assets/cover.jpg'
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
        ],
        [
            'meta',
            {
                name: 'baidu-site-verification',
                content: 'codeva-u9Z5ZSJCBu'
            }
        ],
        [
            'script',
            {
                defer: '',
                src: 'https://analytics.ikxin.com/script.js',
                'data-website-id': 'f0e90b0d-e086-4fdc-b173-de4857b71900'
            }
        ],
        [
            'script',
            {
                async: '',
                src: 'https://www.googletagmanager.com/gtag/js?id=G-HYH4TH7PWM'
            }
        ],
        [
            'script',
            {},
            `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HYH4TH7PWM');`
        ]
    ],
    themeConfig: {
        search: {
            provider: 'local',
            options: {
                locales: {
                    root: {
                        translations: {
                            button: {
                                buttonText: '搜索文档',
                                buttonAriaLabel: '搜索文档'
                            },
                            modal: {
                                noResultsText: '无法找到相关结果',
                                resetButtonTitle: '清除查询条件',
                                footer: {
                                    selectText: '选择',
                                    navigateText: '切换'
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
                text: '速查表',
                link: '/integrations/cheat-sheet'
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
                text: '入门',
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
                        text: 'Tutorial',
                        link: '/tutorial'
                    },
                    {
                        text: 'Table of Content',
                        link: '/table-of-content'
                    }
                ]
            },
            {
                text: '基础',
                collapsed: true,
                items: [
                    {
                        text: 'Structure',
                        link: '/essential/structure'
                    },
                    {
                        text: 'Route',
                        link: '/essential/route'
                    },
                    {
                        text: 'Handler',
                        link: '/essential/handler'
                    },
                    {
                        text: 'Life Cycle',
                        link: '/essential/life-cycle'
                    },
                    {
                        text: 'Validation',
                        link: '/essential/validation'
                    },
                    {
                        text: '插件',
                        link: '/essential/plugin'
                    }
                ]
            },
            {
                text: '模式',
                collapsed: true,
                items: [
                    {
                        text: 'Configuration',
                        link: '/patterns/configuration'
                    },
                    {
                        text: 'Cookie',
                        link: '/patterns/cookie'
                    },
                    {
                        text: 'Web Socket',
                        link: '/patterns/websocket'
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
                        text: 'Trace',
                        link: '/patterns/trace'
                    }
                ]
            },
            {
                text: 'Recipe',
                collapsed: true,
                items: [
                    {
                        text: 'OpenAPI',
                        link: '/recipe/openapi'
                    },
                    {
                        text: 'Opentelemetry',
                        link: '/recipe/opentelemetry'
                    },
                    {
                        text: 'Drizzle',
                        link: '/recipe/drizzle'
                    },
                    {
                        text: 'React Email',
                        link: '/recipe/react-email'
                    },
                ]
            },
            {
                text: 'Eden',
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
                text: '插件',
                collapsed: true,
                items: [
                    {
                        text: 'Overview',
                        link: '/plugins/overview'
                    },
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
                        text: 'OpenTelemetry',
                        link: '/plugins/opentelemetry'
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
                text: '集成',
                collapsed: true,
                items: [
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
                    }
                ]
            }
        ],
        outline: {
            level: [2, 3],
            label: '页面导航'
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/zhcndoc/elysia' }
        ],
        editLink: {
            text: '在 GitHub 上编辑此页面',
            pattern: 'https://github.com/zhcndoc/elysia/tree/main/docs/:path'
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
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
