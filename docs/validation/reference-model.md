---
title: 参考模型
head:
  - - meta
    - property: 'og:title'
      content: 参考模型 - Elysia 中文文档

  - - meta
    - name: 'description'
      content: 参考模型允许你为现有类型模型命名，并在验证时使用该名称，并通过指定名称在生命周期事件或 "handler.guard" 中引用模型。

  - - meta
    - name: 'og:description'
      content: 参考模型允许你为现有类型模型命名，并在验证时使用该名称，并通过指定名称在生命周期事件或 "handler.guard" 中引用模型。
---

# 参考模型

有时你可能会发现自己声明了重复的模型，或者多次重复使用同一个模型。

通过参考模型，我们可以给模型命名，并通过引用名称来重用它们。

让我们从一个简单的场景开始。

假设我们有一个处理使用相同模型的登录的控制器。

```typescript twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .post('/sign-in', ({ body }) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        }),
        response: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

我们可以通过将模型提取为变量并引用它们来重构代码。

```typescript twoslash
import { Elysia, t } from 'elysia'

// 可能在不同的文件中，例如 models.ts
const SignDTO = t.Object({
    username: t.String(),
    password: t.String()
})

const app = new Elysia()
    .post('/sign-in', ({ body }) => body, {
        body: SignDTO,
        response: SignDTO
    })
```

这种分离关注点的方法是一种有效的方法，但随着应用程序变得更复杂，我们可能会发现自己需要在不同的控制器中重复使用多个模型。

我们可以通过创建一个 “参考模型” 来解决这个问题，允许我们给模型命名，并使用自动完成直接在 `schema` 中引用它，通过使用 `model` 注册模型。

```typescript twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/sign-in', ({ body }) => body, {
        // 使用现有模型名称的自动完成
        body: 'sign',
        response: 'sign'
    })
```

当我们想要访问模型的组时，我们可以将 `model` 分离成一个插件，当注册时，它将提供一组模型，而不是多次导入。

```typescript twoslash
// auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

然后在一个实例文件中：

```typescript twoslash
// @filename: auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })

// @filename: index.ts
// ---cut---
// index.ts
import { Elysia } from 'elysia'
import { authModel } from './auth.model'

const app = new Elysia()
    .use(authModel)
    .post('/sign-in', ({ body }) => body, {
        // 使用现有模型名称的自动完成
        body: 'sign',
        response: 'sign'
    })
```

这不仅允许我们分离关注点，还允许我们在多个地方重用模型，并将模型报告到 Swagger 文档中。

## 多个模型

`model` 接受一个以模型名称为键、模型定义为值的对象，支持多个模型。

```typescript twoslash
// auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        number: t.Number(),
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

## 命名约定

重复的模型名称将导致 Elysia 抛出错误。为了避免声明重复的模型名称，我们可以使用以下命名约定。

假设我们将所有模型存储在 `models/<name>.ts`，并将模型的前缀声明为命名空间。

```typescript twoslash
import { Elysia, t } from 'elysia'

// admin.model.ts
export const adminModels = new Elysia()
    .model({
        'admin.auth': t.Object({
            username: t.String(),
            password: t.String()
        })
    })

// user.model.ts
export const userModels = new Elysia()
    .model({
        'user.auth': t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

这可以在一定程度上防止名称重复，但最好还是让命名约定的决定权交给你的团队协商决定。

Elysia 为你提供了一种有见地的选项，让你决定是否避免决策疲劳。
