---
title: Elysia 1.1 - 大人的乐园
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.1 - 大人的乐园

    - - meta
      - name: 'description'
        content: 介绍 OpenTelemetry 和 Trace v2。数据强制和规范化。Guard 插件和批量转换。可选路径参数。装饰器和响应状态协调。生成器响应流。

    - - meta
      - property: 'og:description'
        content: 介绍 OpenTelemetry 和 Trace v2。数据强制和规范化。Guard 插件和批量转换。可选路径参数。装饰器和响应状态协调。生成器响应流。

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-11/elysia-11.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-11/elysia-11.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.1 - 大人的乐园"
    src="/blog/elysia-11/elysia-11.webp"
    alt="Elysia 1.1 标志的蓝紫色调"
    author="saltyaom"
    date="2024 年 7 月 16 日"
    shadow
>

此版本命名来源于 Mili 的一首歌，[**《大人的乐园》**](https://youtu.be/KawV_oK6lIc)，并用作 [《Arknights》动画第三季商业宣传的开场曲](https://youtu.be/sZ1OD0cL6Qw)。

作为一名《Arknights》第一天的玩家和 Mili 的长期粉丝，我从未想过 Mili 会为《Arknights》创作歌曲，你一定要去听听，他们是真正的牛！

Elysia 1.1 关注以下几个方面对开发者体验的改进：
- [OpenTelemetry](#opentelemetry)
- [Trace v2 (重大变更)](#trace-v2)
- [规范化](#normalization)
- [数据强制](#data-type-coercion)
- [Guard as](#guard-as)
- [批量 `as` 转换](#bulk-cast)
- [响应状态协调](#response-reconcilation)
- [可选路径参数](#optional-path-parameter)
- [生成器响应流](#generator-response-stream)

## OpenTelemetry
可观察性是生产环境中一个重要的方面。

它让我们能够理解我们的服务器在生产中如何工作，识别问题和瓶颈。

最流行的可观察性工具之一是 **OpenTelemetry**。然而，我们承认，正确设置和为你的服务器添加监控是一项困难且耗时的任务。

将 OpenTelemetry 集成到大多数现有框架和库中都是困难的。

大多数解决方案依赖于笨拙的方法、猴子补丁、原型污染或者手动监控，因为大多数框架并没有从一开始就设计为支持可观察性。

这就是我们在 Elysia 中引入 **第一方支持** OpenTelemetry 的原因。

要开始使用 OpenTelemetry，只需安装 `@elysiajs/opentelemetry` 并将插件应用于任何实例。

```typescript
import { Elysia } from 'elysia'
import { opentelemetry } from '@elysiajs/opentelemetry'

import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

new Elysia()
	.use(
		opentelemetry({
			spanProcessors: [
				new BatchSpanProcessor(
					new OTLPTraceExporter()
				)
			]
		})
	)
```

![Jaeger 显示自动收集的跟踪](/blog/elysia-11/jaeger.webp)

Elysia OpenTelemetry 将 **收集与 OpenTelemetry 标准兼容的任何库的跨度**，并将自动应用父子跨度。

在上述代码中，我们应用 `Prisma` 来跟踪每个查询花费的时间。

通过应用 OpenTelemetry，Elysia 将会：
- 收集遥测数据
- 将相关生命周期分组
- 测量每个函数的执行时长
- 对 HTTP 请求和响应进行监控
- 收集错误和异常

你可以将遥测数据导出到 Jaeger、Zipkin、New Relic、Axiom 或任何其他兼容 OpenTelemetry 的后端。

以下是将遥测数据导出到 [Axiom](https://axiom.co) 的示例：
```typescript
import { Elysia } from 'elysia'
import { opentelemetry } from '@elysiajs/opentelemetry'

import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

new Elysia()
	.use(
		opentelemetry({
			spanProcessors: [
				new BatchSpanProcessor(
					new OTLPTraceExporter({
						url: 'https://api.axiom.co/v1/traces', // [!code ++]
						headers: { // [!code ++]
						    Authorization: `Bearer ${Bun.env.AXIOM_TOKEN}`, // [!code ++]
						    'X-Axiom-Dataset': Bun.env.AXIOM_DATASET // [!code ++]
						} // [!code ++]
					})
				)
			]
		})
	)
```

![Axiom 显示收集到的 OpenTelemetry 跟踪](/blog/elysia-11/axiom.webp)

Elysia OpenTelemetry 仅适用于将 OpenTelemetry 应用于 Elysia 服务器。

你可以正常使用 OpenTelemetry SDK，跨度将在 Elysia 的请求跨度下运行，它将自动出现在 Elysia 的跟踪中。

然而，我们也提供了 `getTracer` 和 `record` 工具，以便从你应用的任何部分收集跨度。

```typescript
import { Elysia } from 'elysia'
import { record } from '@elysiajs/opentelemetry'

export const plugin = new Elysia()
	.get('', () => {
		return record('database.query', () => {
			return db.query('SELECT * FROM users')
		})
	})
```

`record` 相当于 OpenTelemetry 的 `startActiveSpan`，但它将处理自动关闭并自动捕获异常。

你可以将 `record` 看作是你代码的标签，它将在跟踪中显示。

### 为可观察性准备你的代码库
Elysia OpenTelemetry 将分组生命周期并读取每个钩子的 **函数名称** 作为跨度的名称。

现在是 **命名你的函数** 的好时机。

如果你的钩子处理程序是一个箭头函数，你可以重构它为命名函数，以便更好地理解跟踪；否则，你的跟踪跨度将被命名为 `anonymous`。

```typescript
const bad = new Elysia()
	// ⚠️ 跨度名称将是 anonymous
	.derive(async ({ cookie: { session } }) => {
		return {
			user: await getProfile(session)
		}
	})

const good = new Elysia()
	// ✅ 跨度名称将是 getProfile
	.derive(async function getProfile({ cookie: { session } }) {
		return {
			user: await getProfile(session)
		}
	})
```

## Trace v2
Elysia OpenTelemetry 是基于 Trace v2 构建的，替代了 Trace v1。

Trace v2 允许我们以 100% 的同步行为跟踪我们服务器的任何部分，而不再依赖并行事件监听器桥接（告别死锁）。

它完全重写，不仅更快，而且通过依赖 Elysia 的预编译和代码注入提供可靠且准确的微秒级跟踪。

Trace v2 使用回调监听器而不是 Promise，以确保在继续下一个生命周期事件之前，回调已完成。

以下是 Trace v2 使用示例：
```typescript
import { Elysia } from 'elysia'

new Elysia()
	.trace(({ onBeforeHandle, set }) => {
		// 监听处理前事件
		onBeforeHandle(({ onEvent }) => {
			// 按顺序监听所有子事件
			onEvent(({ onStop, name }) => {
				// 在子事件完成后执行某些操作
				onStop(({ elapsed }) => {
					console.log(name, '耗时', elapsed, '毫秒')

					// 回调在下一个事件之前同步执行
					set.headers['x-trace'] = 'true'
				})
			})
		})
	})
```

你也可以在跟踪内使用 `async`，Elysia 会在回调完成之前阻塞事件，直到下一个事件。

Trace v2 是 Trace v1 的重大变更，请查看 [trace api](/life-cycle/trace) 文档以获取更多信息。

## 规范化
Elysia 1.1 现在在处理数据之前先进行规范化。

为了确保数据一致且安全，Elysia 将努力将数据强制转换为模式中定义的确切数据结构，移除额外字段，并将数据规范化为一致的格式。

例如，如果你有这样的模式：
```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.post('/', ({ body }) => body, {
		body: t.Object({
			name: t.String(),
			point: t.Number()
		}),
		response: t.Object({
			name: t.String()
		})
	})

const { data } = await treaty(app).index.post({
	name: 'SaltyAom',
	point: 9001,
	// ⚠️ 额外字段
	title: '维护者'
})

// 'point' 被移除了，如响应中所定义
console.log(data) // { name: 'SaltyAom' }
```

这段代码做了两件事情：
- 在服务器使用之前，从主体中移除 `title`
- 在发送给客户端之前，从响应中移除 `point`

这对于防止数据不一致，确保数据始终处于正确格式，并不泄露任何敏感信息非常有用。

## 数据类型强制
以前，Elysia 使用精确的数据类型而不进行强制转换，除非明确指定。

例如，要将查询参数解析为数字，你需要明确地将其转换为 `t.Numeric` 而不是 `t.Number`。

```typescript
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.get('/', ({ query }) => query, {
		query: t.Object({
			page: t.Numeric()
		})
	})
```

然而，在 Elysia 1.1 中，我们引入了数据类型强制，这将自动将数据强制转换为正确的数据类型（如果可能）。

这使得我们只需设置 `t.Number` 而不是 `t.Numeric` 来将查询参数解析为数字。
```typescript
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.get('/', ({ query }) => query, {
		query: t.Object({
			// ✅ 页面将被自动强制转换为数字
			page: t.Number()
		})
	})
```

这也适用于 `t.Boolean`、`t.Object` 和 `t.Array`。

这通过在编译阶段的提前时间交换模式与可能的强制转换对应物来实现，效果与使用 `t.Numeric` 或其他强制转换对应物相同。

## Guard as
以前，`guard` 只会应用于当前实例。

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
	.guard({
		beforeHandle() {
			console.log('调用')
		}
	})
	.get('/plugin', () => 'ok')

const main = new Elysia()
	.use(plugin)
	.get('/', () => 'ok')
```

使用这段代码，`onBeforeHandle` 仅在访问 `/plugin` 时被调用，而不会在 `/` 时调用。

在 Elysia 1.1 中，我们为 `guard` 添加了 `as` 属性，允许我们将 guard 应用为 `scoped` 或 `global`，就像添加事件监听器一样。

```typescript
import { Elysia } from 'elysia'

const plugin1 = new Elysia()
	.guard({
		as: 'scoped', // [!code ++]
		beforeHandle() {
			console.log('调用')
		}
	})
	.get('/plugin', () => 'ok')

// 同样的效果
const plugin2 = new Elysia()
	.onBeforeHandle({ as: 'scoped' }, () => {
		console.log('调用')
	})
	.get('/plugin', () => 'ok')
```

这将确保 `onBeforeHandle` 在父级上也会被调用，并遵循作用域机制。

为 guard 添加 `as` 是有用的，因为它允许我们一次性应用多个钩子，同时考虑作用域机制。

但是，它也允许我们应用 `schema`，以确保所有路由的类型安全。

```typescript
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		as: 'scoped',
		response: t.String()
	})
	.get('/ok', () => 'ok')
	.get('/not-ok', () => 1)

const instance = new Elysia()
	.use(plugin)
	.get('/no-ok-parent', () => 2)

const parent = new Elysia()
	.use(instance)
	// 这是可以的，因为响应被定义为作用域
	.get('/ok', () => 3)
```

## 批量转换
继续上述代码，有时我们希望将插件重新应用到父实例，但由于受到 `scoped` 机制的限制，它仅限于一个父级。

要将其应用到父实例，我们需要 **"提高作用域"** 到父实例。

我们可以通过将其强制转换为 `**as('plugin')**` 来实现。

```typescript
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		as: 'scoped',
		response: t.String()
	})
	.get('/ok', () => 'ok')
	.get('/not-ok', () => 1)

const instance = new Elysia()
	.use(plugin)
	.as('plugin') // [!code ++]
	.get('/no-ok-parent', () => 2)

const parent = new Elysia()
	.use(instance)
	// 这将导致错误，因为作用域提高到父级
	.get('/ok', () => 3)
```

`as` 转换将提升所有实例的作用域。

其工作原理是，它读取所有钩子和 schema 的作用域，并将其提升到父实例。

这意味着如果你有 `local` 作用域，并希望将其应用于父实例，你可以使用 `as('plugin')` 提升它。
```typescript
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		response: t.String()
	})
	.onBeforeHandle(() => { console.log('调用') })
	.get('/ok', () => 'ok')
	.get('/not-ok', () => 1)
	.as('plugin') // [!code ++]

const instance = new Elysia()
	.use(plugin)
	.get('/no-ok-parent', () => 2)
	.as('plugin') // [!code ++]

const parent = new Elysia()
	.use(instance)
	// 这将导致错误，因为作用域提高到父级
	.get('/ok', () => 3)
```

这将将 **guard 的响应** 和 **onBeforeHandle** 视为 `scoped`，因此提升到父实例。

**as** 可接受两个可能的参数：
- `plugin` 将事件转换为 **scoped**
- `global` 将事件转换为 **global**

```typescript
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		response: t.String()
	})
	.onBeforeHandle(() => { console.log('调用') })
	.get('/ok', () => 'ok')
	.get('/not-ok', () => 1)
	.as('global') // [!code ++]

const instance = new Elysia()
	.use(plugin)
	.get('/no-ok-parent', () => 2)

const parent = new Elysia()
	.use(instance)
	// 这将导致错误，因为作用域提升到了父级
	.get('/ok', () => 3)
```

这使我们能够一次性提升多个钩子的作用域，避免在每个钩子中添加 `as` 或将其应用于 guard，或提升现有插件的作用域。

```typescript
import { Elysia, t } from 'elysia'

// 在 1.0 中
const from = new Elysia()
	// 在 1.0 中无法将 guard 应用于父级
	.guard({
		response: t.String()
	})
	.onBeforeHandle({ as: 'scoped' }, () => { console.log('调用') })
	.onAfterHandle({ as: 'scoped' }, () => { console.log('调用') })
	.onParse({ as: 'scoped' }, () => { console.log('调用') })

// 在 1.1 中
const to = new Elysia()
	.guard({
		response: t.String()
	})
	.onBeforeHandle(() => { console.log('调用') })
	.onAfterHandle(() => { console.log('调用') })
	.onParse(() => { console.log('调用') })
	.as('plugin')
```

## 响应协调
在 Elysia 1.0 中，Elysia 将优先考虑作用域中的 schema 中的任一项，而不会将它们合并在一起。

然而，在 Elysia 1.1 中，Elysia 将尝试协调来自每个状态码的所有作用域的响应 schema，并将它们合并在一起。

```typescript
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		as: 'global',
		response: {
			200: t.Literal('ok'),
			418: t.Literal('Teapot')
		}
	})
	.get('/ok', ({ error }) => error(418, 'Teapot'))

const instance = new Elysia()
	.use(plugin)
	.guard({
		response: {
			418: t.String()
		}
	})
	// 这是可以的，因为本地响应覆盖了全局响应
	.get('/ok', ({ error }) => error(418, 'ok'))

const parent = new Elysia()
	.use(instance)
	// 因为全局响应的使用，在这里会报错
	.get('/not-ok', ({ error }) => error(418, 'ok'))
```

我们可以看到：
- 在实例中：全局作用域的响应 schema 与本地作用域合并，允许我们在此实例中覆盖全局响应 schema。
- 在父级中：全局作用域的响应 schema 被使用，本地作用域来自 **实例** 的响应没有应用，因为作用域机制的原因。

这在类型级别和运行时都得到了处理，为我们提供了更好的类型完整性。

## 可选路径参数
Elysia 现在通过在路径参数的末尾添加 `?` 来支持可选路径参数。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/ok/:id?', ({ params: { id } }) => id)
	.get('/ok/:id/:name?', ({ params: { id, name } }) => name)
```

在上面的示例中，如果我们访问：
`/ok/1` 将返回 `1`
`/ok` 将返回 `undefined`

默认情况下，如果未提供可选路径参数，则返回 `undefined`。

你可以通过使用 JavaScript 默认值或 schema 默认值提供一个默认值。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/ok/:id?', ({ params: { id } }) => id, {
		params: t.Object({
			id: t.Number({
				default: 1
			})
		})
	})
