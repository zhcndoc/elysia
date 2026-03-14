---
title: 错误处理 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 错误处理 - ElysiaJS

    - - meta
      - name: 'description'
        content: '学习如何有效处理 ElysiaJS 应用中的错误。本指南涵盖错误处理的最佳实践，包括自定义错误类和中间件集成。'

    - - meta
      - property: 'og:description'
        content: '学习如何有效处理 ElysiaJS 应用中的错误。本指南涵盖错误处理的最佳实践，包括自定义错误类和中间件集成。'
---

<script setup>
import { Elysia, t, ValidationError, validationDetail } from 'elysia'
import TutorialBadge from '../components/arona/badge.vue'

import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
import Playground from '../components/nearl/playground.vue'
import DocLink from '../components/xiao/doc-link/doc-link.vue'

const demo = new Elysia()
	.onError(({ code }) => {
		if (code === 418) return 'caught'
	})
    .get('/throw', ({ error }) => {
		// This will be caught by onError
		throw error(418)
	})
	.get('/return', ({ status }) => {
		// This will not be caught by onError
		return status(418)
	})

const demo2 = new Elysia()
    .get('/string', () => {
        throw new ValidationError(
            'params',
            t.Object({
                id: t.Numeric({
                error: 'id 必须是数字'
                })
            }),
            {
                id: 'string'
            }
        )
    })
	.get('/1', () => 1)

const demo3 = new Elysia()
    .get('/string', () => {
        throw new ValidationError(
            'params',
            t.Object({
                id: t.Numeric({
                error: validationDetail('id 必须是数字')
                })
            }),
            {
                id: 'string'
            }
        )
    })
</script>

# 错误处理 <TutorialBadge href="/tutorial/patterns/error-handling" />

This page provides a more advanced guide for effectively handling errors with Elysia.

如果你还没有阅读 **“生命周期 (onError)”**，建议先阅读它。

<Deck>
	<Card
		title="生命周期 (onError)"
		href="/essential/life-cycle.html#on-error-error-handling"
	>
		Elysia 中处理错误的生命周期。
	</Card>
</Deck>

## 自定义验证消息

在定义模式时，可以为每个字段提供自定义验证消息。

当验证失败时，该消息将原样返回。

```ts
import { Elysia } from 'elysia'

new Elysia().get('/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Number({
            error: 'id 必须是数字' // [!code ++]
        })
    })
})
```

If the validation fails on the `id` field, the response will be returned as `id must be a number`.

<Playground
	:elysia="demo2"
/>

### 验证详情 <TutorialBadge href="/tutorial/patterns/validation-error" />

Returning a value from `schema.error` will return the validation as-is, but sometimes you may also want to return the validation details, such as the field name and the expected type

你可以通过使用 `validationDetail` 来实现这一点。

```ts
import { Elysia, validationDetail } from 'elysia' // [!code ++]

new Elysia().get('/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Number({
            error: validationDetail('id 必须是数字') // [!code ++]
        })
    })
})
```

这将在响应中包含所有验证详情，比如字段名和期望类型。

<Playground
	:elysia="demo3"
/>

But if you plan to use `validationDetail` in every field, adding it manually can be annoying.

你可以在 `onError` 钩子中自动处理验证详情。

```ts
new Elysia()
    .onError(({ error, code }) => {
        if (code === 'VALIDATION') return error.detail(error.message) // [!code ++]
    })
    .get('/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number({
                error: 'id 必须是数字'
            })
        })
    })
    .listen(3000)
```

这将为每个带有自定义消息的验证错误添加自定义验证详情。

## 生产环境中的验证详情

By default, Elysia will omit all validation detail if `NODE_ENV` is `production`.

这样做是为了防止泄露验证模式的敏感信息，比如字段名和期望类型，这可能被攻击者利用。

Elysia 只会返回验证失败的信息，而不包含任何详情。

```json
{
    "type": "validation",
    "on": "body",
    "found": {},
    // 仅对自定义错误显示
    "message": "x 必须是数字"
}
```

`message` 属性是可选的，默认省略，除非你在模式中提供了自定义错误消息。

可以通过将 `Elysia.allowUnsafeValidationDetails` 设置为 `true` 来覆盖此设置，更多详情请参见 [Elysia 配置](/patterns/configuration#allow-unsafe-validation-details)。

## 自定义错误

Elysia supports custom errors both in the type-level and implementation level.

By default, Elysia has a set of built-in error types like `VALIDATION`, `NOT_FOUND` which will narrow down the type automatically.

如果 Elysia 不认识该错误，错误代码将是 `UNKNOWN`，默认状态码为 `500`。

但你也可以通过 `Elysia.error` 添加带类型安全的自定义错误，它能帮助缩小错误类型，提供完整类型安全和自动补全，并支持自定义状态码，如下所示：

```typescript twoslash
import { Elysia } from 'elysia'

class MyError extends Error {
    constructor(public message: string) {
        super(message)
    }
}

new Elysia()
    .error({
        MyError
    })
    .onError(({ code, error }) => {
        switch (code) {
            // 自动补全
            case 'MyError':
                // 类型缩小
                // 悬停查看 error 的类型为 `CustomError`
                return error
        }
    })
    .get('/:id', () => {
        throw new MyError('Hello Error')
    })
```

### 自定义状态码

你也可以通过在自定义错误类中添加 `status` 属性，为你的自定义错误指定状态码。

```typescript
import { Elysia } from 'elysia'

class MyError extends Error {
    status = 418

    constructor(public message: string) {
        super(message)
    }
}
```

当抛出该错误时，Elysia 会使用此状态码。

否则你也可以在 `onError` 钩子中手动设置状态码。

```typescript
import { Elysia } from 'elysia'

class MyError extends Error {
	constructor(public message: string) {
		super(message)
	}
}

new Elysia()
	.error({
		MyError
	})
	.onError(({ code, error, status }) => {
		switch (code) {
			case 'MyError':
				return status(418, error.message)
		}
	})
	.get('/:id', () => {
		throw new MyError('Hello Error')
	})
```

### 自定义错误响应

你也可以在自定义错误类中提供一个自定义的 `toResponse` 方法，当错误被抛出时返回自定义响应。

```typescript
import { Elysia } from 'elysia'

class MyError extends Error {
	status = 418

	constructor(public message: string) {
		super(message)
	}

	toResponse() {
		return Response.json({
			error: this.message,
			code: this.status
		}, {
			status: 418
		})
	}
}
```

## 抛出或返回

Most error handling in Elysia can be done by throwing an error and will be handled in `onError`.

但 `status` 可能会让人困惑，因为它既可以作为返回值也可以抛出错误。

根据你的具体需求，它可以是 **返回** 或 **抛出** 。

- 如果 `status` 被 **抛出**，会被 `onError` 中间件捕获。
- 如果 `status` 被 **返回**，不会被 `onError` 中间件捕获。

请看以下代码：

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
    .onError(({ code, error, path }) => {
        if (code === 418) return 'caught'
    })
    .get('/throw', ({ status }) => {
        // This will be caught by onError
        throw status(418)
    })
    .get('/return', ({ status }) => {
        // This will not be caught by onError
        return status(418)
    })
```

这里我们使用了 `status(418)`，也就是 “I'm a teapot”（我是茶壶）状态码。你也可以直接使用字符串名称：`status("I'm a teapot")`。更多关于状态码的使用，请参见 <DocLink href="/tutorial/getting-started/status-and-headers#status">状态码</DocLink>。

<Playground
    :elysia="demo"
/>