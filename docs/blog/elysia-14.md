---
title: Elysia 1.4 - 超对称
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.4 - 超对称

    - - meta
      - name: 'description'
        content: 支持标准 Schema。带有 schema、扩展和 OpenAPI 详情的宏。生命周期类型健全性。提升类型推断性能 10%。

    - - meta
      - property: 'og:description'
        content: 支持标准 Schema。带有 schema、扩展和 OpenAPI 详情的宏。生命周期类型健全性。提升类型推断性能 10%。

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-14/elysia-14.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-14/elysia-14.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.4 - 超对称"
    src="/blog/elysia-14/elysia-14.webp"
    alt="'Elysia 1.4' 标题，左侧写有“超对称”，右侧是 ElysiaJS 酱。"
    author="saltyaom"
    date="2025年9月13日"
    shadow
>

本版本以 Sta 的歌曲 [Supersymmetry](https://youtu.be/NYyjQjtbteA)（Tone Sphere 的结尾主题曲）命名。

Elysia 1.4 的亮点是引入了标准 Schema 和 **“类型健全性”**。

- [标准 Schema](#standard-schema)
- [宏](#macro)
- [生命周期类型健全性](#lifecycle-type-soundness)
- [分组独立 Schema](#group-standalone-schema)

## 标准 Schema

过去三年，Elysia 一直使用 TypeBox 作为唯一的验证器。凭借其性能和类型推断，这成为 Elysia 最受喜爱的功能之一。

然而，从一开始 ([elysia#20](https://github.com/elysiajs/elysia/issues/20)) 社区就非常希望支持除 TypeBox 以外的验证器。

由于 Elysia 深度绑定于 TypeBox，为每个验证器单独添加支持需要大量工作和持续维护以适应变化。

幸运的是，一个名为 [Standard Schema](https://github.com/standard-schema/standard-schema) 的新提案定义了一种使用统一 API 支持不同 Schema 的标准方式。这使得我们无需为每个验证器编写定制集成就能支持多种验证器。

Elysia 现在支持标准 Schema，允许你使用你喜欢的验证器，例如：

- Zod
- Valibot
- Effect Schema
- ArkType
- Joi
- 以及更多！

你可以以类似 TypeBox 的方式提供 schema ，它即可开箱即用：

```ts twoslash
import { Elysia, t } from 'elysia'
import { z } from 'zod'
import * as v from 'valibot'

const app = new Elysia()
  	.post(
   		'/user/:id',
     	({ body, params }) => {
      		body
      		// ^?




         	params
      		// ^?


     	},
      	{
       		params: z.object({
         		id: z.coerce.number()
         	}),
         	body: v.object({
		 		name: v.literal('lilith')
		 	})
      	})
```

你可以在单个路由中使用多个验证器，它们会无缝协同工作并且类型推断正确。

### OpenAPI

社区请求支持通过标准 Schema 生成 OpenAPI 的 JSON Schema，但尚未实现。

不过我们提供了自定义的 `mapJsonSchema` 给 `openapi`，允许你提供一个自定义函数将 Schema 映射为 JSON Schema，作为权宜之计。

这让你能够用喜欢的验证器生成漂亮的 OpenAPI 文档。

![Zod with OpenAPI support](/blog/elysia-14/openapi-zod.webp)
> 利用 Zod 的原生 OpenAPI schema 支持，通过 **describe** 添加描述信息

如果你的验证器不支持 JSON Schema，我们提供了 [OpenAPI 类型生成](/blog/openapi-type-gen.html)，可以直接从验证器的 TypeScript 类型生成 OpenAPI schema。

这意味着 Elysia 支持所有符合标准 Schema 的验证器的 OpenAPI 生成，即使它们不直接支持 JSON Schema。

![Valibot with OpenAPI support](/blog/elysia-14/openapi-valibot.webp)
> Valibot 不直接支持 JSON Schema，但我们使用 OpenAPI 类型生成来支持

不仅能生成正确的输入类型，OpenAPI 类型生成还会生成所有可能的输出类型，包括错误响应。

这确实是 Elysia 的独特功能，我们非常自豪地提供这一点。

### 独立验证器

你还可以使用多个 schema 共同验证单个输入，使用独立验证器：

```ts twoslash
import { Elysia, t } from 'elysia'
import { z } from 'zod'
import * as v from 'valibot'

const app = new Elysia()
	.guard({
		schema: 'standalone',
		body: z.object({
			id: z.coerce.number()
		})
	})
	.post(
		'/user/:id',
		({ body }) => body,
		//  ^?




		{
			body: v.object({
				name: v.literal('lilith')
			})
		}
	)
```
> 这个示例同时用了 Zod 和 Valibot 来验证请求体，允许你混用代码库中不同验证器的现有 schema。

它的工作原理是用各个验证器验证输入的不同部分，然后将每个结果存为快照并合并，形成单一输出，保证类型完整性。

![Using multiple validators to validate part of a body](/blog/elysia-14/standard-schema.webp)
> 同时使用 TypeBox、Zod、Valibot、Joi、Yup、ArkType、Effect Schema、TypeMap 和 ReScript Schema 验证请求体不同部分

我们同时测试了 8 个验证器对输入的不同部分进行验证，效果完美无误。

我们很自豪开箱支持标准 Schema。这是 Elysia 破解单一验证器束缚的重要一步，期待你用它构建出精彩作品。

## 宏

宏是 Elysia 最强大且灵活的功能之一。

它允许你定义自定义属性，修改和扩展 Elysia 的功能，使你能打造属于自己的“子框架”。

宏的多功能性令人惊叹，它能让你轻松做出其他框架几乎无法实现的事情。

在 Elysia 1.4 中，我们带来若干改进，让宏变得更强大。

### 宏 Schema

你现在可以为宏定义 schema，允许你直接从宏中添加自定义验证。

![带有 schema 的宏](/blog/elysia-14/macro-schema.webp)
> 带有 schema 支持的宏

带 schema 的宏会自动进行验证并推断类型，保证类型安全，同时可以和现有 schema 共存。

你还可以叠加来自不同宏，甚至标准 Schema 的多重 schema，它们能无缝配合。

宏 schema 也支持在同一宏内推断 **生命周期的类型**，**但由于 TypeScript 限制，仅限于具名的单一宏**。

![带扩展的宏](/blog/elysia-14/macro-schema-lifecycle.webp)
> 使用具名单一宏，在宏内部推断生命周期类型

如果要在同一宏内使用生命周期类型推断，请使用具名单一宏而非多个叠加宏。

> 这不影响从宏 schema 推断类型到路由生命周期事件，这种用法完全支持——该限制只针对同一宏内的生命周期。

### 宏扩展

你现在可以扩展已有宏，基于现有功能构建。

![带扩展的宏](/blog/elysia-14/macro-extension.webp)
> 支持扩展的宏

这允许你在已有宏基础上添加更多功能。

扩展支持递归且自动去重，你可以扩展已扩展其他宏的宏，无需担心冲突。

不过若不慎形成循环依赖，Elysia 在运行时和类型推断时都有最大调用栈深度 16 的限制，防止无限循环。

### 宏细节

你可以为宏定义 OpenAPI 细节，直接从宏中为 OpenAPI 文档增加更多信息。

若路由已有 OpenAPI 细节，则两者合并，但路由细节优先覆盖宏的。

## 生命周期类型健全性

自从引入了 [OpenAPI 类型生成](/blog/openapi-type-gen)，能直接从类型生成 OpenAPI schema 后，我们意识到为每个生命周期事件实现类型健全性非常重要。

这样，我们就能精确地记录每个生命周期事件和宏的返回类型，完整呈现单一路由所有可能的返回结果。

通过重构了 3,000+ 行纯类型代码，统一响应状态类型，添加了所有生命周期 API 的类型层单元测试确保类型一致性，并优化性能，我们保证了类型推断不会变慢。

这些复杂的成就让我们能够记录单一路由所有可能的返回。

![Type Soundness](/blog/elysia-14/type-soundness.webp)
> 记录单一路由所有可能的返回

这不仅改善了开发者体验，也提升了代码库的可靠性，确保 API 文档和客户端中涵盖所有可能情况，结合 Eden Treaty 功能完美配合。

> 类型健全覆盖所有生命周期和宏，实现完全的 API 文档，唯一例外是出于性能考虑的行内生命周期事件。

我们还把类型推断性能提升了约 9-11%，类型实例化减少了 11.5%，尽管类型复杂度大幅提升。

![Type inference](/blog/elysia-14/type-inference.webp)
> 类型实例化减少 11.57%，基于我们的内部基准测试

## 分组独立 Schema

之前，`group` 搭配 schema 时采用覆盖策略，意味着你在 `group` 定义的 schema 会覆盖路由已有 schema。

如果你想定义新 schema，就得手动包含已有 schema，体验不便且易错。

从 1.4 起，`group` 搭配 schema 改用独立策略，定义的新 schema 不再覆盖，而是与路由 schema 并存。

![group standalone](/blog/elysia-14/group-standalone.webp)
> `group` 搭配 schema 和路由 schema 并存

这样你就可以在 `group` 中定义新 schema，而无须手动包含已有 schema。

## 重要变更

在 1.3.9 关闭了约 300 个 issue，1.4 中无太多 bug 修复——大多数已处理。

### 改进

- [#861](https://github.com/elysiajs/elysia/issues/861) 定义 GET 路由时自动添加 HEAD 方法
- [#1389](https://github.com/elysiajs/elysia/pull/1389) 参考模型支持 NoValidate

### 变更

- 出于安全原因 ObjectString/ArrayString 不再生成默认值
- Cookie 现在在格式很可能是 JSON 时动态解析
- 导出 `fileType` 用于外部文件类型验证以精确响应

### 破坏性变更

- 移除宏 v1，因缺乏类型健全性
- 移除 `error` 函数；改用 `status`
- `mapResponse` 和 `afterResponse` 中 `response` 参数弃用，改用 `responseValue`

## 后记

这是我们首次将吉祥物 Elysia 酱作为发布说明封面！未来发布说明也会延续这一传统！

封面画作呼应了 Supersymmetry（音乐）封面，ElysiaJS 酱模仿 Weirs 做相似姿势。

![Elysia chan mirroring Supersymmetry](/blog/elysia-14/elysia-supersymmetry.webp)
> Elysia 酱模仿 Supersymmetry 封面中 Weirs 的同一姿势 [(pixiv)](https://www.pixiv.net/en/artworks/134997229)

她是不是超可爱？我个人很喜欢画她！为了能画好她，我也努力提升了绘画技艺。希望你也喜欢！

总之，希望你喜欢这次更新！期待看到你用它打造出更多精彩作品！

祝你有美好的一天！

> 我全都拥有
>
> 在这个微小的微型宇宙里
>
> 你那苦乐参半的心意点滴
>
> 我全都深爱
>
> <br />
>
> 你知道
>
> 这人生的游戏是我们的“riverrun”，
>
> 你是这段旅途中的幸运好友
>
> <br />
>
> 时间所剩无几
>
> 天空渐渐暗淡
>
> 星辰游行
>
> 是时候改变我们的命运
>

</Blog>