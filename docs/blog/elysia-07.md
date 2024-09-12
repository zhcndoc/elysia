---
title: Elysia 0.7 - 星光璀璨
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: 介绍 Elysia 0.7 - 星光璀璨

    - - meta
      - name: 'description'
        content: 介绍高达 13 倍速的类型推理。声明式遥测与追踪。响应式饼干模型和饼干验证。TypeBox 0.31 和自定义解码器支持。重写的 Web Socket。定义映射和自定义后缀。为 Elysia 建立更坚实的基础，迎接更辉煌的未来。

    - - meta
      - property: 'og:description'
        content: 介绍高达 13 倍速的类型推理。声明式遥测与追踪。响应式饼干模型和饼干验证。TypeBox 0.31 和自定义解码器支持。重写的 Web Socket。定义映射和自定义后缀。为 Elysia 建立更坚实的基础，迎接更辉煌的未来。

    - - meta
      - property: 'og:image'
        content: https://elysia.zhcndoc.com/blog/elysia-07/stellar-stellar.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysia.zhcndoc.com/blog/elysia-07/stellar-stellar.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.7 - 星光璀璨"
    src="/blog/elysia-07/stellar-stellar.webp"
    alt="夜间充满星星的野外和山脉的风景"
    author="saltyaom"
    date="2023 年 9 月 20 日"
>

