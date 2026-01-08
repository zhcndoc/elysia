interface TableOfContentItem {
    title: string
    href: string
}

interface TableOfContentGroup {
    title: string
    contents: TableOfContentItem[]
}

export const tableOfContents: TableOfContentGroup[] = [
    {
        title: '入门指南',
        contents: [
            {
                title: '介绍',
                href: '/tutorial/'
            },
            {
                title: '你的第一个路由',
                href: '/tutorial/getting-started/your-first-route/'
            },
            {
                title: '处理程序和上下文',
                href: '/tutorial/getting-started/handler-and-context/'
            },
            {
                title: '状态和头部',
                href: '/tutorial/getting-started/status-and-headers/'
            },
            {
                title: '验证',
                href: '/tutorial/getting-started/validation/'
            },
            {
                title: '生命周期',
                href: '/tutorial/getting-started/life-cycle/'
            },
            {
                title: '守卫',
                href: '/tutorial/getting-started/guard/'
            },
            {
                title: '插件',
                href: '/tutorial/getting-started/plugin/'
            },
            {
                title: '封装',
                href: '/tutorial/getting-started/encapsulation/'
            }
        ]
    },
    {
        title: '模式',
        contents: [
            {
                title: 'Cookie',
                href: '/tutorial/patterns/cookie/'
            },
            {
                title: '错误处理',
                href: '/tutorial/patterns/error-handling/'
            },
            {
                title: '验证错误',
                href: '/tutorial/patterns/validation-error/'
            },
            {
                title: '扩展上下文',
                href: '/tutorial/patterns/extends-context/'
            },
            {
                title: '独立模式',
                href: '/tutorial/patterns/standalone-schema/'
            },
            {
                title: '宏',
                href: '/tutorial/patterns/macro/'
            }
        ]
    },
    {
        title: '功能',
        contents: [
            {
                title: 'OpenAPI',
                href: '/tutorial/features/openapi/'
            },
            {
                title: '挂载',
                href: '/tutorial/features/mount/'
            },
            {
                title: '单元测试',
                href: '/tutorial/features/unit-test/'
            },
            {
                title: '端到端类型安全',
                href: '/tutorial/features/end-to-end-type-safety/'
            }
        ]
    },
    {
        title: '结论',
        contents: [
            {
                title: "接下来是什么？",
                href: '/tutorial/whats-next'
            },
            {
            	title: '文档',
				href: '/table-of-content'
            }
        ]
    }
]
