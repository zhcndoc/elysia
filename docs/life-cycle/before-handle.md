---
title: Before Handle
head:
    - - meta
      - property: 'og:title'
        content: Before Handle - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 在验证之后、主路由处理程序之前执行。旨在提供自定义验证以满足在运行主处理程序之前的特定要求。建议在以下情况下使用 Before Handle：受限访问检查、授权、用户登录、自定义请求对数据结构的要求。

    - - meta
      - property: 'og:description'
        content: 在验证之后、主路由处理程序之前执行。旨在提供自定义验证以满足在运行主处理程序之前的特定要求。建议在以下情况下使用 Before Handle：受限访问检查、授权、用户登录、自定义请求对数据结构的要求。
---

# Before Handle

在验证之后、主路由处理程序之前执行。

旨在提供自定义验证以满足在运行主处理程序之前的特定要求。

如果返回一个值，则路由处理程序将被跳过。

建议在以下情况下使用 Before Handle：

-   受限访问检查：授权、用户登录
-   自定义请求对数据结构的要求

## 示例

下面是使用 before handle 检查用户登录的示例。

```typescript twoslash
// @filename: user.ts
export const validateSession = (a: string): boolean => true

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { validateSession } from './user'

new Elysia()
    .get('/', () => 'hi', {
        beforeHandle({ set, cookie: { session } }) {
            if (!validateSession(session.value))
                return (set.status = 'Unauthorized')
        }
    })
    .listen(3000)
```

响应应如下所示：

| Is signed in | Response     |
| ------------ | ------------ |
| ❌           | Unauthorized |
| ✅           | Hi           |

## 守卫

当我们需要将相同的 before handle 应用于多个路由时，可以使用[守卫](#guard)将相同的 before handle 应用于多个路由。

```typescript twoslash
// @filename: user.ts
export const validateSession = (a: string): boolean => true
export const isUserExists = (a: unknown): boolean => true
export const signUp = (body: unknown): boolean => true
export const signIn = (body: unknown): boolean => true

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { 
    signUp,
    signIn,
    validateSession, 
    isUserExists
} from './user'

new Elysia()
    .guard(
        {
            beforeHandle({ set, cookie: { session } }) {
                if (!validateSession(session.value))
                    return (set.status = 'Unauthorized')
            }
        },
        (app) =>
            app
                .get('/user/:id', ({ body }) => signUp(body))
                .post('/profile', ({ body }) => signIn(body), {
                    beforeHandle: isUserExists
                })
    )
    .get('/', () => 'hi')
    .listen(3000)
```

## Resolve

[派生](/life-cycle/before-handle#derive)的 “安全” 版本。

旨在在验证过程后将新值附加到上下文中，存储在与 **beforeHandle** 相同的堆栈中。

Resolve 语法与[派生](/life-cycle/before-handle#derive)相同，下面是从授权插件中检索 bearer 标头的示例。

```typescript twoslash
// @filename: user.ts
export const validateSession = (a: string): boolean => true

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'

new Elysia()
    .guard(
        {
            headers: t.Object({
                authorization: t.TemplateLiteral('Bearer ${string}')
            })
        },
        (app) =>
            app
                .resolve(({ headers: { authorization } }) => {
                    return {
                        bearer: authorization.split(' ')[1]
                    }
                })
                .get('/', ({ bearer }) => bearer)
    )
    .listen(3000)
```

使用 `resolve` 和 `onBeforeHandle` 存储在同一队列中。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(() => {
        console.log(1)
    })
    .resolve(() => {
        console.log(2)

        return {}
    })
    .onBeforeHandle(() => {
        console.log(3)
    })
```

控制台应如下所示：

```bash
1
2
3
```

与**派生**相同，由 **resolve** 分配的属性是唯一的，不与另一个请求共享。

## 守卫 Resolve

由于 resolve 在本地钩子中不可用，建议使用守卫来封装 **resolve** 事件。

```typescript twoslash
// @filename: user.ts
export const isSignIn = (body: any): boolean | undefined => true
export const findUserById = (id: string) => id

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { isSignIn, findUserById } from './user'

new Elysia()
    .guard(
        {
            beforeHandle: isSignIn
        },
        (app) =>
            app
                .resolve(({ cookie: { session } }) => ({
                    userId: findUserById(session.value)
                }))
                .get('/profile', ({ userId }) => userId)
    )
    .listen(3000)
```