以我们永不放弃的精神命名，我们心爱的虚拟 YouTube 主播，~~Suicopath~~ Hoshimachi Suisei，以及她闪耀的声音：“[Stellar Stellar](https://youtu.be/AAsRtnbDs-0)” 来自她的第一张专辑：“Still Still Stellar”

一度被遗忘，她确实是真正在黑暗中闪耀的星星。

**星光璀璨**带来了许多令人兴奋的新更新，帮助 Elysia 巩固基础，轻松处理复杂性，包括：
- 彻底重写的类型，高达 13 倍速的类型推理。
- 用于声明式遥测和更好性能审计的 “追踪”。
- 响应式 cookie 模型和 cookie 验证，简化 cookie 处理。
- TypeBox 0.31 和自定义解码器支持。
- 重写的 Web Socket，提供更好的支持。
- 定义映射和声明式后缀，防止名称冲突。
- 文本基状态

## 重写的类型

Elysia 关于开发者体验的核心功能。

类型是 Elysia 最重要的方面之一，因为它允许我们做许多惊人的事情，比如统一类型，同步您的业务逻辑，类型，文档和前端。

我们希望您能够体验 Elysia 的卓越体验，专注于您的业务逻辑部分，让 Elysia 处理剩余的事情，无论是类型推理与统一类型，还是 Eden 连接器，用于与后端同步类型。

为了实现这一点，我们投入了努力，创建了一个统一的类型系统，以便同步所有类型，但随着功能的增长，我们发现我们的类型推理可能不够快，因为我们缺乏一年前的 TypeScript 经验。

随着我们在处理复杂类型系统、各种优化和许多项目，如 [Mobius](https://github.com/saltyaom/mobius) 的过程中积累的经验，我们挑战自己再次加快我们的类型系统，使其成为 Elysia 的第二次类型重写。

我们删除了 Elysia 类型并从基础开始重写，以使 Elysia 类型快几个数量级。

这是 0.6 和 0.7 在简单 `Elysia.get` 代码上的比较：

<figure class="flex flex-row w-full max-w-full">
    <img alt="Elysia 0.6" style="width: 50%; background: transparent; box-shadow: unset;" class="object-contain" src="/blog/elysia-07/type-0-6.webp" />
    <img alt="Elysia 0.7" style="width: 50%; background: transparent; box-shadow: unset;" class="object-contain" src="/blog/elysia-07/type-0-7.webp" />
</figure>

随着我们获得的经验，以及 TypeScript 的新特性如 const generic，我们能够简化大量的类型代码，减少超过一千行的代码库。

使我们能够精炼我们的类型系统，使其更快，更稳定。

![0.6 和 0.7 在具有 300 个路由和 3,500 行类型声明的复杂项目上的比较](/blog/elysia-07/inference-comparison.webp)

使用 Perfetto 和 TypeScript CLI 生成大型和复杂应用的 trace，我们测量了高达 13 倍的推理速度。

如果你想知道我们是否可能在 0.6 中破坏了类型推理，我们在类型层次上有一个单元测试，以确保大多数情况下，没有类型上的破坏性变化。

我们希望这个改进将帮助您实现更快的类型推理，比如更快的自动完成和 IDE 加载时间，帮助您的开发变得更加快速和流畅。

## Trace

性能是 Elysia 的另一个重要方面。

我们不希望 Elysia 只是为了基准测试而快，我们希望您有一个真实的、快速的服务器，而不是仅仅为了基准测试。

有许多因素可能会减慢您的应用程序，很难识别一个，这就是我们引入**追踪**的原因。

**追踪**允许我们进入生命周期事件，并识别性能瓶颈。

![追踪的使用示例](/blog/elysia-07/trace.webp)

这个例子代码允许我们进入所有的 `beforeHandle` 事件，并提取一个接一个的执行时间，然后设置 Server-Timing API 来检查性能瓶颈。

这不仅限于 `beforeHandle`，事件也可以追踪 `handler` 本身。命名约定是您已经熟悉的生命周期事件的名称。

这个 API 让我们轻松地审计 Elysia 服务器的性能瓶颈，并与您选择的报告工具集成。

默认情况下，追踪使用 AoT 编译和动态代码注入来条件性地报告，这意味着如果您实际上没有使用，就不会有任何性能影响。

## 响应式 Cookie 模型和 cookie 验证
我们将我们的 cookie 插件合并到 Elysia 核心中。

与追踪一样，响应式 Cookie 使用 AoT 编译和动态代码注入来条件性地注入 cookie 使用代码，从而没有任何性能影响。

响应式 Cookie 采用了一种更现代的方法，类似于信号，以一种直观的 API 处理 Cookie。

![响应式 Cookie 的使用示例](/blog/elysia-07/cookie.webp)

没有 `getCookie` 和 `setCookie`，一切只是 cookie 对象。

当您需要使用 cookie 时，只需提取名称来获取/设置其值：
```typescript
app.get('/', ({ cookie: { name } }) => {
    // Get
    name.value

    // Set
    name.value = "New Value"
})
```

然后 cookie 将自动同步值与头部，以及 cookie，使得 `cookie` 对象成为处理 cookie 的唯一真实来源。

Cookie 罐是响应式的，这意味着如果你没有为 cookie 设置新值，`Set-Cookie` 头部将不会被发送以保持相同的 cookie 值并减少性能瓶颈。

### Cookie Schema
随着 cookie 合并到 Elysia 核心，我们引入了新的 **Cookie Schema** 来验证 cookie 值。

这对于严格验证 cookie 会话或想要严格类型或类型推理处理 cookie 时非常有用。

```typescript
app.get('/', ({ cookie: { name } }) => {
    // Set
    name.value = {
        id: 617,
        name: 'Summoning 101'
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

Elysia 为您自动编码和解码 cookie 值，因此如果您需要将 JSON 存储在 cookie 中，例如解码的 JWT 值，或者只是确保值是数字字符串，您可以这样做而不费吹灰之力。

### Cookie 签名
最后，随着 Cookie Schema 的引入和 `t.Cookie` 类型的使用，我们能够创建一个统一的类型来自动签名和验证 cookie 签名。

Cookie 签名是对 cookie 值进行加密哈希，使用密钥和 cookie 内容生成，以增加安全性，通过添加签名到 cookie 来验证数据的真实性和完整性。

这确保了 cookie 值没有被恶意行为者修改，有助于验证 cookie 数据的确切性和完整性。

要处理 Cookie 签名，您只需提供 `secert` 和 `sign` 属性：
```typescript
new Elysia({
    cookie: {
        secret: 'Fischl von Luftschloss Narfidort'
    }
})
    .get('/', ({ cookie: { profile } }) => {
        profile.value = {
            id: 617,
            name: 'Summoning 101'
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

通过提供 cookie 密钥，并 `sign` 属性来指示哪些 cookie 应该有签名验证。

Elysia 然后自动签名和解签 cookie 值，消除了手动签名/解签函数的需要。

Elysia 自动处理 Cookie 的密钥轮换，因此如果您需要迁移到新的 cookie 密钥，您可以只追加密钥，Elysia 将使用第一个值来签名新的 cookie，同时尝试使用剩余的密钥解签 cookie，如果匹配。
```typescript
new Elysia({
    cookie: {
        secrets: ['Vengeance will be mine', 'Fischl von Luftschloss Narfidort']
    }
})
```

响应式 Cookie API 是声明式的，直接了当，关于它提供的魔法，我们真的期待你尝试它。

## TypeBox 0.31
随着 0.7 的发布，我们将 TypeBox 更新到 0.31，带来了更多的功能到 Elysia。

这带来了新的令人兴奋的功能，比如在 Elysia 中支持 TypeBox 的 `Decode`。

以前，自定义类型如 `Numeric` 需要动态代码注入来转换数值字符串为数字，但随着 TypeBox 的 `decode` 的使用，我们现在可以定义一个自定义函数来手动编码和解码类型值。

简化了类型到：
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

TypeBox 中的 `Decode` 函数简化了以往依赖于复杂检查和代码注入的过程。

我们已经重写了所有需要动态代码注入的类型，以便使用 `Transform` 来简化代码维护。

不仅如此，通过 `t.Transform`，你现在还可以定义一个带有自定义函数的自定义类型来自行编码和解码，这使得你可以写出比以往更加表达力强的代码。

我们迫不及待想看看 `t.Transform` 的引入会给你们带来什么。

### 新类型
通过引入 **Transform**，我们添加了一种新的类型，如 `t.ObjectString`，来自动解码请求中的对象值。

当您必须使用 **multipart/formdata** 来处理文件上传，但它不支持对象时，这非常有用。现在，您可以使用 `t.ObjectString()` 来告诉 Elysia 该字段是一个字符串化的 JSON，因此 Elysia 可以自动解码它。
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

我们希望这会简化需要 `multipart` 和 JSON 的需求。

## 重写的 Web Socket
除了完全重写的类型，我们也完全重写了 Web Socket。

以前，我们发现 Web Socket 有三个主要问题：
1. 模式没有严格验证。
2. 类型推理慢。
3. 需要 `.use(ws())` 在每个插件中。

随着这个新更新，解决了所有上述问题，同时改进了 Web Socket 的性能。

1. 现在，Elysia 的 Web Socket 被严格验证，并且类型被自动同步。
2. 我们消除了在每个插件中使用 `.use(ws())` 的需要。

我们为已经很快的 Web Socket 带来了性能提升。

之前，Elysia Web Socket 需要处理每个传入请求的路由，以统一数据和上下文，但随着新模型的引入，Web Socket 现在可以推断其路由的数据，而无需依赖路由器。

这使得性能接近 Bun 本机 Web Socket 的性能。

感谢 [Bogeychan](https://github.com/bogeychan) 提供了 Elysia Web Socket 的测试用例，帮助我们自信地重写 Web Socket。

## 定义映射
在 [#83](https://github.com/elysiajs/elysia/issues/83) 中由 [Bogeychan](https://github.com/bogeychan) 提出。

简而言之，Elysia 允许我们装饰和请求，并将它们与任何我们想要的值存储，但有些插件可能有一个与我们的值重复的名称，有时插件有一个名称冲突，但我们不能重命名属性。

### 映射
正如名称所示，这允许我们重新映射现有的 `state`，`decorate`，`model`，`derive` 到任何我们喜欢的值，以防止插件名称冲突，或者只是想要重命名属性。

通过提供一个函数作为第一个参数，回调将接受当前值，允许我们将值重新映射到任何我们喜欢的值。
```typescript
new Elysia()
    .state({
        a: "a",
        b: "b"
    })
    // Exclude b state
    .state(({ b, ...rest }) => rest)
```

当您需要处理一个具有重复名称的插件时，这很有用，它允许您重新映射插件的名称：
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

映射函数可以与 `state`，`decorate`，`model`，`derive` 一起使用，帮助我们定义正确的属性名称，并防止插件名称冲突。

### 后缀
为了提供更流畅的体验，有些插件可能有大量属性值，这可能变得令人难以置信地重新映射一个接一个。

**后缀**函数，由**前缀**和**后缀**组成，使我们能够重新映射实例的每个属性，防止插件名称冲突。

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

允许我们批量重新映射插件属性，防止插件名称冲突。

默认情况下，**后缀**将同时处理运行时和类型代码，将属性名称转换为驼峰式命名约定。

在某些情况下，您也可以重新映射 `所有` 插件的属性：
```typescript
const app = new Elysia()
    .use(
        setup
            .prefix('all', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```

我们希望映射和后缀将提供一个强大的 API，帮助您处理多个复杂的插件。

## 真正的封装范围
随着 Elysia 0.7 的推出，Elysia 现在可以真正地封装一个实例，将一个范围实例视为另一个实例。

新的范围模型甚至可以防止像 `onRequest` 那样的事件在主实例上解决，这在以前是不可能的。

```typescript
const plugin = new Elysia({ scoped: true, prefix: '/hello' })
    .onRequest(() => {
        console.log('In Scoped')
    })
    .get('/', () => 'hello')

const app = new Elysia()
    .use(plugin)
    // 'In Scoped' will not log
    .get('/', () => 'Hello World')
```

此外，现在作用域在运行时和类型级别上都是真正受限的，这是以前没有提到的类型重写不可能实现的。

这对维护者来说是非常令人兴奋的，因为之前几乎不可能真正封装实例的作用域，但是使用 `mount` 和 WinterCG 兼容性，我们终于能够真正封装插件的实例，同时为像 `state`、`decorate` 这样的主实例属性提供一个软链接。

## 文本状态
有超过 64 个标准的 HTTP 状态码需要记住，我承认有时我们也会忘记我们想要使用的状态码。

这就是为什么我们以文本形式提供 64 个 HTTP 状态码，并为你提供自动完成功能的原因。

![使用文本基础状态代码的示例](/blog/elysia-07/teapot.webp)

文本将自动解析为状态代码，如预期。

当您输入时，应该会有 IDE 的自动完成弹出，无论是 NeoVim 还是 VSCode，因为这是 TypeScript 的内置功能。

![显示自动完成文本基状态码的示例](/blog/elysia-07/teapot-autocompletion.webp)

这是一个小的 ergonomic 特性，帮助您开发服务器，无需在 IDE 和 MDN 之间切换，搜索正确的状态码。

## 值得注意的改进
改进：
- `onRequest` 现在可以异步。
- 添加 `Context` 到 `onError`。
- 生命周期钩子现在接受一个函数数组。
- 静态代码分析现在支持剩余参数。
- 拆分动态路由到单个管道，而不是内联到静态路由，以减少内存使用。
- 设置 `t.File` 和 `t.Files` 到 `File` 而不是 `Blob`。
- 跳过类实例合并。
- 处理 `UnknownContextPassToFunction`。
- [#157](https://github.com/elysiajs/elysia/pull/179) WebSocket - 添加了单元测试，并修复了示例&api by @bogeychan。
- [#179](https://github.com/elysiajs/elysia/pull/179) 添加 github action 来运行 bun test by @arthurfiorette。

重大变更：
- 移除 `ws` 插件，迁移到核心
- 将 `addError` 重命名为 `error`

变化：
- 使用单一的 findDynamicRoute 而不是内联到静态映射。
- 移除 `mergician`。
- 移除数组路由，因为 TypeScript 遇到问题。
- 重写 Type.ElysiaMeta 来使用 TypeBox.Transform。

错误修复：
- 严格验证响应。
- `t.Numeric` 在头部/查询/参数上不起作用。
- `t.Optional(t.Object({ [name]: t.Numeric }))` 导致错误。
- 添加 null 检查，在转换 `Numeric` 之前。
- 继承存储到实例插件。
- 处理类重叠。
- [#187](https://github.com/elysiajs/elysia/pull/187) 内部服务器错误消息修复为 “INTERNAL_SERVER_ERROR”，而不是 “NOT_FOUND” by @bogeychan。
- [#167](https://github.com/elysiajs/elysia/pull/167) 地图 EarlyResponse 与 AoT 在处理后。

## 之后
自从最新的发布以来，我们在 GitHub 上获得了超过 2,000 颗星！

回顾过去，我们的进步超出了我们当时的想象。

推动 TypeScript 和开发者体验的边界，甚至到了我们正在做一些我们觉得真正深刻的事情的地步。

随着每一次发布，我们逐渐更接近于带来我们很久以前绘制的未来。

一个未来，我们可以自由地创造我们想要的东西，拥有惊人的开发者体验。

我们感到非常感激能被你和你可爱的 TypeScript 和 Bun 社区所爱。

看到 Elysia 被像这样令人惊叹的开发者带入生活，真是令人兴奋：
- [Ethan Niser 和他的令人惊叹的 BETH 堆栈](https://youtu.be/aDYYn9R-JyE?si=hgvGgbywu_-jsmhR)
- 被 [Fireship](https://youtu.be/dWqNgzZwVJQ?si=AeCmcMsTZtNwmhm2) 提到
- 拥有 [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) 的官方集成

还有更多选择 Elysia 作为他们下一个项目的开发者。

我们的目标很简单，就是带来一个永恒的天堂，在那里你可以追求你的梦想，每个人都可以幸福地生活。

谢谢你的爱和对你对 Elysia 的压倒性支持，我们希望有一天我们能够将追求我们梦想的未来变成现实。

**愿所有的美丽都被祝福**

> 伸出手，好像要触及某人
>
> 我就像你，没什么特别的
>
> 没错，我会唱夜晚的歌曲
>
> 星光璀璨
>
> 在这个世界，宇宙的中心
>
> 音乐永远不会，永远不会在今夜停止
>
> 没错，我一直渴望成为
>
> 不是灰姑娘，永远等待
>
> 而是来找她的王子
> 
> 因为我是星星，这就是为什么
>
> 星光璀璨

</Blog>
