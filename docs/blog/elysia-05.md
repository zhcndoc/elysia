---
title: Elysia 0.5 - 光芒万丈
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: 介绍 Elysia 0.5 - 光芒万丈

    - - meta
      - name: 'description'
        content: 介绍静态代码分析、新路由器 "Memoirist"、TypeBox 0.28、数值类型、内联模式、状态/装饰/模型/组重构，以及类型稳定性。

    - - meta
      - property: 'og:description'
        content: 介绍静态代码分析、新路由器 "Memoirist"、TypeBox 0.28、数值类型、内联模式、状态/装饰重构、以及类型稳定性。

    - - meta
      - property: 'og:image'
        content: https://elysia.zhcndoc.com/blog/elysia-05/radiant.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysia.zhcndoc.com/blog/elysia-05/radiant.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.5 - 光芒万丈"
    src="/blog/elysia-05/radiant.webp"
    alt="光芒万丈"
    author="saltyaom"
    date="2023 年 5 月 15 日"
>

以 Arknights 的原创音乐 “[光芒万丈](https://youtu.be/QhUjD--UUV4)” 为名，由 Monster Sirent Records 创作。

光芒万丈推动了性能边界的发展，尤其是类型和动态路由方面的稳定性提升。

## 静态代码分析
在 Elysia 0.4 引入了 Ahead of Time 编译后，Elysia 得以优化函数调用并消除之前存在的许多开销。

今天，我们扩展了 Ahead of Time 编译，使其通过静态代码分析变得更快，成为 Bun 框架中最快的。

静态代码分析使 Elysia 能够读取您的函数、处理程序、生命周期和模式，然后尝试调整获取处理程序以提前编译，并消除任何未使用的代码，同时在可能的情况下进行优化。

例如，如果您使用 `schema` 并定义了对象类型的主体，Elysia 期望该路由是 JSON 优先，并将主体解析为 JSON，而不是依赖于内容类型头的动态检查：

```ts
app.post('/sign-in', ({ body }) => signIn(body), {
    schema: {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    }
})
```

这允许我们提高主体解析的性能近 2.5 倍。

通过静态代码分析，Elysia 不依赖于猜测您是否将使用昂贵的属性。

Elysia 可以读取您的代码并检测您将使用的内容，然后提前调整以适应您的需求。

这意味着如果您没有使用昂贵的属性，如 `query` 或 `body`，Elysia 将完全跳过解析以提高性能。

```ts
// Body is not used, skip body parsing
app.post('/id/:id', ({ params: { id } }) => id, {
    schema: {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    }
})
```

通过静态代码分析和 Ahead of Time 编译，您可以放心地知道 Elysia 非常擅长阅读您的代码并自动调整以最大化性能。

静态代码分析允许我们提高 Elysia 的性能，远远超出了我们的想象，以下是一些显著的改进：
- 总体性能提升约 15%
- 静态路由速度提升 33%
- 空查询解析速度提升 50%
- 严格类型主体解析速度提升 100%
- 空主体解析速度提升 150%

通过这些改进，我们能够超越 **Stricjs** 的性能，与 Elysia 0.5.0-beta.0 和 Stricjs 2.0.4 相比。

我们计划在未来的研究论文中详细解释这个话题，以及我们如何通过静态代码分析提高性能。

## 新路由器，“Memoirist”

自 0.2 版以来，我们一直在构建自己的路由器 Raikiri。

Raikiri 满足了它的目的，它是基于基本原理被快速构建的，使用了我们的自定义 Radix 树实现。

但随着我们的进步，我们发现 Raikiri 在 Radix 树的重新认知方面表现不佳，这导致了开发者报告了许多错误，特别是动态路由问题，这些问题通常通过重新排列路由来解决。

我们理解这一点，并修补了 Raikiri 中的 Radix 树重新认知算法的许多方面，但我们的算法很复杂，随着我们对路由器的补丁越来越多，它不再符合我们的目的。

这就是为什么我们引入了一个新的路由器，“Memoirist”。

Memoirist 是一个稳定的 Radix 树路由器，它基于 Medley Router 的算法快速处理动态路径，同时在静态方面利用 Ahead of Time 编译。

在这个版本中，我们将从 Raikiri 迁移到 Memoirist，以提高稳定性和路径映射速度。

我们希望您遇到的任何 Raikiri 问题都将通过 Memoirist 得到解决，我们鼓励您尝试使用它。

## TypeBox 0.28

TypeBox 是 Elysia 严格类型系统的核心库，也称为 **Elysia.t**。

在这个更新中，我们将 TypeBox 从 0.26 更新到 0.28，以提供更细致的类型系统，接近严格类型的语言。

我们更新了 Typebox，以改进 Elysia 的类型系统，以匹配 TypeScript 的新版本，如**常量泛型**。

```ts
new Elysia()
    .decorate('version', 'Elysia Radiant')
    .model(
        'name',
        Type.TemplateLiteral([
            Type.Literal('Elysia '),
            Type.Union([
                Type.Literal('The Blessing'),
                Type.Literal('Radiant')
            ])
        ])
    )
    // Strictly check for template literal
    .get('/', ({ version }) => version)
```

这允许我们严格检查模板文字，或者字符串/数字的模式，以在开发和运行时同时验证您的需求。

### Ahead of Time & Type System

通过 Ahead of Time 编译，Elysia 可以调整自己以优化和匹配定义的类型，以减少开销。

这就是为什么我们引入了一种新的类型，**URLEncoded**。

正如我们之前提到的，Elysia 现在可以基于主体的模式类型来解析主体，减少开销。

默认情况下，Elysia 将根据主体的模式类型解析主体，如下所示：
- t.URLEncoded -> `application/x-www-form-urlencoded`
- t.Object -> `application/json`
- t.File -> `multipart/form-data`
- the rest -> `text/plain`

但是，您可以使用 `type` 来显式告诉 Elysia 以特定的方法解析主体，如下所示：
```ts
app.post('/', ({ body }) => body, {
    type: 'json'
})
```

`type` 可以是以下之一：
```ts
type ContentType = |
    // Shorthand for 'text/plain'
    | 'text'
    // Shorthand for 'application/json'
    | 'json'
    // Shorthand for 'multipart/form-data'
    | 'formdata'
    // Shorthand for 'application/x-www-form-urlencoded'\
    | 'urlencoded'
    | 'text/plain'
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
```

您可以在概念的[显式主体](/life-cycle/parse.html#explicit-body)页面上找到更多细节。

### 数值类型
我们发现开发者在使用 Elysia 时，最常遇到的问题之一是解析数值字符串。

这就是我们引入了一个新的**数值**类型。

在 Elysia 0.4 中，要解析数值字符串，我们需要使用 `transform` 来手动解析字符串。
```ts
app.get('/id/:id', ({ params: { id } }) => id, {
    schema: {
        params: t.Object({
            id: t.Number()
        })
    },
    transform({ params }) {
        const id = +params.id

        if(!Number.isNaN(id))
            params.id = id
    }
})
```

我们发现这一步是多余的，充满了样板，我们想要以声明式的方式解决这个问题。

感谢静态代码分析，数值类型允许您定义数值字符串并自动解析为数字。

一旦验证，数值类型将在运行时和类型级别以数字形式解析，以满足我们的需求。

```ts
app.get('/id/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Numeric()
    })
})
```

您可以在支持模式类型化的任何属性上使用数值类型，包括：
- params
- query
- headers
- body
- response

我们希望您会发现这个新的数值类型在您的服务器中非常有用。

您可以在概念页面的[数值类型](/validation/elysia-type.html#numeric)上找到更多详细信息。

随着 TypeBox 0.28 的发布，我们正在使 Elysia 类型系统更加完善，我们兴奋地看到它在您那边的表现。

## 内联模式
您可能已经注意到，我们的示例不再使用 `schema.type` 来创建类型，因为我们正在进行一个**破坏性更改**，将模式内联到钩子声明中。

```ts
// ? From
app.get('/id/:id', ({ params: { id } }) => id, {
    schema: {
        params: t.Object({
            id: t.Number()
        })
    },
})

// ? To
app.get('/id/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Number()
    })
})
```

当我们做出破坏性更改时，特别是对于 Elysia 最重要的一部分，我们思考了很多。

根据大量的尝试和实际使用情况，我们建议这一新的更改，并让我们的社区进行了投票，发现大约 60% 的 Elysia 开发者对于迁移到内联模式感到高兴。

但我们也倾听了我们社区的其他部分，并试图解决反对这一决定的论点：

### 清晰的分离
在旧的语法中，您需要明确告诉 Elysia 您创建的部分是一个模式，使用 `Elysia.t`。

创建模式和生命周期钩子之间的清晰分离更有助于阅读和理解代码。

但在我们的深入测试中，我们发现大多数人没有问题阅读新的语法，尽管没有像显式模式那样清晰的分离，但人们可以快速习惯新的语法，特别是如果他们熟悉 Elysia 的话。

### 自动完成
人们担心的问题之一是阅读自动完成。

合并模式和生命周期钩子导致自动完成时有很多选项供用户选择，根据许多经过验证的用户体验研究，这可能对用户来说很令人沮丧，并可能导致学习曲线更陡峭。

然而，我们发现 Elysia 的模式属性名称非常可预测，以克服这个问题，一旦开发者熟悉 Elysia 模式。

例如，如果您想要访问头部，您可以在上下文中访问 `headers`，并且您可以在挂钩中输入 `headers`，两者都共享相同的名称以提高可预测性。

有了这些，Elysia 可能需要稍微更多的学习曲线，但这是我们愿意为更好的开发体验所做出的权衡。

## “头部” 字段
之前，您可以通过访问 `request.headers.get` 来获取头部字段，您可能想知道为什么我们没有默认提供头部字段。

```ts
app.post('/headers', ({ request: { headers } }) => {
    return headers.get('content-type')
})
```

因为解析头部有其自己的开销，我们发现许多开发人员不经常访问头部，所以我们决定不实现头部。

但是，随着静态代码分析，Elysia 可以读取您的代码，如果您打算使用头部，然后动态解析头部。

静态代码分析允许我们添加更多新功能，而不产生任何开销。

```ts
app.post('/headers', ({ headers }) => headers['content-type'])
```

解析后的头部将以原始对象的格式提供，以头部名称的小写键形式。

## 状态、装饰、模型重构
Elysia 的主要功能之一是能够根据您的需要定制 Elysia。

我们重新审视了 `state`、`decorate`、和 `setModel`，我们发现 API 不一致，需要改进。

我们发现许多开发人员经常重复使用 `state` 和 `decorate` 来设置多个值，并希望一次性设置所有值，就像 `setModel` 一样，我们希望统一 API 规范，让 `setModel` 与 `state` 和 `decorate` 的使用方式相同，以提供更好的可预测性。

因此，我们将 `setModel` 重命名为 `model`，并添加了对单值和多值设置的支持，并通过函数重载统一了 `state`、`decorate` 和 `model` 的 API。

```ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
	// ? set model using label
	.model('string', t.String())
	.model({
		number: t.Number()
	})
	.state('visitor', 1)
	// ? set model using object
	.state({
		multiple: 'value',
		are: 'now supported!'
	})
	.decorate('visitor', 1)
	// ? set model using object
	.decorate({
		name: 'world',
		number: 2
	})
```

随着我们将 TypeScript 的最低支持提高到 5.0，以提高严格的类型与**常量泛型**的匹配。

`state`、`decorate` 和 `model` 现在支持字面量类型和模板字符串，以严格验证类型，运行时和类型级别。

```ts
	// ? state, decorate, now support literal
app.get('/', ({ body }) => number, {
		body: t.Literal(1),
		response: t.Literal(2)
	})
```

### 分组和守护
我们发现许多开发人员经常将 `group` 与 `guard` 结合使用，我们发现嵌套它们可能变得冗余且可能充满样板。

从 Elysia 0.5 开始，我们为 `.group` 添加了一个守护范围作为可选的第二参数。

```ts
// ✅ previously, you need to nest guard inside a group
app.group('/v1', (app) =>
    app.guard(
        {
            body: t.Literal()
        },
        (app) => app.get('/student', () => 'Rikuhachima Aru')
    )
)

// ✅ new, compatible with old syntax
app.group(
    '/v1', {
        body: t.Literal('Rikuhachima Aru')
    }, 
    app => app.get('/student', () => 'Rikuhachima Aru')
)

// ✅ compatible with function overload
app.group('/v1', app => app.get('/student', () => 'Rikuhachima Aru'))
```

我们希望您会发现这些新的重新设计的 API 更加有用，并更好地适应您的用例。

## 类型稳定性
Elysia 的类型系统非常复杂。

我们可以在类型级别声明变量，通过名称引用类型，应用多个 Elysia 实例，甚至支持闭包式的类型级别，这非常复杂，旨在为您提供最佳的开发体验，特别是与 Eden 结合使用时。

但是，类型的某些方面在更新 Elysia 版本时没有按照我们的意图工作，因为我们必须在每次发布前手动检查，这可能导致人为错误。

随着 Elysia 0.5 的发布，我们为类型级别添加了单元测试，以防止未来的问题。这些测试将在每次发布前运行，如果发生错误，将阻止我们发布包，迫使我们修复类型问题。

这意味着您现在可以依赖我们检查类型的完整性，我们相信这将减少类型引用方面的错误。

---

### 显著改进：
- 添加对 CommonJS 的支持，以便在 Node 适配器中运行 Elysia
- 移除手动片段映射以加速路径提取
- 内联验证器在 `composeHandler` 中以提高性能
- 使用一次性上下文分配
- 添加对懒惰上下文注入的支持通过静态代码分析
- 确保响应的非空性
- 添加联合主体验证器检查
- 将默认对象处理程序设置为继承
- 使用 `constructor.name` 映射替代 `instanceof` 以提高速度
- 添加专用错误构造函数以提高性能
- 条件字面量函数用于检查 onRequest 迭代
- 改善 WebSocket 类型

破坏性更改：
- 将 `innerHandle` 重命名为 `fetch`
    - 迁移：将 `.innerHandle` 重命名为 `fetch`
- 将 `.setModel` 重命名为 `.model`
    - 迁移：将 `setModel` 重命名为 `model`
- 将 `hook.schema` 移至 `hook`
    - 迁移：移除模式和花括号 `schema.type`：
    ```ts
    // from
    app.post('/', ({ body }) => body, {
        schema: {
            body: t.Object({
                username: t.String()
            })
        }
    })

    // to
    app.post('/', ({ body }) => body, {
        body: t.Object({
            username: t.String()
        })
    })
    ```
- remove `mapPathnameRegex` (internal)

## 尾声
推动 JavaScript 在 Bun 上的性能边界是我们非常兴奋的事情！

随着新功能的每次发布，Elysia 变得越来越快，性能和稳定性都有所提升，我们希望 Elysia 能够成为下一代 TypeScript 框架的选择之一。

我们很高兴看到许多才华横溢的开放源代码开发者如何通过他们的出色工作使 Elysia 焕发生机，如 [Bogeychan 的 Elysia Node](https://github.com/bogeychan/elysia-polyfills) 和 Deno 适配器，Rayriffy 的 Elysia 限速，我们希望在将来也能看到您的作品！

感谢您对 Elysia 持续的支持，我们期待与您在下一个版本中见面。

> 我不会让人们失望，我会让他们高飞
>
> 我们的声音每天都在变得更响亮，是的，我们被放大
>
> 以光惊艳
>
> 您将想要站在我的一边
>
> 是的，您知道它是**全速前进**

</Blog>
