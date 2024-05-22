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
    import Landing from '../components/midori/index.vue'
</script>

<Landing>
  <template v-slot:justreturn>
  
```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'Hello World')
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
        // ↓ hover me ↓
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
    .get('/users', 'Dreamy Euphony')

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
        ({ body, error }) => {
            if(body.age < 18) 
                return error(400, "Oh no")

            if(body.name === 'Nagisa')
                return error(418)

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
        ({ body, error }) => {
            if(body.age < 18) 
                return error(400, "Oh no")

            if(body.name === 'Nagisa')
                return error(418)

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
