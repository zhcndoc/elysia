---
title: 简介 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 简介 - ElysiaJS

    - - meta
      - name: 'description'
        content: 设计注重人体工学，广泛支持 TypeScript，现代 JavaScript API，优化用于 Bun。提供独特的统一类型体验和端到端的类型安全，同时保持出色的性能。

    - - meta
      - property: 'og:description'
        content: 设计注重人体工学，广泛支持 TypeScript，现代 JavaScript API，优化用于 Bun。提供独特的统一类型体验和端到端的类型安全，同时保持出色的性能。
---

<script setup>
import Card from './components/nearl/card.vue'
import Deck from './components/nearl/card-deck.vue'
import Playground from './components/nearl/playground.vue'

import { Elysia } from 'elysia'

const demo1 = new Elysia()
    .get('/', '你好 Elysia')
    .get('/user/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)

const demo2 = new Elysia()
    .get('/user/:id', ({ params: { id }}) => id)
    .get('/user/abc', () => 'abc')
</script>


# 一览

Elysia 是一个符合人体工学的 Web 框架，用于使用 Bun 构建后端服务器。

Elysia 设计简洁且类型安全，提供了一个熟悉的 API，广泛支持 TypeScript，并针对 Bun 进行了优化。

下面是在 Elysia 中的简单 hello world 示例。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', '你好 Elysia')
    .get('/user/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)
    .listen(3000)
```

打开 [localhost:3000](http://localhost:3000/) ，你应该会看到结果是“Hello Elysia”。

<Playground
    :elysia="demo1"
    :alias="{
        '/user/:id': '/user/1'
    }"
    :mock="{
        '/user/:id': {
            GET: '1'
        },
        '/form': {
            POST: JSON.stringify({
                hello: 'Elysia'
            })
        }
    }"
/>

::: tip
将鼠标悬停在代码片段上查看类型定义。

在模拟浏览器中，点击蓝色高亮的路径可以切换路径并预览响应。

Elysia 可在浏览器中运行，所看到的结果实际上是使用 Elysia 执行的。
:::

## 性能

基于 Bun 及静态代码分析等广泛优化，使 Elysia 能够动态生成优化代码。

Elysia 的性能优于当前大多数 Web 框架<a href="#ref-1"><sup>[1]</sup></a>，甚至能匹配 Golang 和 Rust 框架的表现<a href="#ref-2"><sup>[2]</sup></a>。

| 框架         | 运行时 | 平均       | 普通文本   | 动态参数       | JSON 数据   |
| ------------ | ------ | ---------- | ---------- | --------------- | ----------- |
| bun          | bun    | 262,660.433| 326,375.76 | 237,083.18      | 224,522.36  |
| elysia       | bun    | 255,574.717| 313,073.64 | 241,891.57      | 211,758.94  |
| hyper-express| node   | 234,395.837| 311,775.43 | 249,675         | 141,737.08  |
| hono         | bun    | 203,937.883| 239,229.82 | 201,663.43      | 170,920.4   |
| h3           | node   | 96,515.027 | 114,971.87 | 87,935.94       | 86,637.27   |
| oak          | deno   | 46,569.853 | 55,174.24  | 48,260.36       | 36,274.96   |
| fastify      | bun    | 65,897.043 | 92,856.71  | 81,604.66       | 23,229.76   |
| fastify      | node   | 60,322.413 | 71,150.57  | 62,060.26       | 47,756.41   |
| koa          | node   | 39,594.14  | 46,219.64  | 40,961.72       | 31,601.06   |
| express      | bun    | 29,715.537 | 39,455.46  | 34,700.85       | 14,990.3    |
| express      | node   | 15,913.153 | 17,736.92  | 17,128.7        | 12,873.84   |

## TypeScript

Elysia 致力于帮助你编写更少的 TypeScript。

Elysia 的类型系统经过细致调校，实现自动从代码中推断类型，而无需显式编写 TypeScript，同时在运行时和编译时都提供类型安全，确保开发体验的人性化。

看看这个例子：

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/user/:id', ({ params: { id } }) => id)
                        // ^?
    .listen(3000)
```

<br>

上面代码创建了路径参数 **"id"**。替代 `:id` 的值会在运行时和类型中传递给 `params.id`，无需手动声明类型。

<Playground
    :elysia="demo2"
    :alias="{
        '/user/:id': '/user/123'
    }"
    :mock="{
        '/user/:id': {
            GET: '123'
        },
    }"
