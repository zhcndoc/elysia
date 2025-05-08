---
title: Elysia 1.3 和科学巫术
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.3 和科学巫术

    - - meta
      - name: 'description'
        content: 近乎 0 的开销规范化，配合精确镜像、Bun 系统路由器、独立验证器、减少一半的类型实例化，以及显著降低内存使用和快速启动大型应用的时间

    - - meta
      - property: 'og:description'
        content: 近乎 0 的开销规范化，配合精确镜像、Bun 系统路由器、独立验证器、减少一半的类型实例化，以及显著降低内存使用和快速启动大型应用的时间

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-13/elysia-13.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-13/elysia-13.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.3 和科学巫术"
    src="/blog/elysia-13/elysia-13.webp"
    alt="粉紫色网格渐变背景，上面是 Elysia 1.3 字样，下面是 Scientific Witchery 字样"
    author="saltyaom"
    date="2025 年 5 月 5 日"
    shadow
>

以 Mili 的歌曲 [Ga1ahad 和科学巫术](https://youtu.be/d-nxW9qBtxQ) 命名。

此版本没有炫目的新功能。

它是对事物进行改进，以至于我们认为这就是 **“魔法”**。

Elysia 1.3 的功能几乎零开销，经过 refinements、修复技术债务和重构内部代码，具有：
- [精确镜像](#exact-mirror)
- [Bun 系统路由器](#bun-system-router)
- [独立验证器](#standalone-validator)
- [减少一半的类型实例化](#reduced-type-instantiation)
- [性能改进](#performance-improvement)
- [验证 DX 改进](#validation-dx-improvement)
- [将错误重命名为状态](#rename-error-to-status)

## 精确镜像
我们在 Elysia 1.1 中引入了 [normalize](/patterns/configuration.html#normalize)，确保数据符合我们所需的形状，并且运行良好。

它有助于减少潜在的数据泄露，避免意外的属性，用户非常喜欢它。然而，这也带来了性能成本。

在后台，它使用 `TypeBox 的 Value.Clean` 动态地将数据强制转换为指定的模式。

效果很好，但速度不够快。

由于 TypeBox 不提供与 `TypeCompiler.Check` 类似的 **编译** 版本，后者利用了提前知道形状的优势。

这就是我们引入 [精确镜像](https://github.com/elysiajs/exact-mirror) 作为替代方案的原因。

**精确镜像** 是 TypeBox 的 **Value.Clean** 的即插即用替代，显著提高了性能，利用了提前编译的优势。

### 性能
对于没有数组的小对象，我们测量的速度 **最快可达 ~500倍**。
![在小数据上运行的精确镜像，其速度比 TypeBox Value.Clean 快 582.52 倍](/blog/elysia-13/exact-mirror-small.webp)
> 在小数据上运行的精确镜像


对于中等和大型对象，我们测量的速度 **最快可达 ~30倍**。
![在中大型数据上运行的精确镜像，结果依次为 29.46 倍和 31.6 倍](/blog/elysia-13/exact-mirror-large.webp)
> 在中大型数据上运行的精确镜像

### 对 Elysia 的意义
从 Elysia 1.3 开始，精确镜像是默认的规范化策略，取代了 TypeBox。

通过升级到 Elysia 1.3，您可以期待显著的性能提升 **没有任何代码更改**。

以下是 Elysia 1.2 的吞吐量。
![未开启规范化的 Elysia，吞吐量为 49k req/sec](/blog/elysia-13/normalize-1.2.webp)
> 未开启规范化的 Elysia

而以下是同一段代码在 Elysia 1.3 中的结果
![开启规范化的 Elysia，吞吐量为 77k req/sec](/blog/elysia-13/normalize-1.3.webp)
> 开启规范化的 Elysia

我们在使用 **单个** 模式的情况下测得吞吐量最高可达 ~1.5倍。

这意味着如果您使用多个模式，您将在性能上看到更明显的提升。

与没有模式的相同代码相比，性能差异小于 2%。

![未验证的 Elysia 的运行结果为 79k req/sec](/blog/elysia-13/no-validation.webp)
> 未验证的 Elysia 的运行结果

这非常重要。

之前，您必须在安全性和性能之间做出选择，但随着我们缩小了使用验证和不使用验证之间的性能差距，现在您不必担心这个问题。

现在，我们将验证开销从大量下降到几乎接近零，而无需您进行任何更改。

它就像魔法一样运行。

但是，如果您希望使用 TypeBox 或完全禁用规范化，您可以像配置其他设置一样，通过构造函数进行设定：
```ts
import { Elysia } from 'elysia'

new Elysia({
    normalize: 'typebox' // 使用 TypeBox
})
```

您可以访问 [GitHub上的精确镜像](https://github.com/elysiajs/exact-mirror) 自行尝试基准测试。

## 系统路由器
我们在 Elysia 中从未遇到过路由器性能问题。

它性能优异，我们尽可能进行了超优化。

我们将其推至 JavaScript 在实际情况下能够提供的近乎极限。

### Bun 路由器
然而，Bun 1.2.3 提供了一个内置的路由解决方案（可能是在本地代码中）。

尽管对于静态路由，我们没有看到太多性能提升，但我们发现 **动态路由性能提高了 2-5%** ，而没有进行任何代码更改。

从 Elysia 1.3 开始，我们提供了一种双路由策略，将 Bun 的本地路由器和 Elysia 的路由器结合使用。

Elysia 将尽可能使用 Bun 路由器，若不成功则回退到 Elysia 的路由器。

### 适配器
为了实现这一点，我们必须重写我们的内部编译代码，以支持来自 **适配器** 的自定义路由器。

这意味着现在可以将自定义路由器与 Elysia 自有路由器一起使用。

这在某些环境中为性能提升开辟了机会，例如：使用内置的 `uWebSocket.js 路由器`，该路由器具有原生实现的路由功能。

## 独立验证器
在 Elysia 中，我们可以定义一个模式并通过 `guard` 将其应用于多个路由。

然后，我们可以通过在路由处理程序中提供一个模式来覆盖公共模式，有时看起来像这样：

![Elysia 运行具有默认覆盖保护的模式，显示模式被覆盖](/blog/elysia-13/schema-override.webp)
> Elysia 运行具有默认覆盖保护

但有时我们 **不想覆盖** 一个模式。

相反，我们希望它两者兼具，允许我们组合模式而不是覆盖它们。

从 Elysia 1.3 开始，我们可以做到这一点。

我们现在可以告诉 Elysia 不要覆盖它，而是将其视为其自身，通过提供一个模式作为 **独立**。

```ts
import { Elysia } from 'elysia'

new Elysia()
    .guard({
        schema: 'standalone', // [!代码 ++]
        response: t.Object({
            title: t.String()
        })
    })
```

结果，我们得到了类似于将本地和全局模式合并的结果。

![Elysia 运行独立模式，合并多个保护](/blog/elysia-13/schema-standalone.webp)
> Elysia 运行独立模式，合并多个保护

## 减少类型实例化

Elysia 的类型推断已经非常快。

我们对类型推断的优化非常有信心，它的速度比大多数使用类 Express 语法的框架还要快。

然而，我们的用户在规模很大、具有多个路由和复杂的类型推断的情况下，面临着挑战。

我们设法在大多数情况下 **将类型实例化减少了一半**，测量了推断速度提高了高达 60%。

![类型实例化从 109k 减少到 52k](/blog/elysia-13/type-instantiation.webp)
> 类型实例化从 109k 减少到 52k

我们还改变了 `decorate` 的默认行为，而不是递归遍历每个对象和属性进行交集。

这应该解决使用重型对象/类的用户的问题，例如 `PrismaClient`。

因此，结果应该会带来更快速的 IDE 自动补全、建议、类型检查和 Eden Treaty。

## 性能改进
我们重构和优化了许多内部代码，从而实现了显著的改进。

### 路由注册

我们重构了存储路由信息的方式，并重用对象引用，而不是克隆/创建新的引用。

我们观察到以下改进：
- 内存使用减少到 ~5.6倍
- 路由注册时间提高到 ~2.7倍

![Elysia 1.2（左）与 1.3（右）之间的路由注册比较](/blog/elysia-13/routes.webp)
> Elysia 1.2（左）与 1.3（右）之间的路由注册比较

这些优化应该能在中大型应用中显现出真正的成果，因为它随服务器的路由数量而扩展。

### Sucrose
我们实现了 Sucrose 缓存，以减少不必要的重新计算，并在为非内联事件编译每个路由时重用已编译的路由。

![Elysia 1.2（左）和 1.3（右）之间的 Sucrose 性能比较](/blog/elysia-13/sucrose.webp)
> Elysia 1.2（左）和 1.3（右）之间的 Sucrose 性能比较

Sucrose 将每个事件转换为校验和号码并将其存储为缓存。它使用很少的内存，并将在服务器启动后清理。

这一改进应该有助于重用全局/作用域事件的每路由的启动时间。

### 实例
在创建多个实例并将其作为插件应用时，我们看到显著的改进。

- 内存使用减少了 ~10倍
- 插件创建速度提高了 ~3倍

![Elysia 1.2（左）与 1.3（右）之间的实例比较](/blog/elysia-13/instance.webp)
> Elysia 1.2（左）与 1.3（右）之间的实例比较

这些优化将在升级到 Elysia 1.3 时自动应用。然而，这些性能优化对于小型应用可能不会特别显著。

因为 Serving 一个简单的 Bun 服务器的固定成本约为 10-15MB。这些优化更像是减少现有开销，并有助于改善启动时间。

### 通用更快性能
通过各种微优化、修复技术债务和消除未使用的编译指令。

我们看到 Elysia 请求处理速度有所改善。在某些情况下提高了高达 40%。

![Elysia.handle 在 Elysia 1.2 和 1.3 之间的比较](/blog/elysia-13/handle.webp)
> Elysia.handle 在 Elysia 1.2 和 1.3 之间的比较

## 验证 DX 改进
我们希望 Elysia 的验证能够 **即刻生效**。

只需告诉它您想要什么，它就能满足。这是 Elysia 最有价值的方面之一。

在这次更新中，我们改善了一些我们一直欠缺的领域。

### 编码模式

我们已将 [encodeSchema](/patterns/configuration.html#encodeschema) 从 `实验性` 移出，并默认启用。

这使我们能够使用 [t.Transform](https://github.com/sinclairzx81/typebox?tab=readme-ov-file#types-transform) 应用自定义响应映射，以返回给最终用户。

![使用 t.Transform 进行值拦截](/blog/elysia-13/encode-schema.webp)
> 使用 t.Transform 进行值拦截

这段示例代码将拦截响应，将“hi”替换为“intercepted”。

### 清理

为了防止 SQL 注入和 XSS，并确保字符串输入/输出安全，我们引入了 [sanitize](/patterns/configuration.html#sanitize) 选项。

它接受一个函数或一组函数，拦截每个 `t.String`，并将其转换为新值。

![使用 sanitize 和 Bun.escapeHTML](/blog/elysia-13/sanitize.webp)
> 使用 sanitize 和 Bun.escapeHTML

在这个例子中，我们使用 **Bun.escapeHTML** 并将每个“dorothy”替换为“doro”。

由于 `sanitize` 将全局应用于每个模式，它必须在根实例上应用。

这大大减少了手动安全验证和转换每个字符串字段的样板代码。


### 表单
在 Elysia 的早期版本中，无法使用 [form](/essential/handler.html#formdata) 和 `t.Object` 在编译时进行类型检查 FormData 响应。

我们现在引入了一个新的 [t.Form](/patterns/type#form) 类型来解决这个问题。

![使用 t.Form 验证 FormData](/blog/elysia-13/form.webp)
> 使用 t.Form 验证 FormData

要迁移到表单类型检查，只需在响应模式中将 `t.Object` 替换为 `t.Form`。

### 文件类型
Elysia 现在使用 [file-type](https://github.com/sindresorhus/file-type) 验证文件类型。

![使用 t.File 定义文件类型](/blog/elysia-13/file-type.webp)
> 使用 t.File 定义文件类型

一旦指定了 `type`，Elysia 将通过检查魔术数字自动检测文件类型。

然而，它也被列为 **peerDependencies**，并且不会随 Elysia 默认安装，以减少不需要此功能的用户的包大小。

如果您依赖文件类型验证以提高安全性，建议您更新到 Elysia 1.3。

### Elysia.Ref
我们可以通过使用 `Elysia.model` 创建引用模型，并通过名称引用它。

然而，有时我们需要在模式内部引用它。

我们现在可以通过使用 `Elysia.Ref` 来实现这一点，并自动完成引用模型。

![使用 Elysia.Ref 引用模型](/blog/elysia-13/elysia-ref.webp)
> 使用 Elysia.Ref 引用模型

您也可以使用 `t.Ref` 来引用模型，但它不会提供自动完成。

### 不验证

我们收到了许多反馈，一些用户希望快速原型化他们的 API，或者有时在强制执行验证时遇到问题。

在 Elysia 1.3 中，我们引入了 `t.NoValidate` 以跳过验证。

![使用 t.NoValidate 告诉 Elysia 跳过验证](/blog/elysia-13/no-validate.webp)
> 使用 t.NoValidate 告诉 Elysia 跳过验证

这将告知 Elysia 跳过运行时验证，但仍然提供 TypeScript 类型检查和 OpenAPI 架构以用于 API 文档。

## 状态
我们收到了关于 `error` 命名的大量反馈。

从 Elysia 1.3 开始，我们决定弃用 `error`，并建议使用 `status` 代替。

![IDE 显示 error 被弃用并重命名为 status](/blog/elysia-13/status.webp)
> IDE 显示 error 被弃用并重命名为 status

`error` 函数将按前一个版本的方式运作，无需立即更改。

但是，我们建议重构为 `status`，因为我们将在接下来的 6 个月内支持 `error` 函数，直到大约 Elysia 1.4 或 1.5。

要迁移，只需将 `error` 重命名为 `status`。

## ".index" 从 Treaty 中移除

之前，您必须添加 `(treaty).index` 来处理以 **/** 结尾的路径。

从 Elysia 1.3 开始，我们决定放弃使用 `.index`，可以简单地绕过它，直接调用方法。

![Eden Treaty 显示没有使用 .index](/blog/elysia-13/treaty-index.webp)
> Eden Treaty 显示没有使用 .index

这是一个 **破坏性更改**，但迁移只需最低努力。

要迁移，只需从您的代码库中删除 `.index`。使用 IDE 搜索进行批量更改，将 `.index` 匹配并删除，这应该是一个简单的更改。

## 突出变化
以下是一些来自变更日志的显著变化。

### 改进
- `encodeSchema` 现在稳定，并默认启用
- 优化类型
- 在使用 Encode 时减少冗余类型检查
- 优化 isAsync
- 默认解包 Definition['typebox'] 以防止不必要的 UnwrapTypeModule 调用
- Elysia.form 现在可以进行类型检查
- 重构类型系统
- 将 `_types` 重构为 `~Types`
- 使用 aot 编译检查自定义 Elysia 类型，例如 Numeric
- 重构 `app.router.static`，并将静态路由器代码生成移至编译阶段
- 优化 `add`、`_use` 及一些实用函数的内存使用
- 改善多个路由的启动时间
- 动态创建 cookie 验证器，以便在编译过程中按需使用
- 减少对象克隆
- 优化用于查找内容类型头分隔符的起始索引
- Promise 现在可以是静态响应
- `ParseError` 现在保留堆栈跟踪
- 重构 `parseQuery` 和 `parseQueryFromURL`
- 向 `mount` 添加 `config` 选项
- 在挂载异步模块后自动重新编译
- 支持宏，当钩子具有函数时
- 支持在 ws 上解析宏
- [#1146](https://github.com/elysiajs/elysia/pull/1146) 添加支持从处理程序返回 Web API 的文件
- [#1165](https://github.com/elysiajs/elysia/pull/1165) 在响应架构验证中跳过非数字状态码
- [#1177](https://github.com/elysiajs/elysia/issues/1177) 当抛出错误时 cookie 不会签名

### 修复错误
- 从 `onError` 返回的 `Response` 使用八位字节流
- 使用 `mergeObjectArray` 时意外的内存分配
- 处理日期查询的空格

### 更改
- 当 `maybeStream` 为 true 时，仅向 mapResponse 提供 `c.request`
- 使用普通对象作为 `routeTree`，而不是 `Map`
- 移除 `compressHistoryHook` 和 `decompressHistoryHook`
- webstandard 处理程序现在在未在 Bun 上时返回 `text/plain`
- 除非明确指定，否则为 `decorate` 使用非常量值
- `Elysia.mount` 现在默认设置 `detail.hide = true`

### 破坏性更改
- 移除 `as('plugin')`，改用 `as('scoped')`
- 移除 Eden Treaty 的根 `index`
- 从 `ElysiaAdapter` 中移除 `websocket`
- 移除 `inference.request`

## 后记

嗨？好久不见。

生活有时会让人感到困惑，是不是？

有一天，你在追逐梦想，努力工作。

转眼间，你回头发现自己已经远超目标。

有人仰望你，你成了他们的灵感，成为某人的榜样。

听起来很棒，对吧？

但我认为我并不是一个好的榜样。

### 我想过诚实的生活

有时，事情只是被夸大了。

我可能看起来像个能创造任何东西的天才，但我不是。我只是尽我所能。

我和朋友们一起玩电子游戏，听奇怪的歌曲，看电影，甚至在动漫展上与他们见面。

就像一个普通人。

这段时间，我只是紧紧地抱住了 *你的* 手臂。

**我和你一样，没有特别之处。**

我尽我所能，但我偶尔也会表现得像个傻瓜。

即使我觉得自己没有任何可以成为榜样的特质，我仍想告诉你，我心怀感激。

我的无聊和略显孤独的生活，请不要美化它太多。

<small>*~ 我很高兴你也坏坏的。*</small>

</Blog>