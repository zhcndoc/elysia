---
title: Elysia 中文文档
titleTemplate: ':title - 符合人体工程学的 Web 框架'
layout: page
sidebar: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 中文文档 - 符合人体工程学的 Web 框架

    - - meta
      - name: 'description'
        content: Elysia 是一个针对人类的人体工程学框架。提供端到端的类型安全和良好的开发者体验。Elysia 具有熟悉、快速的一流 TypeScript 支持，并且在服务之间实现了良好的集成，无论是 tRPC、Swagger 还是 WebSocket。Elysia 全面覆盖，今天就开始构建下一代 TypeScript 网络服务器吧。

    - - meta
      - property: 'og:description'
        content: Elysia 是一个针对人类的人体工程学框架。提供端到端的类型安全和良好的开发者体验。Elysia 具有熟悉、快速的一流 TypeScript 支持，并且在服务之间实现了良好的集成，无论是 tRPC、Swagger 还是 WebSocket。Elysia 全面覆盖，今天就开始构建下一代 TypeScript 网络服务器吧。
---

<script setup>
    import Fern from './components/fern/fern.vue'
</script>

<Fern>

<template v-slot:type-1>

```typescript twoslash
// @noErrors
import { Elysia } from 'elysia'

new Elysia()
	.get('/id/:id', ({ params, set }) => {
	                   // ^?




		set.headers.a
		//           ^|


		return 'Su'
	})

	.get('/optional/:name?', ({ params: { name } }) => {
	                                   // ^?
        return name ?? 'Pardofelis'
	})
	.listen(3000)
```

</template>

<template v-slot:type-2>

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.patch('/profile', ({ body }) => body.profile, {
	                    // ^?




		body: t.Object({
			id: t.Number(),
			profile: t.File({ type: 'image' })
		})
	})
	.listen(3000)
```

</template>

<template v-slot:type-3>

```typescript twoslash
// @errors: 2345
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/profile', ({ status }) => {
		if(Math.random() > .5)
			return status(418, 'Mika')

		return 'ok'
	}, {
		response: {
			200: t.Literal('ok'),
			418: t.Literal('Nagisa')
		}
	})
	.listen(3000)
```

</template>

<template v-slot:type-4>

```typescript twoslash
// @noErrors
import { Elysia, t } from 'elysia'

const role = new Elysia({ name: 'macro' })
	.macro(({ onBeforeHandle }) => ({
		role(type: 'user' | 'staff' | 'admin') {
			onBeforeHandle(({ headers, status }) => {
				if(headers.authorization !== type)
					return status(401)
			})
		}
	}))

new Elysia()
	.use(role)
	.get('/admin/check', 'ok', {
        r
      // ^|
	})
	.listen(3000)
```

</template>

<template v-slot:easy>

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
	.get('/', 'Hello World')
	.get('/image', file('mika.webp'))
	.get('/stream', function* () {
		yield 'Hello'
		yield 'World'
	})
	.ws('/realtime', {
		message(ws, message) {
			ws.send('got:' + message)
		}
	})
	.listen(3000)
```

</template>

<template v-slot:doc>

```typescript
import { Elysia } from 'elysia'
import swagger from '@elysiajs/swagger'

new Elysia()
	.use(swagger())
	.use(character)
	.use(auth)
	.listen(3000)
```

</template>

<template v-slot:e2e-type-safety>

```typescript twoslash
// @noErrors
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .patch(
        '/profile',
        ({ body, status }) => {
            if(body.age < 18)
                return status(400, "哎呀")

            return body
        },
        {
            body: t.Object({
                age: t.Number()
            })
        }
    )
    .listen(80)

export type App = typeof app

// @filename: client.ts
// ---cut---
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const api = treaty<App>('api.elysiajs.com')

const { data } = await api.profile.patch({
      // ^?
    age: 21
})
```

</template>

<template v-slot:test-code>

```typescript twoslash
// @errors: 2345 2304
// @filename: index.ts
import { Elysia, t } from 'elysia'

export const app = new Elysia()
    .put(
        '/user',
        ({ body, status }) => {
        	if(body.username === 'mika')
				return status(400, {
					success: false,
					message: '用户名已被占用'
				} as const)

            return {
            	success: true,
             	message: '用户创建成功'
            } as const
        },
        {
            body: t.Object({
            	username: t.String(),
             	password: t.String()
            })
        }
    )

// @filename: client.ts
// ---cut---
import { treaty } from '@elysiajs/eden'
import { app } from './index'
import { test, expect } from 'bun:test'

const server = treaty(app)

test('应处理重复用户', async () => {
	const { error } = await server.user.put({
	    username: 'mika',
	})

	expect(error?.value).toEqual({
		success: false,
		message: '用户名已被占用'
	})
})
```

</template>

<template v-slot:test-script>

```bash
$ bun test
```

</template>

</Fern>
