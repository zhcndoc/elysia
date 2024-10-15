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

# OpenTelemetry

要开始使用 OpenTelemetry，请安装 `@elysiajs/opentelemetry` 并将其应用于任何实例。

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

Elysia OpenTelemetry is will **collect span of any library compatible OpenTelemetry standard**, and will apply parent and child span automatically.

## Usage
See [opentelemetry](/recipe/opentelemetry) for usage and utilities

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
