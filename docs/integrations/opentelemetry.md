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

new Elysia().use(
	opentelemetry({
		spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())]
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

new Elysia().use(
	opentelemetry({
		spanProcessors: [
			new BatchSpanProcessor(
				new OTLPTraceExporter({
					url: 'https://api.axiom.co/v1/traces', // [!code ++]
					headers: {
						// [!code ++]
						Authorization: `Bearer ${Bun.env.AXIOM_TOKEN}`, // [!code ++]
						'X-Axiom-Dataset': Bun.env.AXIOM_DATASET // [!code ++]
					} // [!code ++]
				})
			)
		]
	})
)
```

## 仪器化

许多仪器化库要求 SDK **必须** 在导入模块之前运行。

例如，要使用 `PgInstrumentation`，`OpenTelemetry SDK` 必须在导入 `pg` 模块之前运行。

要在 Bun 中实现这一点，我们可以

1. 将 OpenTelemetry 设置分成一个不同的文件
2. 创建 `bunfig.toml` 以预加载 OpenTelemetry 设置文件

让我们在 `src/instrumentation.ts` 中创建一个新文件

```ts [src/instrumentation.ts]
import { opentelemetry } from '@elysiajs/opentelemetry'
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg'

export const instrumentation = opentelemetry({
	instrumentations: [new PgInstrumentation()]
})
```

然后我们可以将此 `instrumentaiton` 插件应用于 `src/index.ts` 中的主实例

```ts [src/index.ts]
import { Elysia } from 'elysia'
import { instrumentation } from './instrumentation.ts'

new Elysia().use(instrumentation).listen(3000)
```

然后创建一个 `bunfig.toml`，内容如下：

```toml [bunfig.toml]
preload = ["./src/instrumentation.ts"]
```

这将告诉 Bun 在运行 `src/index.ts` 之前加载并设置 `instrumentation`，以允许 OpenTelemetry 按需设置。

### 部署到生产环境
如果您使用 `bun build` 或其他打包工具。

由于 OpenTelemetry 依赖于猴子补丁 `node_modules/<library>`。为了确保仪器化正常工作，我们需要指定要被仪器化的库作为外部模块，以将其排除在打包之外。

例如，如果您使用 `@opentelemetry/instrumentation-pg` 来对 `pg` 库进行仪器化。我们需要将 `pg` 排除在打包之外，并确保它从 `node_modules/pg` 导入。

要使其正常工作，我们可以通过 `--external pg` 将 `pg` 指定为外部模块
```bash
bun build --compile --external pg --outfile server src/index.ts
```

这告诉 bun 不要将 `pg` 打包到最终输出文件中，并将在运行时从 **node_modules** 目录导入。所以在生产服务器上，您还必须保留 **node_modules** 目录。

建议在 **package.json** 中将应在生产服务器上可用的包指定为 **dependencies**，并使用 `bun install --production` 仅安装生产依赖项。

```json
{
	"dependencies": {
		"pg": "^8.15.6"
	},
	"devDependencies": {
		"@elysiajs/opentelemetry": "^1.2.0",
		"@opentelemetry/instrumentation-pg": "^0.52.0",
		"@types/pg": "^8.11.14",
		"elysia": "^1.2.25"
	}
}
```

然后在运行构建命令后，在生产服务器上
```bash
bun install --production
```

如果 node_modules 目录仍包含开发依赖项，您可以删除 node_modules 目录并再次安装生产依赖项。

## OpenTelemetry SDK

Elysia OpenTelemetry 仅用于将 OpenTelemetry 应用到 Elysia 服务器。

您可以正常使用 OpenTelemetry SDK，并且 span 在 Elysia 的请求 span 下运行，它将自动出现在 Elysia 的跟踪中。

然而，我们也提供 `getTracer` 和 `record` 实用工具，以便从您应用的任何部分收集 span。

```typescript
import { Elysia } from 'elysia'
import { record } from '@elysiajs/opentelemetry'

export const plugin = new Elysia().get('', () => {
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

## setAttributes

`setAttribute` 是一个用于将属性设置为当前 span 的实用工具。

```typescript
import { setAttributes } from '@elysiajs/opentelemetry'

function utility() {
	span.setAttributes({
		'custom.attribute': 'value'
	})
}
```

这是 `getCurrentSpan().setAttributes` 的语法糖。

## 配置

请查看 [opentelemetry 插件](/plugins/opentelemetry) 以获取配置选项和定义。