---
title: JIT 编译器 - ElysiaJS 内部揭秘
head:
  - - meta
    - property: 'og:title'
      content: JIT 编译器 - ElysiaJS 内部揭秘

  - - meta
    - name: 'description'
      content: 关于 Elysia 的 JIT“编译器”，一种动态代码生成技术，用于优化请求处理以实现高性能。

  - - meta
    - property: 'og:description'
      content: 关于 Elysia 的 JIT“编译器”，一种动态代码生成技术，用于优化请求处理以实现高性能。
---

<script setup>
import JIT from './jit-compiler/jit.vue'
import Benchmark from '../components/fern/benchmark.vue'
</script>

# JIT“编译器” <Badge text="内部" type="info" />

Elysia 速度极快，且很可能会一直保持 *JavaScript 中最快的 Web 框架之一*，其唯一瓶颈在于底层 JavaScript 引擎的速度。

<section class="[&>*]:px-0!">
	<Benchmark />
</section>

Elysia 的快速不仅仅得益于针对特定运行时的优化，例如 Bun 的原生特性 `Bun.serve.routes`，更来源于 Elysia 处理路由注册和请求处理的方式。

自 [Elysia 0.4](/blog/elysia-04) （2023 年 3 月 30 日）起，Elysia 核心内置了一个 **JIT“编译器”**（位于 *src/compose.ts*），使用 `new Function(...)`，也称为 `eval(...)`。

这个“编译器”并不是传统意义上将代码从一种语言转换为另一种语言的编译器。它是动态生成针对已定义路由和中间件的请求处理的优化代码。 *(这也是为什么“编译器”用引号括起的原因)*。

当首次对每个路由发起请求时，Elysia 会动态生成特别针对该路由高效处理的优化代码，尽可能避免不必要的性能开销。

## 静态代码分析（Sucrose）

*“Sucrose”* 是与 Elysia JIT“编译器”共存的静态代码分析模块的昵称，位于 *src/sucrose.ts*。

为了生成这些优化代码，编译器需要深入了解路由处理函数如何与请求交互，以及请求的哪些部分实际上是必要的。

这正是 Sucrose 的工作。

Sucrose 通过使用 `Function.toString()` 来读取代码（而不执行它），然后通过自定义的模式匹配提取关于路由处理函数实际需要请求哪些部分的有用信息。

来看一个简单示例：

```ts
import { Elysia } from 'elysia'

const app = new Elysia()
  .patch('/user/:id', ({ params }) => {
	return { id: req.params.id }
  })
```

从代码中可以明显看出，该处理函数只需要解析 `params`。

Sucrose 会读取代码并告诉 *“编译器”* 只解析 **params**，跳过解析请求中的其他部分，如 **body**、**query**、**headers**，因为它们并不需要。

JIT“编译器”随后生成类似如下的代码：

::: code-group

```ts [Elysia]
function tailoredHandler(request) {
	const context = {
		request,
		params: parseParams(request.url)
	}
	
	return routeHandler(context)
}
```

:::

这种方式与传统 web 框架的处理截然不同，传统框架默认会解析所有内容，并通过一个 **centralHandler** 统一处理，无论是否需要，比如：

::: code-group

```ts [传统框架]
function centralHandler(request) {
	const context = {
		request,
		body: await parseBody(request),
		query: parseQuery(request.url),
		headers: parseHeader(request.headers),
		// 还有其他内容
	}

	return routeHandler(context)
}
```

:::

这种方式让 Elysia 变得极快，因为它只做每个路由必须完成的最少工作。

### 为什么不用 acorn、esprima 或其他传统静态分析工具？

传统工具设计用于通用的静态代码分析，可能为 Elysia 的特定用途引入不必要的开销。

就我们的需求而言，解析器仅需要理解 JavaScript 语法中的一个子集：*函数*。仔细想想，这只是 JavaScript 语言的一小部分，而这部分代码已经被 JavaScript 引擎解析和格式化过。

因此，我们没有选用通用工具，而是将这部分视为一种类似 JavaScript 的 DSL（领域专用语言），专门构建以获得最高性能和最低内存消耗（相比基于 AST 的工具）。

## 编译器优化

类似于传统编译器，Elysia 的 JIT“编译器”也执行各种优化，以进一步提升生成代码的性能，比如根据路由处理函数的具体使用模式优化控制流、常量折叠、能够时直接访问属性代替遍历对象和数组等。

这些优化与其他多项小范围优化共同减少了请求处理的开销，提升了整个应用的速度。

### 示例：`mapResponse`、`mapCompactResponse`

这是较小的优化之一，但在高吞吐场景下可能带来显著性能提升。

Elysia 针对响应映射函数提供了两个特殊优化：`mapResponse` 和 `mapCompactResponse`。

构造 `new Response` 对象相对昂贵，但若创建的 `Response` 不包含额外的 `status` 或 `headers`，其开销比构造包含自定义状态码或头的完整 `Response` 更低。

