---
title: OpenTelemetry 插件 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: OpenTelemetry 插件 - ElysiaJS

  - - meta
    - name: 'description'
      content: 为 Elysia 添加 OpenTelemetry 支持的插件。首先使用 "bun add @elysiajs/opentelemetry" 安装插件。

  - - meta
    - name: 'og:description'
      content: 为 Elysia 添加 OpenTelemetry 支持的插件。首先使用 "bun add @elysiajs/opentelemetry" 安装插件。
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

![jaeger 显示自动收集的 trace](/blog/elysia-11/jaeger.webp)

Elysia OpenTelemetry 将 **收集任何符合 OpenTelemetry 标准的库的 span**，并会自动应用父子 span。

## 使用
有关用法和工具，请参见 [opentelemetry](/recipe/opentelemetry)。

## 配置
此插件扩展了 OpenTelemetry SDK 参数选项。

下面是插件接受的配置

### autoDetectResources - boolean
从环境中使用默认资源探测器自动检测资源。

默认值: `true`

### contextManager - ContextManager
使用自定义上下文管理器。

默认值: `AsyncHooksContextManager`

### textMapPropagator - TextMapPropagator
使用自定义传播器。

默认值: `CompositePropagator`，使用 W3C Trace Context 和 Baggage

### metricReader - MetricReader
添加一个将传递给 MeterProvider 的 MetricReader。

### views - View[]
要传递给 MeterProvider 的视图列表。

接受 View 实例的数组。此参数可用于配置直方图指标的显式桶大小。

### instrumentations - (Instrumentation | Instrumentation[])[]
配置仪器。

默认情况下，`getNodeAutoInstrumentations` 已启用，如果您想启用它们，可以使用元包或单独配置每个仪器。

默认值: `getNodeAutoInstrumentations()`

### resource - IResource
配置资源。

资源也可以通过 SDK 的 autoDetectResources 方法进行检测。

### resourceDetectors - Array<Detector | DetectorSync>
配置资源探测器。默认情况下，资源探测器为 [envDetector, processDetector, hostDetector]。注意：为了启用探测，参数 autoDetectResources 必须为 true。

如果未设置 resourceDetectors，您也可以使用环境变量 OTEL_NODE_RESOURCE_DETECTORS 来仅启用某些探测器，或完全禁用它们：

- env
- host
- os
- process
- serviceinstance (实验性)
- all - 启用以上所有资源探测器
- none - 禁用资源探测

例如，要只启用 env 和 host 探测器：

```bash
export OTEL_NODE_RESOURCE_DETECTORS="env,host"
```

### sampler - Sampler
配置自定义采样器。默认情况下，所有 traces 将被采样。

### serviceName - string
要标识的命名空间。

### spanProcessors - SpanProcessor[]
要注册到跟踪提供者的 span 处理器数组。

### traceExporter - SpanExporter
配置一个 trace 导出器。如果配置了导出器，将与 `BatchSpanProcessor` 一起使用。

如果没有以编程方式配置导出器或 span 处理器，此包将自动设置默认的 otlp 导出器，使用 http/protobuf 协议和 BatchSpanProcessor。

### spanLimits - SpanLimits
配置捕获参数。这些是用于配置跟踪器的相同 trace 参数。
