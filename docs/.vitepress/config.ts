import { defineConfig } from 'vitepress'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'

import tailwindcss from '@tailwindcss/vite'

import llmstxt from 'vitepress-plugin-llms'

// import { UnlazyImages } from '@nolebase/markdown-it-unlazy-img'
import {
	GitChangelog,
	GitChangelogMarkdownSection
} from '@nolebase/vitepress-plugin-git-changelog/vite'
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'
// import { ThumbnailHashImages } from '@nolebase/vitepress-plugin-thumbnail-hash/vite'

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
	// description,
	ignoreDeadLinks: true,
	lastUpdated: true,
	markdown: {
		theme: {
			light: 'github-light',
			dark: 'github-dark'
		},
		codeTransformers: [
			transformerTwoslash({
				typesCache: createFileSystemTypesCache({
					dir: './docs/.vitepress/cache/twoslash'
				})
			})
		],
		config: (md) => {
			md.use(InlineLinkPreviewElementTransform)
			// md.use(UnlazyImages(), {
			// 	imgElementTag: 'NolebaseUnlazyImg'
			// })
		}
	},
	// vue: {
	// 	template: {
	// 		transformAssetUrls: {
	// 			NolebaseUnlazyImg: ['src']
	// 		}
	// 	}
	// },

	// ![INFO] uncomment for support hot reload on WSL - https://github.com/vitejs/vite/issues/1153#issuecomment-785467271
	vite: {
		server: {
			watch: {
				usePolling: true
			}
		},
		plugins: [
			tailwindcss() as any,
			process.env.NODE_ENV === 'production' ? llmstxt() : [],
			GitChangelog({
				repoURL: () => 'https://github.com/elysiajs/documentation',
				mapAuthors: [
					{
						mapByEmailAliases: ['saltyaom@gmail.com'],
						avatar: '/blog/authors/aris.webp',
						links: [
							{
								type: 'GitHub',
								link: 'https://github.com/SaltyAom'
							}
						]
					},
					{
						mapByNameAliases: ['bogeychan'],
						links: [
							{
								type: 'GitHub',
								link: 'http://github.com/bogeychan'
							}
						]
					},
					{
						mapByNameAliases: ['Fecony'],
						links: [
							{
								type: 'GitHub',
								link: 'https://github.com/fecony'
							}
						]
					}
				]
			}),
			GitChangelogMarkdownSection(),
			// ThumbnailHashImages()
		],
		optimizeDeps: {
			exclude: ['@nolebase/vitepress-plugin-inline-link-preview/client']
		},
		ssr: {
			noExternal: [
				'@nolebase/vitepress-plugin-inline-link-preview',
				'@unlazy/vue'
			]
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
			'script',
			{
				async: '',
				src: 'https://www.zhcndoc.com/js/common.js'
			}
        	]
	],
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
						text: '教程',
						link: '/tutorial'
					},
					{
						text: '关键概念',
						link: '/key-concept'
					},
					{
						text: '目录',
						link: '/table-of-content'
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
						text: '生命周期',
						link: '/essential/life-cycle'
					},
					{
						text: '验证',
						link: '/essential/validation'
					},
					{
						text: '插件',
						link: '/essential/plugin'
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
						text: '类型',
						link: '/patterns/type'
					},
					{
						text: '宏指令',
						link: '/patterns/macro'
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
						text: '跟踪',
						link: '/patterns/trace'
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
						text: 'Astro',
						link: '/integrations/astro'
					},
					{
						text: 'Better Auth',
						link: '/integrations/better-auth'
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
						text: 'Nextjs',
						link: '/integrations/nextjs'
					},
					{
						text: 'OpenAPI',
						link: '/integrations/openapi'
					},
					{
						text: 'OpenTelemetry',
						link: '/integrations/opentelemetry'
					},
					{
						text: 'React Email',
						link: '/integrations/react-email'
					},
					{
						text: 'SvelteKit',
						link: '/integrations/sveltekit'
					},
				]
			}
		],
		outline: {
			level: [2, 3],
			label: '页面导航'
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
