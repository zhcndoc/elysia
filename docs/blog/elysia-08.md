---
title: Elysia 0.8 - 施坦纳之门
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: 介绍 Elysia 0.8 - 施坦纳之门

    - - meta
      - name: 'description'
        content: 介绍宏 API，一种新的与 Elysia 交互的方式。新的生命周期、解析和映射响应，以更好地与 Elysia 互动。静态内容提前编译静态资源。默认属性、默认头，以及若干改进。

    - - meta
      - property: 'og:description'
        content: 介绍宏 API，一种新的与 Elysia 交互的方式。新的生命周期、解析和映射响应，以更好地与 Elysia 互动。静态内容提前编译静态资源。默认属性、默认头，以及若干改进。

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-08/gate-of-steiner.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-08/gate-of-steiner.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.8 - 施坦纳之门"
    src="/blog/elysia-08/gate-of-steiner.webp"
    alt="太空中漂浮的卫星，面向辽阔的世界"
    author="saltyaom"
    date="2023 年 12 月 23 日"
>

以《Steins;Gate Zero》的结尾曲[**"施坦纳之门"**](https://youtu.be/S5fnglcM5VI)命名。

施坦纳之门并不专注于新的激动人心的 API 和功能，而是关注 API 的稳定性和坚实的基础，以确保在 Elysia 1.0 发布后，API 将会稳定。

然而，我们仍然带来了改进和新特性，包括：
- [宏 API](#宏-api)
- [新的生命周期：解析，映射响应](#新的生命周期)
- [错误函数](#错误函数)
- [静态内容](#静态内容)
- [默认属性](#默认属性)
- [默认头](#默认头)
- [性能和显著改进](#性能和显著改进)

## 宏 API
宏允许我们定义一个自定义字段，通过暴露完整的生命周期事件栈进行钩住和保护。

这使我们能够将自定义逻辑编排成一个简单的配置，且具有完整的类型安全。

假设我们有一个身份验证插件，根据角色限制访问，我们可以定义一个自定义的 **角色** 字段。

```typescript
import { Elysia } from 'elysia'
import { auth } from '@services/auth'

const app = new Elysia()
    .use(auth)
    .get('/', ({ user }) => user.profile, {
        role: 'admin'
    })
```

宏拥有对生命周期栈的完全访问权限，使我们能够直接为每个路由添加、修改或删除现有事件。
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

我们希望通过这个宏 API，插件维护者能够根据自己的需要定制 Elysia，为更好地与 Elysia 互动开启新的方式，而 Elysia 用户将能够享受更符合人机工程学的 API。

[宏 API](/patterns/macro) 文档现在已在 **模式** 部分提供。

下一代可定制性现在只需伸手可及，等待你的键盘和想象力。

## 新生命周期
Elysia 引入了一个新的生命周期，以解决现有问题和高度请求的 API，包括 **解析** 和 **映射响应**：
resolve: 一个安全版本的 **derive**。在与 **beforeHandle** 相同的队列中执行。
mapResponse: 在 **afterResponse** 之后执行，用于提供从原始值到 Web 标准响应的转换函数。

### 解析
一个 [derive](/essential/context.html#derive) 的“安全”版本。

旨在在验证过程后将新值追加到上下文中，并存储在与 **beforeHandle** 相同的栈中。

解析语法与 [derive](/life-cycle/before-handle#derive) 完全相同，以下是从授权插件中检索 bearer 头的示例。

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

### 映射响应
在 **"afterHandle"** 之后立即执行，旨在提供从原始值到 Web 标准响应的自定义响应映射。

以下是使用映射响应提供响应压缩的示例。

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

为什么不使用 **afterHandle** 而是引入一个新的 API？

因为 **afterHandle** 旨在读取和修改原始值。存储插件如 HTML 和压缩依赖于创建 Web 标准响应。

这意味着在这种类型的插件之后注册的插件将无法读取或修改值，从而导致插件行为不正确。

这就是为什么我们引入了一个新的生命周期，在 **afterHandle** 之后运行，专门用于提供自定义响应映射，而不是将响应映射和原始值变更混合在同一个队列中。


## 错误函数
我们可以通过使用 **set.status** 或返回一个新的响应来设置状态代码。
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418

        return "我是一个水壶"
    })
    .listen(3000)
```

这与我们的目标是一致的，即直接将字面值返回给客户端，而无须担心服务器应如何行为。

然而，这在与 Eden 集成时 proved 有挑战性。由于我们返回一个字面值，我们无法从响应中推断出状态代码，从而使得 Eden 无法区分响应和状态代码。

这导致 Eden 无法充分发挥其潜力，特别是在错误处理时，因为它无法推断类型，而不必为每个状态声明显式响应类型。

伴随着许多用户请求我们希望提供一种更明确的方式来直接返回状态代码的值，而不希望依赖于 **set.status** 和 **new Response** 来进行冗长或从处理函数外部声明的实用函数返回响应。

这就是我们引入 **error** 函数以状态代码和值一起返回给客户端的原因。

```typescript
import { Elysia, error } from 'elysia' // [!code ++]

new Elysia()
    .get('/', () => error(418, "我是一个水壶")) // [!code ++]
    .listen(3000)
```

这相当于：
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418

        return "我是一个水壶"
    })
    .listen(3000)
```

不同之处在于，使用 **error** 函数时，Elysia 将自动将状态代码区分为专用响应类型，帮助 Eden 根据状态正确推断响应。

这意味着通过使用 **error**，我们不必包含显式响应模式，以便让 Eden 正确推断每个状态代码的类型。

```typescript
import { Elysia, error, t } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418
        return "我是一个水壶"
    }, { // [!code --]
        response: { // [!code --]
            418: t.String() // [!code --]
        } // [!code --]
    }) // [!code --]
    .listen(3000)
```

我们建议使用 `error` 函数来返回具有状态代码的响应，以获得正确的类型推断，不过，我们并不打算删除 Elysia 中使用 **set.status** 的功能，以保持现有服务器的正常工作。

## 静态内容
静态内容指的是几乎总是返回相同值的响应，无论传入请求是什么。

这类资源通常是公共 **文件**、**视频** 或者是极少更改的硬编码值，除非服务器更新。

到目前为止，Elysia 中的大部分内容都是静态内容。但我们也发现许多情况，如提供静态文件或使用模板引擎提供 HTML 页面，通常也是静态内容。

这就是 Elysia 引入新 API 的原因，以通过预先确定响应来优化静态内容。

```typescript
new Elysia()
    .get('/', () => Bun.file('video/kyuukurarin.mp4')) // [!code --]
    .get('/', Bun.file('video/kyuukurarin.mp4')) // [!code ++]
    .listen(3000)
```

请注意，处理程序现在不是一个函数，而是一个内联值。

这将使性能提高约 20-25%，通过提前编译响应来实现。

## 默认属性
Elysia 0.8 更新了 [TypeBox 到 0.32](https://github.com/sinclairzx81/typebox/blob/index/changelog/0.32.0.md)，引入了许多新特性，包括专用正则表达式、解引用，但最重要的是 Elysia 中最被请求的特性，**默认** 字段支持。

现在在类型构建器中定义默认字段，如果未提供值，Elysia 将提供默认值，支持从类型到正文的模式类型。

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

这使我们能够直接从模式提供默认值，尤其是在使用引用模式时特别有用。

## 默认头
我们可以使用 **set.headers** 设置头，Elysia 总是为每个请求创建一个默认的空对象。

此前，我们可以使用 **onRequest** 来将所需的值附加到 set.headers，但这始终会有一些开销，因为会调用一个函数。

堆叠函数以变更对象可能比在每个请求中直接设置所需值（比如 CORS 或缓存头）要慢。

这就是我们现在支持从一开始设置默认头，而不是为每个新请求创建一个空对象的原因。
```typescript
new Elysia()
    .headers({
        'X-Powered-By': 'Elysia'
    })
```

Elysia CORS 插件也更新了，以使用这个新 API 来提高性能。

## 性能和显著改进
像往常一样，我们找到了一种方法来进一步优化 Elysia，以确保您获得最佳的开箱即用性能。

### 移除 bind
我们发现 **.bind** 使路径查找速度降低了约 5%。通过从我们的代码库中移除绑定，我们可以稍微加快这个过程。

### 静态查询分析
Elysia 静态代码分析现在能够推断查询，如果查询名称在代码中被引用。

这通常会在默认情况下导致 15-20% 的速度提升。

### 视频流
Elysia 现在默认为文件和 Blob 添加 **content-range** 头，以修复需要按块发送的大文件（如视频）的问题。

为了解决这个问题，Elysia 现在默认添加 **content-range** 头。

Elysia 不会在状态代码被设置为 206、304、412、416 时发送 **content-range**，或者当头信息显式提供 **content-range** 时。

建议使用 [ETag 插件](https://github.com/bogeychan/elysia-etag) 来正确处理状态代码，以避免来自缓存的 **content-range** 冲突。

这是 **content-range** 头的初步支持，我们已创建关于在未来基于 [RPC-7233](https://datatracker.ietf.org/doc/html/rfc7233#section-4.2) 实施更准确行为的讨论。欢迎在 [讨论 371](https://github.com/elysiajs/elysia/discussions/371) 中加入讨论，提出有关 Elysia 的 **content-range** 和 **etag 生成** 的新行为建议。

### 运行时内存改进
Elysia 现在重用生命周期事件的返回值，而不是声明一个新的专用值。

这略微减少了 Elysia 的内存使用，对于高峰并发请求表现更好。

### 插件
大多数官方插件现在利用了更新的 **Elysia.headers**、静态内容、**MapResponse** 和修订过的代码，以遵循静态代码分析，进一步提高整体性能。

受到改进的插件包括：静态、HTML 和 CORS。

### 验证错误
Elysia 现在将验证错误作为 JSON 返回，而不是文本。

显示当前错误及所有错误和预期值，以帮助您更容易地识别错误。

示例：
```json
{
  "type": "query",
  "at": "密码",
  "message": "必填属性",
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
      "path": "/密码",
      "message": "必填属性"
    },
    {
      "type": 54,
      "schema": {
        "type": "string"
      },
      "path": "/密码",
      "message": "期望字符串"
    }
  ]
}
```

**expect** 和 **errors** 字段在生产环境中默认被移除，以防止攻击者识别模型以进行进一步攻击。

## 显著改进

**改进**
- 懒惰查询引用
- 默认向 `Blob` 添加 content-range 头
- 更新 TypeBox 到 0.32
- 重写生命周期响应 `be` 和 `af`

**重大变更**
- `afterHandle` 不再提前返回

**变化**
- 更改验证响应为 JSON
- 将 derive 与 `decorator['request']` 区分为 `decorator['derive']`
- `derive` 现在在 onRequest 中不再显示推断类型

**错误修复**
- 从 `PreContext` 中移除 `headers`、`path`
- 从 `PreContext` 中移除 `derive`
- Elysia 类型不输出自定义 `error`

## 结语
自首次发布以来，这一路走来都是一次伟大的旅程。

Elysia 从一个通用的 REST API 框架发展为一个符合人机工程学的框架，以支持端到端类型安全、OpenAPI 文档生成，我们希望继续在未来引入更多激动人心的特性。

<br>
我们很高兴能有您和开发者一起用 Elysia 构建令人惊叹的事物，您对 Elysia 的持续支持鼓励着我们不断前进。

看到 Elysia 作为社区不断成长令人兴奋：
- [Scalar 的 Elysia 主题](https://x.com/saltyAom/status/1737468941696421908?s=20)，为新的文档替代 Swagger UI。
- [pkgx](https://pkgx.dev/) 无缝支持 Elysia。
- 社区将 Elysia 提交到 [TechEmpower](https://www.techempower.com/benchmarks/#section=data-r22&hw=ph&test=composite) 排名，综合得分第 32，甚至超越了 Go 的 Gin 和 Echo。

我们现在将尽力为每个运行环境、插件和集成提供更多支持，以回报您给予我们的善意，首先是重写文档以更详细和更适合初学者，[与 Nextjs 集成](/integrations/nextj)、[Astro](/integrations/astro) 等等将来会有更多。

自 0.7 发布以来，我们看到的问题比以往更少。

现在 **我们正在准备 Elysia 的首次稳定版本**，Elysia 1.0 计划于 **2024 年第一季度** 发布，以回报您的善良。
Elysia 将进入软 API 锁定模式，以防止 API 更改并确保在稳定版本发布后不会或很少有重大修改。

所以，您可以期待您的 Elysia 应用从 0.7 开始正常工作，而无需或以最少的变动来支持 Elysia 的稳定版本。

我们再次感谢您对 Elysia 的持续支持，希望在稳定版本发布日再次见到您。

*为这个世界上所有美好事物而奋斗*。

在那之前，*El Psy Congroo*。

> 在黑暗中的一滴 小さな命
>
> 独特而珍贵，永远
>
> 让人感伤的回忆 夢幻の刹那
>
> 让这一刻持续，持续永远
>
> 我们在天际漂流 果てない想い
>
> 充满来自上方的爱
>
> 他引导我的旅程 せまる刻限
>
> 轻轻落泪，跳向新世界

</Blog>