/>

Elysia 的目标是帮助你写更少的 TypeScript，更多关注业务逻辑。让框架帮你处理复杂的类型。

使用 Elysia 不强制要求 TypeScript，但推荐使用。

## 类型完整性

更进一步，Elysia 提供了 **Elysia.t** —— 一个模式构建器，可以在运行时和编译时对类型和数值进行校验，形成数据类型的唯一可信来源。

我们来修改之前的代码，使其只接受数字值而非字符串。

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/user/:id', ({ params: { id } }) => id, {
                                // ^?
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
```

这段代码确保路径参数 **id** 在运行时和编译时（类型层面）始终是数字。

::: tip
将鼠标悬停在上述代码片段中的 "id" 以查看类型定义。
:::

借助 Elysia 的模式构建器，我们能像强类型语言一样，使用唯一数据来源确保类型安全。

## 标准 Schema

Elysia 支持 [Standard Schema](https://github.com/standard-schema/standard-schema)，允许你使用喜爱的验证库：

- Zod
- Valibot
- ArkType
- Effect Schema
- Yup
- Joi
- [及更多](https://github.com/standard-schema/standard-schema)

```typescript twoslash
import { Elysia } from 'elysia'
import { z } from 'zod'
import * as v from 'valibot'

new Elysia()
	.get('/id/:id', ({ params: { id }, query: { name } }) => id, {
	//                           ^?
		params: z.object({
			id: z.coerce.number()
		}),
		query: v.object({
			name: v.literal('Lilith')
		})
	})
	.listen(3000)
```

Elysia 会自动从模式推断类型，允许你同时使用熟悉的验证库和保持类型安全。

## OpenAPI

Elysia 默认采纳多种标准，如 OpenAPI、WinterTC 兼容性和 Standard Schema，方便你集成绝大多数行业标准工具，或轻松集成已有熟悉工具。

例如，因 Elysia 默认支持 OpenAPI，只需添加一行代码即可生成 API 文档：

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
    .use(openapi()) // [!code ++]
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
```

通过 OpenAPI 插件，你无需额外代码或特殊配置即可无缝生成 API 文档页面，并轻松与团队共享。

## 从类型生成 OpenAPI

Elysia 对 OpenAPI 提供了极佳支持，模式可用于数据验证、类型推断和 OpenAPI 注解，源于唯一数据来源。

Elysia 也支持用 **一行代码直接从类型生成 OpenAPI Schema**，实现完整准确的 API 文档，无需手动注解。

```typescript
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

export const app = new Elysia()
    .use(openapi({
    	references: fromTypes() // [!code ++]
    }))
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
```

这是 Elysia 的一个 **独特功能**，使你能够直接从代码中获得完整且准确的 API 文档，无需任何手动注解。

## 端到端类型安全

利用 Elysia，类型安全不限于服务端。

借助 Elysia 和其客户端库 “Eden”，你可以像 tRPC 一样自动同步类型给前端团队。

```typescript twoslash
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

export const app = new Elysia()
    .use(openapi({
    	references: fromTypes()
    }))
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)

export type App = typeof app // [!code ++]
```

在你的客户端代码中：

```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)

export type App = typeof app

// @filename: client.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const app = treaty<App>('localhost:3000')

// 从 /user/617 获取数据
const { data } = await app.user({ id: 617 }).get()
      // ^?

console.log(data)
```

使用 Eden，你可以使用已有的 Elysia 类型查询 Elysia 服务器，**无需代码生成**，并自动同步前后端类型。

Elysia 不仅帮助你构建可靠后端，也致力于这个世界上美好的事物。

## 类型严谨性

大多数具有端到端类型安全的框架通常只涵盖“理想情况”，将错误处理和边缘情况排除在类型系统之外。

然而，Elysia 可以推断 API 的所有可能结果，包括生命周期事件和代码库中任何部分的宏。

