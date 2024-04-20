---
title: 路由 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 路由 - ElysiaJS

    - - meta
      - name: 'description'
        content: 为了确定对客户端的正确响应，网络服务器使用路径和 HTTP 方法来查找正确的资源。这个过程被称为 "路由"。我们可以通过调用以 HTTP Verb 命名的方法（如 `Elysia.get`、`Elysia.post`）来定义路由，并在匹配时传递路径和要执行的函数。

    - - meta
      - property: 'og:description'
        content: 为了确定对客户端的正确响应，网络服务器使用路径和 HTTP 方法来查找正确的资源。这个过程被称为 "路由"。我们可以通过调用以 HTTP Verb 命名的方法（如 `Elysia.get`、`Elysia.post`）来定义路由，并在匹配时传递路径和要执行的函数。
---

<script setup>
import Playground from '../../components/nearl/playground.vue'
import { Elysia } from 'elysia'

const demo1 = new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'hi')

const demo2 = new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'world')

const demo3 = new Elysia()
    .get('/get', () => 'hello')
    .post('/post', () => 'hi')
    .route('M-SEARCH', '/m-search', () => 'connect') 

const demo4 = new Elysia()
    .get('/', () => 'hello')
    .post('/', () => 'hello')
    .delete('/', () => 'hello')

const demo5 = new Elysia()
    .get('/', () => 'hello')
    .post('/', () => 'hello')
    .get('/hi', ({ error }) => error(404))
</script>

# 路由

Web 服务器使用请求的**路径和 HTTP 方法**来查找正确的资源，这就是 **“路由”**。

我们可以通过调用**以 HTTP Verb 命名的方法**、传递路径和匹配时执行的函数来定义路由。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Landing')
    .get('/hello', () => 'Hi')
    .listen(3000)
```

我们可以通过 **http://localhost:3000** 来访问 Web 服务器

<Playground :elysia="demo1" />

::: tip
默认情况下，Web 浏览器在访问页面时会发送 GET 方法。

这就是使用浏览器访问 GET 路由的原因。
:::

## HTTP Verb

例如，在不同的情况下可以使用多种 HTTP 方法。

### GET

使用 GET 的请求应该只被用于获取数据。

### POST

用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用。

### PUT

用有效载荷请求替换目标资源的所有当前表示。

### DELETE

删除指定的资源。

---

为了处理每个不同的请求方法，Elysia 默认情况下有一个针对多个 HTTP Verb 的内置 API，类似于 `Elysia.get`。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'hi')
    .listen(3000)
```

<Playground :elysia="demo2" />

Elysia HTTP 方法接受以下参数：

-   **path**: 路径名
-   **function**: 响应客户端的函数
-   **hook**: 附加元数据

您可以在 [HTTP 请求方法](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)上阅读有关 HTTP 方法的更多信息。

## 方法链

根据经验，在 Elysia 中**始终**使用方法链。

```typescript twoslash
import { Elysia } from 'elysia'

// ❌ don't
const app1 = new Elysia()

app1.get('/', () => 'hello')

app1.post('/', () => 'world')

// ✅ do
const app = new Elysia()
    .get('/', () => 'hello')
    .post('/', () => 'world')
```

Elysia 正在使用方法链来同步类型安全以供以后使用。

如果没有方法链，Elysia 就无法确保类型的完整性，这将在后面的章节中用到。

## Handle

大多数开发人员使用 Postman、Insomnia 或 Hoppscotch 等 REST 客户端来测试他们的 API。

但是，可以使用 Elysia 以编程方式进行测试 `Elysia.handle`。

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'hi')
    .listen(3000)

app.handle(new Request('http://localhost/')).then(console.log)
```
**Elysia.handle** 是一个处理发送到服务器的实际请求的函数。

::: tip
与单元测试的 mock 不同，它的行为与发送到服务器的**实际请求类似**。

但对于模拟或创建单元测试也很有用。
:::

## 自定义方法

我们可以通过 `Elysia.route` 接受自定义 HTTP 方法。

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/get', () => 'hello')
    .post('/post', () => 'hi')
    .route('M-SEARCH', '/m-search', () => 'connect') // [!code ++]
    .listen(3000)
```

<Playground :elysia="demo3" />

**Elysia.route** 接受以下内容：

-   **method**: HTTP Verb
-   **path**: 路径名
-   **function**: 响应客户端的函数
-   **hook**: 附加元数据

导航到每个方法时，您应该看到如下结果：

| Path | Method | Result |
| - | --- | --- |
| / | GET | hello |
| / | POST | hi |
| / | M-SEARCH | connect |

::: tip
根据 RFC 7231，HTTP Verb 区分大小写。

建议在使用 Elysia 定义自定义 HTTP Verb 时使用大写规范。
:::

## Elysia.all

Elysia 提供了一个 `Elysia.all`，用于使用与 **Elysia.get** 和 **Elysia.post** 相同的 API 处理指定路径下的任何 HTTP 方法。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .all('/', () => 'hi')
    .listen(3000)
```

<Playground :elysia="demo4" />

任何与路径匹配的 HTTP 方法都将按如下方式处理：

| Path | Method | Result |
| ---- | -------- | ------ |
| / | GET | hi |
| / | POST | hi |
| / | DELETE | hi |

## 404

如果没有路径与定义的路由相匹配，Elysia 会将请求传递到 [`onError`](/life-cycle/on-error) 生命周期，然后返回 HTTP 状态为 404 的 `NOT_FOUND`。

我们可以通过像这样从 `onError` 生命周期返回一个值来处理自定义 404 错误：

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hi')
    .onError(({ code }) => {
        if (code === 'NOT_FOUND')
            return 'Route not found :('
    })
    .listen(3000)
```

<Playground :elysia="demo5" />

导航到 Web 服务器时，应该会看到如下结果：

| Path | Method | Result              |
| ---- | ------ | ------------------- |
| /    | GET    | hi                  |
| /    | POST   | Route not found :\( |
| /hi  | GET    | Route not found :\( |

有关生命周期和错误处理的更多信息，请参阅[生命周期事件](/essential/life-cycle#events)和[错误处理](/life-cycle/on-error)。

::: tip
HTTP 状态用于指示响应的类型。 默认情况下，如果一切正确，服务器将返回 "200 OK" 状态代码（如果路由匹配并且没有错误，Elysia 将默认返回 200）

如果服务器未能找到任何要处理的路由（如本例所示），则服务器应返回 "404 NOT FOUND" 状态代码。
:::
