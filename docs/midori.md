---
title: Elysia - 人体工程学框架
layout: page
sidebar: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia - 人体工程学框架

    - - meta
      - name: 'description'
        content: Elysia 是一个为人类设计的人体工程学框架。具有端到端的类型安全性和卓越的开发者体验。Elysia 既熟悉又快速，支持一流的 TypeScript，并在 tRPC、Swagger 或 WebSocket 等服务之间进行了良好的集成。Elysia 能满足您的需求，立即开始构建下一代 TypeScript 网络服务器吧。

    - - meta
      - property: 'og:description'
        content: Elysia 是一个为人类设计的人体工程学框架。具有端到端的类型安全性和卓越的开发者体验。Elysia 既熟悉又快速，支持一流的 TypeScript，并在 tRPC、Swagger 或 WebSocket 等服务之间进行了良好的集成。Elysia 能满足您的需求，立即开始构建下一代 TypeScript 网络服务器吧。
---

<script setup>
    import Landing from './components/midori/index.vue'
</script>

<Landing>
  <template v-slot:justreturn>

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', '你好，世界')
    .get('/json', {
        hello: 'world'
    })
    .get('/id/:id', ({ params: { id } }) => id)
    .listen(3000)

```

  </template>

  <template v-slot:typestrict>

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .post(
        '/profile',
        // ↓ 悬停我 ↓
        ({ body }) => body,
        {
            body: t.Object({
                username: t.String()
            })
        }
    )
    .listen(3000)

```
  </template>

  <template v-slot:openapi>

```ts twoslash
// @filename: controllers.ts
import { Elysia } from 'elysia'

export const users = new Elysia()
    .get('/users', '梦幻的谐音')

export const feed = new Elysia()
    .get('/feed', ['Hoshino', 'Griseo', 'Astro'])

// @filename: server.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { users, feed } from './controllers'

new Elysia()
    .use(swagger())
    .use(users)
    .use(feed)
    .listen(3000)
```
  </template>

<template v-slot:server>

```typescript twoslash
// @filename: server.ts
// ---cut---
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .patch(
        '/user/profile',
        ({ body, status }) => {
            if(body.age < 18)
                return status(400, "哦不")

            if(body.name === 'Nagisa')
                return status(418)

            return body
        },
        {
            body: t.Object({
                name: t.String(),
                age: t.Number()
            })
        }
    )
    .listen(80)

export type App = typeof app
```
  </template>

  <template v-slot:client>

```typescript twoslash
// @errors: 2322 1003
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .patch(
        '/user/profile',
        ({ body, status }) => {
            if(body.age < 18)
                return status(400, "哦不")

            if(body.name === 'Nagisa')
                return status(418)

            return body
        },
        {
            body: t.Object({
                name: t.String(),
                age: t.Number()
            })
        }
    )
    .listen(80)

export type App = typeof app

// @filename: client.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const api = treaty<App>('localhost')

const { data, error } = await api.user.profile.patch({
    name: 'saltyaom',
    age: '21'
})

if(error)
    switch(error.status) {
        case 400:
            throw error.value
//                         ^?

        case 418:
            throw error.value
//                         ^?
}

data
// ^?
```
  </template>


</Landing>