::: code-group

```typescript twoslash [client.ts]
// @filename: server.ts
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.macro({
		auth: {
			cookie: t.Object({
				session: t.String()
			}),
			beforeHandle({ cookie: { session }, status }) {
				if(session.value !== 'valid')
					return status(401)
			}
		}
	})

const app = new Elysia()
	.use(plugin)
    .get('/user/:id', ({ params: { id }, status }) => {
    	if(Math.random() > 0.1)
     		return status(420)
       
       return id
    }, {
    	auth: true,
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)

export type App = typeof app

// @filename: client.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const app = treaty<App>('localhost:3000')

// 从 /user/617 获取数据
const { data, error } = await app.user({ id: 617 }).get()
            // ^?

console.log(data)
```

```typescript twoslash [server.ts]
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.macro({
		auth: {
			cookie: t.Object({
				session: t.String()
			}),
			beforeHandle({ cookie: { session }, status }) {
				if(session.value !== 'valid')
					return status(401)
			}
		}
	})

const app = new Elysia()
	.use(plugin)
    .get('/user/:id', ({ params: { id }, status }) => {
    	if(Math.random() > 0.1)
     		return status(420)
       
       return id
    }, {
    	auth: true,
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
    
export type App = typeof app
```

:::

这是 Elysia 多年来在类型系统投资带来的 **独特优势** 之一。

## 跨平台性

Elysia 为 Bun 设计并优化了原生功能，但**不限于 Bun**。

遵循 [WinterTC 标准](https://wintertc.org/) 允许你将 Elysia 部署到：

- Bun
- [Node.js](/integrations/node)
- [Deno](/integrations/deno)
- [Cloudflare Worker](/integrations/cloudflare-worker)
- [Vercel](/integrations/vercel)
- 通过 API 路由的 [Expo](/integrations/expo)
- 通过 API 路由的 [Nextjs](/integrations/nextjs)
- 通过 API 路由的 [Astro](/integrations/astro)

以及更多！请查看侧边栏中的 `integration` 部分，了解更多支持的运行时环境。

## 我们的社区

我们希望为每个人创建一个友好且欢迎的社区，采用可爱且富有活力的设计，包括我们的动漫吉祥物 Elysia 酱。

我们相信技术可以既可爱又有趣，而非一成不变的严肃，这能为人们的生活带来乐趣。

即使如此，我们仍然非常认真对待 Elysia，确保它是一个可靠的、高性能的生产级框架，可以信赖于你的下一个项目。

Elysia 已被全球众多公司和项目**投入生产使用**，包括 [X](https://x.com/shlomiatar/status/1822381556142362734)、[农业与农业合作银行](https://github.com/elysiajs/elysia/discussions/1312#discussioncomment-13924470)、[Cluely](https://github.com/elysiajs/elysia/discussions/1312#discussioncomment-14420139)、[CS.Money](https://github.com/elysiajs/elysia/discussions/1312#discussioncomment-13913513)、[Abacate Pay](https://github.com/elysiajs/elysia/discussions/1312#discussioncomment-13922081)，并被 GitHub 上超过 10,000 个（开源）项目使用。自 2022 年以来持续活跃开发和维护，拥有来自社区的众多常驻贡献者。

Elysia 是构建你的下一个后端服务器的可靠且生产就绪的选择。

以下是社区资源，助你快速入门：

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        官方 ElysiaJS Discord 社区服务器
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        跟踪 Elysia 的更新和状态
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        源代码与开发
    </Card>
</Deck>

---

<small id="ref-1">1. 请求/秒的测量。基于 Debian 11 上的基准测试，涉及查询、路径参数解析和响应头设置，使用 Intel i7-13700K，测试时间为 2023 年 8 月 6 日，基于 Bun 0.7.2。详细基准测试条件见 [此处](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/c7e26fe3f1bfee7ffbd721dbade10ad72a0a14ab#results)。</small>

<small id="ref-2">2. 基于 [TechEmpower 基准测试第 22 轮](https://www.techempower.com/benchmarks/#section=data-r22&hw=ph&test=composite)。</small>