---
title: Elysia 2 beta - DayDream
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 2 beta - DayDream

    - - meta
      - name: 'description'
        content: 从零开始完全重写的 Elysia。专注于性能、内存使用、启动时间和包大小。Elysia 2 是 Elysia 的全新时代，采用全新的架构，并引入了提前编译（AOT）。

    - - meta
      - property: 'og:description'
        content: 从零开始完全重写的 Elysia。专注于性能、内存使用、启动时间和包大小。Elysia 2 是 Elysia 的全新时代，采用全新的架构，并引入了提前编译（AOT）。

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-20/elysia-20.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-20/elysia-20.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
    import Chart from '../components/chart.vue'

    const startupAt25Routes = [
        { label: 'Hono', value: 21 },
        { label: 'Elysia', value: 24 },
        { label: 'Elysia + TypeBox', value: 28, highlight: true },
        { label: 'Hono + Zod', value: 33 },
        { label: 'Elysia + Zod', value: 38 },
        { label: 'Express', value: 61 },
        { label: 'Express + Zod', value: 72 },
        { label: 'Fastify', value: 90 },
        { label: 'Fastify + Zod', value: 93 }
    ]

    const memoryAt25Routes = [
        { label: 'Hono', value: 35 },
        { label: 'Elysia', value: 36 },
        { label: 'Elysia + TypeBox', value: 42, highlight: true },
        { label: 'Hono + Zod', value: 47 },
        { label: 'Elysia + Zod', value: 48 },
        { label: 'Express', value: 55 },
        { label: 'Fastify', value: 56 },
        { label: 'Express + Zod', value: 61 },
        { label: 'Fastify + Zod', value: 63 }
    ]

    const bundleByVersion = [
        { label: 'None', value: 736, secondaryValue: 344 },
        { label: 'TypeBox', value: 736, secondaryValue: 847 },
        { label: 'Valibot', value: 742, secondaryValue: 350 },
        { label: 'Zod', value: 1260, secondaryValue: 868 }
    ]

    const bundleWithAot = [
        { label: 'None', value: 344, secondaryValue: 226 },
        { label: 'TypeBox', value: 847, secondaryValue: 288 },
        { label: 'Valibot', value: 350, secondaryValue: 266 },
        { label: 'Zod', value: 868, secondaryValue: 784 }
    ]

    const bundleFrameworks = [
        { label: 'Hono', detail: '4.12.28', value: 21 },
        { label: 'h3', detail: '2.0.1-rc.26', value: 103 },
        { label: 'Elysia', detail: '2.0.0-exp.60', value: 141, highlight: true },
        { label: 'Effect HTTP Node', detail: '4.0.0-beta.102', value: 357 },
        { label: 'Express', detail: '5.2.1', value: 603 },
        { label: 'Koa', detail: '3.2.1', value: 554 },
        { label: 'Fastify', detail: '5.10.0', value: 729 },
        { label: 'Adonis', detail: '5.8.0', value: 1200, display: '1.2 MB' },
        { label: 'Nest', detail: '10.2.8', value: 1300, display: '1.3 MB' }
    ]

    const throughput = [
	    { label: 'Elysia', detail: 'Bun 2.0.0-exp.60', value: 210_411, highlight: true },
	    { label: 'Hono', detail: 'Bun 4.12.28', value: 168_275 },
	    { label: 'Fastify', detail: 'Node 5.10.0', value: 101_360 },
	    { label: 'Elysia', detail: 'Node 2.0.0-exp.60', value: 93_845, highlight: true },
	    { label: 'Hono', detail: 'Node 4.12.28', value: 86_129 },
	    { label: 'Effect HTTP', detail: 'Bun 4.0.0-beta.102', value: 88_936 },
	    { label: 'Effect HTTP', detail: 'Node 4.0.0-beta.102', value: 59_958 },
	    { label: 'Koa', detail: 'Node 3.2.1', value: 43_294 },
	    { label: 'Express', detail: 'Node 5.2.1', value: 42_974 },
	    { label: 'Adonis', detail: 'Node 5.8.0', value: 36_557 },
	    { label: 'Nest', detail: 'Node 10.2.8', value: 31_675 }
    ]

	// Ping
    // const throughput = [
	   //  { label: 'Elysia', detail: 'Bun 2.0.0-exp.60', value: 405_492, highlight: true },
	   //  { label: 'Hono', detail: 'Bun 4.12.28', value: 229_744 },
	   //  { label: 'Fastify', detail: 'Node 5.10.0', value: 151_181 },
	   //  { label: 'Elysia', detail: 'Node 2.0.0-exp.60', value: 146_216, highlight: true },
	   //  { label: 'Hono', detail: 'Node 4.12.28', value: 140_752 },
	   //  { label: 'Effect HTTP', detail: 'Bun 4.0.0-beta.102', value: 143_317 },
	   //  { label: 'Effect HTTP', detail: 'Node 4.0.0-beta.102', value: 95_462 },
	   //  { label: 'Express', detail: 'Node 5.2.1', value: 85_301 },
	   //  { label: 'Koa', detail: 'Node 3.2.1', value: 65_713 },
	   //  { label: 'Adonis', detail: 'Node 5.8.0', value: 50_603 },
	   //  { label: 'Nest', detail: 'Node 10.2.8', value: 48_055 }
    // ]

    const startupByVersion = [
        { label: 'None', value: 37, secondaryValue: 26 },
        { label: 'TypeBox', value: 37, secondaryValue: 28 },
        { label: 'Zod', value: 46, secondaryValue: 36 }
    ]

    const startupAt1000Routes = [
        { label: 'Hono', value: 23 },
        { label: 'Elysia', value: 29 },
        { label: 'Elysia + TypeBox', value: 43, highlight: true },
        { label: 'Hono + Zod', value: 56 },
        { label: 'Express', value: 60 },
        { label: 'Elysia + Zod', value: 67 },
        { label: 'Express + Zod', value: 103 },
        { label: 'Fastify', value: 108 },
        { label: 'Fastify + Zod', value: 154 }
    ]

    const memoryBeforeAfterLoadtest = [
        { label: 'Elysia', detail: '2.0.0-exp.60', value: 37, secondaryValue: 45.7, highlight: true },
        { label: 'h3', detail: '2.0.1-rc.26', value: 43.3, secondaryValue: 66.4 },
        { label: 'Hono', detail: '4.12.28', value: 32.4, secondaryValue: 73.9 },
        { label: 'Effect HTTP Node', detail: '4.0.0-beta.102', value: 91.3, secondaryValue: 132.3 },
        { label: 'Express', detail: '5.2.1', value: 60.5, secondaryValue: 150.8 },
        { label: 'Adonis', detail: '5.8.0', value: 123.5, secondaryValue: 160 },
        { label: 'Fastify', detail: '5.10.0', value: 98.5, secondaryValue: 192.4 },
        { label: 'Koa', detail: '3.2.1', value: 94.8, secondaryValue: 200.4 },
        { label: 'Nest', detail: '10.2.8', value: 118, secondaryValue: 213.7 }
    ]

    const refRainMemory = [
        { label: 'Elysia 1.4', value: 33.86 },
        { label: 'Elysia 2', value: 17.69, highlight: true }
    ]

    const compilation = [
        { label: 'Elysia', detail: '1.4', value: 174603, secondaryValue: 1158 },
        { label: 'Elysia', detail: '2', value: 310, secondaryValue: 228 }
    ]

    const complexSchema = [
        { label: 'Elysia', detail: '1.4', value: 227, secondaryValue: 319 },
        { label: 'Elysia', detail: '2', value: 209, secondaryValue: 228 }
    ]

    const aotStartup = [
        { label: 'Elysia 1.4', value: 0.851 },
        { label: 'Elysia 2 AOT', value: 0.046, highlight: true }
    ]

    const aotDefaultMerge = [
        { label: 'Elysia 1.4', value: 21.6 },
        { label: 'Elysia 2', value: 2.5, highlight: true }
    ]

    const aotMemory = [
        { label: 'Elysia', detail: '2', value: 4110, secondaryValue: 1650, secondaryDisplay: '1.65 GB' },
        { label: 'Elysia', detail: '2 AOT', value: 775, secondaryValue: 400, highlight: true }
    ]

    const syntheticMemory = [
        { label: 'Elysia 1', value: 32.1, secondaryValue: 36.9 },
        { label: 'Elysia 2 (JIT)', value: 2.3, secondaryValue: 5.8 },
        { label: 'Elysia 2 + AOT', value: 4.6, secondaryValue: 4.7 }
    ]

    const addRoutes = [
        { label: 'Elysia', detail: '2', value: 7, secondaryValue: 31 },
        { label: 'Elysia', detail: '1.4', value: 23, secondaryValue: 317 },
        { label: 'Hono', detail: '4.12.32', value: 172, secondaryValue: 203 }
    ]

    const applyRouter = [
        { label: 'Elysia', detail: '2', value: 5, secondaryValue: 9 },
        { label: 'Elysia', detail: '1.4', value: 116, secondaryValue: 116 },
        { label: 'Hono', detail: '4.12.32', value: 192, secondaryValue: 503 }
    ]

    const lifecycle = [
        { label: 'Elysia', detail: '2', value: 10, secondaryValue: 15 },
        { label: 'Elysia', detail: '1.4', value: 58, secondaryValue: 126 },
        { label: 'Hono', detail: '4.12.32', value: 252847, secondaryValue: 21558 }
    ]
