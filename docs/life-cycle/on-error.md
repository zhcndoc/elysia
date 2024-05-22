---
title: 错误处理
head:
    - - meta
      - property: 'og:title'
        content: 错误处理 - Elysia 中文文档

    - - meta
      - name: 'description'
        content: 当在任何其他生命周期中至少发生一次错误时执行。旨在捕获和解决意外错误，建议在以下情况下使用 on Error。提供自定义错误消息。故障安全或错误处理程序或重试请求。日志记录和分析。

    - - meta
      - property: 'og:description'
        content: 当在任何其他生命周期中至少发生一次错误时执行。旨在捕获和解决意外错误，建议在以下情况下使用 on Error。提供自定义错误消息。故障安全或错误处理程序或重试请求。日志记录和分析。
---

# 错误处理

**On Error** 是唯一一个不会在每个请求中始终执行的生命周期事件，只有在其他生命周期中至少发生一次错误时才会执行。

设计用于捕获和解决意外错误，在以下情况下建议使用 on Error：

- 提供自定义错误消息
- 故障安全或错误处理程序或重试请求
- 日志记录和分析

## 示例

Elysia 捕获处理程序中抛出的所有错误，对错误代码进行分类，并将其传递给 `onError` 中间件。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        return new Response(error.toString())
    })
    .get('/', () => {
        throw new Error('Server is during maintenance')

        return 'unreachable'
    })
```

通过 `onError`，我们可以捕获并将错误转换为自定义错误消息。

::: tip
重要的是，`onError` 必须在我们要应用它的处理程序之前调用。
:::

例如，返回自定义的 404 错误消息：

```typescript twoslash
import { Elysia, NotFoundError } from 'elysia'

new Elysia()
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') {
            set.status = 404

            return 'Not Found :('
        }
    })
    .post('/', () => {
        throw new NotFoundError()
    })
    .listen(3000)
```

## 上下文

`onError` 上下文是从 `Context` 扩展而来，具有以下附加属性：

-   error：抛出的错误对象
-   code：错误代码

### 错误代码

Elysia 错误代码包括：

-   NOT_FOUND
-   INTERNAL_SERVER_ERROR
-   VALIDATION
-   PARSE
-   UNKNOWN

默认情况下，抛出的错误代码为 `unknown`。

::: tip
如果没有返回错误响应，将使用 `error.name` 返回错误。
:::

## 自定义错误

Elysia 支持类型级别和实现级别的自定义错误。

要提供自定义错误代码，我们可以使用 `Elysia.error` 添加自定义错误代码，以帮助我们轻松分类和缩小错误类型，实现完全的类型安全和自动完成，如下所示：

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
            // 使用自动完成
            case 'MyError':
                // 使用类型缩小
                // 悬停以查看错误类型为 `CustomError`
                return error
        }
    })
    .get('/', () => {
        throw new MyError('Hello Error')
    })
```

`error` 代码的属性基于 `error` 的属性，这些属性将用于对错误代码进行分类。

## 本地错误

与其他生命周期相同，我们使用 guard 将错误传递给 [scope](/essential/scope)：

```typescript twoslash
const isSignIn = (headers: Headers): boolean => true
// ---cut---
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Hello', {
        beforeHandle({ set, request: { headers } }) {
            if (!isSignIn(headers)) {
                set.status = 401

                throw new Error('Unauthorized')
            }
        },
        error({ error }) {
            return 'Handled'
        }
    })
    .listen(3000)
```
