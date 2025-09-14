---
title: Elysia 1.4 - 超对称
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.4 - 超对称

    - - meta
      - name: 'description'
        content: 支持标准验证器。带有 schema、扩展和 OpenAPI 细节的宏。生命周期类型健全性。提升类型推断性能 10%。

    - - meta
      - property: 'og:description'
        content: 支持标准验证器。带有 schema、扩展和 OpenAPI 细节的宏。生命周期类型健全性。提升类型推断性能 10%。

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

Elysia 1.4 的重点是标准 Schema 和 **“类型健全性”**。

- [标准 Schema](#standard-schema)
- [宏](#macro)
- [生命周期类型健全性](#lifecycle-type-soundness)
- [分组独立 Schema](#group-standalone-schema)

## 标准 Schema
三年来，Elysia 一直使用 TypeBox 作为唯一的验证器，这也是 Elysia 备受喜爱的特性之一，因其性能优异且支持类型推断。

但从很早开始，社区中最常被请求的功能之一就是支持除 TypeBox 以外的更多验证器（参见 [elysia#20](https://github.com/elysiajs/elysia/issues/20)）。

由于 Elysia 与 TypeBox 关系密切，单独为每个验证器添加支持需要付出大量努力，且维护起来也很繁重。

幸运的是，现在有一个名为 [Standard Schema](https://github.com/standard-schema/standard-schema) 的新提案，用以定义一种标准方式以相同 API 使用不同的 Schema，使我们能在无需为每个验证器编写定制集成的情况下支持多个验证器。

Elysia 现已支持标准 Schema，允许你使用你喜欢的验证器，比如：
- Zod
- Valibot
- Effect Schema
- ArkType
- Joi
- 以及更多！

你可以提供类似 TypeBox 的 Schema，开箱即用：
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

你可以在同一路由中使用多个验证器，它们会无缝协作，并且类型推断也会正确。

### OpenAPI
有需求希望支持标准 Schema 的 JSON Schema 以生成 OpenAPI，但目前尚未实现。

不过我们提供了自定义的 `mapJsonSchema` 给 `openapi`，允许你提供一个自定义函数将 Schema 映射为 JSON Schema，作为权宜之计。

这让你能用自己喜欢的验证器生成精美的 OpenAPI 文档。

![Zod 支持 OpenAPI](/blog/elysia-14/openapi-zod.webp)
> 使用 Zod 原生 OpenAPI Schema 支持，配合 **describe** 添加 Schema 描述

若你的验证器不支持 JSON Schema，我们提供了独特的 [OpenAPI 类型生成](/blog/openapi-type-gen.html)，直接从验证器的 TypeScript 类型生成 OpenAPI Schema。

这意味着 Elysia 可以支持所有实现标准 Schema 的验证器的 OpenAPI 生成，即便它们不直接支持 JSON Schema。

![Valibot 支持 OpenAPI](/blog/elysia-14/openapi-valibot.webp)
> Valibot 不直接支持 JSON Schema，但我们用 OpenAPI 类型生成来处理

不仅输入类型正确，OpenAPI 类型生成还能生成所有可能的输出类型，包括错误响应。

这是 Elysia 独有的功能，我们为此感到自豪。

### 独立验证器
你也可以使用多个 Schema 来验证单个输入，使用独立验证器：

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
//          ^?



      	{
         	body: v.object({
		 		name: v.literal('lilith')
		 	})
      	})
```
> 该示例使用了 Zod 和 Valibot 来验证请求体体，允许你在代码库中同时使用不同验证器已有的 Schema。

这种方式让各验证器分别解析输入的不同部分，然后将每个结果快照合并，确保类型完整性。

![使用多个验证器验证请求体的不同部分](/blog/elysia-14/standard-schema.webp)
> 使用 TypeBox、Zod、Valibot、Joi、Yup、ArkType、Effect Schema、TypeMap、Rescript Schema 来验证请求体的不同部分

我们同时测试了 8 个验证器，对输入的各部分进行验证，效果完美无瑕。

我们很自豪能开箱即用地支持标准 Schema，这对 Elysia 来说是跳脱单一验证器的大步前进，期待看到你用它构建出怎样的作品。

## 宏
宏是 Elysia 中最强大且灵活的特性之一。

它允许你定义自定义属性，修改和扩展 Elysia 的功能，打造你喜爱的 “子框架”。

宏的多样性非常惊人，能轻松实现其他框架难以实现的功能。

在 Elysia 1.4 中，我们带来了多项改进，使宏更加强大。

### 宏 Schema
现在你可以为宏定义 Schema，直接在宏中定义自定义验证。

![带有 schema 的宏](/blog/elysia-14/macro-schema.webp)
> 带有 schema 支持的宏

带有 Schema 的宏会自动验证并推断类型，确保类型安全，还能与现有的 Schema 并存。

你也可以叠加来自不同宏或甚至标准验证器的多个 Schema，协同运作无阻。

宏 Schema 还支持 **同一宏内的生命周期类型推断**，**不过** 由于 TypeScript 限制，仅限命名的单一宏。

![带扩展的宏](/blog/elysia-14/macro-schema-lifecycle.webp)
> 使用命名的单一宏，在宏内部推断生命周期的类型

若要在同一宏内使用生命周期类型推断，可能需要使用命名的单一宏，而非多个叠加宏。

> 不要将此与使用宏 Schema 去推断路由的生命周期事件混淆，后者不受此限制，能够正常工作。

### 宏扩展
现在你可以扩展已有宏，在原有基础上构建更多功能。

![带扩展的宏](/blog/elysia-14/macro-extension.webp)
> 支持扩展的宏

这让你能在已有宏上追加功能。

扩展支持递归且自动去重，能无碍地扩展已扩展其他宏的宏。

不过如果不慎造成循环依赖，Elysia 在运行时和类型推断时均设置了栈深度上限为 16，以防无限循环。

### 宏细节
你现在可以为宏定义 OpenAPI 细节，直接从宏中为 OpenAPI 文档添加更多内容。

若路由已有 OpenAPI 细节，则会合并两者，但优先采用路由的细节覆盖宏的。

## 生命周期类型健全性
自引入从类型直接生成 OpenAPI Schema 的 [OpenAPI 类型生成](/blog/openapi-type-gen) 后，我们发现为每个生命周期事件实现类型健全性十分有意义。

这样我们能准确记录每个生命周期事件的返回类型，宏也能详尽反映单一路由可能返回的所有情况。

为此，我们重构了超过 3,000 行纯类型代码，包含响应状态类型调和、为所有生命周期 API 编写类型级单元测试以确保类型完整性、进行大量类型性能优化，确保类型推断速度不降。

所有这些复杂工作让我们能够详尽记录单一路由可能的全部返回情况。

![类型健全性](/blog/elysia-14/type-soundness.webp)
> 记录单一路由可能返回的全部情况


这不仅提升了开发者体验，还通过确保 API 文档和 Eden Treaty 客户端均覆盖所有可能性，提高代码库的可靠性。

> 类型健全性涵盖所有生命周期事件和宏，确保你拥有完整的 API 文档。唯一例外是内联生命周期事件，因性能较差未覆盖。

我们还成功提升了约 9-11% 的类型推断性能，尽管类型复杂度大幅提升，类型实例化却降低了 11.5%。

![类型推断](/blog/elysia-14/type-inference.webp)
> 根据内部基准测试，类型实例化减少了 11.57%

## 分组独立 Schema
之前，带 schema 的 `group` 会采用覆盖策略，也就是说如果在 `group` 中定义了 Schema，会覆盖路由已有的 Schema。

想定义新的 Schema 时，必须手动包含已有 Schema，体验不佳且易出错。

从 1.4 起，带 Schema 的 `group` 采用独立策略，即在 `group` 中定义的 Schema 不会覆盖，而是与路由 Schema 共存。

![分组独立](/blog/elysia-14/group-standalone.webp)
> 带 Schema 的 `group` 会与路由 Schema 共存

这允许你在 `group` 中定义新的 Schema，无需手动包含已有 Schema。

## 重要变更
我们在 1.3.9 中关闭了约 300 个问题，1.4 版本中几乎没有什么较大的 bug 修复，已解决已知大部分问题。

### 改进
- [#861](https://github.com/elysiajs/elysia/issues/861) 定义 GET 路由时自动添加 HEAD 方法
- [#1389](https://github.com/elysiajs/elysia/pull/1389) 参考模型中新增 NoValidate 功能

### 变更
- 出于安全考虑，ObjectString/ArrayString 默认不再生成默认值
- Cookie 在格式可能为 JSON 时动态解析
- 导出 `fileType` 用于外部文件类型验证，确保响应准确
- （重复变更）ObjectString/ArrayString 默认不再生成默认值出于安全考虑
-（重复变更）Cookie 在格式可能为 JSON 时动态解析

### 破坏性变更
- 移除不具备类型健全性的宏 v1
- 移除 `error` 函数，改用 `status`
- 弃用 `mapResponse`、`afterResponse` 中的 `response`，改用 `responseValue`

## 后记

这是我们第一次在发布说明封面中以主角身份推出吉祥物 Elysia 酱！这将成为后续发布说明的传统！

我们的封面艺术呼应了《Supersymmetry》音乐封面主题，其中 ElysiaJS 酱与 Weirs 以相似姿势镜像。

![Elysia 酱镜像 Supersymmetry](/blog/elysia-14/elysia-supersymmetry.webp)
> Elysia 酱镜像 Supersymmetry 封面中 Weirs 的同样姿势 [(pixiv)](https://www.pixiv.net/en/artworks/134997229)

她是不是很可爱？我非常喜欢她的形象！我个人努力提升绘画技巧，只为能画出她，希望你喜欢！

总之，祝你喜欢本次发布！我们期待看到你用它创造的精彩作品！

祝你有美好的一天！

> 我倾尽全力
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
> 这人生的游戏是我们的 “riverrun”，
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