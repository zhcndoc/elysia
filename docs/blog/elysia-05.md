---
title: Elysia 0.5 - Radiant
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: 介绍 Elysia 0.5 - Radiant

    - - meta
      - name: 'description'
        content: 介绍静态代码分析、新路由 "Memoirist"、TypeBox 0.28、数字类型、内联模式、状态/装饰/模型/组重构，以及类型稳定性。

    - - meta
      - property: 'og:description'
        content: 介绍静态代码分析、新路由 "Memoirist"、TypeBox 0.28、数字类型、内联模式、状态/装饰重构，以及类型稳定性。

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-05/radiant.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-05/radiant.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.5 - Radiant"
    src="/blog/elysia-05/radiant.webp"
    alt="Radiant"
    author="saltyaom"
    date="2023 年 5 月 15 日"
>

这是以 Arknights 原作音乐「[Radiant](https://youtu.be/QhUjD--UUV4)」为名，由 Monster Sirent Records 作曲。

Radiant 推动了性能的边界，特别是在类型和动态路由的稳定性改进方面。

## 静态代码分析
随着 Elysia 0.4 引入的提前编译，使得 Elysia 能够优化函数调用并消除我们之前的许多开销。

今天，我们将提前编译扩展为更快的静态代码分析，成为最快的 Bun 网络框架。

静态代码分析允许 Elysia 读取您的函数、处理程序、生命周期和模式，然后尝试调整提取处理程序，提前编译处理程序，消除任何未使用的代码并在可能的地方进行优化。

例如，如果您使用 `schema` 并且主体类型为对象，Elysia 期望该路由是 JSON 优先的，并将主体解析为 JSON，而不是依赖于内容类型头的动态检查：

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

这使我们能够将主体解析的性能提高近 2.5 倍。

通过静态代码分析，不再依赖于猜测您是否会使用昂贵的属性。

Elysia 可以读取您的代码并检测您将使用什么，并提前调整以适应您的需求。

这意味着如果您没有使用像 `query` 或 `body` 这样的昂贵属性，Elysia 将完全跳过解析，以提高性能。

```ts
// 身体未使用，跳过身体解析
app.post('/id/:id', ({ params: { id } }) => id, {
    schema: {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    }
})
```

通过静态代码分析和提前编译，您可以放心，Elysia 非常擅长读取您的代码并自动调整以最大化性能。

静态代码分析使得我们能够提升 Elysia 性能，超出我们想象，以下是显著的改进：
- 整体提高约 15%
- 静态路由加速约 33%
- 空查询解析加速约 50%
- 严格类型主体解析加速约 100%
- 空主体解析加速约 150%

凭借这一改进，我们能够在性能上超越 **Stricjs**，比较 Elysia 0.5.0-beta.0 和 Stricjs 2.0.4。

我们打算在将来以研究论文的形式详细解释此主题及我们如何通过静态代码分析提高性能。

## 新路由 "Memoirist"

自 0.2 起，我们一直在构建自己的路由器 "Raikiri"。

Raikiri 达到了它的目的，它是基于我们自定义的径向树实现，从零开始构建以实现快速。

但随着我们的进步，我们发现 Raikiri 在复杂的径向树重整方面表现不佳，这导致开发人员报告了许多错误，尤其是在动态路由方面，这通常可以通过重新排列路由解决。

我们理解，并修补了 Raikiri 径向树重整算法的许多领域，但我们的算法很复杂，修补路由后变得越来越昂贵，直到它不再适合我们的目的。

这就是我们引入新路由 "Memoirist" 的原因。

Memoirist 是一个稳定的 RaixTree 路由器，能够快速处理基于 Medley Router 算法的动态路径，而在静态方面则利用了提前编译的优势。

随着此次发布，我们将从 Raikiri 迁移到 Memoirist，以提高稳定性并获得比 Raikiri 更快的路径映射。

我们希望您在使用 Raikiri 时遇到的任何问题都能通过 Memoirist 得到解决，并鼓励您进行尝试。

## TypeBox 0.28

TypeBox 是一个核心库，支持 Elysia 的严格类型系统，称为 **Elysia.t**。

在此次更新中，我们将 TypeBox 从 0.26 更新到 0.28，以使类型系统更加精细，接近严格的类型语言。

我们更新了 TypeBox，以改进 Elysia 类型系统，以匹配新 TypeBox 功能以及与新版本 TypeScript 的兼容性，如 **Constant Generic**。

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
    // 严格检查模板字面量
    .get('/', ({ version }) => version)
```

这使我们能够严格检查模板字面量或字符串/数字的模式，以同时在运行时和开发过程中进行验证。

### 提前编译与类型系统

通过提前编译，Elysia 可以调整自身以优化并匹配定义的模式类型，以减少开销。

这就是我们引入了一种新类型 **URLEncoded** 的原因。

正如之前提到的，Elysia 现在可以利用模式并在提前进行优化，主体解析是 Elysia 中更昂贵的领域之一，因此我们引入了一种专门用于解析主体的类型，如 URLEncoded。

默认情况下，Elysia 将根据主体的模式类型解析主体，如下所示：
- t.URLEncoded -> `application/x-www-form-urlencoded`
- t.Object -> `application/json`
- t.File -> `multipart/form-data`
- 其余 -> `text/plain`

但是，您可以明确告诉 Elysia 使用特定方法解析主体，如下所示：
```ts
app.post('/', ({ body }) => body, {
    type: 'json'
})
```

`type` 可以是以下之一：
```ts
type ContentType = |
    // 'text/plain' 的简写
    | 'text'
    // 'application/json' 的简写
    | 'json'
    // 'multipart/form-data' 的简写
    | 'formdata'
    // 'application/x-www-form-urlencoded' 的简写
    | 'urlencoded'
    | 'text/plain'
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
```

您可以在概念中的 [explicit body](/life-cycle/parse.html#explicit-body) 页面中找到更多详细信息。

### 数字类型
我们发现开发人员在使用 Elysia 时经常会遇到冗余的任务，即解析数字字符串。

因此，我们引入了一种新的 **Numeric** 类型。

在 Elysia 0.4 中，解析数字字符串时，我们需要使用 `transform` 手动解析字符串：
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

我们发现这个步骤是冗余的，充满了样板代码，我们希望以声明的方式解决这个问题。

感谢静态代码分析，数字类型允许您定义数字字符串并自动将其解析为数字。

一旦验证，数字类型将在运行时和类型级别自动解析为数字，以满足我们的需求。

```ts
app.get('/id/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Numeric()
    })
})
```

您可以在任何支持模式类型的属性上使用数字类型，包括：
- params
- query
- headers
- body
- response

我们希望您会发现这种新的数字类型在您的服务器中很有用。

您可以在概念中查看 [numeric type](/validation/elysia-type.html#numeric) 页面以获取更多详细信息。

随着 TypeBox 0.28 的发布，我们使 Elysia 的类型系统更加完整，并期待看到它在您那的表现。

## 内联模式
您可能已经注意到，我们的示例不再使用 `schema.type` 来创建类型，因为我们进行了一项 **重大变更**，将模式移至钩子语句的内联方式。

```ts
// ? 从
app.get('/id/:id', ({ params: { id } }) => id, {
    schema: {
        params: t.Object({
            id: t.Number()
        })
    },
})

