---
title: Elysia 1.0 - 倒下者的哀歌
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.0 - 倒下者的哀歌

    - - meta
      - name: 'description'
        content: 介绍 Sucrose，一个更好的静态代码分析引擎，启动时间提高到 14 倍，移除 40 个路由/实例的限制，类型推断速度提高到 ~3.8 倍，Eden 条约 2，Hook 类型（重大变化），以及严格类型检查的内联错误。

    - - meta
      - property: 'og:description'
        content: 介绍 Sucrose，一个更好的静态代码分析引擎，启动时间提高到 14 倍，移除 40 个路由/实例的限制，类型推断速度提高到 ~3.8 倍，Eden 条约 2，Hook 类型（重大变化），以及严格类型检查的内联错误。

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-10/lament-of-the-fallen.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-10/lament-of-the-fallen.webp

    - - script
      - src: https://platform.twitter.com/widgets.js
        async: true
        charset: utf-8
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.0 - 倒下者的哀歌"
    src="/blog/elysia-10/lament-of-the-fallen.webp"
    alt="梦幻音景的浮动泡泡"
    author="saltyaom"
    date="2024 年 3 月 16 日"
    shadow
>

Elysia 1.0 是经过 1.8 年开发后的第一个稳定版本。

自项目启动以来，我们一直在等待一个专注于开发者体验、速度以及如何让程序为人类而非机器而写的框架。

我们在各种场景中对 Elysia 进行了实战测试，模拟中型和大型项目，向客户交付代码，这是我们第一次感到足够自信可以发布的版本。

