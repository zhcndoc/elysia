---
title: Integration with Drizzle - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Integration with Drizzle - ElysiaJS

  - - meta
    - name: 'description'
      content: 我们可以使用 Drizzle 创建从数据库到验证再到前端的端到端类型安全，使用 drizzle-typebox。

  - - meta
    - name: 'og:description'
      content: 我们可以使用 Drizzle 创建从数据库到验证再到前端的端到端类型安全，使用 drizzle-typebox。
---

# Drizzle
Drizzle ORM 是一个无头 TypeScript ORM，专注于类型安全和开发者体验。

我们可以使用 `drizzle-typebox` 将 Drizzle 模式转换为 Elysia 验证模型。

### Drizzle Typebox
[Elysia.t](/essential/validation.html#elysia-type) 是 TypeBox 的一个分支，允许我们直接在 Elysia 中使用任何 TypeBox 类型。

我们可以使用 ["drizzle-typebox"](https://npmjs.org/package/drizzle-typebox) 将 Drizzle 模式转换为 TypeBox 模式，并直接在 Elysia 的模式验证中使用。

### 其工作原理如下：
1. 在 Drizzle 中定义你的数据库模式。
2. 使用 `drizzle-typebox` 将 Drizzle 模式转换为 Elysia 验证模型。
3. 使用转换后的 Elysia 验证模型来确保类型验证。
4. 从 Elysia 验证模型生成 OpenAPI 模式。
5. 添加 [Eden Treaty](/eden/overview) 以增强前端的类型安全。

```
                                                    * ——————————————— *
                                                    |                 |
                                               | -> |  文档          |
* ————————— *             * ———————— * OpenAPI |    |                 |
|           |   drizzle-  |          | ——————— |    * ——————————————— *
|  Drizzle  | —————————-> |  Elysia  |
|           |  -typebox   |          | ——————— |    * ——————————————— *
* ————————— *             * ———————— *   Eden  |    |                 |
                                               | -> |  前端代码      |
												    |                 |
												    * ——————————————— *

```

## 安装
要安装 Drizzle，请运行以下命令：

```bash
bun add drizzle-orm drizzle-typebox
```

然后你需要固定 `@sinclair/typebox` 的版本，因为 `drizzle-typebox` 和 `Elysia` 之间可能存在版本不匹配，这可能会导致两个版本之间的符号冲突。

我们建议使用以下命令固定 `@sinclair/typebox` 的版本为 `elysia` 使用的 **最低版本**：
```bash
grep "@sinclair/typebox" node_modules/elysia/package.json
```

我们可以在 `package.json` 中使用 `overrides` 字段来固定 `@sinclair/typebox` 的版本：
```json
{
  "overrides": {
  	"@sinclair/typebox": "0.32.4"
  }
}
```

## Drizzle 模式
假设我们在代码库中有一个 `user` 表，如下所示：

::: code-group

```ts [src/database/schema.ts]
import { relations } from 'drizzle-orm'
import {
    pgTable,
    varchar,
    timestamp
} from 'drizzle-orm/pg-core'

import { createId } from '@paralleldrive/cuid2'

export const user = pgTable(
    'user',
    {
        id: varchar('id')
            .$defaultFn(() => createId())
            .primaryKey(),
        username: varchar('username').notNull().unique(),
        password: varchar('password').notNull(),
        email: varchar('email').notNull().unique(),
        salt: varchar('salt', { length: 64 }).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    }
)

export const table = {
	user
} as const

export type Table = typeof table
```

:::

## drizzle-typebox
我们可以使用 `drizzle-typebox` 将 `user` 表转换为 TypeBox 模型：

::: code-group

```ts [src/index.ts]
import { createInsertSchema } from 'drizzle-typebox'
import { table } from './database/schema'

const _createUser = createInsertSchema(table.user, {
	// 使用 Elysia 的 email 类型替换电子邮件
	email: t.String({ format: 'email' })
})

new Elysia()
	.post('/sign-up', ({ body }) => {
		// 创建新用户
	}, {
		body: t.Omit(
			_createUser,
			['id', 'salt', 'createdAt']
		)
	})
```

:::

这使我们可以在 Elysia 验证模型中重复使用数据库模式。

## 类型实例化可能是无限的
如果你遇到错误 **类型实例化可能是无限的**，这可能是因为 `drizzle-typebox` 和 `Elysia` 之间存在循环引用。

如果我们将来自 drizzle-typebox 的类型嵌套到 Elysia 模式中，它将导致类型实例化的无限循环。

为了避免这种情况，我们需要 **在 `drizzle-typebox` 和 `Elysia` 模式之间显式定义一个类型**：
```ts
import { t } from 'elysia'
import { createInsertSchema } from 'drizzle-typebox'

import { table } from './database/schema'

const _createUser = createInsertSchema(table.user, {
	email: t.String({ format: 'email' })
})

// ✅ 这样做有效，通过引用来自 `drizzle-typebox` 的类型
const createUser = t.Omit(
	_createUser,
	['id', 'salt', 'createdAt']
)

// ❌ 这样做会导致类型实例化的无限循环
const createUser = t.Omit(
	createInsertSchema(table.user, {
		email: t.String({ format: 'email' })
	}),
	['id', 'salt', 'createdAt']
)
```

如果你想使用 Elysia 类型，始终为 `drizzle-typebox` 声明一个变量并引用它。

## 实用工具
由于我们很可能会使用 `t.Pick` 和 `t.Omit` 来排除或包括某些字段，重复这个过程可能会很繁琐：

我们建议使用以下实用函数 **（按原样复制）** 来简化这个过程：

::: code-group

```ts [src/database/utils.ts]
/**
 * @lastModified 2025-02-04
 * @see https://elysiajs.com/recipe/drizzle.html#utility
 */

import { Kind, type TObject } from '@sinclair/typebox'
import {
    createInsertSchema,
    createSelectSchema,
    BuildSchema,
} from 'drizzle-typebox'

import { table } from './schema'
import type { Table } from 'drizzle-orm'

type Spread<
    T extends TObject | Table,
    Mode extends 'select' | 'insert' | undefined,
> =
    T extends TObject<infer Fields>
        ? {
              [K in keyof Fields]: Fields[K]
          }
        : T extends Table
          ? Mode extends 'select'
              ? BuildSchema<
                    'select',
                    T['_']['columns'],
                    undefined
                >['properties']
              : Mode extends 'insert'
                ? BuildSchema<
                      'insert',
                      T['_']['columns'],
                      undefined
                  >['properties']
                : {}
          : {}

/**
 * 将 Drizzle 模式展开为一个普通对象
 */
export const spread = <
    T extends TObject | Table,
    Mode extends 'select' | 'insert' | undefined,
>(
    schema: T,
    mode?: Mode,
): Spread<T, Mode> => {
    const newSchema: Record<string, unknown> = {}
    let table

    switch (mode) {
        case 'insert':
        case 'select':
            if (Kind in schema) {
                table = schema
                break
            }

            table =
                mode === 'insert'
                    ? createInsertSchema(schema)
                    : createSelectSchema(schema)

            break

        default:
            if (!(Kind in schema)) throw new Error('期望是一个模式')
            table = schema
    }

    for (const key of Object.keys(table.properties))
        newSchema[key] = table.properties[key]

    return newSchema as any
}

/**
 * 将 Drizzle 表展开为一个普通对象
 *
 * 如果 `mode` 是 'insert'，则模式将经过插入优化
 * 如果 `mode` 是 'select'，则模式将经过选择优化
 * 如果 `mode` 是未定义，模式将按原样展开，模型需要手动优化
 */
export const spreads = <
    T extends Record<string, TObject | Table>,
    Mode extends 'select' | 'insert' | undefined,
>(
    models: T,
    mode?: Mode,
): {
    [K in keyof T]: Spread<T[K], Mode>
} => {
    const newSchema: Record<string, unknown> = {}
    const keys = Object.keys(models)

    for (const key of keys) newSchema[key] = spread(models[key], mode)

    return newSchema as any
}
```

:::

这个实用函数将把 Drizzle 模式转换为一个普通对象，可以通过属性名称作为普通对象进行选择：
```ts
// ✅ 使用展开实用函数
const user = spread(table.user, 'insert')

const createUser = t.Object({
	id: user.id, // { type: 'string' }
	username: user.username, // { type: 'string' }
	password: user.password // { type: 'string' }
})

// ⚠️ 使用 t.Pick
const _createUser = createInsertSchema(table.user)

const createUser = t.Pick(
	_createUser,
	['id', 'username', 'password']
)
```

### 表单例
我们建议使用单例模式来存储表模式，这将使我们能够在代码库的任何地方访问表模式：

::: code-group

```ts [src/database/model.ts]
import { table } from './schema'
import { spreads } from './utils'

export const db = {
	insert: spreads({
		user: table.user,
	}, 'insert'),
	select: spreads({
		user: table.user,
	}, 'select')
} as const
```

:::

这样我们就能在代码库的任何地方访问表模式：

::: code-group

```ts [src/index.ts]
import { Elysia } from 'elysia'
import { db } from './database/model'

const { user } = db.insert

new Elysia()
	.post('/sign-up', ({ body }) => {
		// 创建新用户
	}, {
		body: t.Object({
			id: user.username,
			username: user.username,
			password: user.password
		})
	})
```

:::

### 精细化

如果需要类型精细化，你可以直接使用 `createInsertSchema` 和 `createSelectSchema` 来精细化模式。

::: code-group

```ts [src/database/model.ts]
import { t } from 'elysia'
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'

import { table } from './schema'
import { spreads } from './utils'

export const db = {
	insert: spreads({
		user: createInsertSchema(table.user, {
			email: t.String({ format: 'email' })
		}),
	}, 'insert')),
	select: spreads({
		user: createSelectSchema(table.user, {
			email: t.String({ format: 'email' })
		})
	}, 'select')
} as const
```

:::

在上述代码中，我们精细化了 `user.email` 模式以包括一个 `format` 属性。

`spread` 实用函数将跳过优化的模式，因此你可以按原样使用它。

---

有关更多信息，请参考 [Drizzle ORM](https://orm.drizzle.team) 和 [Drizzle TypeBox](https://orm.drizzle.team/docs/typebox) 文档。