// ? 到
app.get('/id/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Number()
    })
})
```

在进行重大变更时我们考虑了很多，特别是对于 Elysia 最重要的部分之一。

基于大量的实验和实际使用，我们尝试通过投票向我们的社区建议这一新变更，并发现约 60% 的 Elysia 开发人员愿意迁移到内联模式。

但我们也倾听了社区其余部分的声音，试图理解反对这一决定的论点：

### 清晰的分离
在旧语法中，您必须明确告诉 Elysia 您创建的部分是一个模式，使用 `Elysia.t`。

创建生命周期和模式之间的明确分离更清晰，具有更好的可读性。

但根据我们的严格测试，我们发现大多数人没有对此新语法感到困惑，生命周期钩子与模式类型的分离仍然具有明确的分离，`t.Type` 和函数之间的语法高亮在代码审查时尤为明显，尽管没有明确的模式那样清晰，但人们可以很快适应新语法，特别是如果他们熟悉 Elysia。

### 自动完成
人们关注的另一个领域是读写自动完成功能。

将模式和生命周期钩子合并导致自动完成有大约 10 个可供选择的属性，而基于多项经过验证的用户体验研究，这可能会让用户感到沮丧，因为可供选择的选项太多，并可能造成更陡的学习曲线。

然而，我们发现，Elysia 的模式属性名相当可预测，一旦开发人员习惯了 Elysia 类型，就能克服这个问题。

例如，如果您想访问头部，您可以在上下文中访问 `headers`，而在钩子中输入 `headers`，两者共享相同的名称以提高可预测性。

因此，Elysia 可能会有一点学习曲线，但这是我们愿意为更好的开发者体验付出的代价。

## "headers" 字段
之前，您可以通过访问 `request.headers.get` 来获取 headers 字段，您可能会想知道为什么我们不默认发送 headers。

```ts
app.post('/headers', ({ request: { headers } }) => {
    return headers.get('content-type')
})
```

因为解析 headers 有其自身的开销，并且我们发现许多开发人员并不经常访问 headers，因此我们决定不实现 headers。

但通过静态代码分析，这种情况发生了改变，Elysia 可以读取您的代码，判断您是否打算使用 headers，然后动态解析 headers。

静态代码分析使我们能够添加新的功能，而没有任何开销。

```ts
app.post('/headers', ({ headers }) => headers['content-type'])
```

解析后的 headers 将作为头部名称的小写键的普通对象可用。

## 状态、装饰、模型重构
Elysia 的主要特性之一是能够根据您的需求自定义 Elysia。

我们重新审视了 `state`、`decorate` 和 `setModel`，并发现 API 不够一致，可以进行改进。

我们发现许多人在设置多个值时会重复使用 `state` 和 `decorate`，好希望能够像使用 `setModel` 一样一次性设置所有内容，我们希望将 `setModel` 的 API 规范统一，以便与 `state` 和 `decorate` 一样使用，以提高可预测性。

因此，我们将 `setModel` 重命名为 `model`，并添加了支持为 `state`、`decorate` 和 `model` 设定单个和多个值的函数重载。

```ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
	// ? 使用标签设置模型
	.model('string', t.String())
	.model({
		number: t.Number()
	})
	.state('visitor', 1)
	// ? 使用对象设置模型
	.state({
		multiple: 'value',
		are: 'now supported!'
	})
	.decorate('visitor', 1)
	// ? 使用对象设置模型
	.decorate({
		name: 'world',
		number: 2
	})
