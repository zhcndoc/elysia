---
title: Elysia 0.7 - Stellar Stellar
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: 介绍 Elysia 0.7 - Stellar Stellar

    - - meta
      - name: 'description'
        content: 介绍高达 13 倍的更快类型推断。带有跟踪的声明式遥测。反应式 cookie 模型和 cookie 验证。支持 TypeBox 0.31 和自定义解码器。重写的 Web Socket。定义重映射和自定义后缀。为 Elysia 提供更坚实的基础，展望更光明的未来。

    - - meta
      - property: 'og:description'
        content: 介绍高达 13 倍的更快类型推断。带有跟踪的声明式遥测。反应式 cookie 模型和 cookie 验证。支持 TypeBox 0.31 和自定义解码器。重写的 Web Socket。定义重映射和自定义后缀。为 Elysia 提供更坚实的基础，展望更光明的未来。

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-07/stellar-stellar.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-07/stellar-stellar.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.7 - Stellar Stellar"
    src="/blog/elysia-07/stellar-stellar.webp"
    alt="满天星斗的夜晚中的野外和山脉的风景"
    author="saltyaom"
    date="2023 年 9 月 20 日"
>

以我们永不放弃的精神命名，献给我们心爱的虚拟 YouTuber，~~Suicopath~~ 星街墨春，以及她那绝妙的声音：「[Stellar Stellar](https://youtu.be/AAsRtnbDs-0)」来自她的首张专辑：「Still Still Stellar」

曾经被遗忘，她确实是一颗在黑暗中闪耀的星星。

**Stellar Stellar** 为 Elysia 带来了许多令人兴奋的新更新，帮助 Elysia 坚固基础，轻松处理复杂性，特点包括：
- 全面重写类型，类型推断速度提高高达 13 倍。
- 用于声明式遥测和更好性能审计的“跟踪”。 
- 反应式 Cookie 模型和 cookie 验证以简化 cookie 处理。 
- TypeBox 0.31 和自定义解码器的支持。
- 重写的 Web Socket 以获得更好的支持。
- 定义重映射和声明式后缀以防止名称冲突。
- 基于文本的状态

## 重写类型

Elysia 的核心特征之一，关注开发者体验。

类型是 Elysia 最重要的方面之一，因为它使我们能够做很多令人惊叹的事情，比如统一类型、同步业务逻辑、打字、文档和前端。

我们希望您在 Elysia 上有出色的体验，专注于您的业务逻辑部分，让 Elysia 处理其余部分，无论是通过统一类型进行的类型推断，还是通过 Eden 连接器与后端同步类型。

为此，我们致力于创建一个统一的类型系统来同步所有类型，但随着功能的增长，我们发现我们的类型推断可能不够快速，因为我们几年前缺乏 TypeScript 的经验。

在处理复杂类型系统的过程中，我们积累了经验，进行了各种优化，参与了多个项目，如 [Mobius](https://github.com/saltyaom/mobius)。我们自我挑战再次加速我们的类型系统，使这成为 Elysia 的第二次类型重写。

我们从头开始删除并重写了每个 Elysia 类型，使 Elysia 类型的速度大幅提升。

这是 0.6 和 0.7 在简单的 `Elysia.get` 代码中的比较：

<figure class="flex flex-row w-full max-w-full">
    <img alt="Elysia 0.6" style="width: 50%; background: transparent; box-shadow: unset;" class="object-contain" src="/blog/elysia-07/type-0-6.webp" />
    <img alt="Elysia 0.7" style="width: 50%; background: transparent; box-shadow: unset;" class="object-contain" src="/blog/elysia-07/type-0-7.webp" />
</figure>

凭借我们新获得的经验，以及像 const generic 这样的新版 TypeScript 特性，我们简化了许多代码，减少了代码库中一千多行的类型。

这使我们能够进一步优化我们的类型系统，使其速度更快、稳定性更高。

![在我们的 300 条路由和 3,500 行类型声明的复杂项目中，Elysia 0.6 和 0.7 的比较](/blog/elysia-07/inference-comparison.webp)

使用 Perfetto 和 TypeScript CLI 在一个大规模和复杂应用上生成跟踪，我们测量出了高达 13 倍的推断速度。

如果您想知道我们是否会在 0.6 中破坏类型推断，我们确实在类型级别上有单元测试，以确保大多数情况下没有破坏性更改。

我们希望这一改进能帮助您实现更快的类型推断，比如更快的自动完成，以及您 IDE 的加载时间接近瞬时，以帮助您的开发速度更快、更流畅。

## 跟踪

性能是 Elysia 另一个重要方面。

我们不想为了基准测试而快速，我们希望您在现实场景中拥有真正快速的服务器，而不仅仅是基准测试。

有许多因素可能会导致您的应用速度变慢，而且很难识别其中一个，这就是我们引入 **“跟踪”** 的原因。

**跟踪** 允许我们利用生命周期事件，识别应用的性能瓶颈。

![跟踪用法示例](/blog/elysia-07/trace.webp)

这个示例代码允许我们插入所有 **beforeHandle** 事件，并逐个提取执行时间，然后设置 Server-Timing API 来检测性能瓶颈。

而且这不仅限于 `beforeHandle`，甚至 `handler` 本身的事件也可以被跟踪。命名约定是基于您已经熟悉的生命周期事件命名的。

此 API 使我们能够轻松审计 Elysia 服务器的性能瓶颈，并与您选择的报告工具集成。

默认情况下，跟踪使用 AoT 编译和动态代码注入来有条件地报告您实际使用的事件，这意味着不会对性能产生任何影响。

## 反应式 Cookie
我们将我们的 cookie 插件合并到 Elysia 核心中。

与跟踪相同，反应式 Cookie 使用 AoT 编译和动态代码注入，条件性地注入 cookie 使用代码，如果您不使用它，则不会对性能产生影响。

反应式 Cookie 以更现代的方式使用信号来处理 cookie，并提供符合人体工程学的 API。

![反应式 Cookie 的使用示例](/blog/elysia-07/cookie.webp)

没有 `getCookie`、`setCookie`，一切皆是一个 cookie 对象。

当您想使用 cookie 时，只需提取名称并获取/设置其值，如下所示：
```typescript
app.get('/', ({ cookie: { name } }) => {
    // 获取
    name.value

    // 设置
    name.value = "新值"
})
```

然后 cookie 会自动将值与 headers 和 cookie 罐进行同步，使 `cookie` 对象成为处理 cookie 的单一真实来源。

Cookie 罐是反应式的，这意味着如果您没有为 cookie 设置新值，则不会发送 `Set-Cookie` 头，以保持相同的 cookie 值并减少性能瓶颈。

### Cookie 架构
随着 cookie 合并到 Elysia 核心中，我们引入了新的 **Cookie 架构**，用于验证 cookie 值。

当您需要严格验证 cookie 会话或希望对处理 cookie 提供严格的类型或类型推断时，这非常有用。

```typescript
app.get('/', ({ cookie: { name } }) => {
    // 设置
    name.value = {
        id: 617,
        name: '召唤 101'
    }
}, {
    cookie: t.Cookie({
        value: t.Object({
            id: t.Numeric(),
            name: t.String()
        })
    })
})
```

Elysia 自动为您编码和解码 cookie 值，因此如果您想将 JSON 存储在 cookie 中，例如解码的 JWT 值，或者只想确保值是数字字符串，您可以轻松做到这一点。

### Cookie 签名
最后，凭借 Cookie 架构的引入，以及 `t.Cookie` 类型。我们能够创建一种统一类型，以自动处理 cookie 签名的签名/验证。

Cookie 签名是附加到 cookie 值的加密哈希，使用密钥和 cookie 内容生成，以通过向 cookie 添加签名来增强安全性。

这确保 cookie 值未被恶意行为者修改，有助于验证 cookie 数据的真实性和完整性。

在 Elysia 中处理 cookie 签名，只需提供 `secret` 和 `sign` 属性：
```typescript
new Elysia({
    cookie: {
        secret: 'Fischl von Luftschloss Narfidort'
    }
})
    .get('/', ({ cookie: { profile } }) => {
        profile.value = {
            id: 617,
            name: '召唤 101'
        }
    }, {
        cookie: t.Cookie({
            profile: t.Object({
                id: t.Numeric(),
                name: t.String()
            })
        }, {
            sign: ['profile']
        })
    })
```

通过提供 cookie 密钥和 `sign` 属性来指示哪个 cookie 应进行签名验证。

Elysia 然后自动签署和取消签署 cookie 值，消除了手动调用 **sign** / **unsign** 函数的需要。

Elysia 自动处理 Cookie 的密钥轮换，因此如果您必须迁移到新的 cookie 密钥，只需附加密钥，Elysia 将使用第一个值来签署新 cookie，而在尝试与其余密钥签署的 cookie 时，如果匹配则取消签署。
```typescript
new Elysia({
    cookie: {
        secrets: ['复仇将属于我', 'Fischl von Luftschloss Narfidort']
    }
})
```

反应式 Cookie API 是声明式和简单明了的，这里有一些关于它提供的符合人体工程学特性的神奇之处，我们非常期待您来尝试它。

## TypeBox 0.31
随着 0.7 的发布，我们正在更新到 TypeBox 0.31 为 Elysia 带来更多功能。

这带来了新兴的兴奋特性，如在 Elysia 中原生支持 TypeBox 的 `Decode`。

以前，一个像 `Numeric` 这样的自定义类型需要动态代码注入以将数字字符串转换为数字，但借助 TypeBox 的解码，我们允许定义一个自定义函数自动编码和解码类型的值。

这使我们能够将类型简化为：
```typescript
Numeric: (property?: NumericOptions<number>) =>
    Type.Transform(Type.Union([Type.String(), Type.Number(property)]))
        .Decode((value) => {
            const number = +value
            if (isNaN(number)) return value

            return number
        })
        .Encode((value) => value) as any as TNumber,
```

不再依赖于广泛的检查和代码注入，而是通过 TypeBox 中的 `Decode` 函数实现简化。

我们已经重写了所有需要动态代码注入的类型，以使用 `Transform` 来简化代码维护。

不仅限于此，借助 `t.Transform`，您现在还可以定义一个自定义类型，手动指定自定义函数进行编码和解码，让您能够写出比以往任何时候都更加富有表现力的代码。

我们迫不及待想看看您在 `t.Transform` 引入后会带来什么。

### 新类型
随着 **Transform** 的引入，我们新增了一种类型，如 `t.ObjectString`，用于自动解码请求中的对象值。

这在您必须使用 **multipart/formdata** 处理文件上传但不支持对象时非常有用。您现在只需使用 `t.ObjectString()` 来告诉 Elysia 该字段是串行化的 JSON，这样 Elysia 就可以自动解码。
```typescript
new Elysia({
    cookie: {
        secret: 'Fischl von Luftschloss Narfidort'
    }
})
    .post('/', ({ body: { data: { name } } }) => name, {
        body: t.Object({
            image: t.File(),
            data: t.ObjectString({
                name: t.String()
            })
        })
    })
```

我们希望这能简化对 JSON 和 **multipart** 的需求。

## 重写 Web Socket
除了完全重写类型，我们还完全重写了 Web Socket。

以前我们发现 Web Socket 有 3 个主要问题：
1. 模式没有严格验证
2. 类型推断慢
3. 所有插件中需要 `.use(ws())`

通过这次更新，所有上述问题均得到了改善，同时提升了 Web Socket 的性能。

1. 现在，Elysia 的 Web Socket 是严格验证的，类型自动同步。
2. 我们无需在每个插件中使用 `.use(ws())` 来使用 WebSocket。

而且我们为已经快速的 Web Socket 带来了性能改进。

之前，Elysia Web Socket 需要处理每个传入请求的路由，以统一数据和上下文，但通过新模型，Web Socket 现在可以在不依赖于路由器的情况下推断其路由的数据。

将性能接近 Bun 原生 Web Socket 性能。

感谢 [Bogeychan](https://github.com/bogeychan) 提供测试用例，帮助我们自信地重写 Web Socket。

## 定义重映射
在 [#83](https://github.com/elysiajs/elysia/issues/83) 中由 [Bogeychan](https://github.com/bogeychan) 提出的。

总结来说，Elysia 允许我们装饰请求并存储我们想要的任何值，然而某些插件可能与我们已有的值重复命名，而有时插件可能存在名称冲突，但我们根本无法重命名属性。

### 重映射
字面意思是，这允许我们重映射现有的 `state`、`decorate`、`model`、`derive` 为我们希望的任何内容，以防止名称冲突，或者仅仅为了重命名属性。

通过提供一个函数作为第一个参数，回调将接受当前值，允许我们将其重映射为任何我们希望的值。
```typescript
new Elysia()
    .state({
        a: "a",
        b: "b"
    })
    // 排除 b 状态
    .state(({ b, ...rest }) => rest)
```

这在您必须处理具有某些重复名称的插件时非常有用，使您能够重映射插件的名称：
```typescript
new Elysia()
    .use(
        plugin
            .decorate(({ logger, ...rest }) => ({
                pluginLogger: logger,
                ...rest
            }))
    )
```

重映射函数可以与 `state`、`decorate`、`model`、`derive` 一起使用，以帮助您定义正确的属性名称，并防止名称冲突。

### 后缀
为了提供更顺畅的体验，一些插件可能有很多属性值，这会使逐一重映射变得令人不知所措。

**后缀** 函数由一个 **前缀** 和 **后缀** 组成，允许我们重映射实例的所有属性，以防止插件的名称冲突。

```typescript
const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(
        setup
            .prefix('decorator', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```

这使我们能够轻松地批量重映射插件的属性，从而避免名称冲突。

默认情况下，**后缀** 将自动处理运行时和类型级代码，按照命名约定将属性重映射为驼峰式命名。

在某些情况下，您还可以重映射插件的 `所有` 属性：
```typescript
const app = new Elysia()
    .use(
        setup
            .prefix('all', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```

我们希望重映射和后缀功能为您处理多个复杂插件提供强大的 API。

## 真正的封装作用域
随着 Elysia 0.7 的推出，Elysia 现在真正能够通过将作用域实例视为另一个实例来封装实例。

新的作用域模型甚至可以防止事件如 `onRequest` 在主实例上解析，这是不可能的。

```typescript
const plugin = new Elysia({ scoped: true, prefix: '/hello' })
    .onRequest(() => {
        console.log('在作用域中')
    })
    .get('/', () => '你好')

const app = new Elysia()
    .use(plugin)
    // '在作用域中' 不会日志输出
    .get('/', () => 'Hello World')
```

更重要的是，作用域现在在运行时和类型级别上都是真正限制的，这是之前没有类型重写时无法实现的。

这对维护者来说令人兴奋，因为之前，真正封装一个实例的作用域几乎是不可能的，但通过使用 `mount` 和 WinterCG 的一致性，我们终于能够真正封装插件的实例，同时与主实例的属性如 `state`、`decorate` 之间提供软连接。

## 基于文本的状态
有超过 64 个标准 HTTP 状态码需要记忆，我承认有时我们也会忘记我们想要使用的状态。

这就是为什么我们以文本形式提供 64 个 HTTP 状态码，并为您提供自动完成功能。

![基于文本的状态码使用示例](/blog/elysia-07/teapot.webp)

文本将自动解析为状态码，如预期的那样。

当您输入时，IDE 会自动弹出关于文本的自动完成功能，无论是 NeoVim 还是 VSCode，因为这是 TypeScript 的内置功能。

![基于文本的状态码显示自动完成](/blog/elysia-07/teapot-autocompletion.webp)

这是一个小的符合人体工程学的功能，帮助您开发服务器，而无需在 IDE 和 MDN 之间切换以查找正确的状态码。

## 显著改进
改进：
- `onRequest` 现在可以是异步的
- 将 `Context` 添加到 `onError`
- 生命周期钩子现在接受数组函数
- 静态代码分析现在支持 rest 参数
- 将动态路由分解为单个流水线，而不是内联到静态路由中，以减少内存使用
- 将 `t.File` 和 `t.Files` 设置为 `File` 而不是 `Blob`
- 跳过类实例合并
- 处理 `UnknownContextPassToFunction`
- [#157](https://github.com/elysiajs/elysia/pull/179) WebSocket - 添加单元测试并修复示例和 API 由 @bogeychan 提供
- [#179](https://github.com/elysiajs/elysia/pull/179) 添加 GitHub 行动以运行 bun 测试由 @arthurfiorette 提供

破坏性更改：
- 移除 `ws` 插件，迁移到核心
- 将 `addError` 重命名为 `error`

变更：
- 使用单个 findDynamicRoute，而不是内联到静态映射
- 移除 `mergician`
- 由于 TypeScript 问题，移除数组路由
- 重写 Type.ElysiaMeta 以使用 TypeBox.Transform

错误修复：
- 默认严格验证响应
- `t.Numeric` 在 headers / query / params 中不工作
- `t.Optional(t.Object({ [name]: t.Numeric }))` 导致错误
- 在转换 `Numeric` 之前添加 null 检查
- 从实例插件中继承存储
- 处理类重叠
- [#187](https://github.com/elysiajs/elysia/pull/187) InternalServerError 消息修复为 "INTERNAL_SERVER_ERROR"，而不是 "NOT_FOUND"，由 @bogeychan 提供
- [#167](https://github.com/elysiajs/elysia/pull/167) mapEarlyResponse 在处理后带有 aot

## 之后
自最新发布以来，我们在 GitHub 上获得了超过 2,000 个星星！

回顾过去，我们的进步超乎我们的想象。

推动 TypeScript 和开发者体验的边界，甚至使我们感到做了一些真正深刻的事情。

随着每次发布，我们逐渐朝着实现我们很久以来描绘的未来迈出了一步。

一个我们可以自由创造任何想要的东西，同时拥有惊人的开发者体验的未来。

我们真心感谢您和可爱的 TypeScript 和 Bun 社区的爱与支持。

看到 Elysia 由像以下这样出色的开发者们赋予生命，真是令人兴奋：
- [Ethan Niser 和他令人惊叹的 BETH Stack](https://youtu.be/aDYYn9R-JyE?si=hgvGgbywu_-jsmhR)
- 被 [Fireship](https://youtu.be/dWqNgzZwVJQ?si=AeCmcMsTZtNwmhm2) 提及
- 有 [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) 的官方集成

以及更多选择 Elysia 作为下一个项目的开发者。

我们的目标很简单，为您营造一个您可以追求梦想的永恒乐园，让每个人都能快乐地生活。

感谢您和您对 Elysia 的爱与支持，我们希望有一天将我们的梦想描绘成现实。

**愿所有美好事物都被祝福**

> 伸出那只手，好像想要触碰某人
>
> 我和你一样，没什么特别
>
> 没错，我会唱夜晚的歌
>
> Stellar Stellar
>
> 在世界的中心，宇宙中
>
> 音乐今晚将永不停歇
>
> 没错，我总是渴望成为
>
> 不是仙履奇缘，永远等待
>
> 而是她所渴望的王子
> 
> 因为我是一颗星，因此
>
> Stellar Stellar

</Blog>
