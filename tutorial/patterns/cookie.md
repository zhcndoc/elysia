---
url: 'https://elysiajs.com/tutorial/patterns/cookie.md'
---

# Cookie

您可以通过上下文中的 cookie 与 cookie 进行交互。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		const total = +visit.value ?? 0
		visit.value++

		return `您已访问 ${visit.value} 次`
	})
	.listen(3000)
```

Cookie 是一个响应式对象。一旦被修改，响应将会反映出这个变化。

## 值

当提供了类型注释时，Elysia 会尝试将其强制转换为相应的值。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		visit.value ??= 0
		visit.value.total++

		return `您已访问 ${visit.value.total} 次`
	}, {
		cookie: t.Object({
			visit: t.Optional(
				t.Object({
					total: t.Number()
				})
			)
		})
	})
	.listen(3000)
```

我们可以使用 cookie schema 来验证和解析 cookie。

## 属性

我们可以通过其属性名称获取或设置 cookie 属性。

否则，使用 `.set()` 批量设置属性。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		visit.value ??= 0
		visit.value++

		visit.httpOnly = true
		visit.path = '/'

		visit.set({
			sameSite: 'lax',
			secure: true,
			maxAge: 60 * 60 * 24 * 7
		})

		return `您已访问 ${visit.value} 次`
	})
	.listen(3000)
```

请查看 Cookie 属性。

## 移除

我们可以通过调用 `.remove()` 方法来移除 cookie。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		visit.remove()

		return `Cookie 已移除`
	})
	.listen(3000)
```

## Cookie 签名

Elysia 可以对 cookie 进行签名以防止篡改：

1. 向 Elysia 构造函数提供 cookie 秘密。
2. 使用 `t.Cookie` 为每个 cookie 提供秘密。

```typescript
import { Elysia } from 'elysia'

new Elysia({
	cookie: {
		secret: 'Fischl von Luftschloss Narfidort',
	}
})
	.get('/', ({ cookie: { visit } }) => {
		visit.value ??= 0
		visit.value++

		return `您已访问 ${visit.value} 次`
	}, {
		cookie: t.Cookie({
			visit: t.Optional(t.Number())
        }, {
            secrets: 'Fischl von Luftschloss Narfidort',
            sign: ['visit']
        })
	})
	.listen(3000)
```

如果提供了多个秘密，Elysia 将使用第一个秘密对 cookie 进行签名，并尝试用其余的秘密进行验证。

请参见 Cookie 签名，Cookie 轮换。

## 任务

让我们创建一个简单的计数器，用于跟踪您访问网站的次数。

\<template #answer>

1. 我们可以通过修改 `visit.value` 来更新 cookie 值。
2. 我们可以设置 **HTTP 只读** 属性，通过设置 `visit.httpOnly = true`。

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		visit.value ??= 0
		visit.value++

		visit.httpOnly = true

		return `您已访问 ${visit.value} 次`
	}, {
		cookie: t.Object({
			visit: t.Optional(
				t.Number()
			)
		})
	})
	.listen(3000)
```
