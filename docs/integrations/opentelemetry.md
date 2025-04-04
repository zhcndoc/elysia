---
title: OpenTelemetry 插件 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: OpenTelemetry 插件 - ElysiaJS

  - - meta
    - name: 'description'
      content: 为 Elysia 添加 OpenTelemetry 支持的插件。开始时，请使用 "bun add @elysiajs/opentelemetry" 安装插件。

  - - meta
    - name: 'og:description'
      content: 为 Elysia 添加 OpenTelemetry 支持的插件。开始时，请使用 "bun add @elysiajs/opentelemetry" 安装插件。
---

# OpenTelemetry

要开始使用 OpenTelemetry，请安装 `@elysiajs/opentelemetry` 并将插件应用于任何实例。

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

![jaeger 显示收集到的跟踪信息](/blog/elysia-11/jaeger.webp)

Elysia OpenTelemetry 将 **收集与 OpenTelemetry 标准兼容的任何库的 span**，并会自动应用父子 span。

在上面的代码中，我们应用 `Prisma` 来跟踪每个查询所花费的时间。

通过应用 OpenTelemetry，Elysia 将：
- 收集遥测数据
- 将相关生命周期分组
- 测量每个函数所花费的时间
- 对 HTTP 请求和响应进行仪器化
- 收集错误和异常

您可以将遥测数据导出到 Jaeger、Zipkin、New Relic、Axiom 或任何其他与 OpenTelemetry 兼容的后端。

![axiom 显示收集到的 OpenTelemetry 跟踪信息](/blog/elysia-11/axiom.webp)

以下是将遥测数据导出到 [Axiom](https://axiom.co) 的示例
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

## OpenTelemetry SDK
Elysia OpenTelemetry 仅用于将 OpenTelemetry 应用到 Elysia 服务器。

您可以正常使用 OpenTelemetry SDK，并且 span 在 Elysia 的请求 span 下运行，它将自动出现在 Elysia 的跟踪中。

然而，我们也提供 `getTracer` 和 `record` 实用工具，以便从您应用的任何部分收集 span。

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

## Record 实用工具
`record` 相当于 OpenTelemetry 的 `startActiveSpan`，但它将自动处理关闭并捕获异常。

您可以将 `record` 看作是您的代码的标签，这将在跟踪中显示。

### 为可观察性准备您的代码库
Elysia OpenTelemetry 将分组生命周期并读取每个钩子的 **函数名称** 作为 span 的名称。

现在是 **命名您的函数** 的好时机。

如果您的钩子处理程序是一个箭头函数，您可以将其重构为命名函数，以便更好地理解跟踪，否则，您的跟踪 span 将被命名为 `anonymous`。

```typescript
const bad = new Elysia()
	// ⚠️ span 名称将是匿名的
	.derive(async ({ cookie: { session } }) => {
		return {
			user: await getProfile(session)
		}
	})

const good = new Elysia()
	// ✅ span 名称将是 getProfile
	.derive(async function getProfile({ cookie: { session } }) {
		return {
			user: await getProfile(session)
		}
	})
```

## getCurrentSpan
`getCurrentSpan` 是一个实用工具，用于在处理程序外部获取当前请求的当前 span。

```typescript
import { getCurrentSpan } from '@elysiajs/opentelemetry'

function utility() {
	const span = getCurrentSpan()
	span.setAttributes({
		'custom.attribute': 'value'
	})
}
```

这在处理程序外部通过从 `AsyncLocalStorage` 获取当前 span 而工作。

## setAttribute
`setAttribute` 是一个用于将属性设置为当前 span 的实用工具。

```typescript
import { setAttribute } from '@elysiajs/opentelemetry'

function utility() {
	setAttribute('custom.attribute', 'value')
}
```

这是 `getCurrentSpan().setAttributes` 的语法糖。

## 配置
请查看 [opentelemetry 插件](/plugins/opentelemetry) 以获取配置选项和定义。