```

同时，我们将 TypeScript 的最低支持版本提高到 5.0，以增强与 **Constant Generic** 的严格类型支持。

`state`、`decorate` 和 `model` 现在支持字面量类型和模板字符串，以严谨地验证类型，包括运行时和类型级别。

```ts
	// ? state、decorate 现在支持字面量
app.get('/', ({ body }) => number, {
		body: t.Literal(1),
		response: t.Literal(2)
	})
```

### 组与守卫
我们发现许多开发人员经常将 `group` 和 `guard` 一起使用，我们发现在嵌套时有些多余，可能会充满样板代码。

从 Elysia 0.5 开始，我们为 `.group` 添加了作为可选第二个参数的守卫范围。

```ts
// ✅ 之前，需要将守卫嵌套在组内
app.group('/v1', (app) =>
    app.guard(
        {
            body: t.Literal()
        },
        (app) => app.get('/student', () => 'Rikuhachima Aru')
    )
)

// ✅ 新的，兼容旧语法
app.group(
    '/v1', {
        body: t.Literal('Rikuhachima Aru')
    },
    app => app.get('/student', () => 'Rikuhachima Aru')
)

// ✅ 兼容函数重载
app.group('/v1', app => app.get('/student', () => 'Rikuhachima Aru'))
```

我们希望您会发现这些新重新审视的 API 更加有用，并更符合您的用例。

## 类型稳定性
Elysia 的类型系统是复杂的。

我们可以在类型级别声明变量，通过名称引用类型，应用多个 Elysia 实例，甚至在类型级别支持闭包，这使得为您提供最佳的开发者体验变得非常复杂，特别是在 Eden。

但有时，随着我们更新 Elysia 版本，类型并不会按预期工作，因为我们必须在每次发行之前手动检查，并可能导致人为错误。

随着 Elysia 0.5 的发布，我们为类型级别的测试添加了单元测试，以防止将来的可能错误，这些测试将在每次发布之前运行，如果出现错误，将阻止我们发布软件包，迫使我们修复类型问题。

这意味着，您现在可以依靠我们在每次发布时检查类型完整性，确信在类型引用方面会更少出现错误。

---

### 显著改进:
- 添加对 CommonJS 的支持，以便与 Node 适配器运行 Elysia
- 删除手动片段映射，以加速路径提取
- 在 `composeHandler` 中内联验证器，以提高性能
- 使用一次性上下文分配
- 通过静态代码分析添加对延迟上下文注入的支持
- 确保响应的非空性
- 添加联合主体验证检查
- 设置默认对象处理程序进行继承
- 使用 `constructor.name` 映射而不是 `instanceof` 来提高速度
- 添加专用错误构造函数以提高性能
- 为检查 onRequest 迭代，添加条件字面量函数
- 改进 WebSocket 类型

重大变更：
- 将 `innerHandle` 重命名为 `fetch`
    - 要迁移：将 `.innerHandle` 重命名为 `fetch`
- 将 `.setModel` 重命名为 `.model`
    - 要迁移：将 `setModel` 重命名为 `model`
- 将 `hook.schema` 移除至 `hook`
    - 要迁移：移除 schema 及大括号 `schema.type`：
    ```ts
    // 从
    app.post('/', ({ body }) => body, {
        schema: {
            body: t.Object({
                username: t.String()
            })
        }
    })

    // 到
    app.post('/', ({ body }) => body, {
        body: t.Object({
            username: t.String()
        })
    })
    ```
- 移除 `mapPathnameRegex`（内部）

## 后续
推动 JavaScript 在 Bun 中的性能边界是我们非常兴奋的事情！

即使每次发布都有新特性，Elysia 仍然在变得更快，凭借改进的可靠性和稳定性，我们希望 Elysia 会成为下一代 TypeScript 框架的选择之一。

我们很高兴看到许多有才华的开源开发人员通过他们的卓越工作使 Elysia 复苏，例如 [Bogeychan's Elysia Node](https://github.com/bogeychan/elysia-polyfills) 和 Deno 适配器，Rayriffy 的 Elysia 限制，我们也期待您未来的作品！

感谢您对 Elysia 的持续支持，我们希望在下一个版本中见到您。

> 我不会让人失望，要让他们振奋
>
> 我们每天都在变得更加响亮，是的，我们在放大
>
> 璀璨的光芒
>
> 你一定想站在我这边
>
> 是的，你知道这是 **全速前进**

</Blog>
