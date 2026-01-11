---
url: 'https://elysiajs.com/patterns/typescript.md'
---

# TypeScript

Elysia 开箱即用支持 TypeScript。

大多数情况下，你无需手动添加任何 TypeScript 注解。

## 推断

Elysia 会根据你提供的 Schema 推断请求和响应的类型。

```ts twoslash
import { Elysia, t } from 'elysia'
import { z } from 'zod'

const app = new Elysia()
  	.post('/user/:id', ({ body }) => body, {
  	//                     ^?
	  	body: t.Object({
			id: t.String()
		}),
		query: z.object({
			name: z.string()
		})
   	})
```

Elysia 可以自动从诸如 TypeBox 和你喜欢的验证库（参见 [标准 Schema](/essential/validation#standard-schema)）的 Schema 中推导类型，例如：

* Zod
* Valibot
* ArkType
* Effect Schema
* Yup
* Joi

### Schema 转 Type

Elysia 支持的所有 Schema 库都可以转换成 TypeScript 类型。

\<Tab
id="quickstart"
:names="\['TypeBox', 'Zod', 'Valibot', 'ArkType']"
:tabs="\['typebox', 'zod', 'valibot', 'arktype']"
noTitle

>

```ts twoslash
import { Elysia, t } from 'elysia'

const User = t.Object({
  	id: t.String(),
  	name: t.String()
})

type User = typeof User['static']
//    ^?
```

```ts twoslash
import { z } from 'zod'

const User = z.object({
  	id: z.string(),
  	name: z.string()
})

type User = z.infer<typeof User>
//    ^?
```

```ts twoslash
import * as v from 'valibot'

const User = v.object({
  	id: v.string(),
  	name: v.string()
})

type User = v.InferOutput<typeof User>
//    ^?
```

```ts twoslash
import { type } from 'arktype'

const User = type({
  	id: 'string',
  	name: 'string'
})

type User = typeof User.infer
//    ^?
```

## 类型性能

Elysia 的设计考虑了类型推断性能。

在每次发布前，我们都会进行本地基准测试，确保类型推断快速流畅，不会让你的 IDE 报“类型实例化过深且可能无限”的错误。

大部分使用 Elysia 的时间里，你不会遇到任何类型性能问题。

不过如果遇到了，可以按照以下步骤来排查哪些部分拖慢了类型推断：

1. 进入项目根目录，运行

```
tsc --generateTrace trace --noEmit --incremental false
```

这会在项目根目录生成一个名为 `trace` 的文件夹。

2. 打开 [Perfetto UI](https://ui.perfetto.dev)，将 `trace/trace.json` 文件拖入页面。

![Perfetto](/assets/perfetto.webp)

> 界面会显示类似火焰图的内容

找到耗时较长的部分，点击查看它的推断时间、来源的文件和行号。

这样可以帮助定位类型推断的性能瓶颈。

### Eden

如果你在使用 [Eden](/eden/overview) 时遇到类型推断缓慢问题，可以尝试用 Elysia 的子应用来隔离类型推断。

```ts [backend/src/index.ts]
import { Elysia } from 'elysia'
import { plugin1, plugin2, plugin3 } from './plugin'

const app = new Elysia()
	.use([plugin1, plugin2, plugin3])
  	.listen(3000)

export type app = typeof app

// 导出子应用
export type subApp = typeof plugin1 // [!code ++]
```

在前端，你可以导入子应用而非整个应用。

```ts [frontend/src/index.ts]
import { treaty } from '@elysiajs/eden'
import type { subApp } from 'backend/src'

const api = treaty<subApp>('localhost:3000') // [!code ++]
```

这能让类型推断更快，因为不必推断整个应用。

详见 [Eden Treaty](/eden/overview) 了解更多关于 Eden 的内容。
