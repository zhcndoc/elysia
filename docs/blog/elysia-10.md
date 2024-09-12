---
title: 伊利西亚 1.0 - 陨落者的哀歌
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: 伊利西亚 1.0 - 陨落者的哀歌

    - - meta
      - name: 'description'
        content: 介绍蔗糖，一个更好的静态代码分析引擎，启动时间提升高达14倍，移除每实例40个路由的限制，类型推断速度提升约3.8倍，更新条约2，钩子类型（重大更改），以及严格类型检查的行内错误。

    - - meta
      - property: 'og:description'
        content: 介绍蔗糖，一个更好的静态代码分析引擎，启动时间提升高达14倍，移除每实例40个路由的限制，类型推断速度提升约3.8倍，更新条约2，钩子类型（重大更改），以及严格类型检查的行内错误。

    - - meta
      - property: 'og:image'
        content: https://elysia.zhcndoc.com/blog/elysia-10/lament-of-the-fallen.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysia.zhcndoc.com/blog/elysia-10/lament-of-the-fallen.webp

    - - script
      - src: https://platform.twitter.com/widgets.js
        async: true
        charset: utf-8
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="伊利西亚 1.0 - 陨落者的哀歌"
    src="/blog/elysia-10/lament-of-the-fallen.webp"
    alt="梦幻协奏曲，漂浮气泡的景象"
    author="SaltyAom"
    date="2024 年 6 月 16 日"
    shadow
>

伊利西亚 1.0 是经过 1.8年开发后的首个稳定版本。

自从开始，我们一直在期待一个专注于开发者体验、开发速度，以及如何为人类而不是机器编写代码的框架。

我们在各种情况下测试了伊利西亚，模拟了中等到大型的项目，并将代码交付给客户，这是我们感到足够自信可以发布的第一个版本。

