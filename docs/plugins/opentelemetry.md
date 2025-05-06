---
title: OpenTelemetry 插件 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: OpenTelemetry 插件 - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia 的插件，增加对 OpenTelemetry 的支持。开始时请使用 "bun add @elysiajs/opentelemetry" 安装插件。

  - - meta
    - name: 'og:description'
      content: Elysia 的插件，增加对 OpenTelemetry 的支持。开始时请使用 "bun add @elysiajs/opentelemetry" 安装插件。
---

# OpenTelemetry

::: tip
此页面是 **OpenTelemetry** 的 **配置参考**，如果您想要设置和集成 OpenTelemetry，我们建议您查看 [与 OpenTelemetry 集成](/integrations/opentelemetry)。
:::

要开始使用 OpenTelemetry，请安装 `@elysiajs/opentelemetry` 并将插件应用于任意实例。

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

![jaeger 显示自动收集的追踪](/blog/elysia-11/jaeger.webp)

Elysia OpenTelemetry 将 **收集任何与 OpenTelemetry 标准兼容的库的跨度**，并将自动应用父子跨度。

## 使用
请参见 [opentelemetry](/integrations/opentelemetry) 以获取用法和实用工具

## 配置
此插件扩展 OpenTelemetry SDK 参数选项。

以下是插件接受的配置

### autoDetectResources - 布尔值
使用默认资源探测器自动检测环境中的资源。

默认值：`true`

### contextManager - ContextManager
使用自定义上下文管理器。

默认值：`AsyncHooksContextManager`

### textMapPropagator - TextMapPropagator
使用自定义传播器。

默认值：`CompositePropagator`，使用 W3C Trace Context 和 Baggage

### metricReader - MetricReader
添加一个将被传递给 MeterProvider 的 MetricReader。

### views - View[]
要传递给 MeterProvider 的视图列表。

接受 View 实例的数组。此参数可用于配置直方图指标的显式桶大小。

### instrumentations - (Instrumentation | Instrumentation[])[]
配置仪器。

默认情况下启用 `getNodeAutoInstrumentations`，如果您希望启用它们，您可以使用元包或单独配置每个仪器。

默认值：`getNodeAutoInstrumentations()`

### resource - IResource
配置资源。

资源也可以通过使用 SDK 的 autoDetectResources 方法来检测。

### resourceDetectors - Array<Detector | DetectorSync>
配置资源探测器。默认情况下，资源探测器为 [envDetector, processDetector, hostDetector]。 注意：为了启用探测，参数 autoDetectResources 必须为 true。

如果没有设置 resourceDetectors，您还可以使用环境变量 OTEL_NODE_RESOURCE_DETECTORS 来启用特定探测器或完全禁用它们：

- env
- host
- os
- process
- serviceinstance (实验性)
- all - 启用上述所有资源探测器
- none - 禁用资源探测

例如，只启用 env 和 host 探测器：

```bash
export OTEL_NODE_RESOURCE_DETECTORS="env,host"
```

### sampler - Sampler
配置自定义采样器。默认情况下，所有追踪将被采样。

### serviceName - 字符串
要标识的命名空间。

### spanProcessors - SpanProcessor[]
要注册到追踪器提供程序的跨度处理器数组。

### traceExporter - SpanExporter
配置追踪导出器。如果配置了导出器，则将与 `BatchSpanProcessor` 一起使用。

如果没有以编程方式配置导出器或跨度处理器，该软件包将自动设置使用 http/protobuf 协议的默认 otlp 导出器和一个 BatchSpanProcessor。

### spanLimits - SpanLimits
配置追踪参数。这些与配置追踪器使用的相同追踪参数。