当未使用 `set` 或 `status` 时，Elysia 会使用 `mapCompactResponse` 来直接把值映射成 `Response` 对象，避免额外属性带来的开销。

## 平台特定优化

Elysia 最初专为 Bun 开发，但同样支持 [Node.js](/integrations/node)、[Deno](/integrations/deno)、[Cloudflare Workers](/integrations/cloudflare-workers) 等多平台。

兼容某平台与针对该平台做优化存在巨大差别。

Elysia 能利用平台特有特性与优化以进一步提升性能，例如运行于 Bun 时使用 `Bun.serve.routes` 以调用 Zig 语言编写的 Bun 原生路由能力以最大化性能。

使用 **内联响应** 来获得静态响应的最大性能，这使得 Elysia 在 [TechEmpower 框架基准测试](https://www.techempower.com/benchmarks/#section=data-r23&hw=ph&test=plaintext)中，位列全球最快后端框架的第 14 名。

此外还有其他多种小型优化，例如
- 运行于 Bun 时使用 **Bun.websocket** 以获得最佳 WebSocket 性能
- `Elysia.file` 在支持时有条件地使用 `Bun.file` 实现更快的文件处理
- 运行于 Bun 时调用 `Headers.toJSON()` 以减少处理头部时的开销

这些小优化叠加起来，使得 Elysia 在目标平台上极为高效。

## JIT“编译器”的开销

Elysia 的 JIT *“编译器”* 以高性能为设计目标，然而动态代码生成过程在每条路由的首次请求处理时，会引入一些开销。

### 首次请求开销

首次对特定路由发起请求时，Elysia 需要分析路由处理函数代码，生成优化代码。

在现代 CPU 上这一过程相对**非常快**，通常每条路由耗时 < 0.005ms，且只发生**一次**。但它仍然是开销。

<JIT />

可通过在构造 Elysia 时设置 `precompile: true` 将该过程提前至启动阶段，从而消除首个请求时的等待代价，代价是启动时间会变长。

### 内存使用

动态生成的代码会被缓存以供后续请求复用。对于路由繁多的应用，这会导致内存增长，但整体仍然较小。

### 体积增大

JIT“编译器”和 Sucrose 模块会为 Elysia 核心库添加额外代码，增大应用整体体积，但性能收益通常远大于体积增加的代价。

### 可维护性

动态代码生成让代码库变得更复杂和难以维护。维护者需要深入理解 JIT“编译器”的工作原理，才能有效使用及排查问题。

### 安全考量

使用 `new Function(...)` 或 `eval(...)` 如果处理不当，可能引入安全风险。

但风险仅在于“处理不当”时存在。

Elysia 采取了多项防护措施，确保生成代码安全且不暴露漏洞，保证仅执行受信任的代码。**输入几乎从不由用户控制**，而完全由 Elysia（Sucrose）自身生成。

## 使用 `eval` 的库

Elysia 并非唯一使用 `new Function` 和 `eval` 的框架。

[ajv](https://www.npmjs.com/package/ajv) 和 [TypeBox](https://www.npmjs.com/package/@sinclair/typebox) 是行业标准的验证库，自 Node.js 初期以来每月下载量分别达到 8.95 亿和 3.32 亿。

两者内部都使用了 `eval` 来优化验证代码性能，使其[跑分快于同类竞争对手](https://moltar.github.io/typescript-runtime-type-benchmarks/)。

Elysia 更是基于此，将动态代码生成扩展到整套后端框架，追求极致性能。事实上，Elysia 也用 TypeBox 进行输入验证，因此整个库的方方面面都在运行 `eval`。

## 关闭选项

Elysia 默认开启 JIT 编译，但可完全关闭，启用动态模式：

```ts
new Elysia({ aot: false })
```

不过不推荐这样做，因为关闭 JIT 会缺失部分功能，比如 `trace`。

## 后记

经过这些 *过度* 优化，Elysia 实现了 *近乎零* 开销，唯一限制因素成为底层 JavaScript 引擎本身的速度。

虽然带来了维护难度，但 Elysia JIT“编译器”所取得的性能收益是值得的，也契合了我们打造高性能服务器框架的初衷。

这也是 Elysia 相较于其他对性能不那么重视的 Web 框架的重要差异点，因为要做好这一点极为不易。

我们还发布了一篇 [简短的 6 页研究论文到 ACM 数字图书馆](https://dl.acm.org/doi/10.1145/3605098.3636068)，介绍 Elysia JIT“编译器”及其性能优化。

多年来，**我们几乎从未见过有效基准测试中，Elysia 不是最高速框架**（除非使用了 FFI/本地绑定如 Rust、Go、Zig），且这类测试也是因序列化/反序列化开销非常难以超越。

当然，也存在如 uWebSocket（用 C++ 写并绑定了 JavaScript）极为快速，性能超过了 Elysia。

但即便如此，我们依然认为这**非常值得**。