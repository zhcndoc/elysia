---
title: Elysia 中文文档
titleTemplate: ':title - 人体工程学框架'
layout: page
sidebar: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 中文文档 - 人体工程学框架

    - - meta
      - name: 'description'
        content: Elysia 是一个面向人类的人体工程学框架。具有端到端类型安全性和出色的开发者体验。 Elysia 熟悉、快速，并提供一流的 TypeScript 支持，其中与 tRPC、Swagger 或 WebSocket 等服务之间存在良好思考的集成。Elysia 已经为你考虑周全，立即开始构建下一代 TypeScript Web 服务器。

    - - meta
      - property: 'og:description'
        content: Elysia 是一个面向人类的人体工程学框架。具有端到端类型安全性和出色的开发者体验。 Elysia 熟悉、快速，并提供一流的 TypeScript 支持，其中与 tRPC、Swagger 或 WebSocket 等服务之间存在良好思考的集成。Elysia 已经为你考虑周全，立即开始构建下一代 TypeScript Web 服务器。
---

<script setup>
    import Fern from '../components/fern/fern.vue'
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
	.get('/profile', ({ error }) => {
		if(Math.random() > .5)
			return error(418, 'Mika')

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
			onBeforeHandle(({ headers, error }) => {
				if(headers.authorization !== type)
					return error(401)
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
import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'Hello World')
	.get('/image', Bun.file('mika.webp'))
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
        ({ body, error }) => {
            if(body.age < 18)
                return error(400, "Oh no")

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
        ({ body, error }) => {
        	if(body.username === 'mika')
				return error(400, {
					success: false,
					message: 'Username already taken'
				} as const)

            return {
            	success: true,
             	message: 'User created'
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

test('should handle duplicated user', async () => {
	const { error } = await server.user.put({
	    username: 'mika',
	})

	expect(error?.value).toEqual({
		success: false,
		message: 'Username already taken'
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