</script>

<Blog
    title="Elysia 2 beta - DayDream"
    src="/blog/elysia-20/elysia-20.webp"
    alt="左侧大标题中写着“Elysia 2”，标题略上方写着“DayDream”。右侧配有 Elysia chan 吉祥物。"
    author="saltyaom"
    date="30 Jul 2026"
    shadow
>

按照我们的惯例，本次发布以 Guns Girl Z 九周年歌曲中的歌曲 [DayDream](https://youtu.be/3qRd7Ok0NVY) 命名。

Elysia 2 是对 Elysia 的**完整重写**，从零开始，关注的不只是吞吐量，还包括其他方面。

<small>这个名字是为了致敬 Kiana 为实现愿望所经历的挣扎与漫长旅程。</small>

---

我们曾尝试让 Elysia 成为最快的 JavaScript 框架。但在这个过程中，我们牺牲了很多东西。内存使用、包大小和启动时间都只是次要考虑因素。

项目范围超出了我们最初的设计，新增的功能也像技术债务一样不断堆积。

我们从未预料到 Elysia 会发展到今天的规模，因此并没有真正针对超大规模进行设计。我们原以为它会是一个解决特定问题的小众框架，所以除了在个人 X/Twitter 账号上发布内容外，从未对 Elysia 进行市场推广或广告宣传。

但我们错了。

如今，**Elysia 是使用量排名第九的 JavaScript 后端框架**，并在 [State of JavaScript 2025](https://2025.stateofjs.com/en-US/libraries/back-end-frameworks/) 中获得了重点关注。

我们真心相信应该构建优秀的软件，而如果软件足够优秀，人们就会追随它——你们向我们证明了这一点，远远超出了我们的预期。

根据你们的反馈，我们现在意识到，除了运行时性能之外，还有更多重要的事情需要考虑。

因此，我们重新思考了它的整体范围和功能。我们阅读了 Elysia 的代码库，在保持性能优先的同时，从头开始重新设计架构，并纳入我们已有的全部功能。

Elysia 2 beta，顾名思义，仍然是**beta**。它还不是稳定版本。你可以通过 `elysia@next` 进行尝试。

```bash
# auto migration
bunx @elysia/codemod@latest

# manual migration
bun add elysia@next
```

- [包大小](#bundle-size)
- [启动时间](#startup-time)
- [内存使用](#memory-usage)
- [TypeBox](#typebox)
- [提前编译](#ahead-of-time-compilation)
- [启动时间](#startup-time)
- [适配器和运行时](#adapter-and-runtime)
- [更快的 API](#faster-apis)
- [Defer](#defer)
- [破坏性变更](#breaking-change)
- [稳定性](#stability)
- [预期效果](#what-to-expect-from-elysia-2)
- [后记](#afterwords)

## 包大小

我们已经让 Elysia 2 比 Elysia 1.4 小**超过 50%**，并且通过构建插件还可以进一步缩小。

### Tree Shake TypeBox

Elysia 2 的设计是**模块化的**。我们在 1.4 中加入了 Standard Schema 支持，但由于结构原因，无论你是否使用 TypeBox，Elysia 都会将其打包进去。

现在，如果你不使用 TypeBox，Elysia 2 可以将 TypeBox 完全 Tree Shake 掉。

<Chart
    :items="bundleByVersion"
    :series="['Elysia 1', 'Elysia 2']"
    unit="KB"
/>

通过使用 AOT 构建插件分析并移除 Elysia 功能中未使用的部分，我们还可以进一步缩小体积。

<Chart
    :items="bundleWithAot"
    :series="['Elysia 2', 'Elysia 2 + AOT']"
    unit="KB"
/>

<small>使用 AOT 构建插件时，如果所有 schema 都可以预编译，TypeBox Compiler 也可以被完全移除。</small>

226KB 听起来很大，但这是未压缩的结果；如果进行压缩，最终大小为**141KB**。

如果将它与其他框架比较，实际上它相当小。

<Chart :items="bundleFrameworks" unit="KB" />

<small>结果是使用 `bun build --minify` 构建的“hello world”应用，参见 [HTTP benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/ba1520ccacfb4a1783a3211b1c9682e8c8e43870)。</small>

Elysia 2 的体积中，大约有 50% 来自 Sucrose（静态代码分析）和提前编译器。

即使如此，Elysia 仍然比 Express、Fastify 和 Koa 这类传统框架小得多。

## 启动时间

除了包大小之外，启动时间也是 Serverless 和 Edge 函数的一大关注点，例如 Cloudflare Worker、Vercel Edge Function。

我们将 Elysia 2 的启动时间提升了**超过 30%**，尤其是在使用 TypeBox 时。

<Chart
    :items="startupByVersion"
    :series="['Elysia 1', 'Elysia 2']"
    unit="ms"
/>

如果将启动时间与其他服务器框架进行比较：

### 25 个路由

服务器注册了 25 个路由，每个路由都有一个包含 5 个字段的不同 schema。启动时间从启动服务器开始计算，直到首次请求到达为止。

<Chart :items="startupAt25Routes" unit="ms" />

<small>启动时间可能会有所波动。测量结果为运行 5 次的平均值，预计会有约 3～4ms 的差异。</small>

### 1,000 个路由

每个应用注册 1,000 个 POST 路由，每个路由都使用一个不同的 5 字段 schema。

<Chart :items="startupAt1000Routes" unit="ms" />

<small>Elysia 使用完整编译重构模式，因此已经完成了所有编译，而不是延迟编译。</small>

## 内存使用

使用与之前相同的基准测试：

### 25 个路由

条件与之前相同。服务器注册了 25 个路由，每个路由都有一个包含 5 个字段的不同 schema。启动时间从启动服务器开始计算，直到首次请求到达为止。

<Chart :items="memoryAt25Routes" unit="MB" />

### 负载测试前后

为了准确测量内存使用量，我们测量了运行 HTTP 负载测试**前后**的内存。源码可以在 [HTTP benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/ba1520ccacfb4a1783a3211b1c9682e8c8e43870) 中找到。

<Chart
    :items="memoryBeforeAfterLoadtest"
    :series="['Before', 'After']"
    unit="MB"
/>

负载测试后，Elysia 的内存使用量明显最低，同时内存使用也最稳定、最可预测。

这对以下两点很重要：

1. Serverless 和 Edge Function 的内存使用按秒计费，并且内存使用受到限制
2. 集群模式会复制进程，内存使用量会**大致**乘以集群数量

这意味着，如果你在集群模式下使用 10 个 CPU 核心和 10 个 worker 运行 HTTP 服务器，**内存使用量将约为原来的 10 倍**。

- 如果使用 10 个 worker 运行 Elysia，内存使用量约为 450 MB。
- 如果使用 10 个 worker 运行 Hono，内存使用量约为 740 MB。
- 如果使用 10 个 worker 运行 Fastify，内存使用量约为 2,100 MB。

## TypeBox

我们已从 TypeBox 0.34 更新到 TypeBox 1.3。请参考 [TypeBox 1.0 migration guide](https://github.com/sinclairzx81/typebox/blob/main/changelog/1.0.0-migration.md)。

### 每个字段的 Cookie Schema

Elysia 现在支持为每个字段设置 Cookie schema，而不是整体设置。

```ts
new Elysia()
	.get(
		'/',
		{
			cookie: t.Object({
				a: t.Cookie(t.String(), {
					sign: true
				})
			})
		},
		() => 'ok'
	)
```

### t.Accelerate

通过 Standard JSON Schema 将 schema 转换为 TypeBox Compiler，以获得最佳性能。

```ts
import * as z from 'zod'

new Elysia()
	.post(
		'/',
		{
			body: t.Accelerate(
				z.object({
					name: z.string()
				})
			)
		},
		() => 'ok'
	)
```

此 API 仍处于 alpha 阶段，请谨慎使用。

### Ref:Rain

我们没有重新导出 TypeBox，而是在其上构建了一个小型抽象层。**“Ref:Rain”** 是这个 TypeBox 小型抽象层的昵称。

在真实应用中，并不是所有 schema 都是不同的。一些重复的 schema，例如 params 或 query，可能会被**共享**和复用。

从基本类型开始，许多 schema 都只会使用类似下面这样的空基本类型。

```ts
t.Object({
	name: t.String(),
	age: t.Number()
})
```

如果这些基本类型被调用 100k 次，就会创建新的分配。因此，我们不分配 100k 个 schema，而是简单地通过引用**复用**它。

<Chart :items="refRainMemory" unit="MB" />

### 编译

我们注意到，有些场景中的 schema 可以重复使用，例如 query、params，甚至引用 schema。

我们加入了 Schema Compilation Cache，以防止不必要的重新编译。在检查缓存之前，它会忽略 `description`、`examples`、`tags` 等元数据，因此带有 OpenAPI 元数据的重复 schema 也可以被缓存。

### 使用 schema 编译 100k 个路由

<small>- stress/compile-with-schema.ts</small>

<Chart
    :items="compilation"
    :series="['Time taken', 'Memory usage']"
    unit="ms"
    secondary-unit="MB"
/>

结果并不是笔误。Elysia 2 已经将编译过程完全转移到了构建时。

### 100k 个复杂 schema

<small>- stress/schema.ts</small>

创建 100k 个 TypeBox schema，每个 schema 包含 45 种类型。

<Chart
    :items="complexSchema"
    :series="['Time taken', 'Memory usage']"
    unit="ms"
    secondary-unit="MB"
/>

所有这些改进使总体内存使用量降低了 33%。

## 提前编译

Elysia 有一个“编译器”，它会分析你的 handler，并生成最优的路由 handler。

这正是 Elysia 如此快速的原因，但也带来了成本。这个过程会在服务器启动时执行一次，并针对每个路由执行一次，这会在路由可以运行之前增加微小的延迟。每次编译本身都非常快，但在真实应用中尤其容易累积。

---

我们重写了 Elysia 的“编译器”，使其可以将编译过程转移到构建时，也就是所谓的**提前编译**。

```ts [build.ts]
import { aot } from 'elysia/plugin/aot/bun'

const { outputs } = await Bun.build({
	entrypoints: ['src/index.ts'],
	outdir: 'dist',
	target: 'bun',
	plugins: [aot('src/index.ts')]
})
```

你可以先 `export` Elysia 实例，然后设置构建脚本，并将插件指向你想要的主要 Elysia 实例，从而选择启用 AOT。

AOT 插件会完成以下所有工作：

1. 编译 handler 代码
2. 编译 TypeBox schema
3. 编译 Exact mirror schema
4. 预计算 `default` 属性合并器
5. 静态分析未使用的 Elysia 模块
6. 为每个目标平台创建最优代码
7. 如果所有 TypeBox schema 都可以编译，则完全模拟 TypeBox

随后，Elysia 会尝试对应用执行 dry-run，以复现最准确的结果。

在运行时，Elysia 将直接使用构建好的 schema，并完全跳过编译过程。

## 启动时间

Elysia 1.4 需要编译 `fetch` 入口 handler。因此，服务器收到的每个首次请求都需要经过两次编译。

在 Elysia 2 中，我们完全移除了 fetch 入口中的编译，并将请求编译转移到 AOT，因此启动时间大幅改善。

<Chart :items="aotStartup" unit="ms" />

### 内存使用

对于拥有 100k 个不同 schema 且进行 eager compile 的应用，可以期待更好的结果：

<Chart
    :items="aotMemory"
    :series="['Startup time', 'Memory usage']"
    unit="ms"
    secondary-unit="MB"
/>

### 合成内存基准测试

<Chart
    :items="syntheticMemory"
    :series="['Identical handlers', 'Distinct handlers (real app)']"
    unit="KB/route"
/>

在真实世界中，“identical handler” 极不可能出现，但我们加入了这个测试，以说明合成基准测试的结果。

### 部分 Default Merge

Elysia 2 现在可以提前分配静态默认值，并且能够更快地执行部分合并。

<Chart :items="aotDefaultMerge" unit="μs" />

### 目标

构建插件并不局限于 Bun。我们为以下 bundler 提供了支持和回归测试：

- Bun.build
- vite
- esbuild
- rspack
- **unplugin**

每个插件 bundler 都可以通过 `elysia/plugin/aot/<name>` 下对应的名称导入，并像普通插件一样使用。

```ts [build.ts]
import { aot } from 'elysia/plugin/aot/vite'

export default defineConfig({
	plugins: [aot('src/index.ts')]
})
```

**Unplugin** 还可以扩展到其他 bundler，例如：

- rollup
- rolldown
- webpack
- farm

### 我应该使用提前编译吗？

如果适用，应该使用。

我们几乎总能在所有选择启用 AOT 构建模式的应用中看到很好的结果。

AOT 模式的实际成本在于，它会将每个路由和 schema 的内联代码写入最终包中。这可能会略微增加包大小以及应用启动时保留的少量内存，但能够**大幅降低峰值内存使用量**。

### 构建时环境

由于 AOT 插件会对你的应用执行 dry-run，因此有两件事需要注意。

1. 长时间运行的进程，例如 Postgres Pool、Redis Pool 等数据库连接。

这会阻止你的应用在构建环境中退出，因此建议在 bundler 完成代码打包后添加 `process.exit(0)`。

```ts
Bun.build({
	entrypoints: ['src/index.ts'],
	outdir: 'dist',
	target: 'bun',
	plugins: [aot('src/index.ts')]
}).then(() => {
	process.exit(0)
})
```

2. 条件标记

选择启用 Elysia AOT 的应用应该在构建时和运行时以完全相同的方式调用 Elysia API，以避免生成无效的 manifest。

Elysia 应该能够检测这种情况，并在服务器启动前立即 panic，同时通知你原因和建议。

由于这是一次 dry-run，你可以通过 `Manifest` 有条件地跳过应用中的某些部分：

```ts
import { Manifest } from 'elysia'

if (Manifest.isCapturing())
	console.log('Do something in AOT dry-run')
```

### Cloudflare Worker

如果你使用 Cloudflare Worker，我们建议启用 AOT，以避免提前承担启动时间成本。

由于 Cloudflare Worker 不允许使用 `new Function`，你必须在启动时编译所有路由并承担全部编译成本，或者将这个过程直接转移到构建时。

Cloudflare Worker 已经建议在发布 worker 代码之前使用 Vite 插件进行构建，因此这个过程只需要在 Vite 配置中再添加一个插件。

```ts
import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { aot } from 'elysia/plugin/vite'

export default defineConfig({
	plugins: [cloudflare(), aot('src/index.ts')]
})
```

## 适配器和运行时

从第一天起，Elysia 就一直使用类似 Hono 的 Web Standard Request/Response。这意味着，**如果运行时支持 Web Standard Request，Elysia 就和 Hono 一样具有可移植性**。

对于不支持 Web Standard 的运行时，Elysia 提供了 Adapter API，可在各种环境中运行 HTTP 服务器。

Elysia 的口号是“为 Bun 优化”，**而不是“只能在 Bun 上运行”**。尤其是 Elysia 与 Hono 一样构建在相同基础之上，而 Hono 一直被宣传为“portable”，所以事实从来不是只能在 Bun 上运行。

### Adapter v2

Adapter 现在已经完成重构，并从私有 API 变为公开可用 API。

之前，Elysia adapter 使用传递给 compiler 的字符串化代码。这使得创建或贡献 adapter 变得困难。

在 Elysia 2 中，现在所有字段都只是一个函数。

```ts
import { createAdapter } from 'elysia/adapter'

const adapter = createAdapter({
	name: 'bangboo',
	// map value to response, not limited to Web Standard
	response: {
		map: mapResponse
	},
	setup(app: Elysia) {
		// do something with Elysia
		// run before listen
	},
	listen() {
		// bind to runtime HTTP server
	},
	// an so on
	...rest
})
```

所有字段都是类型安全的，并且这些函数基本都会返回一个你可以轻松修改或替换的对象。

### Node 运行时

我们使用 Adapter v2 连接 Elysia Node adapter，使其在底层使用 srvx 和 crossws。

```ts
import { Elysia } from 'elysia'
import { node } from '@elysia/node'

new Elysia({ adapter: node() })
	.listen(3000)
```

我们已将 srvx 更新到 `0.12`，并加入了 `FastResponse`，这应该能大幅提升性能，使其几乎与普通 Node HTTP 库相同。

<Chart :items="throughput" unit="req/s" />

<small>参见 [HTTP benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/ba1520ccacfb4a1783a3211b1c9682e8c8e43870)。</small>

### Node Websocket

我们将 WebSocket 从普通的 Node adapter 中分离出来，以减小包大小。如果你想在 Node 上使用 websocket，只需从 websocket 子目录导入。

```ts
import { Elysia } from 'elysia'
import { node } from '@elysia/node/websocket'

new Elysia({ adapter: node() })
	.listen(3000)
```

## 更快的 API

HTTP 吞吐量、post 内存使用和启动时间并不是唯一重要的指标。我们还需要考虑真实应用中的使用方式，例如插件和生命周期事件。

这里我们收集了多个 Elysia API 的指标，以了解它们的性能表现。

你可以在 [elysia/example/stress](https://github.com/elysiajs/elysia/tree/kiana/example/stress) 中找到基准测试源码。

### 添加 100k 个路由

反复向应用添加 100k 个静态路由，并测量完成所需的时间。

<small>- stress/route.ts</small>

<Chart
    :items="addRoutes"
    :series="['Time taken', 'Memory usage']"
    unit="ms"
    secondary-unit="MB"
/>

### 应用 100k 个 Router

<small>- stress/apply-plugin.ts</small>

反复将包含 1 个路由的 100k 个 Elysia 实例应用到主应用，并测量完成所需的时间。

<Chart
    :items="applyRouter"
    :series="['Time taken', 'Memory usage']"
    unit="ms"
    secondary-unit="MB"
/>

### 应用带 Hook 的 100k 个 Plugin

<small>- stress/lifecycle.ts</small>

反复应用 100k 个包含 1 个生命周期事件的 Elysia 实例，该事件具有**scope/plugin**封装范围，或者简单来说，在 Hono 中应用 middleware。

<Chart
    :items="lifecycle"
    :series="['Time taken', 'Memory usage']"
    unit="ms"
    secondary-unit="MB"
/>

<small>*Hono 的结果并不是笔误。</small>

## Defer

Elysia 现在支持以编程方式添加 callback function，在响应发送后运行。

```ts
new Elysia()
	.get(({ defer }) => {
		const disconnect = connect()

		// run after response is sent
		defer(() => {
			disconnect()
		})
	})
```

`defer` 会在 `afterResponse` hook 之后，在队列中执行。

## 破坏性变更

我们更新了一些 API，并在此版本中移除了几个软弃用 API。

为了让迁移到 Elysia 2 尽可能顺利，我们提供了 Elysia codemod，它应该可以自动将 95% 的代码迁移到 Elysia 2。

```ts
bunx @elysia/codemod@latest
```

---

### 路由参数交换

我们进行了调查，发现许多开发者更希望让 hook/schema 出现在 handler **之前**。

```ts
new Elysia()
	.post('/', {
		isAdmin: true,
		body: t.Object({
			name: t.String()
		})
	}, () => {
		// handler
	})
```

这样阅读和审查代码会更加符合人体工学，而不是：

1. 查看路由和 handler
2. 向下滚动到 hook 元数据
3. 再向上滚动阅读代码

旧 API 会让你不必要地反复上下滚动，因此我们进行了修改，让代码更容易阅读。

此迁移可以由 codemod 完全自动完成。

---

### @elysia scope

我们进行了争取，并从 `npm` 获得了 `@elysia` scope。

我们将使用 `@elysia` 发布官方维护的、适用于 Elysia 1.4+ 的 Elysia 插件，并让 `@elysiajs` 继续支持 Elysia 1.x 插件。

---

### `on` 前缀

我们移除了用于注册生命周期事件的 `on` 前缀。

这是为了统一 hook 和 API 的命名方式。

```ts
new Elysia()
	.beforeHandle(() => {})
	.guard({
		beforeHandle() {}
	})
	.get('/', {
		beforeHandle() {}
	}, () => {})
```

此外，我们意识到，大多数事件实际上并不需要 `on` 来表达它是事件拦截器，例如 `derive`、`mapDerive`、`afterResponse`、`beforeHandle`、`transform`、`trace` 等。

以下是旧 API 及其对应新 API 的完整映射：

| 旧 API             | 新 API             |
|-------------------|-------------------|
| onRequest         | request            |
| onParse           | parse              |
| onTransform       | transform          |
| onBeforeHandle    | beforeHandle       |
| onAfterHandle     | afterHandle        |
| onAfterResponse   | afterResponse      |
| onError           | error              |
| onStart           | setup              |
| onStop            | cleanup            |

---

### 错误处理

我们彻底修改了错误处理 API。之前，我们使用 `code` 来区分错误。

但这主要带来了 3 个问题。

##### 1. 冗余样板代码

为了添加 `code`，我们必须注册所有错误 `error`。实例会携带 code 名称的类型推断，如下所示：

为了安全地推断 code 和 error 类型，你需要导入携带该类型推断的基础实例：

```ts
const ErrorDictionary = new Elysia()
	.error('MyError', MyError)

const ErrorHandler = new Elysia()
	.use(ErrorDictionary)
	.onError(({ code, error }) => {
		switch(code) {
			case 'MyError':
				// correctly infer
				return error
		}
	})

const WithoutDictionary = new Elysia()
	.onError(({ code, error }) => {
		switch(code) {
			// No infer
			case 'MyError':
				// Generic Error
				return error
		}
	})
```

这增加了额外的样板代码，并且不支持循环依赖。

##### 2. 添加原型

为了实现这一点，`error` 会为输入 Error 类添加一个新原型。

然后 Elysia 会查找错误原型并进行匹配。

##### 3. 类型推断

由于无法静态分析错误处理，因此不可能推断响应类型。

#### 新 API

为了解决这个问题，我们完全移除了错误 code，并引入了一个可以直接接收 Error 类的新 API。

```ts
new Elysia()
	.error(MyError, () => {
		// do something
	})
```

这解决了之前的全部 3 个问题，同时使代码更加简洁。你可以将它理解为类似 `mapResponse`，但专门用于错误处理。

由于这一变更，现在可以直接将 Error 和映射后的值推断到路由响应类型中。

这意味着任何错误都可以被正确收集，并让 Eden Error handling 更加富有表现力。

![New Error Handling API](/blog/elysia-20/error-infer.webp)

#### Elysia Error

如果要使用 Elysia 特有的错误，例如 `notFound`、`validation`，只需从 Elysia 导入对应的错误名称。

```ts
import { NotFound, ValidationError } from 'elysia'

new Elysia()
	.error(NotFound, () => {
	})
	.error(ValidationError, () => {
		// do something
	})
```

#### Fallback

要处理错误无法被静态分析的 fallback 情况，只需使用 `instanceof Error`。

```ts
import { NotFound, ValidationError } from 'elysia'

new Elysia()
	.error(({ error }) => {
		if (error instanceof MyError)
			// do something
	})
```

---

### Problem Error

Elysia 现在使用 [RFC 9457](https://datatracker.ietf.org/doc/html/rfc9457)：Problem Details API 来描述错误。

所有 Elysia 错误现在都会返回 problem detail JSON，而不是单独的字符串，并统一使用 problem detail 结构。

此外，Elysia 现在使用 `application/problem+json` header 发送错误，而不是 `application/json`。

要启用此功能，可以使用 `problem` 代替 `status`，它会为 RFC 9457 处理必要的工作。

```ts
import { Elysia, problem } from 'elysia'

new Elysia()
	.get('/', () => problem(418, {
		detail: 'I love teapot'
	}))
	.error(MyError, () => problem(418, {
		detail: 'I love teapot'
	}))
```

Eden 已经处理了新的 header 和格式，但对于其他 client，请务必检查你的前端，确认它是否正常工作。

---

### return 或 throw

这种行为曾让许多用户感到困惑。现在，无论错误是 return 还是 throw，都可以从 `onError` 中进行拦截。

---

### Macros

`.macro(name, definition)` 现在已被移除。

它最初是作为解决 macro 与 resolve 和／或 schema 兼容问题的临时方案引入的。

```ts
// Elysia 1.x
new Elysia()
	.macro('auth', {
  		resolve: ({ headers }) => ({ user: auth(headers) })
	})
	.get('/', ({ auth }) => auth)

// Doesn't work in Elysia 1.x but work in 2.0
new Elysia()
	.macro({
		auth: {
			derive: ({ headers }) => ({ user: auth(headers) })
		}
	})
	.get('/', ({ auth }) => auth)
```

现在这个问题已经修复，因此我们移除了这个临时方案，以简化 macro API。

---

### WebSocket

WebSocket 现在是一个 opt-in 功能，并拥有与 `.get`、`.post` 及其他普通 API 类似的 API。

```ts
import { websocket } from 'elysia/websocket'

new Elysia()
	// add only once in any part of an app
	.use(websocket())
	.ws('/', ({ params: { id } }) => id)
	.ws('/stream', function* () {
		// instead of ws.send(1)
		yield 1
		yield 2
		yield 3
	})
```

原始 WebSocket API 是以 Bun 为模型设计的，但我们发现，终端用户实际上没有理由为了使用 WebSocket 而理解 Bun websocket 的工作方式。

因此，我们将其替换为用户已经熟悉的 Elysia API，以获得更好的心智模型和类型推断。

通过 generator function 和 `yield`，Elysia 现在可以直接推断实际的 WebSocket 响应，而不是依赖 response schema 这样的次级来源。

#### 需要注意的变更

- `.ws()` 现在接受 2～3 个参数
	- 2 参数形式（`.ws('/ws', handler)`、`.ws('/ws', options)`）保持不变
	- 3 参数形式现在是 `.ws('/ws', options, handler)`
- `ws.data` 现在直接内联到 `ws` 中
- 出于类型安全考虑，现在更推荐使用 generator function 和 `yield` 发送数据，而不是使用 `ws.send`

---

### `resolve` 现在是 `derive`

我们发现，大多数人不清楚何时应该使用 `derive` 和 `resolve`，并且经常将两者混淆。

我们发现，大多数人实际上需要的是让 `derive` 在 `beforeHandle` 而不是 `transform` 中运行。

因此，旧的 `resolve` 现在就是新的 `derive`：

- `derive` 现在在 `beforeHandle` 中运行（之前是 `resolve` 的行为）
- `resolve` 现在已被移除

```ts
// 1.x
app.resolve(({ headers }) => ({ user: auth(headers) }))

// 2.0
app.derive(({ headers }) => ({ user: auth(headers) }))
```

---

### `'scoped'` scope 现在是 `'plugin'` scope

- `{ as: 'scope' }` **对象形式已移除**
- `.decorate()`／`.state()` 的 `{ as: 'append' | 'override' }`

```ts
// 1.x
app.beforeHandle({ as: 'scoped' }, fn)
app.as('scoped')
app.guard({ as: 'scoped' }, fn)
app.decorate({ as: 'override' }, 'db', db)

// 2.0
app.beforeHandle('plugin', fn)
app.as('plugin')
app.guard('plugin', fn)
app.decorate('override', 'db', db)
```

---

### Guard／group 默认使用 `'override'`

**每个** `.guard()` 和 `.group()` 默认都使用 **override**。

- 越接近路由，权限越高，越接近的 schema 会**替换**继承而来的 schema
- 所有 API 都必须显式使用 `schema: 'standalone'`

**迁移：**如果你使用 `guard`，请添加 `schema: 'standalone'`：

```ts
// 1.x string-scope & run forms were implicitly additive (standalone)
app.guard({ body: t.Object({ a: t.String() }) })

// 2.0 now overrides by default; prefer closer schema first
app.guard({ schema: 'standalone', body: t.Object({ a: t.String() }) })
```

---

### `aot: false` 已移除

Dynamic mode 现在已被完全移除，取而代之的是 AOT mode。

---

### 移除 file-type

Elysia 2 默认不再包含 `file-type` package 来验证文件的 mime type。

它只会与指定 type 的 `t.File` 和 `t.Files` 一起使用。任何不使用它的应用都会携带一个很大的模块，因此现在默认将其移除。

迁移时，只需调用 `setFileTypeDetector`，并在 Elysia 应用的任意位置传入 `fileTypeFromFile` 或你自己的实现。

```ts
import { setFileTypeDetector } from 'elysia'
import { fileTypeFromFile } from 'file-type'

setFileTypeDetector(fileTypeFromFile)
````

## 稳定性

Elysia 现在覆盖了更多单元测试，expect 调用次数从 2800 次增加到 10,000+ 次。

其中包括性能、内存使用报告，以及每次 commit 和 pull request 的包大小硬性保护，以防止并追踪性能回归。

### 其他变更

你可以在这里找到不应影响大多数应用的内部变更或较小变更：[migration guide](https://github.com/elysiajs/elysia/pull/1873#issuecomment-4734573873)

#### 行为变更

- `context.path` 现在是 readonly
- Validation error `payload.expected` 的值现在会被共享并深度冻结
- schema 会在首次注册时克隆，并通过 identity 复用
- Signed-cookie 验证现在默认使用 `verify: 'lazy'`
- 从 `request()` hooks 中提前返回的值现在会在发送前经过 `mapResponse`
- [Type] 实例级 `.parse()` 和 `.transform()` 不再继承任何 guard input schema——其上下文会被类型化为原始的、验证前的值（实例前缀中的路径参数仍会保留）
- `afterHandle` 在短路时会跳过剩余部分
- `Error.summary` 现在改用默认的 TypeBox message
- `Error.summary` 现在支持 Standard Schema
- Validator 会运行 `Convert`，并将 codec schema 的顺序调整为 `Convert -> Check -> DecodeUnsafe`
- `streamResponse`（adapter utils）现在会生成原始 body chunks
- 无 body 的 `GET`／`HEAD` 路由不再运行 `parse` 生命周期 hooks
- 默认验证（422）响应现在会限制回显的 `found` 值：JSON 超过 4KB 的 request body 不再完整返回
- 只向 Bun.serve.routes 注册静态内容
- Bun 原生静态路由 dispatch 不再因存在 `error` hook 而被禁用
- `mapResponse` hook 或 request schema 现在会正确回退到 JS 路径，而不是在 Bun.serve.routes 中以未映射／未验证的方式原生提供服务
- 当 `NODE_ENV=production` 时，未处理的错误不再向 client 泄露其 `message`
- 对于没有显式 `response` 的 thrown／returned 通用 `Error` 或任何 status >= 500 的 `ElysiaError`，现在出于安全原因会返回 `Internal Server Error`，而不是原始错误消息
- response mapper 为 returned／mapped `Error` 生成的 JSON 错误响应不再包含 `cause` 字段，并且当 `NODE_ENV=production` 时，其 `message` 会被替换为 `Internal Server Error`。非生产环境输出保持不变（`{ name, message, cause }`）
- `file()` 响应现在会根据不区分大小写的文件扩展名解析其 `content-type`
- 同步 Standard Schema validators 不再强制生成异步路由
- 在 router 构建期间，Bun 原生静态路由 `Response` 对象不再保留在基础 Elysia 实例上

#### 改进

- `t.File({ type })`／`t.Files({ type })` 的内容检测失败现在会报告出错的属性路径（`property: '/avatar'`、`/files/0`），而不是空路径——只有在检测失败时才会对验证值执行 identity walk
- adapter v2
- sub type validator
- shared validator cached
- shared schema reference
- Cookie schema field
- 普通 `t.File()`／`t.Files()`（没有 `type` 选项）不再强制使用异步验证路径

#### Bug 修复

- 在不确定 content-type 时返回 415
- `context.server` 现在会在 socket 请求中接收活动的 Bun server，而对于直接调用 `app.handle()` 则为 `null`
- 非 Bun（Node／web-standard）adapter 中，普通字符串响应现在会设置 `content-type: text/plain`
- cookie values 被进行两次 percent decode（`parse()` 已经会解码），导致任何解码后仍包含 `%xx` 的值被破坏（例如 `100%2520off` 会变为 `100 off`，而不是 `100%20off`）
- `.compile()` 会用通用 HTTP handler 覆盖 WebSocket upgrade handlers，导致 eager／AOT 编译后 upgrade 失效
- `normalize: false` 会按引用返回预计算的默认对象，因此某个请求的 handler 对默认 body／query 的修改会泄漏到后续请求
- 没有 `200` 条目的独立 `response` schema 会抛出 `'~kind' in undefined`
- Dynamic（参数化）路由在默认 `strictPath: false` 下无法匹配末尾斜杠
- 每个应用的 `loosePath`／decoded-path caches 会在攻击者控制的请求路径下无限增长
- `onError` 返回 `File`／`Blob` 时会抛出 `TypeError`
- 在非 Bun runtime 中重新流式传输返回的 `Response` 时，response headers 会丢失
- Bun 上的原生静态路由会跳过 `wrap()` HOC
- 在 Bun 之外，signed-cookie HMAC 比较会回退到非 constant-time 的 `===`（timing side channel）
- cookie secret rotation 中使用 `null`（“allow unsigned”）条目时，任何包含点号的值都会抛出 `Secret key must be provided`
- `application/xml` 会被解析为 `x-www-form-urlencoded`
- Sucrose：在 context 上使用 optional chaining（`ctx?.query`）的 handlers 无法推断该字段
- query array parsing 中未受保护的 `JSON.parse` 会将格式错误的输入变成受请求控制的 500
- 当所有静态响应都是同步响应时，Bun 原生静态路由从未被安装
- error-path `mapResponse` codegen 会向未声明的 `tmp` 赋值，使映射后的响应泄漏到 `globalThis`
- 无 schema 的 body 路由现在会在访问 `request.body` 之前将 `Transfer-Encoding` 视为 body 存在，从而为 chunked／proxy-framed 请求保留快速 framing-header 路径，而无需 `Content-Length`

## 对 Elysia 2 的预期

你不太可能看到 Elysia 2 带来显著更快的吞吐量。

Elysia 2 是 Elysia 更好的基础，覆盖了我们现在拥有以及未来将拥有的全部范围，其目标比单纯追求吞吐量更加广泛。

你应该关注的是降低后的峰值内存使用量和更快的启动时间，尤其是在 Cloudflare Worker 这类 Serverless 环境中。

虽然由于所有破坏性变更和重写，这个版本仍然有些粗糙，但你应该可以期待未来版本的 Elysia 带来更加稳固的体验。

## 我应该更新到 Elysia 2 beta 吗？

Elysia 2 已在合成环境以及我们的一些内部服务器上经过充分测试，没有出现关键问题。

Codemod 几乎可以处理所有情况，我们使用它迁移了全部 Elysia 插件，覆盖率约为 95%，且无需付出太多努力。

```bash
bunx @elysia/codemod@latest
```

我们将当前版本标记为“beta”，为插件开发者更新其插件以适配 Elysia 2 提供一个平稳过渡期。

对于我们来说，它已经足够稳定，足以让我们有信心将自己的应用迁移到 Elysia 2 beta。但由于这是一次完全重写，与之前的版本相比可能仍然存在一些特殊情况，不过我们认为它已经足够稳定。它比我们发布过的任何 Elysia beta 版本都稳定得多。

在相当一部分插件迁移到 Elysia 2 之前，我们会继续保留 beta 标签。

## 后记

DayDream 是 Elysia 的一次重大更新，历时超过 8 个月。

如果没有所有的 [sponsors](https://github.com/sponsors/saltyaom)，尤其是 Jarred Sumner，让我能够全职维护 Elysia，这一切都不可能实现。

这同样离不开社区投入的时间和资源，不仅是经济上的支持，也包括情感上的支持。

“Daydream”这首歌每次都能打动我，尤其是考虑到它诞生的故事。GGZ 可能是我最早接触到的手机游戏之一。看到自己最喜欢的角色经历如此多的苦难，只为最终实现她的愿望，这也是我想要做的事情。

对我来说，8 个月仿佛转瞬即逝。昨天我还在撰写 Elysia 1.4 的发布说明，而现在已经在写 Elysia 2 了。前方仍然有一条更加漫长的道路。

但即使道路无限漫长，我们终有一天会抵达终点。

> **Per Ardua Ad Astra**
>
> 历经磨难，终抵群星。

---

我保存这个版本名称，是因为它在我心中有着特殊的位置。对于一个非常特别的时刻来说尤其如此，而它现在也完美契合 Elysia 今天的时刻。

现在的 Elysia，就像我们刚刚醒来，发现自己所做的一切原来只是一场梦。一场略有不同，却更美好的现实，让我们从中醒来。

从小我就一直梦想着创造一些东西，让人们可以用它来构建伟大的事物。我努力让 Elysia 尽可能变得优秀。我每天都尽力打造世界上最好的工具，有时也对自己要求得太过严格。

有时我会想，我为什么要在 Open Source 上投入这么多时间。真的值得吗？从经济角度看，这糟糕透了。长期来看也很糟糕。在一个无法自给自足的 Open Source Software 上工作，完全没有任何明智之处。但即便如此，我仍然继续前进。

当我感到疲惫，不想再做任何事情时，有时我会停下来，偷偷观察人们如何使用 Elysia，而不与他们互动。即使我看不懂，我也能看到许多关于 Elysia 的日语、韩语和西班牙语博客文章或视频。

看到人们使用你花费多年、投入巨大努力打造的工具。看到 Elysia 如何帮助你构建自己的工具，看到你们的故事和经历，这是一种我不知道该如何描述的感受。这是一份只有我自己能够珍藏的宝藏。

它每天都在支撑着我继续前进。让我意识到，我所做的事情是有意义的。让我意识到，我并不孤单。

> 我还要许下多少愿望，黎明才会到来
>
> 这一切终将结束的那一天，真的会到来吗？
>
> 如果我拭去眼泪，我的思念一定会化作力量
>
> 即使我没有闭上双眼
>
> 我仍看见了一场梦，那是一场如此喧闹的梦
>
> 我真的想见到你，奔向你，然后说一句“好久不见”

即使我知道那只是一场愚蠢的梦，我仍然想继续做梦。

关于 Elysia，我还有许多计划想与你们分享。

> 即使我没有闭上双眼，我仍看见了一场梦
>
> 那是一场如此喧闹的梦
>
> 我想见到你，我想与你相遇

谢谢你一直陪伴着我。

\- SaltyAom

</Blog>