伊利西亚 1.0 带来了重大改进，并包含了一个必要的重大变更。
- [蔗糖](#蔗糖) - 重写的模式匹配静态分析，取代正则表达式
- [启动时间提升](#启动时间提升)高达 14 倍
- [移除 ~40 路由/实例的 TypeScript 限制](#移除-~40-路由实例-的限制)
- [类型推断速度提升](#类型推断速度提升)约 3.8 倍
- [更新条约 2](#更新条约2)
- [钩子类型](#钩子类型-重大变更) (重大更改)
- [严格类型检查的行内错误](#严格类型检查的行内错误)

---

按照传统，伊利西亚的发布笔记以一首歌曲或媒体命名。

这个重要的版本以 [“陨落者的哀歌”](https://youtu.be/v1sd5CzR504) 命名。

来自**“崩坏 3” **的动画短片，这是我最喜欢的章节，以及我最喜欢的角色，**“雷电芽衣”**，她演绎的主题曲，[“崩坏世界偶像”](https://youtu.be/s_ZLfaZMpe0)。

这是一个非常好的游戏，你应该去尝试一下。

ー SaltyAom

<small>也被称为雷电芽衣，来自枪少女 Z、崩坏 3、崩坏星穹铁道。以及她的 “变体”，雷电将军，来自原神，可能还有亚克隆，崩坏星穹铁道 (因为她在星铁 2.1 中被提到的坏结局赫尔墨斯形态)。</small>

::: tip
请记住，伊利西亚 JS 是由志愿者维护的开源库，与米哈游或霍格沃兹没有关联。但我们确实是崩坏系列的超级粉丝，对吗？:::
:::

## 蔗糖
伊利西亚优化了性能，在各种基准测试中表现出色，其中一个主要因素要归功于 Bun，以及我们的自定义即时静态代码分析。

如果你还不知道，伊利西亚有一个内置的 “编译器”，它读取你的代码并生成一种优化处理函数的方法。

这个过程很快，并且不需要构建步骤就在飞行中发生。
然而，维护起来很困难，因为它是用许多复杂的正则表达式编写的，并且在某些情况下可能会变慢。

这就是为什么我们用一个混合方法重新实现了我们的静态分析部分，该方法结合了部分抽象语法树和模式匹配的名称**“蔗糖”**。

而不是使用完整的抽象语法树，这种方法更准确，我们选择实现仅适用于提高性能的规则，因为它在运行时需要速度。

蔗糖擅长准确地推断处理函数的递归属性，内存使用量低，结果是最快 37%的推断时间和显著减少的内存使用。

蔗糖被用来替换正则表达式到部分抽象语法树，从 Elysia 1.0 开始使用模式匹配。

## 启动时间改进
由于蔗糖 (Sucrose) 的贡献，以及与动态注入阶段的分离，我们现在可以将分析时间延迟到 JIT (即时编译) 而不是 AOT (ahead-of-time 编译)。

换句话说，“编译” 阶段可以懒惰地评估。

当路由第一次匹配时，将评估阶段从 AOT 卸载到 JIT，并将结果缓存以按需编译，而不是在服务器启动前编译所有路由。

在运行时性能方面，单个编译通常很快，耗时不超过 0.01-0.03 毫秒 (毫秒，不是秒)。

在中型应用程序和压力测试中，我们测量到启动时间快了约 6.5-14 倍。

## 移除约 40 条路由/实例限制
以前，由于 Elysia 0.1 的限制，您只能堆叠约 40 条路由/1 个 Elysia 实例。

这是 TypeScript 的限制，每个队列都有有限的内存，如果超出，TypeScript 会认为 “类型实例化过深，可能是无限的”。
```typescript
const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    .get('/3', () => '3')
    // repeat for 40 times
    .get('/42', () => '42')
    // Type instantiation is excessively deep and possibly infinite
```

作为权宜之计，我们需要将实例分开成控制器以克服限制，并重新合并类型以卸载队列，如下所示。
```typescript
const controller1 = new Elysia()
    .get('/42', () => '42')
    .get('/43', () => '43')

const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    // repeat for 40 times
    .use(controller1)
```

然而，从伊利西亚 1.0 开始，我们在优化类型性能，特别是尾调用优化和变体方面克服了这个限制。

这意味着理论上，我们可以堆叠无限数量的路由和方法的直到 TypeScript 崩溃。

<small class="opacity-50">(提示：我们做到了，大约在 558 个路由/实例之前，因为 TypeScript 命令行和语言服务器因为 JavaScript 堆栈/队列的限制)</small>

```typescript
const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    .get('/3', () => '42')
    // repeat for n times
    .get('/550', () => '550')
```

因此，我们将 40 个路由的限制提高到 JavaScript 内存限制，所以尽量不要堆叠超过 ~558 个路由/实例，并在必要时分离成插件。

![TypeScript在558个路由时崩溃](/blog/elysia-10/558-ts-limit.webp)

阻止我们感觉伊利西亚还没有准备好生产的是这个限制。

## 类型推断速度提升
多亏了我们在优化方面所做的努力，我们在大多数伊利西亚服务器中测量了**约 82%**的提升。

由于去除了堆栈限制，以及改进了类型性能，我们可以期望几乎即时的类型检查和自动完成，即使在 500 个路由堆叠之后。

<video controls>
    <source src="/blog/elysia-10/type-demo.mp4" />
</video>

**约 13 倍速度的提升**，对于条约的类型推断，通过预计算类型而不是卸载类型重映射到伊甸。

总的来说，伊利西亚和伊甸条约一起工作，速度可以**提升约 3.9 倍**。

这里是 Elysia + Eden Treaty 在 0.8 和 1.0 之间的比较，对于 450 个路由。

![类型性能比较，显示Elysia 0.8需要大约1500ms，而Elysia 1.0只需要大约400ms](/blog/elysia-10/ely-comparison.webp)

压力测试对于 450 个路由的 Elysia 和 Eden 条约，结果如下：
- Elysia 0.8 需要大约 1500ms
- Elysia 1.0 需要大约 400ms

多亏了堆栈限制的移除，以及重映射过程，现在有可能堆叠超过 1000 个路由。

## 更新条约 2
我们向您征求对伊甸条约的意见，您喜欢什么，有什么可以改进的地方。您提出了关于条约设计的一些缺陷，并提出了几种改进措施。

这就是为什么今天，我们介绍伊甸条约 2，一个更加符合人体工程学的设计。

尽管我们不喜欢重大变更，但条约 2 是条约 1 的继承者。

**条约 2 的新内容：**
- 更加符合人体工程学的语法
- 端到端类型安全的单元测试
- 拦截器
- 没有 “$” 前缀和属性

我们最喜欢的是端到端类型安全的单元测试。

因此，我们可以在不发送 FETCH 请求的情况下，用伊甸条约 2 来编写单元测试，提供自动完成和类型安全，而不是启动一个模拟服务器。
```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia().get('/hello', () => 'hi')
const api = treaty(app)

describe('Elysia', () => {
    it('return a response', async () => {
        const { data } = await api.hello.get()

        expect(data).toBe('hi')
    })
})
```

两个之间的区别是**条约 2 是条约 1 的继承者。**

我们并不打算引入任何条约 1 的破坏性变更，也不强迫您更新到条约 2。

您可以继续使用条约 1 而不需要更新到条约 2，我们将以维护模式维护它。

- 您可以导入 `treaty` 来使用条约 2。
- 并且导入 `edenTreaty` 来使用条约 1。

新条约的文档可以在[条约概览](/eden/treaty/overview.html)中找到，而旧条约的文档则在[条约遗留](/eden/treaty/legacy.html)中。

## 钩子类型 (重大变更)
我们讨厌破坏性变更，这是我们第一次在大型规模上进行这种变更。

我们在 API 设计上投入了大量努力，以减少对 Elysia 的变更，但这是为了修复一个有缺陷的设计所必需的。

以前，当我们添加一个钩子时，比如 `onTransform`，或 `onBeforeHandle`，它将成为全局钩子。

这在大规模项目中创建插件时非常有用，但对于单个实例来说，并不是理想的选择。

```typescript
const plugin = new Elysia()
    .onBeforeHandle(() => {
        console.log('Hi')
    })
    // log Hi
    .get('/hi', () => 'in plugin')

const app = new Elysia()
    .use(plugin)
    // will also log hi
    .get('/no-hi-please', () => 'oh no')
```

然而，我们发现这种行为带来了一些问题。
- 我们发现许多开发者即使在新的实例中也有很多嵌套的守卫，守卫几乎被用作开始新实例的一种方式，以避免副作用。
- 默认的全局可能导致不可预测的行为 (副作用)，如果不小心，特别是在团队中，有经验不足的开发者。
- 我们询问了许多熟悉和不熟悉 Elysia 的开发者，发现大多数开发者最初都期望钩子是本地的。
- 遵循前一点，我们发现使钩子默认全局可能会在不仔细审查的情况下容易导致意外的错误 (副作用)，并且难以调试和观察。

---

为了解决这个问题，我们引入了钩子类型，以指定钩子应该如何继承，通过引入一个**“钩子类型”**。

钩子类型可以分为以下几种：
- 本地 (默认)- 仅应用于当前实例及其后代
- 作用域 - 仅应用于 1 个祖先，当前实例及其后代
- 全局 (旧行为)- 应用于所有应用插件 (所有祖先，当前实例及其后代) 的实例

要指定钩子的类型，只需在钩子中添加 `{ as: hookType }`。
```typescript
const plugin = new Elysia()
    .onBeforeHandle(() => { // [!code --]
    .onBeforeHandle({ as: 'global' }, () => { // [!code ++]
        console.log('hi')
    })
    .get('/child', () => 'log hi')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'log hi')
```

该 API 旨在解决 Elysia 的**守卫嵌套问题**，开发者在根实例上引入钩子时因为担心副作用而不敢这样做。

例如，为了对整个实例创建一个身份验证检查，我们需要在守卫中包装一个路由。

```typescript
const plugin = new Elysia()
    .guard((app) =>
        app
            .onBeforeHandle(checkAuthSomehow)
            .get('/profile', () => 'log hi')
    )
```

然而，随着钩子类型的引入，我们可以移除嵌套保护样板代码。
```typescript
const plugin = new Elysia()
    .guard((app) => // [!code --]
        app // [!code --]
            .onBeforeHandle(checkAuthSomehow)
            .get('/profile', () => 'log hi')
    ) // [!code --]
```

钩子类型将指定钩子应该如何被继承，让我们创建一个插件来演示钩子类型是如何工作的。
```typescript
// ? Value based on table value provided below
const type = 'local'

const child = new Elysia()
    .get('/child', () => 'hello')

const current = new Elysia()
    .onBeforeHandle({ as: type }, () => {
        console.log('hi')
    })
    .use(child)
    .get('/current', () => 'hello')

const parent = new Elysia()
    .use(current)
    .get('/parent', () => 'hello')

const main = new Elysia()
    .use(parent)
    .get('/main', () => 'hello')
```

通过更改 `type` 值，结果应该是以下几种：

| type       | child | current | parent | main |
| ---------- | ----- | ------- | ------ | ---- |
| 'local'    | ✅    | ✅       | ❌     | ❌   |
| 'scope'    | ✅    | ✅       | ✅     | ❌   |
| 'global'   | ✅    | ✅       | ✅     | ✅   |

从 Elysia 0.8 迁移，如果你想使一个钩子全局化，你必须指定那个钩子是全局的。

```typescript
// From Elysia 0.8
new Elysia()
    .onBeforeHandle(() => "A")
    .derive(() => {})

// Into Elysia 1.0
new Elysia()
    .onBeforeHandle({ as: 'global' }, () => "A")
    .derive({ as: 'global' }, () => {})
```

尽管我们讨厌破坏性变更和迁移，但我们认为这是一个重要的修复，它迟早会发生以解决问题。

大多数服务器可能不需要自己应用迁移，但**很大程度上取决于插件作者**，或者如果迁移是必需的，通常不会超过 5-15分钟。

要查看完整的迁移说明，请参阅 [Elysia#513](https://github.com/elysiajs/elysia/issues/513)。

有关钩子类型的文档，请参阅 [Lifecycle#hook-type](https://beta.elysiajs.com/essential/scope.html#hook-type)

## 内联错误
从 Elysia 0.8 开始，我们可以使用 `error` 函数返回一个带有状态码的响应，以便 Eden 推理。

然而，这有一些缺点。

如果你为路由指定了一个响应模式，Elysia 将无法为状态码提供准确的自动完成。

例如，缩小可用状态码的范围。
![在Elysia中使用import error](/blog/elysia-10/error-fn.webp)

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

行内错误可以产生细粒度的类型，提供类型窄化、自动完成和类型检查，直到值的准确性，下划线红色波浪线出现在值上，而不是整个函数。

![使用Elysia的行内错误函数，显示窄化的状态代码自动完成](/blog/elysia-10/inline-error-fn.webp)


我们推荐使用行内错误函数而不是 import error 来获得更准确的类型安全。

## 这意味着 v1，接下来的计划
达到稳定的发布意味着我们相信 Elysia 是稳定和准备好用于生产的。

保持向后兼容性现在是我们的一些目标，专注于不是引入破坏性变更到 Elysia，除了安全性的问题。

我们的目标是让后端开发感觉简单、有趣和直观，同时确保用 Elysia 构建的产品有一个坚实的根基。

在此之后，我们将专注于改进我们的生态系统和插件。
引入一种处理重复和枯燥任务的方式，开始内部插件重写，身份验证，同步 JIT 和非 JIT 模式的行为，以及**通用运行时支持**。

Bun 在运行时表现出色，包管理器和所有提供的工具，我们相信 Bun 将是 JavaScript 的未来。

我们相信，通过向更多的运行时和提供有趣 Bun 特定的功能 (或至少易于配置，例如 [Bun Loaders API](https://bun.sh/docs/bundler/loaders))，将会逐渐让更多的人尝试 Bun，而不仅仅是 Elysia 选择支持 Bun。

<blockquote class="twitter-tweet">
    <p lang="en" dir="ltr">Bun was right, the best way to migrate people from Node is to have compatibility layer and offers better DX, and performance on Bun</p>
    <span>&mdash; SaltyAom (@saltyAom)</span>
    <a href="https://twitter.com/saltyAom/status/1768303850858143887?ref_src=twsrc%5Etfw">March 14, 2024</a>
</blockquote>

伊利西亚核心本身部分兼容 WinterCG，但是不是所有的官方插件在 WinterCG 上工作，有一些 Bun 特定的功能，我们想要修复这一点。

我们也不确定具体的日期或版本来支持所有运行时，因为我们将逐渐采用和支持，直到我们确保它不会出现任何不可预见的行为。

你可以期待支持的下列运行时：
- Node
- Deno
- Cloudflare Worker

我们还想支持以下：
- Vercel Edge Function
- Netlify Function
- AWS Lambda / LLRT

此外，我们还想支持以下：
- Nextjs
- Expo
- Astro
- SvelteKit

在此期间，有一个 [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) 维护由 Bogeychan，一个积极的 Elysia 贡献者。

此外，我们还重写了 [Eden 文档](/eden/overview)来更深入地解释 Eden 的细节，我们认为你应该去看看。

我们也改善了几个页面，并去除了多余的部分文档，你可以查看受影响页面的 [Elysia 1.0 文档 PR](https://github.com/elysiajs/documentation/pull/282/files)。

最后，如果你有任何关于迁移和额外问题的疑问，请随时在我们的 Elysia Discord 服务器上提问。
<iframe
    class="w-full h-64"
    src="https://discord.com/widget?id=1044804142461362206&theme=dark"
    allowtransparency="true"
    frameborder="0"
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
    loadin="lazy"
/>

## 可注意的改进

### 改进：
- 细粒度的反应式 cookie
- 使用单一的 cookie 源
- 宏对 websocket 的支持
- 添加 `mapResolve`
- 添加 `{ as: 'global' | 'scoped' | 'local' }` 到生命周期事件
- 添加短暂类型
- 行内 `error` 到处理器
- 行内 `error` 具有基于状态码的自动完成和类型检查
- 处理器现在检查 `error` 返回类型对于状态码
- 实用程序 `Elysia._types` 用于类型推断
- [#495](https://github.com/elysiajs/elysia/issues/495) 提供用失败的解析生成的用户友好错误
- 处理器现在基于状态码推断返回类型为条约
- `t.Date` 现在允许字符串化的日期
- 改进了类型测试用例
- 添加了生命周期测试用例
- `resolve, mapResolve, derive, mapDerive` 使用短暂类型来准确地缩小范围
- 推断查询动态变量

### 重大变更：
- [#513](https://github.com/elysiajs/elysia/issues/513) 生命周期现在默认是本地的

### Change:
- group private API property
- move `Elysia.routes` to `Elysia.router.history`
- detect possible json before return
- unknown response now return as-is instead of JSON.stringify()
- change Elysia validation error to JSON instead of string

### Bug fix:
- [#466](https://github.com/elysiajs/elysia/issues/466) Async Derive leaks request context to other requests if `aot: true`
- [#505](https://github.com/elysiajs/elysia/issues/505) Empty ObjectString missing validation inside query schema
- [#503](https://github.com/elysiajs/elysia/issues/503) Beta: undefined class when using decorate and derive
- onStop callback called twice when calling .stop
- mapDerive now resolve to `Singleton['derive']` instead of `Singleton['store']`
- `ValidationError` doesn't return `content-type` as `application/json`
- validate `error(status, value)` validate per status
- derive/resolve always scoped to Global
- duplicated onError call if not handled
- [#516](https://github.com/elysiajs/elysia/issues/516) server timing breaks beforeHandle guards
- cookie.remove() doesn't set correct cookie path

## 后记
::: tip
以下内容包含个人感受，可能包含宣泄，抱怨，可能尴尬和不专业，不应该写在软件发布笔记中。你可以选择不继续阅读，因为我们已经提供了所有必要的发布内容。:::
:::

两年前，我有一个悲惨的记忆。

这很容易成为我最痛苦的回忆之一，日夜工作以跟上一些软件公司与我们签订的宽松合同中占便宜的不公平任务。

这花费了超过 6 个月的时间，我必须从醒来工作到睡觉 (15 小时) 不断重复，**一天不休息，甚至没有5分钟的休息时间**，没有时间放松，除了编码之外什么也没有，几乎两个月没有休息日，甚至没有周末，我几乎不得不在医院的病床上工作。

我失去了灵魂，生活中没有任何目的，我唯一的愿望是让它成为一个梦。

当时，有太多的重大变化，无数的新功能从宽松要求和合同的漏洞中引入。

跟踪它几乎是不可能的，我们甚至因为 “不满意” 而被骗，没有得到我们应得的报酬，我们对此无能为力。

我花了整整一个月的时间从对编写代码的恐惧中恢复过来，因为不专业，我甚至无法在创伤中正确地完成我的工作，并向我的经理咨询我遭受了职业倦怠。

这就是为什么我们如此讨厌重大变化，并希望设计 Elysia 来轻松处理 TypeScript 的健壮性，即使它不是很好，但这是唯一的选择。

我不想任何人再经历类似的事情。

我们设计了一个框架来应对我们合同中所有的缺陷。

我在那里看到的的技术缺陷没有一个基于 JavaScript 的解决方案可以满足我，所以我决定尝试一个。

可以继续前进，可以避免将来签订这样的宽松合同，赚钱而不是花我大部分的自由时间一个框架但我没有。

有一个部分，[动画短片中的一句引用](https://youtu.be/v1sd5CzR504?t=128)，Mei 反对 Kiana 牺牲自己为世界的想法，Mei 回答说：

<div class="font-mono text-gray-500 dark:text-gray-400 text-base">

\> Yet you shoulder everything alone, at the cost of your life.

\> Maybe this is for the greater good...

\> But how can I pretend this is the right thing?

\> I only know that deep down...

\> the world means nothing to me...

\> without you

</div>

这是一种双重性，描述了一个人为了世界牺牲自己，而另一个人为了拯救自己所爱的人牺牲自己。

如果我们都看到一个问题并继续前进，我们怎么知道，下一个会遇到同样问题的人，需要有人去做一些事情。

那个人会为了拯救他人而牺牲自己，但如果没有人拯救那个牺牲者怎么办？

这个名字**“陨落者的哀歌”**描述了这一点，以及我们为什么创造 Elysia。

<small class="opacity-50">尽管一切都是为了我的最爱，我可能和我自己联系得太多。</small>

---

尽管从痛苦的记忆中创造，和悲剧事件。这是一个特权，看到 Elysia 成长为一个充满爱意的事物。并且看到你建造的东西被爱，并且被很好地接受。

伊利西亚是一个开源开发者的作品，没有任何公司支持。

我们需要做一些工作来维持生计，并在业余时间构建 Elysia。

在一个点上，我选择不立即寻找工作，只是为了在几个月内专注于 Elysia。

我们愿意花费我们的时间来不断改进 Elysia，并且您可以通过 [GitHub 赞助商](https://github.com/sponsors/SaltyAom)帮助我们，以减少我们支持自己的工作量，并拥有更多的时间来工作在 Elysia。

我们只是制造者，想要创造一些东西来解决我们遇到的问题。

---

我们一直在创造和实验 Elysia，将真实代码交付给客户，并使用 Elysia 来为我们的本地社区，[CreatorsGarten](https://creatorsgarten.org) (本地技术社区，不是组织) 提供动力。

这花了很多时间，准备和勇气，以确保 Elysia 准备好生产。当然，会有 bug，但我们愿意倾听并修复它们。

这是一个新的开始，而且可能是因为你。

而且这是可能的**因为你**。

<!-- There are a lot of emotions, a lot of tiring days, and countless nights trying to build something good, something we love, something we dream of.

I have always been telling myself since then that, one day my effort would be recognized. One day someone would remember me. One day.

I don't know if that day is today or not, there's still a long way ahead.
But something I know is that the seed I planted has starting to bloomed.

I hope that we can see this journey together. -->

ー SaltyAom

> 所有辉煌的星星在末日终将消逝，
>
> 你温柔的灵魂将沉溺于诅咒之中。
>
> “猩红之月照耀在血迹斑斑的小镇上”
>
> 哀歌中的偶像在哭泣。
>
> 那些甜蜜的回忆深埋在记忆中，直到世界的尽头。
>
> <br>
>
> [**If rescuing you is a sin, I’ll gladly become a sinner.**](https://youtu.be/v1sd5CzR504?t=260)
</Blog>
