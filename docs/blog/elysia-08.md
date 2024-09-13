---
title: Elysia 0.8 - 史泰纳之门
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: 介绍 Elysia 0.8 - 史泰纳之门

    - - meta
      - name: 'description'
        content: 介绍 Macro API，一种与 Elysia 交互的新方式。新增的生命周期、resolve 和 mapResponse 让与 Elysia 的交互更加顺畅。静态内容编译静态资源预处理。默认属性、默认头和其他多项改进。

    - - meta
      - property: 'og:description'
        content: 介绍 Macro API，一种与 Elysia 交互的新方式。新增的生命周期、resolve 和 mapResponse 让与 Elysia 的交互更加顺畅。静态内容编译静态资源预处理。默认属性、默认头和其他多项改进。

    - - meta
      - property: 'og:image'
        content: https://elysia.zhcndoc.com/blog/elysia-08/gate-of-steiner.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysia.zhcndoc.com/blog/elysia-08/gate-of-steiner.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.8 - 史泰纳之门"
    src="/blog/elysia-08/gate-of-steiner.webp"
    alt="太空中的卫星在广阔的世界面前"
    author="saltyaom"
    date="2023 年 12 月 23 日"
>

以《命运石之门 0》的结尾曲《Gate of Steiner》命名。

Gate of Steiner 不专注于新奇的功能，而是关注 API 的稳定性和坚实的基础，以确保在 Elysia 1.0 发布时 API 保持稳定。

