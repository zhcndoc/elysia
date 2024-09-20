---
title: Elysia 1.1 - 成年人的天堂
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.1 - 成年人的天堂

    - - meta
      - name: 'description'
        content: 引入 OpenTelemetry 并介绍追踪 v2。数据规范化与标准化。守卫插件与批量转换。可选路径参数。装饰器与响应状态协调。生成器响应流。

    - - meta
      - property: 'og:description'
        content: 引入 OpenTelemetry 并介绍追踪 v2。数据规范化与标准化。守卫插件与批量转换。可选路径参数。装饰器与响应状态协调。生成器响应流。

    - - meta
      - property: 'og:image'
        content: https://elysia.zhcndoc.com/blog/elysia-11/elysia-11.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysia.zhcndoc.com/blog/elysia-11/elysia-11.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.1 - 成年人的天堂"
    src="/blog/elysia-11/elysia-11.webp"
    alt="Elysia 1.1 标志的蓝紫色调"
    author="saltyaom"
    date="2024 年 7 月 16 日"
    shadow
>

以 Mili 的一首歌命名的 [“成年人的天堂”](https://youtu.be/KawV_oK6lIc)，并被用作[明日方舟第三季 TV 动画的商业宣传片](https://youtu.be/sZ1OD0cL6Qw)的开场曲。

作为一个从第一天就开始玩明日方舟的玩家，同时也是 Mili 的长期粉丝，我从未想过 Mili 会为明日方舟创作一首歌曲。你应该去听听他们，他们是最棒的。

Elysia 1.1 专注于以下几个方面的开发者体验改进：
- [OpenTelemetry](#opentelemetry)
- [Trace v2 (breaking change)](#trace-v2)
- [标准化](#normalization)
- [数据类型强制转换](#data-type-coercion)
- [Guard as](#guard-as)
- [批量 `as` 转换](#bulk-cast)
- [响应状态协调](#response-reconcilation)
- [可选路径参数](#optional-path-parameter)
- [生成器响应流](#generator-response-stream)

## OpenTelemetry
可观测性是生产环境中一个重要的方面。

它允许我们了解我们的服务器在生产环境中的工作方式，识别问题和瓶颈。

用于可观测性的最流行工具之一是 **OpenTelemetry**。然而，我们承认，正确地设置和为服务器添加仪器是一个困难且耗时的过程。

将 OpenTelemetry 集成到大多数现有的框架和库中是很困难的。

大多数解决方案都围绕着一些不规范的方法，如猴子补丁、原型污染或手动仪器，因为这些框架最初并不是为可观测性设计的。

这就是为什么我们在 Elysia 上引入了对 OpenTelemetry 的**第一方支持**。

要开始使用 OpenTelemetry，请安装 `@elysiajs/opentelemetry` 并将其插件应用到任何实例上。

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

![Jaeger 显示自动收集的追踪](/blog/elysia-11/jaeger.webp)

Elysia OpenTelemetry 能够收集遵循 OpenTelemetry 标准的所有库的 span，并且会自动应用父 span 和子 span。

在上面的代码中，我们使用 `Prisma` 来追踪每个查询花费了多长时间。

通过应用 OpenTelemetry，Elysia 将：
- 收集遥测数据
- 将相关生命周期分组在一起
- 测量每个函数执行的时间
- 仪器 HTTP 请求和响应
- 收集错误和异常

你可以将遥测数据导出到 Jaeger、Zipkin、New Relic、Axiom 或任何其他与 OpenTelemetry 兼容的后端。

这里有一个将遥测数据导出到 [Axiom](https://axiom.co) 的例子。
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

![Axiom 显示从 OpenTelemetry 自动收集的追踪](/blog/elysia-11/axiom.webp)

Elysia 的 OpenTelemetry 是为了将 OpenTelemetry 应用于 Elysia 服务器而设计的。

你仍然可以使用 OpenTelemetry SDK，span 将会在 Elysia 的请求 span 下运行，它们将自动在 Elysia 的追踪中显示。

然而，我们也提供了一个 `getTracer` 和 `record` 实用程序，用于在任何部分收集 span。

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

`record` 是 OpenTelemetry 的 `startActiveSpan` 的等效项，但它会自动关闭 span 并捕获异常。

你可以将 `record` 视为代码中的一个标签，它将在追踪中显示。

### 为监控准备你的代码库
Elysia 的 OpenTelemetry 将根据函数名分组生命周期，并读取每个钩子的**函数名**作为 span 的名称。

这是一个重新命名你的函数的好时机。

如果你的钩子处理器是一个箭头函数，你可能需要将其重构为命名函数，以便更好地理解追踪。

```typescript
const bad = new Elysia()
	// ⚠️ span name will be anonymous
	.derive(async ({ cookie: { session } }) => {
		return {
			user: await getProfile(session)
		}
	})

const good = new Elysia()
	// ✅ span name will be getProfile
	.derive(async function getProfile({ cookie: { session } }) {
		return {
			user: await getProfile(session)
		}
	})
```

## 追踪 v2
Elysia 的 OpenTelemetry 建立在追踪 v2 之上，取代了追踪 v1。

追踪 v2 允许我们在 100% 同步行为的情况下追踪服务器的任何部分，而不依赖于并行事件监听器桥 (再见死锁)。

它完全重写，不仅速度更快，而且可靠，准确到微秒，依赖 Elysia 的提前编译和代码注入。

追踪 v2 使用回调监听器，而不是 Promise，以确保回调在继续下一个生命周期事件之前完成。

这是追踪 v2 的使用示例：
```typescript
import { Elysia } from 'elysia'

new Elysia()
	.trace(({ onBeforeHandle, set }) => {
		// 在处理之前的事件上监听
		onBeforeHandle(({ onEvent }) => {
			// 监听所有子事件顺序
			onEvent(({ onStop, name }) => {
				// 事件结束后执行某件事
				onStop(({ elapsed }) => {
					console.log(name, 'took', elapsed, 'ms')

					// callback 是在下一个事件之前同步执行的
					set.headers['x-trace'] = 'true'
				})
			})
		})
	})
```

你也可以在追踪中使用 `async`，Elysia 将在回调完成之前阻塞事件，然后继续下一个事件。

追踪 v2 是追踪 v1 的破坏性变更，请查看[追踪 API](/life-cycle/trace) 文档获取更多信息。

## 标准化
Elysia 1.1 现在在处理数据之前对其进行标准化。

为了确保数据的统一性和安全性，Elysia 会尝试将数据强制转换为在模式中定义的确切数据形状，删除额外的字段，并将数据标准化为一致的格式。

例如，如果你有这样的模式：
```typescript twoslash
// @errors: 2353
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
	// ⚠️ 删除额外的字段
	title: '维护者'
})

// 'point' is removed as defined in response
console.log(data) // { name: 'SaltyAom' }
```

这段代码做了两件事：
- 在服务器上使用之前，从 body 中移除 `title`
- 在发送给客户端之前，从响应中移除 `point`

这有助于防止数据的不一致性，并确保数据始终以正确的格式出现，不泄露任何敏感信息。

## 数据类型强制转换
之前，Elysia 使用的是一个确切的数据类型，除非明确指定，否则不进行强制转换。

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

然而，在 Elysia 1.1 中，我们引入了数据类型强制转换，这将自动将数据强制转换为模式中定义的确切数据类型，如果可能的话。

允许我们将 `t.Number` 设置为解析查询参数为数字，而不是 `t.Numeric`。
```typescript
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.get('/', ({ query }) => query, {
		query: t.Object({
			// ✅ page will be coerced into a number automatically
			page: t.Number()
		})
	})
```

这同样适用于 `t.Boolean`、`t.Object` 和 `t.Array`。

这是通过在编译阶段之前用可能强制转换的对应模式替换模式来完成的，与使用 `t.Numeric` 或其他强制转换对应模式相同。

## 守卫
之前，`守卫` 只会应用到当前实例。

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
	.guard({
		beforeHandle() {
			console.log('called')
		}
	})
	.get('/plugin', () => 'ok')

const 主 = new Elysia()
	.use(plugin)
	.get('/', () => 'ok')
```

使用这段代码，`onBeforeHandle` 只有在访问 `/plugin` 时会被调用，而不是 `/`。

在 Elysia 1.1 中，我们为 `守卫` 添加了 `as` 属性，允许我们将守卫视为 `作用域` 或 `全局`，就像添加事件监听器一样。

```typescript
import { Elysia } from 'elysia'

const plugin1 = new Elysia()
	.guard({
		as: 'scoped', // [!code ++]
		beforeHandle() {
			console.log('called')
		}
	})
	.get('/plugin', () => 'ok')

// Same as
const plugin2 = new Elysia()
	.onBeforeHandle({ as: 'scoped' }, () => {
		console.log('called')
	})
	.get('/plugin', () => 'ok')
```

这将确保 `onBeforeHandle` 在父实例上也被调用，并遵循作用域机制。

添加 `as` 到守卫是有用的，因为它允许我们在尊重作用域机制的同时，将多个钩子应用于所有路由。

然而，它也允许我们应用 `模式` 以确保整个应用的路由类型安全。

```typescript twoslash
// @errors: 2304 2345
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
	// This is fine because response is defined as scoped
	.get('/ok', () => 3)
```

## 批量投射
从上面的代码继续，有时我们希望将插件重新应用于父实例，但由于 `scoped` 机制的限制，它仅限于 1 个父实例。

为了应用到父实例，我们需要将范围**提升到父实例**。

我们可以通过将其投射为 `**as('plugin')**` 来实现这一点。

```typescript twoslash
// @errors: 2304 2345
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
	// This now error because `scoped` is lifted up to parent
	.get('/ok', () => 3)
```

`as` 类型转换将提升实例的所有作用域。

它的运作方式是，它会读取所有钩子和模式作用域，并将其提升到父实例。

这意味着如果你有一个 `local` 作用域，并且想要将其应用于父实例，你可以使用 `as('plugin')` 来提升它。
```typescript twoslash
// @errors: 2304 2345
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		response: t.String()
	})
	.onBeforeHandle(() => { console.log('called') })
	.get('/ok', () => 'ok')
	.get('/not-ok', () => 1)
	.as('plugin') // [!code ++]

const instance = new Elysia()
	.use(plugin)
	.get('/no-ok-parent', () => 2)
	.as('plugin') // [!code ++]

const parent = new Elysia()
	.use(instance)
	// This now error because `scoped` is lifted up to parent
	.get('/ok', () => 3)
```

这将抛出**守卫响应**和 **onBeforeHandle** 为 `scoped`，从而将其提升到父实例。

**as** 接受两个可能的参数：
- `plugin` 将事件抛出为 **scoped**
- `global` 将事件抛出为 **global**

```typescript twoslash
// @errors: 2304 2345
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		response: t.String()
	})
	.onBeforeHandle(() => { console.log('called') })
	.get('/ok', () => 'ok')
	.get('/not-ok', () => 1)
	.as('global') // [!code ++]

const instance = new Elysia()
	.use(plugin)
	.get('/no-ok-parent', () => 2)

const parent = new Elysia()
	.use(instance)
	// This now error because `scoped` is lifted up to parent
	.get('/ok', () => 3)
```

这使我们能够一次性地投射多个钩子作用域，而无需为每个钩子添加 `as`，或者将其应用于守卫，或者提升现有的插件作用域。

```typescript
import { Elysia, t } from 'elysia'

// On 1.0
const from = new Elysia()
	// Not possible to apply guard to parent on 1.0
	.guard({
		response: t.String()
	})
	.onBeforeHandle({ as: 'scoped' }, () => { console.log('called') })
	.onAfterHandle({ as: 'scoped' }, () => { console.log('called') })
	.onParse({ as: 'scoped' }, () => { console.log('called') })

// On 1.1
const to = new Elysia()
	.guard({
		response: t.String()
	})
	.onBeforeHandle(() => { console.log('called') })
	.onAfterHandle(() => { console.log('called') })
	.onParse(() => { console.log('called') })
	.as('plugin')
```

## 响应和解
在 Elysia 1.0 中，Elysia 将偏好范围中的任意一个模式，并且不会将它们合并在一起。

然而，在 Elysia 1.1 中，Elysia 将尝试调和来自每个状态码的所有范围中的响应模式，并将它们合并在一起。

```typescript twoslash
// @errors: 2304 2345
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
	// This is fine because local response override
	.get('/ok', ({ error }) => error(418, 'ok'))

const parent = new Elysia()
	.use(instance)
	// Error because global response
	.get('/not-ok', ({ error }) => error(418, 'ok'))
```

我们可以看到：
- 在实例中：响应模式从全局作用域合并到本地作用域，允许我们在实例中覆盖全局响应模式
- 在父实例中：响应模式从全局作用域使用，本地作用域 (实例) 未应用，因为作用域机制

这是在类型级别和运行时都处理的，为我们提供了更好的类型完整性。

## 可选路径参数
Elysia 现在支持可选路径参数，通过在路径参数末尾添加 `?`。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/ok/:id?', ({ params: { id } }) => id)
	.get('/ok/:id/:name?', ({ params: { id, name } }) => name)
```

在上面的例子中，如果我们访问：
`/ok/1` 将返回 `1`
`/ok` 将返回 `undefined`

默认情况下，如果未提供可选路径参数，访问时将返回 `undefined`。

你可以通过 JavaScript 的默认值或模式默认值提供默认值。

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

在这个例子中，如果我们访问：
`/ok/2` 将返回 `1`
`/ok` 将返回 `1`

## 生成器响应流
以前，你可以通过使用 `@elysiajs/stream` 包来流式响应。

然而，存在一个限制：
- 未提供类型安全的 Eden 类型推断
- 流式响应的实现不够直观

现在，Elysia 支持响应流式传输，通过使用生成器函数。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})
```

在这个例子中，我们可以通过使用 `yield` 关键字流式传输响应。

使用生成器函数，我们现在可以从生成器函数中推断返回类型，并直接提供给 Eden。

Eden 现在会从生成器函数推断响应类型为 `AsyncGenerator`。

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

当流式传输响应时，通常请求可能在响应完全流式传输之前被取消。在这种情况下，Elysia 将自动停止生成器函数。

我们建议将 `@elysiajs/stream` 迁移到生成器函数以流式传输响应，因为它更加直观并提供了更好的类型推断。

因为流插件现在处于维护模式，将来它会将被弃用。

## 破坏性变更
- 解析值作为**字符串**，除非明确指定。
    - 查看 [50a5d92](https://github.com/elysiajs/elysia/commit/50a5d92ea3212c5f95f94552e4cb7d31b2c253ad)，[44bf279](https://github.com/elysiajs/elysia/commit/44bf279c3752c6909533d19c83b24413d19d27fa)。
    - 删除对象自动解析，除非在查询中明确指定 `query`
   	- 除了 RFC 3986 中定义的查询字符串，简而言之，查询字符串可以是字符串或字符串数组。
- 将 `onResponse` 重命名为 `onAfterResponse`
- [内部] 移除 $passthrough，改用 toResponse
- [内部] 现在 UnwrapRoute 类型总是以状态码解决

### 显著变化：
- 添加 `set.headers` 的自动完成功能
- 从钩子中移除原型膨胀
- 移除查询名称的静态分析
- 移除查询替换中的 ‘+’，以利于移除静态查询分析
- 添加 `server` 属性
- `mapResponse` 现在在错误事件中调用
- 在类型级别进行调和装饰器
- `onError` 支持数组函数
- 解析带有和没有模式的查询对象
- 弃用 `ObjectString` 用于解析数组
- Sucrose：改进 isContextPassToFunction 和 extractMainParameter 的稳定性
- 添加 `replaceSchemaType`
- 向 `context` 添加 `route`
- 优化递归 MacroToProperty 类型
- 解析查询数组和对象
- 优化 `composeGeneralHandler` 的代码路径
- 在编译器恐慌时添加调试报告
- 如果未定义模式，则使用 `Cookie<unknown>` 而不是 `Cookie<any>`
- 在大型代码库中减少路由注册的内存使用量约 36%
	- 减少编译代码路径
	- 移除跟踪推断
	- 减少路由编译代码路径
	- 移除路由处理程序编译缓存 (st${index}，stc${index})
- 在 cookie 不存在的情况下，向 cookie 添加 undefined 联合类型
- 优化响应状态解析类型推断

### Bug fix:
- 正常化标题意外地使用了查询验证器检查而不是
- `onError` 缺少跟踪符号
- 标题验证器的编译没有被缓存
- 去重宏传播
- 嵌套组中的 Websocket 现在可以工作
- 除非提供成功的状态码，否则不会检查错误响应

## Afterword
大家好，我是 SaltyAom，再次感谢大家在过去的两年中对 Elysia 的支持。

这是一段美好的旅程，看到大家对 Elysia 的巨大支持让我感到非常高兴，以至于我不知道如何表达我的感受。

我仍然很高兴能够继续开发 Elysia，并且期待着与你和 Elysia 一起踏上一段漫长的旅程。

然而，独自一人开发 Elysia 并不容易，这就是为什么我需要你的帮助来支持 Elysia，无论是通过报告一个 bug，创建一个 PR (毕竟我们是开源的)，还是分享你对 Elysia 的任何喜欢之处，甚至是简单地说一声嗨。

在过去的两年里，我知道 Elysia 并不完美，有时我可能没有足够的时间来回应问题，但我正在尽我最大的努力让它变得更好，并且有一个关于它可能成为什么的愿景。

这就是为什么在未来，我们将有更多的维护者来帮助维护 Elysia 插件，目前 Bogeychan 和 Fecony 在帮助维护社区服务器方面做得很好。

---

你可能知道或不知道，最初 ElysiaJS 被称为 “KingWorld”，后来改名为 “Elysia”。

与 Elysia 的命名一致，两者都受到动漫/游戏/虚拟主播亚文化的启发。

KingWorld 这个名字来源于 Shirakami Fubuki 和 Sasakure.uk 的歌曲 [KINGWORLD](https://youtu.be/yVaQpUUAzik?si=Dmto2PgA0uDxNi3D)，他们都是我最喜欢的虚拟主播和音乐制作人。

这就是为什么 Logo 设计采用了 Fubuki 风格的北极狐。

而 Elysia 显然是得名于游戏《崩坏 3rd》中的 [Elysia](https://honkai-impact-3rd-archives.fandom.com/wiki/Elysia)，她也是我最喜欢的角色，而且我还以她的名字命名了我的猫。

我也有一个小礼物，正如你所知，我在业余时间也是一个 cosplayer，而且我也有一套《崩坏 3rd》Elysia 的 cosplay。

![Elysia maintainer](/blog/elysia-11/ely.webp)

所以，大概是 Elysia 维护 Elysia 吧？

我计划将来做一个 Elysia cosplay 的摄影并分享给你，因为我非常喜欢她，我想让它完美。

话虽如此，我期待在下一个版本中见到你，感谢你对 Elysia 的支持。

> We were so easily satisfied and happy
>
> Even if I break your favorite teddy bear
>
> A "sorry" could fix everything
>
> When did it change? When did we forget?
>
> Why is it now so hard to forgive?
>
> Do we advance, never stopping our steps
>
> Because we are scared to look back on what we did?

> Truth is, I know as long as we live
>
> Our ideals dye rivers scarlet
>
> Answer me, my sinking ship
>
> Where's our tomorrow?
>
> Where does our future go?
>
> Does our hope have to be sown upon somebody's sorrow?

**ขอให้โลกใจดีกับเธอบ้างนะ**

</Blog>
