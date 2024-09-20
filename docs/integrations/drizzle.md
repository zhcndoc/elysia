---
title: 集成 Drizzle
head:
  - - meta
    - property: 'og:title'
      content: 集成 Drizzle - Elysia 中文文档

  - - meta
    - name: 'description'
      content: 你可以使用 drizzle-typebox 包将 Drizzle 类型转换为 Elysia 的模式来处理数据验证。

  - - meta
    - property: 'og:description'
      content: 你可以使用 drizzle-typebox 包将 Drizzle 类型转换为 Elysia 的模式来处理数据验证。
---

# 集成 Drizzle

[Drizzle](https://orm.drizzle.team) 是一个 TypeScript ORM，可以直接提供类型完整性支持。

允许我们直接将数据库模式定义和类型推断到 TypeScript 类型中，从而实现从数据库到服务器再到客户端的端到端类型安全。

## Drizzle Typebox

[Elysia.t](/validation/overview) 是 TypeBox 的分支，允许我们直接在 Elysia 中使用任何 TypeBox 类型。

我们可以使用 [“drizzle-typebox”](https://npmjs.org/package/drizzle-typebox) 将 Drizzle 模式转换为 TypeBox 模式，并直接在 Elysia 的模式验证中使用它。

```typescript
import { Elysia, t } from 'elysia'

import { createInsertSchema } from 'drizzle-typebox'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'

const user = sqliteTable('user', {
    id: text('id').primaryKey().$defaultFn(createId),
    username: text('username').notNull(),
    password: text('password').notNull(),
})

const insertUserSchema = createInsertSchema(user)

const auth = new Elysia({ prefix: '/auth' })
    .put(
        '/sign-up',
        ({ body }) => body,
        {
            body: t.Omit(insertUserSchema, ['id'])
        }
    )
```

或者如果你想在验证方面添加自定义字段，例如文件上传：
```typescript
import { Elysia, t } from 'elysia'

import { createInsertSchema } from 'drizzle-typebox'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'

const user = sqliteTable('user', {
    id: text('id').primaryKey().$defaultFn(createId),
    username: text('username').notNull(),
    password: text('password').notNull(),
    image: text('image')
})

const insertUserSchema = createInsertSchema(user, {
    image: t.File({ // [!code ++]
        type: 'image', // [!code ++]
        maxSize: '2m' // [!code ++]
    }) // [!code ++]
})

const auth = new Elysia({ prefix: '/auth' })
    .put(
        '/sign-up',
        async ({ body: { image, ...body } }) => {
            const imageURL = await uploadImage(image) // [!code ++]
// [!code ++]
            return { image: imageURL, ...body } // [!code ++]
        },
        {
            body: t.Omit(insertUserSchema, ['id'])
        }
    )
```