虽然如此，我们仍然带来了一些改进和新功能，包括：
- [Macro API](#macro-api)
- [新生命周期：resolve，mapResponse](#new-life-cycle)
- [错误函数](#error-function)
- [静态内容](#static-content)
- [默认属性](#default-property)
- [默认头](#default-header)
- [性能和显著改进](#performance-and-notable-improvement)

## Macro API
Macro 允许我们定义一个自定义字段来挂钩和守卫，通过暴露对生命周期事件栈的完全控制。

这样我们就可以将自定义逻辑组合成简单配置，并且拥有完全的类型安全性。

假设我们有一个用于基于角色限制访问的认证插件，我们可以定义一个名为**角色**的自定义字段。

```typescript
import { Elysia } from 'elysia'
import { auth } from '@services/auth'

const app = new Elysia()
    .use(auth)
    .get('/', ({ user }) => user.profile, {
        role: 'admin'
    })
```

Macro 完全访问生命周期栈，允许我们为每个路由添加、修改或删除现有事件。
```typescript
const plugin = new Elysia({ name: 'plugin' }).macro(({ beforeHandle }) => {
    return {
        role(type: 'admin' | 'user') {
            beforeHandle(
                { insert: 'before' },
                async ({ cookie: { session } }) => {
                  const user = await validateSession(session.value)
                  await validateRole('admin', user)
}
            )
        }
    }
})
```

我们希望通过这个 Macro API，插件维护者可以按照自己的心之所向来定制 Elysia，为与 Elysia 的交互开辟一种新的方式，而 Elysia 用户将能够享受更舒适的 API。

[Macro API](/patterns/macro) 的文档现在在**模式**部分可用。

下一代定制性现在只离你的键盘和想象力一步之遥。

## 新生命周期
Elysia 引入了新的生命周期来修复现有问题并提供高度请求的 API，包括 **resolve** 和 **mapResponse**：
resolve：**derive** 的一个安全版本。在同一个队列中作为 **beforeHandle** 执行。
mapResponse：在 **afterResponse** 之后执行，用于提供从基本值到 Web 标准响应的转换函数。

### Resolve
一个 “安全” 版的 [derive](/essential/context.html#derive)。

设计为在验证过程之后将新值附加到上下文，存储在与 **beforeHandle** 相同的栈中。

Resolve 的语法与 [derive](/life-cycle/before-handle#derive) 相同，下面是检索 Authorization 插件中的 Bearer 头部的示例。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .guard(
        {
            headers: t.Object({
                authorization: t.TemplateLiteral('Bearer ${string}')
            })
        },
        (app) =>
            app
                .resolve(({ headers: { authorization } }) => {
                    return {
                        bearer: authorization.split(' ')[1]
                    }
                })
                .get('/', ({ bearer }) => bearer)
    )
    .listen(3000)
```

### MapResponse
在 **“afterHandle”** 之后执行，设计为提供自定义响应映射，将基本值转换为 Web 标准响应。

下面是一个使用 mapResponse 提供响应压缩的示例。

```typescript
import { Elysia, mapResponse } from 'elysia'
import { gzipSync } from 'bun'

new Elysia()
    .mapResponse(({ response }) => {
        return new Response(
            gzipSync(
                typeof response === 'object'
                    ? JSON.stringify(response)
                    : response.toString()
            )
        )
    })
    .listen(3000)
```

为什么不用 **afterHandle** 而是引入新 API？

因为 **afterHandle** 被设计用来读取和修改基本值。存储插件，如 HTML 和 Compression，它们依赖于创建 Web 标准响应。

这意味着在响应映射和基本值突变在同一队列中的插件注册在之后将无法读取或修改值，导致插件行为不正确。

这就是为什么我们引入了一个新的生命周期，在 **afterHandle** 之后专门用于提供自定义响应映射，而不是将响应映射和基本值突变混在一起。


## 错误函数
我们可以通过使用 **set.status** 或返回新 Response 来设置状态码。
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418

        return "I'm a teapot"
    })
    .listen(3000)
```

这符合我们的目标，只是将字面量值返回给客户端，而不是担心服务器应该如何表现。

然而，这被证明与 Eden 的集成具有挑战性。因为我们返回一个字面量值，我们不能从响应中推断状态码，使得 Eden 无法区分响应和状态码。

这导致 Eden 无法发挥其全部潜力，特别是在错误处理中，因为它不能在没有为每个状态声明显式响应类型的情况下推断类型。

此外，我们的许多用户都希望有一个更明确的方式来直接将状态码与值一起返回，而不是依赖于 **set.status**，和 **new Response** 的冗长性，或者从处理程序函数外声明的实用程序函数返回响应。

这就是为什么我们引入一个 **error** 函数来返回一个状态码以及值给客户端。

```typescript
import { Elysia, error } from 'elysia' // [!code ++]

new Elysia()
    .get('/', () => error(418, "I'm a teapot")) // [!code ++]
    .listen(3000)
```

这等同于：
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418

        return "I'm a teapot"
    })
    .listen(3000)
```

区别是使用 **error** 函数，Elysia 将自动将错误与专门的响应类型区分开来，帮助 Eden 正确推断响应类型。

这意味着使用 **error** 函数时，我们不必为每个状态码提供显式的响应模式，使 Eden 能够正确推断类型。

```typescript
import { Elysia, error, t } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418
        return "I'm a teapot"
    }, { // [!code --]
        response: { // [!code --]
            418: t.String() // [!code --]
        } // [!code --]
    }) // [!code --]
    .listen(3000)
```

我们推荐使用 `error` 函数来返回带有状态码的响应，以便正确推断类型，但我们并不打算从 Elysia 中移除 **set.status** 的使用，以保持现有服务器的工作。

## 静态内容
静态内容指的是几乎总是返回相同值，而不管传入请求如何的响应。

这种类型的服务器资源通常是在服务器上几乎不改变的公共**文件**、**视频**或硬编码值。

到目前为止，Elysia 中的大部分内容都是静态内容。但我们也发现，许多情况，如提供静态文件或使用模板引擎提供 HTML 页面，通常也是静态内容。

这就是为什么 Elysia 引入了新的 API 来通过预先编译响应来优化静态内容。

```typescript
new Elysia()
    .get('/', () => Bun.file('video/kyuukurarin.mp4')) // [!code --]
    .get('/', Bun.file('video/kyuukurarin.mp4')) // [!code ++]
    .listen(3000)
```

注意，现在 handler 不是函数，而是内联值。

这通过编译响应预处理提高了性能，大约提高了 20-25%。

## 默认属性
Elysia 0.8 更新到 [TypeBox 到 0.32](https://github.com/sinclairzx81/typebox/blob/index/changelog/0.32.0.md)，带来了许多新功能，包括专门的 RegEx、Deref，但最重要的是，Elysia 中最常请求的功能，**默认**字段支持。

现在，在类型构造器中定义默认字段，Elysia 将提供默认值，如果值未提供，支持从类型到正文的模式。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ query: { name } }) => name, {
        query: t.Object({
            name: t.String({
                default: 'Elysia'
            })
        })
    })
    .listen(3000)
```

这允许我们从模式直接提供默认值，特别是当使用引用模式时非常有用。

## 默认头
我们可以使用 **set.headers** 设置头，Elysia 总是为每个请求创建一个默认的空对象。

之前，我们使用 **onRequest** 来附加期望的值到 set.headers，但这样做总是有一些开销，因为函数被调用。

在对象上堆叠函数来修改对象会稍微慢一些，而不是在每次请求时提供期望的值，如 CORS 或缓存头。

这就是为什么我们现在支持设置默认头，而不是为每次新请求创建空对象。
```typescript
new Elysia()
    .headers({
        'X-Powered-By': 'Elysia'
    })
```

Elysia 的 CORS 插件也更新使用这个新 API 来提高性能。

## 性能和显著改进
和往常一样，我们找到一种方法来进一步优化 Elysia，以确保你从盒子里就能获得最好的性能。

### 可移除的绑定
我们发现**。bind** 减慢了路径查找约 ~5%，删除我们代码库中的**。bind** 可以加速这个过程。

### 静态查询分析
Elysia 的静态代码分析现在能够推断出如果查询在代码中被引用则查询。

这通常导致速度提升 15-20%。

### 视频流
Elysia 现在为 `Blob` 和 `File` 添加 **content-range** 头默认，以修复大型文件如视频的发送问题，这些视频需要通过块发送。

为了修复这个问题，Elysia 现在添加了 **content-range** 头默认。

Elysia 不会在状态码设置为 206、304、412、416 或如果响应头显式提供了 **content-range** 时发送 **content-range**。

建议使用 [ETag 插件](https://github.com/bogeychan/elysia-etag)来处理正确的状态码，以避免 **content-range** 缓存冲突。

这是对 **content-range** 头的初始支持。我们创建了一个讨论来实施基于 [RPC-7233](https://datatracker.ietf.org/doc/html/rfc7233#section-4.2) 的更准确的行为了解，请加入[讨论 371](https://github.com/elysiajs/elysia/discussions/371) 来提出新的 Elysia **content-range** 和 **etag 生成**行为。

### 运行时内存改进
Elysia 现在重复使用生命周期事件的返回值，而不是为每个新请求声明一个新的专用值。

这减少了 Elysia 的内存使用，为峰值并发请求稍微优化了性能。

### 插件
大多数官方插件现在都利用了更新的 **Elysia.headers**、静态内容、**MapResponse** 和修订代码，以更好地兼容静态代码分析，进一步提高整体性能。

改进的插件包括静态、HTML 和 CORS。

### 验证错误
Elysia 现在以 JSON 形式返回验证错误，而不是文本。

显示当前错误和所有错误以及期望的值，帮助你更容易地识别错误。

示例：
```json
{
  "type": "query",
  "at": "password",
  "message": "Required property",
  "expected": {
    "email": "eden@elysiajs.com",
    "password": ""
  },
  "found": {
    "email": "eden@elysiajs.com"
  },
  "errors": [
    {
      "type": 45,
      "schema": {
        "type": "string"
      },
      "path": "/password",
      "message": "Required property"
    },
    {
      "type": 54,
      "schema": {
        "type": "string"
      },
      "path": "/password",
      "message": "Expected string"
    }
  ]
}
```

**expect** 和 **errors** 字段在生产环境中默认被移除，以防止攻击者识别模型进行进一步攻击。

## 显著改进

**改进**
- 懒惰查询引用
- 默认在 `Blob` 中添加内容范围头
- 将 TypeBox 更新到 0.32
- 覆盖 `be` 和 `af` 的生命周期响应

**重大变更**
- `afterHandle` 不再提前返回

**变更**
- 将验证响应改为 JSON
- 将 `decorator['request']` 中的派生区分出来作为 `decorator['derive']`
- `derive` 在 onRequest 中不再显示推断类型

**修复**
- 从 `PreContext` 中移除 `headers`、`path`
- 从 `PreContext` 中移除 `derive`
- Elysia 类型不会输出自定义的 `error`

## 后记
自从第一个版本发布以来，我们的旅程一直非常精彩。

Elysia 已经从一个通用的 REST API 框架演化成为一个支持端到端类型安全的框架，并且能够生成 OpenAPI 文档。我们希望在将来继续引入更多令人兴奋的功能。

<br>
我们很高兴有你和开发者们一起使用Elysia构建令人惊叹的东西，你们对Elysia的持续支持让我们深受鼓舞，并继续前进。

看到 Elysia 作为一个社区成长是一件令人兴奋的事情：
- [Scalar 的 Elysia 主题](https://x.com/saltyAom/status/1737468941696421908?s=20)，用于新的文档，而不是 Swagger UI。
- [pkgx](https://pkgx.dev/) 支持 Elysia。
- 社区提交了 Elysia 到 [TechEmpower](https://www.techempower.com/benchmarks/#section=data-r22&hw=ph&test=composite) 排名，在所有框架的综合得分中排名第 32 位，甚至超过了 Go 的 Gin 和 Echo。

我们现在正尝试为每个运行时、插件和集成提供更多支持，以回报你们给予我们的善意，从重写文档开始，提供更多详细和初学者友好的内容，[与 Nextjs 集成](/integrations/nextj)，[Astro](/integrations/astro)，未来还会有更多。

自从 0.7 版本发布以来，我们发现的问题比之前的版本要少。

现在，**正在为 Esia 的第一个稳定版本做**，Elysia 1.0 的目标是在**2024年第一季度**发布，以回报你们的善意。
Elysia 现在将进入软 API 锁定模式，以防止 API，并确保一旦稳定版本发布，有很少破坏性更改。

因此，你可以期望从 0.7 版本开始，你的 Elysia 能够正常工作，无需或只需进行最小更改即可支持 Elysia 的稳定版本。

我们再次感谢你对 Elysia 的持续支持，我们希望在稳定版本发布的那一天再次见到你。

*为了这个世界上所有美好的事物而奋斗*。

在此之前，*El Psy Congroo*。

> 黑暗中的一滴小小的命
>
> 独一无二且珍贵永远
>
> 苦涩甜蜜的记忆夢幻 の 刹那
>
> 让这一刻持续，持续永远
>
> 我们在天空中漂移果 てない 想 い
>
> 充满了来自上方的爱
>
> 他指引我的旅行 せまる 刻限
>
> 流下眼泪，跃向新世界

</Blog>
