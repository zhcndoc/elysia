---
title: OpenTelemetry 插件
head:
  - - meta
    - property: 'og:title'
      content: OpenTelemetry 插件 - Elysia 中文文档

  - - meta
    - name: 'description'
      content: 一个为 Elysia 添加了对 OpenTelemetry 支持的插件。开始使用，只需通过 "bun add @elysiajs/opentelemetry" 安装插件。

  - - meta
    - name: 'og:description'
      content: 一个为 Elysia 添加了对 OpenTelemetry 支持的插件。开始使用，只需通过 "bun add @elysiajs/opentelemetry" 安装插件。
---

要开始使用 OpenTelemetry，请安装 `@elysiajs/opentelemetry` 并将其应用于任何实例。

```typescript twoslash
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

Elysia OpenTelemetry 将 **收集任何遵循 OpenTelemetry 标准的库的 span**，并自动应用父 span 和子 span。

在上面的代码中，我们应用了 `Prisma` 来追踪每个查询花费了多长时间。

通过应用 OpenTelemetry，Elysia 将：
- 收集遥测数据
- 将相关生命周期分组在一起
- 测量每个函数花费的时间
- 仪器 HTTP 请求和响应
- 收集错误和异常

你可以将遥测数据导出到 Jaeger、Zipkin、New Relic、Axiom 或其他任何兼容 OpenTelemetry 的后端。

![Axiom 显示从 OpenTelemetry 收集的跟踪](/blog/elysia-11/axiom.webp)

这里是将遥测数据导出到 [Axiom](https://axiom.co) 的一个示例：
```typescript twoslash
const Bun = {
	env: {
		AXIOM_TOKEN: '',
		AXIOM_DATASET: ''
	}
}
// ---cut---
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
Elysia OpenTelemetry 仅用于将 OpenTelemetry 应用于 Elysia 服务器。

你可以正常使用 OpenTelemetry SDK，span 在 Elysia 的请求 span 下运行，它会自动出现在 Elysia 的跟踪中。

然而，我们也提供了一个 `getTracer` 和 `record` 实用程序，用于从应用程序的任何部分收集 span。

```typescript twoslash
const db = {
	query(query: string) {
		return new Promise<unknown>((resolve) => {
			resolve('')
		})
	}
}
// ---cut---
import { Elysia } from 'elysia'
import { record } from '@elysiajs/opentelemetry'

export const plugin = new Elysia()
	.get('', () => {
		return record('database.query', () => {
			return db.query('SELECT * FROM users')
		})
	})
```

## 记录实用程序
`record` 相当于 OpenTelemetry 的 `startActiveSpan`，但会自动处理关闭和捕获异常。

你可以将 `record` 视为代码的一个标签，它将在跟踪中显示。

### 为可观测性准备你的代码库
Elysia OpenTelemetry 将每个钩子的生命周期分组在一起，并读取每个钩子 **函数名** 作为 span 的名字。

这是一个命名你的函数的好时机。

如果你的钩子处理程序是一个箭头函数，你可以将其重构为命名函数，以便更好地理解跟踪，否则，你的跟踪 span 将命名为 `anonymous`。

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

## 配置
此插件扩展了 OpenTelemetry SDK 参数选项。

以下是插件接受的配置：

### autoDetectResources - 布尔型
自动检测资源，使用默认资源检测器。

默认值: `true`

### contextManager - ContextManager
使用自定义上下文管理器。

默认值: `AsyncHooksContextManager`

### textMapPropagator - TextMapPropagator
使用自定义传播器。

默认值: `CompositePropagator` 使用 W3C Trace Context 和 Baggage

### metricReader - MetricReader
添加一个 MetricReader，它将被传递给 MeterProvider。

### views - View[]
一个视图列表，将被传递给 MeterProvider。

接受 View-实例的数组。这个参数可以用来配置直方图度量的显式桶大小。

### instrumentations - (Instrumentation | Instrumentation[])[]
配置仪器。

默认情况下 `getNodeAutoInstrumentations` 是启用的，如果你想要启用它们，你可以使用元包或单独配置每个仪器。

默认值: `getNodeAutoInstrumentations()`

### resource - IResource
配置资源。

资源也可以通过使用 SDK 的 autoDetectResources 方法来检测。

### resourceDetectors - Array<Detector | DetectorSync>
配置资源检测器。默认情况下，资源检测器是 [envDetector, processDetector, hostDetector]。注意：为了启用检测，参数 autoDetectResources 必须为 true。

如果你没有设置 resourceDetectors，你也可以使用环境变量 OTEL_NODE_RESOURCE_DETECTORS 来启用某些检测器，或者完全禁用它们：

- env
- host
- os
- process
- serviceinstance（实验性的）
- all - 启用上面所有的资源检测器
- none - 禁用资源检测

例如，只启用 env、host 检测器：

```bash
export OTEL_NODE_RESOURCE_DETECTORS="env,host"
```

### sampler - Sampler
配置自定义采样器。默认情况下，所有的跟踪都会被采样。

### serviceName - 字符串
命名空间，用于标识。

### spanProcessors - SpanProcessor[]
一个 span 处理器的数组，注册到 tracer provider。

### traceExporter - SpanExporter
配置一个追踪器导出器。如果配置了导出器，它将和 `BatchSpanProcessor` 一起使用。

如果没有通过编程方式配置导出器或 span 处理器，这个包将自动设置默认的 otlp 导出器，使用 http/protobuf 协议，并带有一个 `BatchSpanProcessor`。

### spanLimits - SpanLimits
配置追踪参数。这些是用来配置追踪器的相同的追踪参数。
