---
title: Elysia 1.2 - 你与我
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.2 - 你与我

    - - meta
      - name: 'description'
        content: 介绍适配器以支持通用运行时，具有解析功能的对象宏，带自定义名称的解析器，生命周期的 WebSocket，具有递归类型的 TypeBox 0.34，以及 Eden 验证推断。

    - - meta
      - property: 'og:description'
        content: 介绍适配器以支持通用运行时，具有解析功能的对象宏，带自定义名称的解析器，生命周期的 WebSocket，具有递归类型的 TypeBox 0.34，以及 Eden 验证推断。

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-12/elysia-12.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-12/elysia-12.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.2 - 你与我"
    src="/blog/elysia-12/elysia-12.webp"
    alt="蓝紫色调背景中间有白色文本标签 Elysia 1.2"
    author="saltyaom"
    date="2024年12月23日"
    shadow
>

以 HoyoMix 的专辑《 At the Fingertip of the Sea 》中的歌曲 [Φ²](https://youtu.be/b9IkzWO63Fg) 命名，正如在 [**"你与我"**](https://youtu.be/nz_Ra4G57A4) 中使用的那样。

Elysia 1.2 专注于承诺扩展通用运行时支持和开发者体验：
- [适配器](#adapter)
- [具有解析的宏](#macro-with-resolve)
- [解析器](#parser)
- [WebSocket](#websocket)
- [Typebox 0.34](#typebox)
- [减少内存使用](#reduced-memory-usage)

## 适配器
最受欢迎的请求之一是支持更多运行时。

Elysia 1.2 引入了 **适配器** 以允许 Elysia 在不同的运行时上运行。

```ts
import { node } from '@elysiajs/node'

new Elysia({ adapter: node() })
	.get('/', 'Hello Node')
	.listen(3000)
```

Elysia 设计为在 Bun 上运行，并将继续将 Bun 作为主要运行时，优先在 Bun 上实现功能。

然而，我们为您提供了更多选择，可以在适合您需求的不同环境中尝试 Elysia，例如，无服务器的 AWS Lambda、Supabase Function 等。

Elysia 的适配器的目标是提供跨不同运行时的一致 API，同时保持相同代码或对每个运行时的最小更改所带来的最佳性能。

### 性能

性能是 Elysia 的强项之一。我们不妥协于性能。

Elysia 直接使用原生 Node API，以实现最佳性能，而不是依赖于桥接将 Web 标准的请求转换为 Node 请求/响应。并在需要时提供 Web 标准兼容性。

通过利用 Sucrose 静态代码分析，Elysia 比大多数 Web 标准框架（如 Hono、h3，甚至原生 Node 框架如 Fastify、Express）都要快。

![Node 基准测试](/blog/elysia-12/node-benchmark.webp)

<small>与往常一样，您可以在 [Bun HTTP 框架基准测试](https://github.com/saltyaom/bun-http-framework-benchmark) 中找到基准测试。</small>

Elysia 现在支持以下运行时适配器：
- Bun
- Web 标准 (WinterCG) 例如 Deno、浏览器
- Node <sup><small>(beta)</small></sup>

虽然 Node 适配器仍在 beta 阶段，但它具备您从返回生成器流到 WebSocket 所期待的最多功能。我们建议您尝试一下。

我们将继续扩展对更多运行时的支持，未来从以下开始：
- Cloudflare Worker
- AWS Lambda
- uWebSocket.js

### 通用运行时 API
为了与不同的运行时兼容，Elysia 现在围绕精心挑选的工具函数提供一致的 API。

例如，在 Bun 中，您可以使用 `Bun.file` 返回文件响应，而该功能在 Node 中不可用。

```ts
import { Elysia } from 'elysia' // [!code --]
import { Elysia, file } from 'elysia' // [!code ++]

new Elysia()
	.get('/', () => Bun.file('./public/index.html')) // [!code --]
	.get('/', () => file('./public/index.html')) // [!code ++]
```

这些工具函数是 Bun 的工具函数的复制，旨在与 Elysia 支持的运行时兼容，而未来将扩展。

目前，Elysia 支持：
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

使用新的宏对象语法，您现在可以返回生命周期，而不是检索它，以减少样板代码。

以下是旧语法和新语法的比较：
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

两种语法都受支持，但推荐使用新对象语法。我们没有计划去掉之前的语法，但我们将专注于新对象语法，并引入新功能。

::: info
由于 TypeScript 的限制，宏的 `resolve` 仅适用于新的对象语法，而不适用于之前的语法。
:::

## 名称解析器

Elysia 1.2 引入了带自定义名称的解析器，允许您指定应使用哪个解析器来解码请求体。

```ts
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

`parser` 的 API 类似于 `onParse`，但带有自定义名称，允许您在路由中引用它。

您还可以引用 Elysia 内置的解析器，或提供多个解析器按顺序使用。

```ts
import { Elysia } from 'elysia'

new Elysia()
	.parser('custom', ({ contentType }) => {
		if(contentType === "application/kivotos")
			return 'nagisa'
	})
	.post('/', ({ body }) => body, {
		parse: ['custom', 'json']
	})
```

解析器将按顺序调用，如果解析器未返回值，将移至下一个解析器，直到其中一个解析器返回值。

## WebSocket
我们重写了 WebSocket 以提高性能，并使其 API 和行为与最新的 Bun 的 WebSocket API 匹配，同时保持与每个运行时的兼容性。

```ts
new Elysia()
	.ws('/ws', {
		ping: (message) => message,
		pong: (message) => message
	})
```

WebSocket 现在具有更一致的 API，与 HTTP 路由相匹配，并具有与 HTTP 路由相似的生命周期。

## TypeBox 0.34
Elysia 1.2 现在支持 TypeBox 0.34。

通过此更新，Elysia 现在使用 TypeBox 的 `t.Module` 来处理引用模型以支持循环递归类型。

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

## 减少内存使用
我们已经重构了 Sucrose 生成的代码，以实现可交换的代码生成过程。

通过重构以减少代码重复、路由优化和不必要代码的移除。

这使得 Elysia 能够重用多个部分的代码，并减少大部分的内存使用。

对于我们的项目，简单升级到 Elysia 1.2，就看到内存使用量减少了多达 2 倍。

![1.1 和 1.2 之间的内存比较](/blog/elysia-12/memory.webp)

这种内存优化随着路由数量和路由复杂度的增加而扩展。因此，您可能会看到内存使用量呈指数级减少。

## 重要更新
以下是 Elysia 1.2 中一些显著改进的内容。

### Eden 验证错误
Eden 现在如果提供了验证模型，也会自动推断 `422` 状态码。
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

### 路由
我们更新了路由注册的去重机制，使其更加优化。

之前 Elysia 会检查所有可能的路由，以防止路由重复。现在 Elysia 使用校验和哈希映射检查路由是否已经注册，并合并路由和代码生成的过程循环以提高性能。

### 更改
- 事件监听器现在会根据作用域自动推断路径参数
- 为批量 `as` 添加了 ‘scoped’ 以将类型转换为 ‘scoped’，类似于 ‘plugin’
- 更新 `cookie` 至 1.0.1
- 更新 TypeBox 至 0.33
- `content-length` 现在接受数字
- 在 `trace` 中使用 16 位十六进制数作为 `id`
- 在生产构建中禁用 `minify` 以便更好地调试/错误报告

## 破坏性更改
在升级到 Elysia 1.2 时，您的代码库可能需要进行一些小的必需更改。

不过，以下是您需要注意的所有更改。

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

### 表单数据
从 1.2 开始，如果响应是表单数据，您现在必须显式返回 `form`，而不是自动检测是否在 1 级深处的对象中存在文件。

```ts
import { Elysia, form, file } from 'elysia'

new Elysia()
	.post('/', ({ file }) => ({ // [!code --]
	.post('/', ({ file }) => form({ // [!code ++]
		a: file('./public/kyuukurarin.mp4')
	}))
```

### WebSocket
WebSocket 方法现在返回相应的值，而不是返回 `WebSocket`。

因此，删除了方法链的能力。

这样做是为了使 WebSocket 的 API 与 Bun 的 WebSocket API 匹配，以便更好地兼容和迁移。

```ts
import { Elysia } from 'elysia'

new Elysia()
	.ws('/', {
		message(ws) {
			ws // [!code --]
				.send('hello') // [!code --]
				.send('world') // [!code --]

			ws.send('hello') // [!code ++]
			ws.send('world') // [!code ++]
		}
	})
```

### 作用域
Elysia 现在移除了 `constructor scoped`，因为这可能会与 `scope's scoped/global` 混淆。

```ts
import { Elysia } from 'elysia'

new Elysia({ scoped: false }) // [!code --]

const scoped = new Elysia() // [!code ++]

const main = new Elysia() // [!code ++]
	.mount(scoped) // [!code ++]
```

### 内部破坏性改动
- 移除路由内部属性 static.http.staticHandlers
- 路由历史编译现在与历史组合连接

## 结语

Elysia 1.2 是我们努力工作很久的雄心勃勃的更新。

这是一个将 Elysia 的影响力扩展到更多开发者和更多运行时的赌博，但我还有其他想说的事情。

### 让我们重新开始。

嗨，你好吗？我希望你一切都好。

我仍然喜欢这样，写关于 Elysia 的博客文章。已经有一段时间了。

您可能注意到，自上次更新以来已经有一段时间了，而且这次更新并不算长。我为此感到抱歉。

我希望您能理解，我们也有自己的生活要照顾。我们不是机器人，我们是人。有时是生活，有时是工作，有时是家庭，有时是财务。

### 我希望一直和你在一起。

做我喜欢的事，不断更新 Elysia，不断写博客文章，不断创作艺术，但你知道我也有一些事情要照顾。

我必须为餐桌上带来食物，我需要照顾很多财务上的事情。我也得照顾自己。

我希望你一切都好，希望你快乐，希望你健康，希望你安全。

即使我不在这里。名为 Elysia 的我将与您同在。

感谢您与我同行。

> 在这里我感受到真实号码解带来的触碰。
>
> 两个灵魂的涟漪现在达到了我们的双缝。
>
> 在世界上投射出光明与黑暗的条纹，似昼似夜。
>
> 你让我在阳光下自由。
>
> 我将你的摇篮梦飞向月球再返回。
>
> 一条虫会变成一只蝴蝶，
>
> 在一个人回答“我是谁”之前。
>
> 当冰变成水后，
>
> 我倒吊着的海洋将是你的天空。

> 而我们终于再次相遇，Seele。

</Blog>