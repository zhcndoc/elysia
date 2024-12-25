---
title: Elysia 1.2 - 你和我
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.2 - 你和我

    - - meta
      - name: 'description'
        content: 介绍适配器以支持通用运行时，具有解析的对象宏，自定义名称的解析器，带生命周期的 WebSocket，具有递归类型的 TypeBox 0.34，以及 Eden 验证推断。

    - - meta
      - property: 'og:description'
        content: 介绍适配器以支持通用运行时，具有解析的对象宏，自定义名称的解析器，带生命周期的 WebSocket，具有递归类型的 TypeBox 0.34，以及 Eden 验证推断。

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-12/elysia-12.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-12/elysia-12.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.2 - 你和我"
    src="/blog/elysia-12/elysia-12.webp"
    alt="蓝紫色背景中间有白色文本标签 Elysia 1.2"
    author="saltyaom"
    date="2024年12月23日"
    shadow
>

以 HoyoMix 专辑《At the Fingertip of the Sea》中的歌曲 [Φ²](https://youtu.be/b9IkzWO63Fg) 命名，再次用于 [**"你和我"**](https://youtu.be/nz_Ra4G57A4)。

Elysia 1.2 专注于致力于扩展通用运行时支持和开发者体验：
- [适配器](#adapter)
- [具有解析的宏](#macro-with-resolve)
- [解析器](#parser)
- [WebSocket](#websocket)
- [TypeBox 0.34](#typebox)
- [类型推断](#type-inference)

## 适配器
最常请求的功能之一是支持更多运行时。

Elysia 1.2 引入了 **适配器**，允许 Elysia 在不同的运行时上运行。

```ts
import { node } from '@elysiajs/node'

new Elysia({ adapter: node() })
	.get('/', '你好，Node')
	.listen(3000)
```

Elysia 设计为在 Bun 上运行，并将继续将 Bun 作为主要运行时，优先考虑 Bun 首先的功能。

然而，我们为您提供了更多选择，以便在适合您需求的不同环境上尝试 Elysia，例如，AWS Lambda、Supabase Function 等无服务器环境。

Elysia 的适配器的目标是在不同运行时之间提供一致的 API，同时保持相同代码或为每个运行时进行最小更改的最佳性能。

### 性能

性能是 Elysia 的优势之一。我们不妥协于性能。

Elysia 不依赖于桥接将 Web 标准请求转换为 Node 请求/响应。Elysia 直接使用原生 Node API，以在需要时实现最佳性能，同时提供 Web 标准兼容性。

通过利用 Sucrose 静态代码分析，Elysia 比大多数 Web 标准框架（如 Hono、h3，甚至原生 Node 框架如 Fastify、Express）速度更快。

![Node 基准测试](/blog/elysia-12/node-benchmark.webp)

<small>如往常一样，您可以在 [Bun HTTP 框架基准测试](https://github.com/saltyaom/bun-http-framework-benchmark) 中找到基准测试。</small>

Elysia 现在支持以下运行时适配器：
- Bun
- Web 标准（WinterCG），例如 Deno、浏览器
- Node <sup><small>(测试版)</small></sup>

尽管 Node 适配器仍处于测试版，但它具有您期望的从返回生成器流到 WebSocket 的大部分功能。我们建议您尝试一下。

我们将继续扩大对未来更多运行时的支持，从以下开始：
- Cloudflare Worker
- AWS Lambda
- uWebSocket.js

### 通用运行时 API
为了与不同的运行时兼容，Elysia 现在封装了一些挑选的工具函数，以提供一致的 API。

例如，在 Bun 中，您可以使用 `Bun.file` 来返回文件响应，而在 Node 中则不可用。

```ts
import { Elysia } from 'elysia' // [!code --]
import { Elysia, file } from 'elysia' // [!code ++]

new Elysia()
	.get('/', () => Bun.file('./public/index.html')) // [!code --]
	.get('/', () => file('./public/index.html')) // [!code ++]
```

这些工具函数是 Bun 的工具函数的复制，旨在与 Elysia 支持的运行时兼容，并将在将来扩展。

目前，Elysia 支持以下函数：
- `file` - 返回文件响应
- `form` - 返回表单数据响应
- `server` - Bun 的 `Server` 类型声明的移植

## 具有解析的宏
从 Elysia 1.2 开始，您现在可以在宏中使用 `resolve`。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.macro({
		user: (enabled: true) => ({
			resolve: ({ cookie: { session } }) => ({
				user: session.value!
			})
		})
	})
	.get('/', ({ user }) => user, {
                          // ^?
		user: true
	})
```

使用新的宏对象语法，您现在可以返回而不是检索生命周期，以减少样板代码。

以下是新旧语法的比较：
```ts
// ✅ 对象宏
new Elysia()
	.macro({
		role: (role: 'admin' | 'user') => ({
			beforeHandle: ({ cookie: { session } }) => ({
				user: session.value!
			})
		})
	})

// ⚠️ 函数宏
new Elysia()
	.macro(({ onBeforeHandle }) => {
		role(role: 'admin' | 'user') {
			onBeforeHandle(({ cookie: { session } }) => ({
				user: session.value!
			})
		}
	})
```

两种语法均受到支持，但推荐使用新的对象语法。我们没有计划移除以前的语法，但我们将重点关注具有新功能的新对象语法。

::: info
由于 TypeScript 的限制，宏的 `resolve` 仅对新的对象语法有效，而不适用于以前的语法。
:::

## 名称解析器

Elysia 1.2 引入了一个自定义名称的解析器，使您能够指定用于解码请求体的解析器。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.parser('custom', ({ contentType }) => {
		if(contentType === "application/kivotos")
			return 'nagisa'
	})
	.post('/', ({ body }) => body, {
		parse: 'custom'
	})
```

`parser` 与 `onParse` 具有相似的 API，但具有自定义名称，允许您在路由中引用它。

您还可以引用 Elysia 的内置解析器或提供多个解析器以按顺序使用。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.parser('custom', ({ contentType }) => {
		if(contentType === "application/kivotos")
			return 'nagisa'
	})
	.post('/', ({ body }) => body, {
		type: 'json',
		parse: ['custom', 'json']
	})
```

解析器将按顺序调用，如果解析器未返回值，它将移动到下一个解析器，直到其中一个解析器返回值为止。

## WebSocket
我们已重写 WebSocket 以提高性能，并使其 API 和行为与最新的 Bun WebSocket API 匹配，同时兼容每个运行时。

```ts
new Elysia()
	.ws('/ws', {
		ping: (message) => message,
		pong: (message) => message
	})
```

WebSocket 现在与 HTTP 路由具有更一致的 API，并且具有与 HTTP 路由类似的生命周期。

## TypeBox 0.34
Elysia 1.2 现在支持 TypeBox 0.34。

通过此更新，Elysia 现在使用 TypeBox 的 `t.Module` 来处理引用模型，以支持循环递归类型。

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.model({
		a: t.Object({
			a: t.Optional(t.Ref('a'))
		})
	})
	.post('/recursive', ({ body }) => body, {
                         // ^?
		body: 'a'
	})
```

## 突出更新
以下是 Elysia 1.2 中的一些显著改善。

### Eden 验证错误
如果提供了验证模型，Eden 现在也会自动推断出 `422` 状态代码。
```ts
import { treaty } from '@elysiajs/eden'
import type { App } from './app'

const api = treaty<App>('localhost:3000')

const { data, error } = await api.user.put({
	name: 'saltyaom'
})

if(error)
	switch(error.status) {
		case 422:
			console.log(error.summary)
			break

		default:
			console.error(error)
	}
```

### Sucrose
为了提供运行时适配器，Sucrose 必须更新以支持可交换的代码生成。

这使 Elysia 能够解耦并重构大部分代码生成过程，使其更加模块化。

我们已重构代码生成，使其更高效且更快速，包括删除不必要的空格、制表符和换行符，以减少内存使用。

### 路由
我们已更新路由注册去重以更高效。

之前 Elysia 会检查所有可能的路由以防止路由重复。现在 Elysia 使用校验和哈希映射来检查路由是否已注册，并合并路由和代码生成过程循环以提高性能。

### 变更
- 事件监听器现在根据作用域自动推断路径参数
- 向批量 `as` 添加 ‘scoped’ 以将类型转换为 ‘scoped’，类似于 ‘plugin’
- 更新 `cookie` 到 1.0.1
- 更新 TypeBox 到 0.33
- `content-length` 现在接受数字
- 使用 16 位十六进制数表示 `trace` 中的 `id`
- 为了更好的调试/错误报告，在生产构建中禁用 `minify`

## 破坏性变更
在适应升级到 Elysia 1.2 中，您的代码库可能需要进行一些小的修改。

然而，以下是您需要注意的所有更改。

### 表单数据
从 1.2 开始，如果响应是表单数据，您现在必须显式返回 `form`，而不是自动检测文件是否存在于 1 层深的对象中。

```ts
import { Elysia, form, file } from 'elysia'

new Elysia()
	.post('/', ({ file }) => ({ // [!code --]
	.post('/', ({ file }) => form({ // [!code ++]
		a: file('./public/kyuukurarin.mp4')
	}))
```

### 解析
`type` 现在与 `parse` 合并，以允许控制自定义和内置解析器的顺序。

```ts
import { Elysia, form, file } from 'elysia'

new Elysia()
	.post('/', ({ body }) => body, {
		type: 'json' // [!code --]
		parse: 'json' // [!code ++]
	})
```

### 作用域
Elysia 现在移除了 `constructor scoped`，因为这可能会与 `scope` 的 scoped/global 混淆。

```ts
import { Elysia } from 'elysia'

new Elysia({ scoped: false }) // [!code --]

const scoped = new Elysia() // [!code ++]

const main = new Elysia() // [!code ++]
	.mount(scoped) // [!code ++]
```

### 内部破坏性变更
- 移除路由内部属性 static.http.staticHandlers
- 路由历史编译现在与历史组合链接

## 后记

Elysia 1.2 是我们工作了一段时间的雄心勃勃的更新。

这是扩大 Elysia 对更多开发者和更多运行时的影响力的尝试，但我还有其他事情想说。

### 让我们重新开始。

嗨，你好吗？我希望你一切都好。

我仍然喜欢这样，写关于 Elysia 的博客文章。自那时以来已经有一段时间了。

你可能注意到，自上次更新以来已经有一段时间了，而且也不是很长。我对此感到抱歉。

我希望你理解，我们也有自己的生活要照顾。我们不是机器人，我们是人。有时是生活，有时是工作，有时是家庭，有时是经济。

### 我希望一直陪在你身边。

做我喜欢的事情，持续更新 Elysia，持续写博客文章，持续创作艺术，但你知道我也有事情要照顾。

我必须把食物放到桌面上，我必须处理许多经济上的事务。我也必须照顾好自己。

希望你一切安好，幸福，健康，安全。

即使我不在这里，名为 Elysia 的我也会陪伴着你。

感谢你与我同在。

> 在这里，我感受到真实数字解决方案带来的触觉。
>
> 两个灵魂的涟漪现在已经达到我们的双缝。
>
> 在日夜交替的世界中投射光明与黑暗的条纹。
>
> 你让我在阳光下获得自由。
>
> 我把你的摇篮梦想飞往月球又回到地球。
>
> 一个虫子会变成蝴蝶，
>
> 在一个人能回答“我是谁”之前。
>
> 在冰冷化为水之后，
>
> 我悬挂的海洋将会是你的天空。

> 我们终于再次相遇了，Seele。

</Blog>