```

在此示例中，如果我们访问：
`/ok/2` 将返回 `1`
`/ok` 将返回 `1`

## 生成器响应流
以前，你可以通过使用 `@elysiajs/stream` 包流式响应。

然而，这有一个限制：
- 不提供 Eden 的类型安全推断
- 流式响应的方式不是特别直观

现在，Elysia 通过使用生成器函数默认支持响应流式传输。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})
```

在这个例子中，我们可以通过使用 `yield` 关键字流式响应。

使用生成器函数，我们现在可以从生成器函数推断返回类型，并直接将其提供给 Eden。

Eden 现在将从生成器函数推断响应类型为 `AsyncGenerator`。

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})

const { data, error } = await treaty(app).ok.get()
if (error) throw error

for await (const chunk of data)
	console.log(chunk)
```

在流式响应的过程中，请求可能在响应完全流式传输之前被取消，在这种情况下，Elysia 会在请求被取消时自动停止生成器函数。

我们建议将流式响应从 `@elysiajs/stream` 迁移到生成器函数，因为它更直观并提供更好的类型推断。

由于流插件将处于维护模式，并将在将来被弃用。

## 重大变更
- 为所有验证器解析值为字符串，除非明确指定。
    - 参见 [50a5d92](https://github.com/elysiajs/elysia/commit/50a5d92ea3212c5f95f94552e4cb7d31b2c253ad)， [44bf279](https://github.com/elysiajs/elysia/commit/44bf279c3752c6909533d19c83b24413d19d27fa)。
    - 移除查询中的对象自动解析，除非通过查询明确指定。
   	- 除了 RFC 3986 中定义的查询字符串，TLDR；查询字符串可以是字符串或字符串数组。
- 将 `onResponse` 重命名为 `onAfterResponse`
- [内部] 移除 $passthrough，取而代之的是 toResponse
- [内部] UnwrapRoute 类型现在始终以状态码解析。

### 突出变更：
- 为 `set.headers` 添加自动完成
- 移除钩子的原型污染
- 移除查询名称的静态分析
- 移除查询替换 '+' 以消除静态查询分析
- 添加 `server` 属性
- mapResponse 现在在错误事件中被调用
- 协调装饰器在类型级别
- `onError` 支持数组函数
- 解析带有和不带有模式的查询对象
- 弃用 `ObjectString` 解析数组
- Sucrose: 改进 isContextPassToFunction，提取主参数的稳定性
- 添加 `replaceSchemaType`
- 将 `route` 添加到 `context`
- 优化递归 MacroToProperty 类型
- 解析查询数组和对象
- 优化 `composeGeneralHandler` 的代码路径
- 添加调试报告以应对编译器恐慌
- 使用 `Cookie<unknown>` 而不是 `Cookie<any>`，如果未定义模式
- 将大型代码库的路由注册内存使用减少约 36%
    - 减少编译代码路径
    - 移除跟踪推断
    - 减少路由编译代码路径
    - 移除路由处理程序编译缓存 (st${index}, stc${index})
- 在 cookie 中添加未定义的联合，以防 cookie 不存在
- 优化响应状态解析类型推断。

### 错误修复：
- 规范化头部意外使用查询验证器检查
- `onError` 缺失跟踪符号
- 头部验证器编译未被缓存
- 去重宏传播
- 嵌套组中的 WebSocket 现在可以工作
- 错误响应未检查，除非提供成功状态代码

## 结束语
大家好，又是 SaltyAom，感谢你在过去两年对 Elysia 的支持。

这段旅程非常美好，看到如此多对 Elysia 的支持让我非常开心，我都不知道该如何表达。

我仍然很高兴能继续在 Elysia 上工作，并期待与您和 Elysia 共同经历更长的旅程。

然而，独自一人维护 Elysia 是不容易的，这就是为什么我需要你的帮助，支持 Elysia，通过报告错误、创建 PR（毕竟我们是开源的）或分享你喜欢的关于 Elysia 的任何内容，甚至只是打个招呼。

在过去的两年中，我知道 Elysia 还不完美，有时候我可能没有足够的时间回应问题，但我在努力尽力使其变得更好，并对它未来的愿景充满信心。

这就是为什么在未来，我们将有更多的维护者来帮助维护 Elysia 的插件，目前 Bogeychan 和 Fecony 正在帮助维护社区服务器，做得非常出色。

---

如你所知，最初 ElysiaJS 的名字是 "KingWorld"，然后改为 "Elysia"。

和 Elysia 的命名约定一样，这两个名字都是受到动画/游戏/vtuber 次文化的启发。

KingWorld 的名字来自于 [KINGWORLD](https://youtu.be/yVaQpUUAzik?si=Dmto2PgA0uDxNi3D) 这首歌，由白上吹雪和 Sasakure.uk 制作，他们都是我最喜欢的 vtuber 和音乐制作人。

这就是 **为什么 logo 是以北极狐的风格设计**，灵感来源于吹雪。

而 Elysia 显然是以 [Elysia](https://honkai-impact-3rd-archives.fandom.com/wiki/Elysia) 命名，来自游戏《崩坏3》，这也是我为我的猫起名的来源。

同时，我还有一份小礼物，那就是我在空闲时间也是一名 coser，我也做了崩坏3 Elysia 的 cos 服。

![Elysia 维护者](/blog/elysia-11/ely.webp)

所以，Elysia 维护 Elysia，我想是吧？

我计划未来拍摄 Elysia cos 的照片并与你分享，因为我非常喜欢她，想要做到完美。

最后，我期待在下一个版本中见到你，感谢你对 Elysia 的支持。

> 我们曾经如此容易满足和快乐
>
> 即使我打破了你最喜欢的泰迪熊
>
> 一声“对不起”可以弥补一切
>
> 什么时候发生了改变？我们什么时候忘记？
>
> 为什么现在如此难以原谅？
>
> 我们是否在不断前进，永不停止
>
> 因为我们害怕回顾我们所做的事情？

> 其实，我知道只要我们活着
>
> 我们的理想便把河流染成猩红
>
> 回答我，我沉没的船
>
> 我们的明天在哪里？
>
> 我们的未来去哪儿了？
>
> 我们的希望一定要建立在某人的悲伤上吗？

**ขอให้โลกใจดีกับเธอบ้างนะ**

</Blog>