Elysia 1.0 引入了显著的改进，并包含 1 个必要的重大变化。
- [Sucrose](#sucrose) - 重写了基于模式匹配的静态分析，而非使用正则表达式
- [启动时间改进](#improved-startup-time) 提高至 14 倍
- [移除 ~40 个路由/实例的 TypeScript 限制](#remove-40-routesinstance-limit)
- [更快的类型推断](#type-inference-improvement) 提高至 ~3.8 倍
- [条约2](#treaty-2)
- [Hook 类型](#hook-type-breaking-change)（重大的变化）
- [内联错误](#inline-error) 用于严格的错误检查

---

Elysia 的发布说明有一个传统，每个版本都以一首歌或媒体命名。

这个重要版本的名称来自于 ["倒下者的哀歌"](https://youtu.be/v1sd5CzR504)。

这是来自我最喜欢的故事弧中的 **"崩坏：第三次崩坏"** 的短动画，和我最喜欢的角色 **"雷电芽衣"**，她的主题曲是 ["崩坏世界女神"](https://youtu.be/s_ZLfaZMpe0)。

这是一个非常好的游戏，你应该去看看。

ー SaltyAom

<small>也被称为来自《枪娘Z》、《崩坏：第三次崩坏》、《崩坏：星穹铁道》的雷电芽衣。还有她的“变体”，来自《原神》的雷电将军，可能还是来自《崩坏：星穹铁道》的阿喀琉斯（因为她可能是提到的星穹铁道 2.1 中的反派赫尔莎形态）。</small>

::: tip
请记住，ElysiaJS 是一个由志愿者维护的开源库，并不与米哈游或 HoYoverse 有关。但我们非常喜欢崩坏系列，可以吗？
:::

## Sucrose
Elysia 被优化以在各种基准测试中表现出色，其中一个主要因素得益于 Bun 及我们的自定义 JIT 静态代码分析。

如果你不知道，Elysia 中嵌入了一种“编译器”，可以读取你的代码并生成优化的函数处理方式。

这个过程快速且实时发生，无需构建步骤。
但因为大部分代码是用复杂的正则表达式编写的，所以在维护时会比较具有挑战性，如果发生递归时可能会变慢。

这就是为什么我们重写了静态分析部分，采用了部分 AST 基础与基于模式匹配的混合方法，命名为 **"Sucrose"**。

我们选择仅实现一组改进性能所需的规则，而非使用全面的 AST 基础（虽然准确性更高），因为这需要在运行时保持速度。

Sucrose 非常擅长低内存使用情况下准确推断处理函数的递归属性，导致推断时间提高了 37%，并显著降低了内存使用。

从 Elysia 1.0 开始，Sucrose 被用来替换基于正则表达式的部分 AST 和模式匹配。

## 改进的启动时间
得益于 Sucrose 及动态注入阶段的分离，我们可以将分析时间延迟到 JIT，而不是 AOT。

换句话说，“编译”阶段可以懒惰求值。

在第一次匹配路由时将评估阶段从 AOT 转移到 JIT，并缓存结果以便根据需要编译，而不是在服务器启动之前对所有路由进行编译。

在运行时性能方面，单次编译通常非常快速，耗时不超过 0.01-0.03 毫秒（毫秒不是秒）。

在中型应用程序和压力测试中，我们测得启动时间提高了 ~6.5-14 倍。

## 移除 ~40 个路由/实例限制
之前，从 Elysia 0.1 开始，你只能堆叠约 40 个路由/1 个 Elysia 实例。

这是 TypeScript 的一个限制，每个队列有有限的内存，如果超出，TypeScript 会认为 **“类型实例化过深，可能是无限的”**。
```typescript
const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    .get('/3', () => '3')
    // 重复 40 次
    .get('/42', () => '42')
    // 类型实例化过深，可能是无限的
```

为了解决这个限制，我们需要将实例分离为控制器来克服限制，然后重新合并类型以卸载队列，如下所示。
```typescript
const controller1 = new Elysia()
    .get('/42', () => '42')
    .get('/43', () => '43')

const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    // 重复 40 次
    .use(controller1)
```

然而，从 Elysia 1.0 开始，在优化类型性能（特别是尾调用优化和变体）一年后，我们克服了限制。

这意味着理论上，我们可以堆叠无限数量的路由和方法，直到 TypeScript 崩溃。

<small class="opacity-50">(剧透：我们已经做到这一点，大约在 558 个路由/实例之前 TypeScript CLI 和语言服务器因 JavaScript 每个堆栈/队列的内存限制而崩溃)</small>

```typescript
const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    .get('/3', () => '42')
    // 重复 n 次
    .get('/550', () => '550')
```

所以我们将限制从 ~40 个路由改为 JavaScript 内存限制，因此请尽量不要堆叠超过 ~558 个路由/实例，并在必要时分开为插件。

![TypeScript 在 558 个路由时崩溃](/blog/elysia-10/558-ts-limit.webp)

让我们觉得 Elysia 还没有准备好投入生产的障碍终于被解决了。

## 类型推断改进
得益于我们所做的优化，我们在大多数 Elysia 服务器中测得 **高达 ~82%** 的改进。

由于移除了堆栈限制，并提高了类型性能，即使在 500 个路由堆叠后的类型检查和自动完成几乎是即时的。

<video controls>
    <source src="/blog/elysia-10/type-demo.mp4" />
</video>

**对于 Eden 条约的性能提高高达 13 倍**，类型推断性能通过预计算类型而非卸载类型重映射到 Eden。

总体而言，Elysia 和 Eden 条约共同工作可以 **提高到 ~3.9 倍的速度**。

以下是 Elysia + Eden 条约在 0.8 和 1.0 中 450 个路由之间的比较。

![Elysia Eden 0.8 和 1.0 的类型性能比较，图中显示 Elysia 0.8 耗时 ~1500ms，而 Elysia 1.0 耗时 ~400ms](/blog/elysia-10/ely-comparison.webp)

使用 450 个路由的 Elysia 和 Eden 条约的压力测试结果如下：
- Elysia 0.8 耗时 ~1500ms
- Elysia 1.0 耗时 ~400ms

并且由于移除了堆栈限制和重映射过程，现在可以为单个 Eden 条约实例堆叠超过 1000 个路由。

## 条约 2
我们请你对 Eden 条约给出反馈，告诉我们你喜欢什么以及可以改进的地方，你为我们提供了一些设计缺陷和几个改进建议。

这就是为什么今天我们推出 Eden 条约 2，对其进行了完全改造，更加人性化的设计。

尽管我们不喜欢重大变化，但条约 2 是条约 1 的继承者。

**条约 2 的新特性**：
- 更加人性化的语法
- 单元测试的端到端类型安全
- 拦截器
- 无需 "$" 前缀和属性

我们最喜欢的是单元测试的端到端类型安全。

因此，与其启动一个模拟服务器并发送请求，不如使用 Eden 条约 2 来编写具有自动补全和类型安全的单元测试。
```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia().get('/hello', () => 'hi')
const api = treaty(app)

describe('Elysia', () => {
    it('返回响应', async () => {
        const { data } = await api.hello.get()

        expect(data).toBe('hi')
    })
})
```

两者之间的区别在于 **条约 2 是条约 1 的继承者**。

我们无意在条约 1 中引入任何重大变化，也不会强迫你更新至条约 2。

你可以选择继续在当前项目中使用条约 1，而无需更新至条约 2，我们会将其保持在维护模式。

- 你可以导入 `treaty` 来使用条约 2。
- 导入 `edenTreaty` 用于条约 1。

新条约的文档可以在 [条约概述](/eden/treaty/overview.html) 中找到，而条约 1 的文档可以在 [条约遗留](/eden/treaty/legacy.html) 中找到。

## Hook 类型（重大变化）
我们讨厌重大变化，这是我们第一次进行大规模的改变。

我们投入了大量精力在 API 设计上，以减少对 Elysia 所做更改的需要，但修复设计漏洞是必要的。

以前，当我们使用 **"on"** 添加一个 Hook，例如 `onTransform` 或 `onBeforeHandle` 时，它将成为全局 Hook。

这对于创建插件之类的功能很好，但对于像控制器这样的局部实例并不理想。

```typescript
const plugin = new Elysia()
    .onBeforeHandle(() => {
        console.log('嗨')
    })
    // 日志嗨
    .get('/嗨', () => '在插件中')

const app = new Elysia()
    .use(plugin)
    // 也会记录嗨
    .get('/不嗨请', () => '哦不')
```

然而，我们发现这种行为引发了几个问题。
- 我们发现许多开发者在新实例中有很多嵌套的守卫。守卫几乎被用作启动新实例的方式，以避免旁作用。
- 默认全局可能导致不可预测（旁作用）行为，特别是在团队中缺乏经验的开发者。
- 我们询问了许多熟悉和不熟悉 Elysia 的开发者，发现大多数人在最初都期望 Hook 是局部的。
- 基于之前的要点，我们发现，默认将 Hook 设为全局很容易导致意外的 bug（旁作用），如果不仔细审核，会很难调试和观察。

---

为了解决这个问题，我们引入了 Hook 类型来指定 Hook 的继承方式，添加了一种 **“hook-type”**。

Hook 类型可以分类如下：
- local（默认）- 仅适用于当前实例及其后代
- scoped - 仅适用于 1 个祖先、当前实例和后代
- global（旧行为）- 适用于所有应用插件的实例（所有祖先、当前和后代）

要指定 Hook 的类型，只需在 Hook 中添加 `{ as: hookType }`。
```typescript
const plugin = new Elysia()
    .onBeforeHandle(() => { // [!代码 --]
    .onBeforeHandle({ as: 'global' }, () => { // [!代码 ++]
        console.log('嗨')
    })
    .get('/子', () => '记录嗨')

const main = new Elysia()
    .use(plugin)
    .get('/父', () => '记录嗨')
```

此 API 的设计旨在解决 Elysia 的 **守卫嵌套问题**，开发者通常害怕在根实例上引入 Hook，因为担心旁作用。

例如，对于整个实例进行身份验证检查，我们需要在守卫中包装路由。

```typescript
const plugin = new Elysia()
    .guard((app) =>
        app
            .onBeforeHandle(checkAuthSomehow)
            .get('/profile', () => '记录嗨')
    )
```

但是，通过引入 Hook 类型，我们可以去除嵌套守卫的样板代码。
```typescript
const plugin = new Elysia()
    .guard((app) => // [!代码 --]
        app // [!代码 --]
            .onBeforeHandle(checkAuthSomehow)
            .get('/profile', () => '记录嗨')
    ) // [!代码 --]
```

Hook 类型将指定 Hook 应该如何被继承，让我们创建一个插件来说明 Hook 类型的工作原理。
```typescript
// ? 值基于下表提供的值
const type = 'local'

const child = new Elysia()
    .get('/child', () => '你好')

const current = new Elysia()
    .onBeforeHandle({ as: type }, () => {
        console.log('嗨')
    })
    .use(child)
    .get('/当前', () => '你好')

const parent = new Elysia()
    .use(current)
    .get('/父', () => '你好')

const main = new Elysia()
    .use(parent)
    .get('/主', () => '你好')
```

通过改变 `type` 值，结果应如下所示：

| type       | child | current | parent | main |
| ---------- | ----- | ------- | ------ | ---- |
| 'local'    | ✅    | ✅       | ❌     | ❌   | 
| 'scope'    | ✅    | ✅       | ✅     | ❌   | 
| 'global'   | ✅    | ✅       | ✅     | ✅   | 

从 Elysia 0.8 迁移，如果你希望使 Hook 为全局的，你需要指定该 Hook 是全局的。

```typescript
// 从 Elysia 0.8
new Elysia()
    .onBeforeHandle(() => "A")
    .derive(() => {})

// 转入 Elysia 1.0
new Elysia()
    .onBeforeHandle({ as: 'global' }, () => "A")
    .derive({ as: 'global' }, () => {})
```

尽管我们讨厌重大变化和迁移，但我们认为这是一个重要的修复，迟早会发生，以解决问题。

大多数服务器可能不需要自己执行迁移，但 **极大依赖于插件作者**，如果迁移是必要的，通常不会超过 5-15 分钟。

有关完整的迁移说明，请参见 [Elysia#513](https://github.com/elysiajs/elysia/issues/513)。

有关 Hook 类型的文档，请参见 [生命周期#hook-type](https://beta.elysiajs.com/essential/scope.html#hook-type)。

## 内联错误
自 Elysia 0.8 开始，我们可以使用 `error` 函数返回带有状态码的响应，用于 Eden 推断。

然而，这存在一些缺陷。

如果你为路由指定响应模式，Elysia 将无法为状态码提供准确的自动补全。

例如，缩小可用状态码的范围。
![在 Elysia 中使用导入错误](/blog/elysia-10/error-fn.webp)

内联错误可以从处理程序中解构如下：
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/hello', ({ error }) => {
        if(Math.random() > 0.5) return error(418, 'Nagisa')

        return 'Azusa'
    }, {
        response: t.Object({
            200: t.Literal('Azusa'),
            418: t.Literal('Nagisa')
        })
    })
```

内联错误可以根据模式生成细粒度的类型，提供类型缩小、自动补全和对值的准确性进行类型检查，否定红色波浪线下的值，而不是整个函数。

![在 Elysia 中使用内联错误函数，自动补全显示缩小后的状态码](/blog/elysia-10/inline-error-fn.webp)


我们建议使用内联错误，而不是导入错误，以获得更准确的类型安全性。

## v1 对我们意味着什么，接下来会怎样
达到稳定版本意味着我们相信 Elysia 足够稳定，准备在生产中使用。

维护向后兼容性现在是我们的目标之一，我们努力不向 Elysia 引入重大变化，除了安全问题。

我们的目标是使后端开发变得简单、有趣和直观，同时确保使用 Elysia 构建的产品具有牢固的基础。

在此之后，我们将专注于优化我们的生态系统和插件。
介绍处理冗余和单调任务的人性化方法，开始进行一些内部插件重写，身份验证，JIT 与非 JIT 模式之间的同步行为，以及 **通用运行时支持。**

Bun 在运行时、包管理和他们提供的所有工具中表现出色，我们相信 Bun 将成为 JavaScript 的未来。

我们相信，通过将 Elysia 开放给更多的运行时，并提供有趣的 Bun 特定功能（或至少易于配置，例如 [Bun Loaders API](https://bun.sh/docs/bundler/loaders)），最终将使人们尝试使用 Bun，而不是选择仅支持 Elysia。

<blockquote class="twitter-tweet">
    <p lang="en" dir="ltr">Bun 是正确的，从 Node 迁移的最佳方式是提供兼容层和更好的开发者体验，以及在 Bun 上的性能</p>
    <span>&mdash; SaltyAom (@saltyAom)</span>
    <a href="https://twitter.com/saltyAom/status/1768303850858143887?ref_src=twsrc%5Etfw">2024年3月14日</a>
</blockquote>

Elysia 核心本身部分与 WinterCG 兼容，但并不是所有的官方插件都与 WinterCG 兼容，其中一些具有 Bun 特定的功能，我们希望修复这一点。

我们还没有确切的日期或版本用于通用运行时的支持，因为我们将逐渐应用并测试，直到确保它在没有意外行为的情况下工作。

你可以期待支持以下运行时：
- Node
- Deno
- Cloudflare Worker

我们还希望支持以下内容：
- Vercel 边缘函数
- Netlify 函数
- AWS Lambda / LLRT

此外，我们还在以下支持服务器端渲染或边缘函数的框架上测试并支持 Elysia：
- Nextjs
- Expo
- Astro
- SvelteKit

同时，Bogeychan（Elysia 的一位活跃贡献者）维护的 [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills)。

此外，我们重写了 [Eden 文档](/eden/overview)，以更深入地解释 Eden 的细节，我们认为你应该查看一下。

我们还改进了几个页面，并删除了冗余的文档部分，你可以在 [Elysia 1.0 文档 PR](https://github.com/elysiajs/documentation/pull/282/files) 中查看受影响的页面。

最后，如果你在迁移过程中遇到问题或有与 Elysia 相关的疑问，可以在 Elysia 的 Discord 服务器中随时提问。
<iframe
    class="w-full h-64"
    src="https://discord.com/widget?id=1044804142461362206&theme=dark"
    allowtransparency="true"
    frameborder="0"
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
    loadin="lazy"
/>

## 突出改进

### 改进：
- 细粒度反应式 Cookie
- 使用单一真相源管理 Cookie
- WebSocket 的宏支持
- 添加 `mapResolve`
- 添加 `{ as: 'global' | 'scoped' | 'local' }` 到生命周期事件
- 添加瞬态类型
- 内联 `error` 到处理程序中
- 内联 `error` 基于状态码具有自动补全和类型检查
- 处理程序现在根据状态码检查 `error` 的返回类型
- 工具 `Elysia._types` 用于类型推断
- [#495](https://github.com/elysiajs/elysia/issues/495) 为解析失败提供用户友好的错误
- 处理程序现在推断条约的错误状态返回类型
- `t.Date` 现在允许字符串化的日期
- 改进类型测试用例
- 为所有生命周期添加测试用例
- resolve、mapResolve、derive、mapDerive 使用瞬态类型准确范围
- 推断查询动态变量

### 重大变化：
- [#513](https://github.com/elysiajs/elysia/issues/513) 生命周期现在优先局部

### 更改：
- 分组私有 API 属性
- 将 `Elysia.routes` 移动到 `Elysia.router.history`
- 检测可能的 JSON 在返回之前
- 未知响应现在原样返回而不是 JSON.stringify()
- 更改 Elysia 验证错误为 JSON 而不是字符串

### Bug 修复：
- [#466](https://github.com/elysiajs/elysia/issues/466) Async Derive 在 `aot: true` 时泄漏请求上下文到其他请求
- [#505](https://github.com/elysiajs/elysia/issues/505) 空 ObjectString 在查询模式中缺少验证
- [#503](https://github.com/elysiajs/elysia/issues/503) Beta：使用装饰和派生时的 undefined 类
- 调用 .stop 时 onStop 回调被调用两次
- mapDerive 现在解析到 `Singleton['derive']` 而不是 `Singleton['store']`
- `ValidationError` 不会将 `content-type` 设置为 `application/json`
- 验证 `error(status, value)` 针对每个状态进行验证
- derive/resolve 始终作用于全局
- 如果未处理，则重复调用 onError
- [#516](https://github.com/elysiajs/elysia/issues/516) 服务器计时在 beforeHandle 守卫之前中断
- cookie.remove() 没有设置正确的 cookie 路径

## 后记
::: tip
以下内容包含个人感受，可能是发泄、抱怨、可能是尴尬和不专业，这不应该出现在软件发布说明中。你可以选择不继续阅读，因为我们已经阐明了发布的所有必要内容。
:::

两年前，我有一个悲惨的记忆。

这无疑是我最痛苦的记忆之一，日以继夜地工作，处理不公平的任务，这些任务利用了我们与某些软件公司的松散合同。

这花费了我超过 6 个月的时间，我不得不从早醒到睡觉（15 小时）重复工作，**整整两个月都没有做任何事，甚至没有休息 5 分钟，完全没有放松时间，几乎没有单日休息，甚至在医院床上也快得工作。**

我就像一个没有魂魄的人，生活中毫无目标，我唯一的愿望就是让一切成为一场梦。

那时，破坏性变化很多，从松散的要求和合同中引入了无数新功能。

跟踪这些几乎不可能，而我们甚至没有获得应得的报酬，理由是“没有满意”，我们对此无能为力。

我花了一个月的时间才从对编码的恐惧中恢复过来，因不专业而无法正常完成工作，心里受到创伤，并向经理咨询我遭受的职业倦怠。

这就是为什么我们如此讨厌重大变化，并希望设计 Elysia 以便轻松处理变化，即使这并不好，但这就是我们所拥有的。

我不希望任何人经历这样的事情。

我们设计了一个框架来应对我们在那个合同中遇到的所有缺陷。

我看到的技术缺陷中，并没有任何基于 JavaScript 的解决方案可以满足我，因此我进行了实验。

我本可以选择继续前行，避免将来出现这种松散合同，并赚钱，而不是花费大部分休息时间创造一个框架，但我没有。

我最喜欢的部分是 [动画短片中的一句话](https://youtu.be/v1sd5CzR504?t=128)，其中芽衣反对琪亚娜牺牲自己拯救世界的想法，而芽衣回应：

<div class="font-mono text-gray-500 dark:text-gray-400 text-base">

\> 然而你独自扛下所有，付出了生命的代价。

\> 也许这是为了更大的利益...

\> 但我如何层层剥离这一切？

\> 我只知道，内心深处...

\> 世界对我而言毫无意义...

\> 如果没有你

</div>

这是描绘牺牲自己拯救世界的人与为了拯救所爱之人而牺牲自己的人之间的二元对立。

如果我们看到一个问题就无动于衷，如何确保接下来的人不会 stumble [被绊倒] 在与我们相同的问题上，需要有人做点什么。

那个人愿意牺牲自己拯救他人，但谁又将拯救被牺牲了的人呢？

这个名字 **"倒下者的哀歌"** 描述了这一点，以及我们为什么创造 Elysia。

<small class="opacity-50">*尽管这与我个人最喜欢的东西有关，我可能与之联系得太深了。</small>

---

尽管源于悲惨的事件与记忆，但看到 Elysia 成长为如此受爱戴的事物，是我的特权。看到你所创造的东西受到他人的喜爱并被他人接受。

Elysia 是开源开发者的作品，没有任何公司支持。

我们必须为生计而努力，并在空闲时间构建 Elysia。

在某个时刻，我选择不立即寻找工作，而是为了 Elysia 工作了数个月。

我们希望能不断改进 Elysia，而你可以通过 [GitHub sponsors](https://github.com/sponsors/SaltyAom) 来帮助我们，减少我们为自己支持所需的工作，并拥有更多空闲时间去工作让 Elysia 更好。

我们只是想要创建解决我们问题的东西的开发者。

---

我们不断创建并试验 Elysia，向客户交付真实代码，并在实际项目中使用 Elysia 为我们本地社区 [CreatorsGarten](https://creatorsgarten.org)（地方技术社区，而非组织）提供动力。

确保 Elysia 准备好的确需要大量的时间、准备和勇气。当然，不可避免会有 bug，但我们愿意倾听并修复它。

这是全新的一开始。

而这一切都因为 **你** 的存在而成为可能。

<!-- 这里有大量情感，很多辛苦的日子，以及无数个夜晚试图创造出优秀、热爱和梦想的东西。

我一直告诉自己，总有一天我的努力会被认可。总有一天，某人会记住我。总有一天。

我不知道那一天是否是今天，前方的道路还很漫长。
但我知道的是，我种下的种子已经开始发芽。

我希望我们能一起见证这一段旅程。 -->

ー SaltyAom

> 所有神圣的星星在日子结束时都会消逝，
>
> 你的温柔灵魂被赋予了诅咒。
>
> “猩红的月亮照耀着沾满鲜血的城镇”
>
> 哀泣的女神陷入了哀歌。
>
> 所有那些甜美的梦藏在回忆深处，直到最后。
>
> <br>
>
> [**如果拯救你是罪，我将心甘情愿地成为一个罪人。**](https://youtu.be/v1sd5CzR504?t=260)
</Blog>
