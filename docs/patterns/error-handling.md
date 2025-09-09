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

import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
import Playground from '../components/nearl/playground.vue'

const demo = new Elysia()
	.onError(({ code }) => {
		if (code === 418) return 'caught'
	})
    .get('/throw', ({ error }) => {
		// 这会被 onError 捕获
		throw error(418)
	})
	.get('/return', ({ status }) => {
		// 这不会被 onError 捕获
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

# 错误处理

本页提供了一个更高级的指南，用于在 Elysia 中有效处理错误。

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

如果 `id` 字段验证失败，响应将返回 `id 必须是数字`。

<Playground
	:elysia="demo2"
/>

### 验证详情

从 `schema.error` 返回一个值将原样返回验证消息，但有时你也希望返回验证细节，比如字段名和期望类型。

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

但是如果你计划在每个字段都使用 `validationDetail`，手动添加会很麻烦。

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

默认情况下，如果 `NODE_ENV` 是 `production`，Elysia 会省略所有验证详情。

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

## 自定义错误

Elysia 支持类型层级和实现层级的自定义错误。

默认情况下，Elysia 有一组内置错误类型，如 `VALIDATION`、`NOT_FOUND`，会自动缩小类型。

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

大多数错误处理可以通过抛出错误并在 `onError` 中处理完成。

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
        // 这会被 onError 捕获
        throw status(418)
    })
    .get('/return', ({ status }) => {
        // 这不会被 onError 捕获
        return status(418)
    })
```

<Playground
    :elysia="demo"
/>