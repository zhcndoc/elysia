---
url: /midori.md
---

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
