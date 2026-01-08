import { defineConfig } from 'vitepress'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'

import lightbox from 'vitepress-plugin-lightbox'

import tailwindcss from '@tailwindcss/vite'
import llmstxt from 'vitepress-plugin-llms'
import { analyzer } from 'vite-bundle-analyzer'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { comlink } from 'vite-plugin-comlink'
import { fileURLToPath } from 'url'

const description =
    '适合人体工程学的框架，由 Bun 强化的 TypeScript 框架，具有端到端的类型安全、统一的类型系统和卓越的开发者体验。'

export default defineConfig({
    lang: 'zh-CN',
    title: 'Elysia 中文文档',
	titleTemplate: ':title - Elysia 中文文档',

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
    description,
    ignoreDeadLinks: true,
    lastUpdated: true,
    markdown: {
        theme: {
            light: 'github-light',
            dark: 'github-dark'
        },
        codeTransformers: [
            transformerTwoslash({
                typesCache: createFileSystemTypesCache()
            })
        ],
        languages: [
            'js',
            'ts',
            'javascript',
            'typescript',
            'jsx',
            'tsx',
            'prisma',
            'bash',
            'vue',
            'json',
            'yml'
        ],
        config: (md) => {
            md.use(lightbox, {})
        }
    },
    buildEnd() {
        process.exit(0)
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
				content: 'https://elysia.zhcndoc.com/assets/cover.webp'
            }
        ],
        [
            'meta',
            {
                property: 'og:image:width',
                content: '2560'
            }
        ],
        [
            'meta',
            {
                property: 'og:image:height',
                content: '1440'
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
				content: 'https://elysia.zhcndoc.com/assets/cover.webp'
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
			'script',
			{
				async: '',
				src: 'https://www.zhcndoc.com/js/common.js'
			}
        ],
        [
            'link',
            {
                rel: 'preload',
                as: 'image',
                href: '/assets/elysia_v.webp',
                fetchpriority: 'high'
            }
        ],
        [
            'link',
            {
                rel: 'preload',
                as: 'image',
                href: '/assets/elysia.svg',
                fetchpriority: 'high'
            }
        ],
        [
            'link',
            {
                rel: 'preload',
                as: 'image',
                href: '/assets/shigure-ui-smol.gif',
                fetchpriority: 'low'
            }
        ]
    ],
    vite: {
        // define: {
        //     __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true
        // },
        // build: {
        //     minify: false
        // },
        clearScreen: false,
        server: {
            watch: {
                usePolling: true
            }
        },
        experimental: {
            enableNativePlugin: false
        },
        resolve: {
            alias: [
                {
                    find: /^.*\/VPNavBarSearch\.vue$/,
                    replacement: fileURLToPath(
                        new URL('./theme/navbar-search.vue', import.meta.url)
                    )
                }
            ]
        },
        plugins: [
            nodePolyfills({
                include: ['path', 'crypto']
            }),
            tailwindcss(),
            comlink(),
            process.env.NODE_ENV === 'production'
                ? llmstxt({
                      description: 'Ergonomic Framework for Humans',
                      details: description,
                      ignoreFiles: [
                          'index.md',
                          'table-of-content.md',
                          'blog/*',
                          'public/*'
                      ],
                      domain: 'https://elysiajs.com'
                  })
                : undefined,
            process.env.ANALYZE === 'true' ? analyzer() : undefined
        ],
        worker: {
            plugins: () => [comlink()]
        },
        optimizeDeps: {
            exclude: [
                '@nolebase/vitepress-plugin-inline-link-preview/client',
                '.vitepress/cache',
                '@rollup/browser'
            ]
        },
        ssr: {
            noExternal: [
                '@nolebase/vitepress-plugin-inline-link-preview',
                '@nolebase/ui'
            ]
        }
    },
    themeConfig: {
        search: {
            provider: 'local',
            options: {
				detailedView: true,
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
                text: '文档',
                link: '/table-of-content'
            },
            {
                text: '博客',
                link: '/blog'
            },
            {
                text: 'Illust',
                link: '/illust'
            }
        ],
        sidebar: [
            {
				text: '入门',
                collapsed: true,
                items: [
                    {
						text: '概览',
                        link: '/at-glance'
                    },
                    {
						text: '快速开始',
                        link: '/quick-start'
                    },
                    {
                        text: '目录',
                        link: '/table-of-content'
                    },
                    {
						text: '关键概念',
                        link: '/key-concept'
                    }
                ]
            },
            {
				text: '基础',
                collapsed: true,
                items: [
                    {
						text: '路由',
                        link: '/essential/route'
                    },
                    {
						text: '处理程序',
                        link: '/essential/handler'
                    },
                    {
                        text: '插件',
                        link: '/essential/plugin'
                    },
                    {
                        text: '生命周期',
                        link: '/essential/life-cycle'
                    },
                    {
                        text: '验证',
                        link: '/essential/validation'
                    },
                    {
						text: '最佳实践',
                        link: '/essential/best-practice'
                    }
                ]
            },
            {
				text: '模式',
                collapsed: true,
                items: [
                    {
						text: '配置',
                        link: '/patterns/configuration'
                    },
                    {
                        text: 'Cookie',
                        link: '/patterns/cookie'
                    },
                    {
                        text: '生产环境部署',
                        link: '/patterns/deploy'
                    },
                    {
                        text: '错误处理',
                        link: '/patterns/error-handling'
                    },
                    {
                        text: '扩展上下文',
                        link: '/patterns/extends-context'
                    },
                    {
                        text: 'Fullstack Dev Server',
                        link: '/patterns/fullstack-dev-server'
                    },
                    {
                        text: 'Macro',
                        link: '/patterns/macro'
                    },
                    {
						text: '挂载',
                        link: '/patterns/mount'
                    },
                    {
                        text: 'OpenAPI',
                        link: '/patterns/openapi'
                    },
                    {
                        text: 'OpenTelemetry',
                        link: '/patterns/opentelemetry'
                    },
                    {
                        text: 'Trace',
                        link: '/patterns/trace'
                    },
                    {
                        text: 'TypeBox (Elysia.t)',
                        link: '/patterns/typebox'
                    },
                    {
                        text: 'TypeScript',
                        link: '/patterns/typescript'
                    },
                    {
						text: '单元测试',
                        link: '/patterns/unit-test'
                    },
                    {
                        text: 'WebSocket',
                        link: '/patterns/websocket'
                    }
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
						text: 'Eden 协议',
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
                                text: 'WebSocket',
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
								text: '旧版（协议 1）',
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
						text: '概述',
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
                        text: 'OpenAPI',
                        link: '/plugins/openapi'
                    },
                    {
                        text: 'OpenTelemetry',
                        link: '/plugins/opentelemetry'
                    },
                    {
						text: '服务器计时',
                        link: '/plugins/server-timing'
                    },
                    {
						text: '静态',
                        link: '/plugins/static'
                    }
                ]
            },
            {
                text: 'Comparison',
                collapsed: true,
                items: [
                    {
                        text: 'Express',
                        link: '/migrate/from-express'
                    },
                    {
                        text: 'Fastify',
                        link: '/migrate/from-fastify'
                    },
                    {
                        text: 'Hono',
                        link: '/migrate/from-hono'
                    },
                    {
                        text: 'tRPC',
                        link: '/migrate/from-trpc'
                    }
                ]
            },
            {
                text: 'Integration',
                collapsed: true,
                items: [
                    {
                        text: 'AI SDK',
                        link: '/integrations/ai-sdk'
                    },
                    {
                        text: 'Astro',
                        link: '/integrations/astro'
                    },
                    {
                        text: 'Better Auth',
                        link: '/integrations/better-auth'
                    },
                    {
                        text: 'Cloudflare Worker',
                        link: '/integrations/cloudflare-worker'
                    },
                    {
                        text: 'Deno',
                        link: '/integrations/deno'
                    },
                    {
                        text: 'Drizzle',
                        link: '/integrations/drizzle'
                    },
                    {
                        text: 'Expo',
                        link: '/integrations/expo'
                    },
                    {
                        text: 'Netlify',
                        link: '/integrations/netlify'
                    },
                    {
                        text: 'Nextjs',
                        link: '/integrations/nextjs'
                    },
                    {
                        text: 'Node.js',
                        link: '/integrations/node'
                    },
                    {
                        text: 'Nuxt',
                        link: '/integrations/nuxt'
                    },
                    {
                        text: 'Prisma',
                        link: '/integrations/prisma'
                    },
                    {
                        text: 'React Email',
                        link: '/integrations/react-email'
                    },
                    {
                        text: 'SvelteKit',
                        link: '/integrations/sveltekit'
                    },
                    {
                        text: 'Tanstack Start',
                        link: '/integrations/tanstack-start'
                    },
                    {
                        text: 'Vercel',
                        link: '/integrations/vercel'
                    }
                ]
            }
        ],
        outline: {
            level: [2, 3],
            label: '目录'
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/elysiajs/elysia' },
            { icon: 'twitter', link: 'https://twitter.com/elysiajs' },
            { icon: 'discord', link: 'https://discord.gg/eaFJ2KDJck' }
        ],
        editLink: {
			text: '在 GitHub 上编辑此页面',
            pattern:
				'https://github.com/zhcndoc/elysia/tree/main/docs/:path'
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
