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
        content: 几乎零开销的规范化，使用精确镜像、Bun 系统路由器、独立验证器、减少一半的类型实例化、显著减少内存使用和大型应用程序更快的启动时间

    - - meta
      - property: 'og:description'
        content: 几乎零开销的规范化，使用精确镜像、Bun 系统路由器、独立验证器、减少一半的类型实例化、显著减少内存使用和大型应用程序更快的启动时间

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

以 Mili 的歌曲 [Ga1ahad and Scientific Witchery](https://youtu.be/d-nxW9qBtxQ) 命名。

此版本没有带来闪亮的新功能。

它是关于改进，使事情变得更好，以至于我们认为它是**“魔法”**。

Elysia 1.3 的特性几乎没有开销、精炼、修复技术债务和重构内部代码，特点包括：
- [精确镜像](#exact-mirror)
- [Bun系统路由器](#bun-system-router)
- [独立验证器](#standalone-validator)
- [减少一半的类型实例化](#reduced-type-instatiation)
- [性能改进](#performance-improvement)
- [验证DX改进](#validaiton-dx-improvement)
- [将错误重命名为状态](#rename-error-to-status)

## 精确镜像
我们在 Elysia 1.1 中引入了 [normalize](/patterns/configuration.html#normalize)，以确保数据符合我们期望的形状，并且效果很好。

它帮助减少了潜在的数据泄露、意外属性，用户们对此非常喜欢。然而，它的性能成本很高。

在后台，它使用 `TypeBox's Value.Clean` 动态地将数据强制转换为指定的模式。

它工作良好，但速度不如我们希望的那样快。

由于 TypeBox 不像 `TypeCompiler.Check` 那样提供**编译版** `Value.Clean`，后者可以利用提前知道的形状。

因此，我们引入了一个替代方案 [精确镜像](https://github.com/elysiajs/exact-mirror)。

**精确镜像** 是 TypeBox 的 **Value.Clean** 的直接替代品，通过利用提前编译显著提高了性能。

### 性能
对于没有数组的小对象，我们测量到的速度提高了**多达 ~500倍**。
![在小数据上运行精确镜像结果比 TypeBox 的 Value.Clean 快 582.52倍](/blog/elysia-13/exact-mirror-small.webp)
> 精确镜像在小数据上运行

对于中型和大型对象，我们测量到的速度提高了**多达 ~30倍**。
![在中型和大型数据上运行精确镜像结果依次为 29.46倍和 31.6倍](/blog/elysia-13/exact-mirror-large.webp)
> 精确镜像在中型和大型数据上运行

### 对Elysia的意义
从 Elysia 1.3 开始，精确镜像成为默认的规范化策略，替代 TypeBox。

通过升级到 Elysia 1.3，您可以期待显著的性能提升，**无需任何代码更改**。

以下是 Elysia 1.2 的吞吐量。
![Elysia 关闭规范化，结果为 49k req/sec](/blog/elysia-13/normalize-1.2.webp)
> Elysia 关闭规范化

以下是 Elysia 1.3 中相同代码的结果
![Elysia 打开规范化，结果为 77k req/sec](/blog/elysia-13/normalize-1.3.webp)
> Elysia 打开规范化

我们测量到的吞吐量提高了约 1.5 倍，针对**单个**规范化模式。

这意味着如果您使用多个模式，您将会获得更大的性能提升。

当我们将其与相同代码**没有模式的情况**做比较时，发现性能差异小于 2%。

![Elysia 在没有验证的情况下运行，结果为 79k req/sec](/blog/elysia-13/no-validation.webp)
> Elysia 在没有验证的情况下运行

这非常重要。

之前，您必须在安全性和性能之间进行选择，但随着我们缩小了有和没有验证之间的性能差距，现在您不必再担心了。

同时，我们将验证开销从大量减少到几乎接近零，且不需要您做出任何改变。

它就像魔法一样工作。

不过，如果您希望使用 TypeBox 或完全禁用规范化，可以像设置其他配置一样通过构造函数进行设置：
```ts
import { Elysia } from 'elysia'

new Elysia({
	normalize: 'typebox' // 使用 TypeBox
})
```

您可以访问 [GitHub上的精确镜像](https://github.com/elysiajs/exact-mirror) 自行尝试基准测试。

## 系统路由器
我们从未在 Elysia 中遇到路由器的性能问题。

它的性能非常出色，我们尽可能进行了超优化。

我们将其推向了 JavaScript 在实际意义上提供的几乎极限。

### Bun 路由器
然而，Bun 1.2.3 提供了一种内置的路由解决方案（可能）采用原生代码。

尽管对于静态路由，我们没有看到太多性能提升，但我们发现**动态路由快了 2-5%**，无需任何代码更改。

从 Elysia 1.3 开始，我们提供了一种双路由器策略，通过同时使用 Bun 的原生路由器和 Elysia 的路由器。

Elysia 尽可能会尝试使用 Bun 路由器，然后回退到 Elysia 的路由器。

### 适配器
为了实现这一点，我们必须重写内部编译代码以支持自定义路由器来自**适配器**。

这意味着，现在可以与 Elysia 自身的路由器一起使用自定义路由器。

这为某些环境中的性能提升开辟了机会，例如：使用内置的 ```uWebSocket.js 路由器```，其具有路由的原生实现。

## 独立验证器
在 Elysia 中，我们可以定义一个模式并使用 `guard` 将其应用于多个路由。

然后我们可以通过在路由处理程序中提供一个模式来覆盖公共模式，这看起来像这样：

![Elysia 运行具有默认覆盖保护的模式，显示模式被覆盖](/blog/elysia-13/schema-override.webp)
> Elysia 运行具有默认覆盖保护

但有时我们**不想覆盖**一个模式。

相反，我们希望它能同时工作，让我们能够组合模式，而不是覆盖它们。

从 Elysia 1.3 开始，我们可以做到这一点。

我们现在可以告诉 Elysia 不要覆盖它，而是将其视为自己的模式，通过提供 **独立** 的模式。

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

我们对类型推断的优化充满信心，并且其速度超过了大多数使用类 express 语法的框架。

然而，我们的用户确实在处理非常**非常**大规模的系统，具有多个路由和复杂的类型推断。

我们设法在大多数情况下**将类型实例化减少了一半**，并测量到推断速度提高了 60%。

![类型实例化从 109k 减少到 52k](/blog/elysia-13/type-instatiation.webp)
> 类型实例化从 109k 减少到 52k

我们还改变了 `decorate` 的默认行为，而不是递归地循环每个对象和属性进行交叉，而是进行交集。

这应该解决使用重型对象/类（例如 `PrismaClient`）的用户的问题。

因此，我们应该能够更快地完成 IDE 自动补全、建议、类型检查和 Eden Treaty。

## 性能改进
我们重构并优化了大量内部代码，累积了显著的改进。

### 路由注册

我们重构了存储路由信息的方式，重用了对象引用，而不是克隆/创建一个新对象。

我们观察到以下改进：
- 内存使用减少了 ~5.6 倍
- 路由注册时间提高了 ~2.7 倍

![Elysia 1.2（左）和 1.3（右）之间的路由注册比较](/blog/elysia-13/routes.webp)
> Elysia 1.2（左）和 1.3（右）之间的路由注册比较

这些优化应该能够为中到大型应用程序带来实际的结果，因为它与服务器有多少路由有关。

### Sucrose
我们实现了 Sucrose 缓存，以减少不必要的重新计算，并在为非内联事件编译每个路由时重用已编译的路由。

![Elysia 1.2（左）和 1.3（右）之间的 Sucrose 性能比较](/blog/elysia-13/sucrose.webp)
> Elysia 1.2（左）和 1.3（右）之间的 Sucrose 性能比较

Sucrose 将每个事件转换为一个校验和数字并将其存储为缓存。 它使用较小的内存，并且在服务器启动后会被清理。

这个改进应该有助于每个重用全局/作用域事件的路由的启动时间。

### 实例
在创建多个实例并将它们应用为插件时，我们看到了显著的改进。

- 内存使用减少了 ~10倍
- 插件创建速度提高了 ~3倍

![Elysia 1.2（左）和 1.3（右）之间的实例比较](/blog/elysia-13/instance.webp)
> Elysia 1.2（左）和 1.3（右）之间的实例比较

这些优化将通过升级到 Elysia 1.3 自动应用。 然而，对于小应用程序，这些性能优化可能没有显著的体现。

因为作为固定成本大约 10-15MB 的简单 Bun 服务器，这些优化更多的是减少现有的开销，并帮助加快启动时间。

### 一般性能的提高
通过各种微优化、修复技术债务以及消除未使用的编译指令。

我们观察到 Elysia 请求处理速度的总体改善。在某些情况下提高了 40%。

![Elysia.handle 在 Elysia 1.2 和 1.3 之间的比较](/blog/elysia-13/handle.webp)
> Elysia.handle 在 Elysia 1.2 和 1.3 之间的比较

## 验证DX改进
我们希望 Elysia 的验证能够**顺利进行**。

您只需告诉它您想要什么，然后它就能满足您。这是Elysia最有价值的方面之一。

在这次更新中，我们改善了我们一直缺乏的一些领域。

### 编码模式

我们将 [encodeSchema](/patterns/configuration.html#encodeschema) 从 `experimental` 移出，并默认启用。

这使我们能够使用 [t.Transform](https://github.com/sinclairzx81/typebox?tab=readme-ov-file#types-transform) 应用自定义响应映射以返回给最终用户。

![使用 t.Transform 进行值拦截](/blog/elysia-13/encode-schema.webp)
> 使用 t.Transform 进行值拦截

这个示例代码将拦截响应，将“hi”替换为“intercepted”。

### 清理

为了防止 SQL 注入、XSS，确保字符串输入输出是安全的。我们引入了 [sanitize](/patterns/configuration.html#sanitize) 选项。

它接受一个函数或函数数组，以拦截每个 `t.String`，并将其转换为新值。

![使用 sanitize 和 Bun.escapeHTML](/blog/elysia-13/sanitize.webp)
> 使用 sanitize 和 Bun.escapeHTML

在这个例子中，我们使用 **Bun.escapeHTML** 并将每个“dorothy”替换为“doro”。

由于 `sanitize` 将全局应用于每个模式，它必须在根实例上应用。

这应该大大减少手动验证和转换每个字符串字段的样板代码。


### 表单
在 Elysia 的先前版本中，无法在编译时与 [form](/essential/handler.html#formdata) 和 `t.Object` 进行类型检查。

我们现在引入了一种新的 [t.Form](/patterns/type#form) 类型来解决这个问题。

![使用 t.Form 验证 FormData](/blog/elysia-13/form.webp)
> 使用 t.Form 验证 FormData

要迁移到表单类型检查，只需在响应模式中将 `t.Object` 替换为 `t.Form`。

### 文件类型
Elysia 现在使用 [file-type](https://github.com/sindresorhus/file-type) 来验证文件类型。

![使用 t.File 定义文件类型](/blog/elysia-13/file-type.webp)
> 使用 t.File 定义文件类型

一旦指定了 `type`，Elysia 将通过检查魔术数字自动检测文件类型。

然而，它也被列为**peerDependencies**，并不会随 Elysia 默认安装，以减少不需要它的用户的捆绑大小。

如果您依赖于文件类型验证以提高安全性，建议您升级到 Elysia 1.3。

### Elysia.Ref
我们可以通过使用 `Elysia.model` 创建引用模型并通过名称引用它。

然而，有时我们需要在模式内部引用它。

我们现在可以通过使用 `Elysia.Ref` 来实现，通过自动补全引用模型。

![使用 Elysia.Ref 引用模型](/blog/elysia-13/elysia-ref.webp)
> 使用 Elysia.Ref 引用模型

您还可以使用 `t.Ref` 引用模型，但不会提供自动补全。

### 不验证

我们收到一些反馈，有些用户希望快速原型化他们的 API，或有时遇到执行验证的问题。

在 Elysia 1.3 中，引入了 `t.NoValidate` 来跳过验证。

![使用 t.NoValidate 告诉 Elysia 跳过验证](/blog/elysia-13/no-validate.webp)
> 使用 t.NoValidate 告诉 Elysia 跳过验证

这将告诉 Elysia 跳过运行时验证，但仍提供 TypeScript 类型检查和 OpenAPI 模式以供 API 文档。

## 状态
我们收到了很多关于 `error` 命名的反馈。

从 Elysia 1.3 开始，我们决定弃用 `error`，并建议使用 `status` 代替。

![IDE 显示错误已弃用并重命名为状态](/blog/elysia-13/status.webp)
> IDE 显示错误已弃用并重命名为状态

`error` 函数将按照先前版本的方式工作，无需立即更改。

然而，我们建议重构为 `status`，因为我们将支持 `error` 函数至少持续 6 个月，直到大约 Elysia 1.4 或 1.5。

要迁移，只需将 `error` 重命名为 `status`。

## ".index" 从条约中删除

之前，您必须使用 `(treaty).index` 来处理以 **/** 结尾的路径。

从 Elysia 1.3 开始，我们决定放弃使用 `.index`，可以直接绕过调用方法。

![Eden Treaty 显示没有使用 .index](/blog/elysia-13/treaty-index.webp)
> Eden Treaty 显示没有使用 .index

这是一个**破坏性更改**，但应当需要最小的迁移工作。

要迁移，只需从代码库中移除 `.index`。 通过使用 IDE 搜索批量更改和替换 `.index` 的方式应该是简单的变更。

## 值得注意的更改
以下是一些来自变更日志的显著更改。

### 改进
- `encodeSchema` 现在稳定，并默认启用
- 优化类型
- 减少使用编码时的冗余类型检查
- 优化 isAsync
- 默认解开 Definition['typebox'] 以防止不必要的 UnwrapTypeModule 调用
- Elysia.form 现在可以进行类型检查
- 重构类型系统
- 重构 `_types` 到 `~Types`
- 使用 AOT 编译检查自定义 Elysia 类型，例如 Numeric
- 重构 `app.router.static`，并将静态路由代码生成移至编译阶段
- 优化 `add`、`_use` 和一些实用函数的内存使用
- 提高多个路由的启动时间
- 在编译过程中动态创建需要的 cookie 验证器
- 减少对象克隆
- 优化查找内容类型头分隔符的起始索引
- Promise 现在可以是静态响应
- `ParseError` 现在保留堆栈跟踪
- 重构 `parseQuery` 和 `parseQueryFromURL`
- 向 `mount` 添加 `config` 选项
- 异步模块挂载后自动重新编译
- 支持宏，当钩子为函数时
- 支持 ws 上的解析宏
- [#1146](https://github.com/elysiajs/elysia/pull/1146) 添加支持从处理程序返回 web API 的文件
- [#1165](https://github.com/elysiajs/elysia/pull/1165) 跳过响应模式验证中的非数字状态代码
- [#1177](https://github.com/elysiajs/elysia/issues/1177) 当抛出错误时 cookie 不会被签名

### 修复错误
- 从 `onError` 返回的 `Response` 使用八位字节流
- 使用 `mergeObjectArray` 时意外的内存分配
- 处理日期查询的空格

### 更改
- 仅在 `maybeStream` 为 true 时提供 `c.request` 映射响应
- 为 `routeTree` 使用普通对象而不是 `Map`
- 删除 `compressHistoryHook` 和 `decompressHistoryHook`
- webstandard 处理程序现在如果不在 Bun 上返回 `text/plain`
- 除非明确指定，否则为 `decorate` 使用非常量值
- `Elysia.mount` 现在默认设置 `detail.hide = true`

### 破坏性更改
- 移除 `as('plugin')`，改用 `as('scoped')`
- 移除 Eden Treaty 的根 `index`
- 从 `ElysiaAdapter` 中移除 `websocket`
- 移除 `inference.request`

## 后记

嗨？好久不见。

生活可能令人困惑，是不是？

有一天，您追逐着梦想，努力朝着它迈进。

不知不觉中，您回头一看，意识到自己已经走得比目标还远。

有人仰望着您，您成为了他们的灵感，成为了某人的榜样。

听起来很奇妙，对吧？

但我认为我不会成为其他人的好榜样。

### 我想过诚实的生活

有时，事情变得夸张。

我可能表现得像个能创造任何事的天才，但其实并非如此。我只是尽力而为。

我和朋友一起玩视频游戏，听奇怪的歌，观看电影。我甚至在动漫博览会上见到我的朋友。

就像一个普通人。

这段时间，我只是紧紧依偎在*你的*臂弯中。

**我和你一样，没什么特别的。**

我尽力而为，但时不时也会表现得像个傻瓜。

即使我没有任何我认为应该成为榜样的东西，我仍然想让你知道我很感激。

我那无聊而稍显孤独的生活，请不要美化得太过了。

<small>*~ 我很高兴你也邪恶。*</small>

</Blog>