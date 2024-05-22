---
title: Handler
head:
    - - meta
      - property: 'og:title'
        content: Handler - Elysia 中文文档

    - - meta
      - name: 'description'
        content: Handler 是一个响应每个路由请求的函数。接受请求信息并向客户端返回响应。Handler 可通过 Elysia.get / Elysia.post 注册。

    - - meta
      - property: 'og:description'
        content: Handler 是一个响应每个路由请求的函数。接受请求信息并向客户端返回响应。Handler 可通过 Elysia.get / Elysia.post 注册。
---

<script setup>
import Playground from '../../components/nearl/playground.vue'
import { Elysia } from 'elysia'

const demo1 = new Elysia()
    .get('/', ({ path }) => path)

const demo2 = new Elysia()
    .get('/', ({ error }) => error(418, "Kirifuji Nagisa"))
</script>

# Handler

找到资源后，响应的函数称为 **Handler**

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    // the function `() => 'hello world'` is a handler
    .get('/', () => 'hello world')
    .listen(3000)
```

Handler 可能是一个文字值，并且可以内联。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'Hello Elysia')
    .get('/video', Bun.file('kyuukurarin.mp4'))
    .listen(3000)
```

使用内联值始终返回相同的值，这对于优化文件等静态资源的性能很有用。

这使得 Elysia 能够提前编译响应以优化性能。

::: tip
提供内联值不是缓存。

静态资源值、标头和状态可以使用生命周期动态改变。
:::

## Context

Context 是发送到服务器的请求信息。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ path }) => path)
    .listen(3000)
```

<Playground :elysia="demo1" />

我们将在下一页 Context 中介绍 [Context](/essential/context) 属性，现在让我们看看 Handler 的功能。

## Set

**set** 是一个可变属性，可通过 `Context.set` 形成一个可访问的响应。

- **set.status** - 设置自定义状态码
- **set.headers** - 附加自定义请求头
- **set.redirect** - 追加重定向

## Status

我们可以使用以下任一方法返回自定义状态代码：

- **error** 函数 (推荐)
- **set.status**

## error

用于返回状态代码和响应的 `error` 专用函数。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ error }) => error(418, "Kirifuji Nagisa"))
    .listen(3000)
```

<Playground :elysia="demo2" />

建议 `error` 在主处理程序内部使用，因为它具有更好的推理能力：

- 允许 TypeScript 检查返回值是否正确键入响应模式
- 根据状态代码自动完成类型缩小
- 使用端到端类型安全 (Eden) 进行错误处理的类型缩小

## set.status

如果未提供，请设置默认状态代码。

建议在只需要返回特定状态代码的插件中使用，同时允许用户返回自定义值，例如 HTTP 201/206 或 403/405 等。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(({ set }) => {
        set.status = 418

        return 'Kirifuji Nagisa'
    })
    .get('/', () => 'hi')
    .listen(3000)
```

::: tip
HTTP 状态指示响应的类型。如果路由处理程序成功执行且没有错误，Elysia 将返回状态代码 200。
:::

你还可以使用状态代码的通用名称而不是使用数字来设置状态代码。

```typescript twoslash
// @errors 2322
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status
          // ^?

        return 'Kirifuji Nagisa'
    })
    .listen(3000)
```

## set.headers

允许我们附加或删除表示为对象的响应标头。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.headers['x-powered-by'] = 'Elysia'

        return 'a mimir'
    })
    .listen(3000)
```

## redirect

将请求重定向到另一个资源。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ redirect }) => {
        return redirect('https://youtu.be/whpVWVWBW4U?&t=8')
    })
    .get('/custom-status', ({ redirect }) => {
        // You can also set custom status to redirect
        return redirect('https://youtu.be/whpVWVWBW4U?&t=8', 302)
    })
    .listen(3000)
```

使用重定向时，返回值不是必需的，并且将被忽略。因为响应将来自另一个资源。

## Response

Elysia 构建在 Web 标准的 Request/Response 之上。

为了符合 Web 标准，从路由处理程序返回的值将被 Elysia 映射到 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) 中。

让你专注于业务逻辑而不是样板代码。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    // Equivalent to "new Response('hi')"
    .get('/', () => 'hi')
    .listen(3000)
```

如果你更喜欢显式的 Response 类，Elysia 也会自动处理。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => new Response('hi'))
    .listen(3000)
```

::: tip
使用原始值或 `Response` 具有几乎相同的性能 (± 0.1%)，因此无论性能如何，请选择你喜欢的值。
:::
