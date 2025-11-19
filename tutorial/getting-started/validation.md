---
url: 'https://elysiajs.com/tutorial/getting-started/validation.md'
---

# 验证

Elysia 提供开箱即用的数据验证。

你可以使用 `Elysia.t` 来定义一个模式。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.post(
		'/user',
		({ body: { name } }) => `你好 ${name}!`,
		{
			body: t.Object({
				name: t.String(),
				age: t.Number()
			})
		}
	)
	.listen(3000)
```

当你定义模式时，Elysia 会确保数据的形状是正确的。

如果数据不符合模式，Elysia 会返回 **422 无法处理的实体** 错误。

请参见 验证。

### 自带模式

或者，Elysia 支持 **标准模式**，允许您使用自己选择的库，如 **zod**、**yup** 或 **valibot**。

```typescript
import { Elysia } from 'elysia'
import { z } from 'zod'

new Elysia()
	.post(
		'/user',
		({ body: { name } }) => `你好 ${name}!`,
		{
			body: z.object({
				name: z.string(),
				age: z.number()
			})
		}
	)
	.listen(3000)
```

请参见 标准模式 以获取所有兼容模式。

## 验证类型

您可以验证以下属性：

* `body`
* `query`
* `params`
* `headers`
* `cookie`
* `response`

一旦定义了模式，Elysia 会为您推断类型，因此您无需在 TypeScript 中定义单独的模式。

请参见 模式类型 以了解每种类型。

## 响应验证

当您为 `response` 定义验证模式时，Elysia 会在将响应发送给客户端之前验证响应，并为您进行类型检查。

您还可以指定要验证的状态码：

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get(
		'/user',
		() => `你好 Elysia!`,
		{
			response: {
				200: t.Literal('你好 Elysia!'),
				418: t.Object({
					message: t.Literal("我是一壶茶")
				})
			}
		}
	)
	.listen(3000)
```

请参见 响应验证。

## 练习

让我们练习一下我们所学的内容。

\<template #answer>

我们可以通过使用 `t.Object` 来定义一个模式，提供给 `body` 属性。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ status, set }) => {
		set.headers['x-powered-by'] = 'Elysia'

		return status(418, '你好 Elysia!')
	})
	.get('/docs', ({ redirect }) => redirect('https://elysiajs.com'))
	.listen(3000)
```
