---
title: 路由 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 路由 - ElysiaJS

    - - meta
      - name: 'description'
        content: 为了确定对客户端的正确响应，web 服务器使用路径和 HTTP 方法来查找正确的资源。这个过程被称为“路由”。我们可以通过调用一个与 HTTP 动词同名的方法来定义路由，比如 `Elysia.get`、`Elysia.post`，传递一个路径和一个匹配时执行的函数。

    - - meta
      - property: 'og:description'
        content: 为了确定对客户端的正确响应，web 服务器使用路径和 HTTP 方法来查找正确的资源。这个过程被称为“路由”。我们可以通过调用一个与 HTTP 动词同名的方法来定义路由，比如 `Elysia.get`、`Elysia.post`，传递一个路径和一个匹配时执行的函数。
---

<script setup>
import Playground from '../components/nearl/playground.vue'
import { Elysia } from 'elysia'

const demo1 = new Elysia()
    .get('/', () => '你好')
    .get('/hi', () => '嗨')

const demo2 = new Elysia()
    .get('/', () => '你好')
    .post('/hi', () => '嗨')

const demo3 = new Elysia()
	  .get('/id', () => `id: undefined`)
    .get('/id/:id', ({ params: { id } }) => `id: ${id}`)

const demo4 = new Elysia()
    .get('/', () => '嗨')
    .post('/', () => '嗨')

const demo5 = new Elysia()
    .get('/', () => '你好')
    .get('/hi', ({ error }) => error(404, '路由未找到 :('))

const demo6 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ error }) => error(404))
    .get('/id/anything/test', ({ error }) => error(404))

const demo7 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ error }) => error(404))
    .get('/id/:id/:name', ({ params: { id, name } }) => id + ' ' + name)

const demo8 = new Elysia()
    .get('/get', () => 'hello')
    .post('/post', () => 'hi')
    .route('M-SEARCH', '/m-search', () => 'connect')

const demo9 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ error }) => error(404))
    .get('/id/:id/:name', ({ params: { id, name } }) => id + '/' + name)

const demo10 = new Elysia()
    .get('/id/1', () => '静态路径')
    .get('/id/:id', () => '动态路径')
    .get('/id/*', () => '通配符路径')

const demo11 = new Elysia()
    .post('/user/sign-in', () => '登录')
    .post('/user/sign-up', () => '注册')
    .post('/user/profile', () => '个人资料')

const demo12 = new Elysia()
    .group('/user', (app) =>
        app
            .post('/sign-in', () => '登录')
            .post('/sign-up', () => '注册')
            .post('/profile', () => '个人资料')
    )

const users = new Elysia({ prefix: '/user' })
    .post('/sign-in', () => '登录')
    .post('/sign-up', () => '注册')
    .post('/profile', () => '个人资料')

const demo13 = new Elysia()
    .get('/', () => '你好，世界')
    .use(users)
</script>

# 路由

Web 服务器使用请求的 **路径和 HTTP 方法** 来查找正确的资源，这被称为 **“路由”**。

我们可以通过调用一个 **与 HTTP 动词同名的方法**，传递一个路径和一个匹配时执行的函数来定义路由。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', '你好')
    .get('/hi', '嗨')
    .listen(3000)
```

我们可以通过访问 **http://localhost:3000** 来访问 web 服务器。

默认情况下，web 浏览器在访问页面时会发送 GET 方法。

<Playground :elysia="demo1" />

::: tip
使用上面的交互式浏览器，将鼠标悬停在蓝色高亮区域以查看每个路径之间的不同结果
:::

## 路径类型

Elysia 中的路径可以分为 3 种类型：

-   **静态路径** - 用于定位资源的静态字符串
-   **动态路径** - 段可以是任何值
-   **通配符** - 直到特定点的路径可以是任何内容

你可以将所有路径类型结合在一起，为你的 web 服务器组成行为。

优先级如下：

1. 静态路径
2. 动态路径
3. 通配符

如果路径被解析为静态而动态路径被提供，Elysia 将优先解析静态路径而不是动态路径。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/1', '静态路径')
    .get('/id/:id', '动态路径')
    .get('/id/*', '通配符路径')
    .listen(3000)
```

<Playground
  :elysia="demo10"
    :alias="{
    '/id/:id': '/id/2',
    '/id/*': '/id/2/a'
  }"
  :mock="{
    '/id/*': {
      GET: '通配符路径'
    }
  }"
/>

在这里，服务器将返回以下响应：

| 路径    | 响应        |
| ------- | ------------- |
| /id/1   | 静态路径     |
| /id/2   | 动态路径     |
| /id/2/a | 通配符路径   |

## 静态路径

路径或路径名是一个用于定位服务器资源的标识符。

```bash
http://localhost:/path/page
```

Elysia 使用路径和方法来查找正确的资源。

<div class="bg-white rounded-lg">
    <img src="/essential/url-object.svg" alt="URL 代表" />
</div>

路径从源地址之后开始。以 **/** 开头，在查询参数 **(?)** 之前结束。

我们可以将 URL 和路径分类如下：

| URL                             | 路径         |
| ------------------------------- | ------------ |
| http://site.com/                | /            |
| http://site.com/hello           | /hello       |
| http://site.com/hello/world     | /hello/world |
| http://site.com/hello?name=salt | /hello       |
| http://site.com/hello#title     | /hello       |

::: tip
如果路径未指定，浏览器和 web 服务器将将路径视为 '/' 作为默认值。
:::

Elysia 将对每个请求进行 [路由](/essential/route) 查找，并使用 [处理程序](/essential/handler) 函数进行响应。

## 动态路径

URLs 可以是静态和动态的。

静态路径是硬编码的字符串，可以用于定位服务器上的资源，而动态路径匹配某些部分并捕获值以提取额外的信息。

例如，我们可以从路径名中提取用户 ID。例如：

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
                      // ^?
    .listen(3000)
```

<br>

这里动态路径是通过 `/id/:id` 创建的，告诉 Elysia 匹配直到 `/id` 的任何路径。之后的部分将存储为 **params** 对象。

<Playground
  :elysia="demo6"
  :alias="{
    '/id/:id': '/id/1'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    }
  }"
/>

请求时，服务器应该返回以下响应：

| 路径                   | 响应  |
| ---------------------- | ------- |
| /id/1                  | 1       |
| /id/123                | 123     |
| /id/anything           | anything  |
| /id/anything?name=salt | anything  |
| /id                    | 未找到  |
| /id/anything/rest      | 未找到  |

动态路径非常适合包括如 ID 之类的内容，这些可以后续使用。

我们将命名变量路径称为 **路径参数** 或简称为 **params**。

## 段

URL 段是组成完整路径的每个路径。

段由 `/` 分隔。
![URL 段的表示](/essential/url-segment.webp)

Elysia 中的路径参数通过在段前加上 ':' 后跟名称来表示。
![路径参数的表示](/essential/path-parameter.webp)

路径参数允许 Elysia 捕获 URL 的特定段。

命名的路径参数将存储在 `Context.params` 中。

| 路由     | 路径   | 参数  |
| --------- | ------ | ------- |
| /id/:id   | /id/1  | id=1    |
| /id/:id   | /id/hi | id=hi   |
| /id/:name | /id/hi | name=hi |

## 多个路径参数

你可以有任意多个路径参数，这些参数将存储在一个 `params` 对象中。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/:id/:name', ({ params: { id, name } }) => id + ' ' + name)
                             // ^?
    .listen(3000)
```

<br>
<br>

<Playground
  :elysia="demo7"
  :alias="{
    '/id/:id': '/id/1',
    '/id/:id/:name': '/id/anything/rest'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    },
    '/id/:id/:name': {
      GET: 'anything rest'
    }
  }"
/>

服务器将返回以下响应：

| 路径                   | 响应      |
| ---------------------- | ------------- |
| /id/1                  | 1             |
| /id/123                | 123           |
| /id/anything           | anything      |
| /id/anything?name=salt | anything      |
| /id                    | 未找到     |
| /id/anything/rest      | anything rest |

## 可选路径参数
有时我们可能希望静态路径和动态路径解析为相同的处理程序。

我们可以通过在参数名称后添加问号 `?` 来使路径参数可选。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id?', ({ params: { id } }) => `id ${id}`)
                          // ^?
    .listen(3000)
```

<br>

<Playground
  :elysia="demo3"
  :alias="{
    '/id/:id': '/id/1'
  }"
  :mock="{
    '/id/:id': {
      GET: 'id 1'
    },
  }"
/>

服务器将返回以下响应：

| 路径                   | 响应      |
| ---------------------- | ------------- |
| /id                    | id undefined  |
| /id/1                  | id 1          |

## 通配符

动态路径允许捕获 URL 的某些段。

但是，当你需要路径的值更动态，并希望捕获其余的 URL 段时，可以使用通配符。

通配符可以使用 "\*" 捕获段之后的值，无论数量。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/*', ({ params }) => params['*'])
                    // ^?
    .listen(3000)
```

<br>

<Playground
  :elysia="demo9"
  :alias="{
    '/id/:id': '/id/1',
    '/id/:id/:name': '/id/anything/rest'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    },
    '/id/:id/:name': {
      GET: 'anything/rest'
    }
  }"
/>

在这种情况下，服务器将返回以下响应：

| 路径                   | 响应      |
| ---------------------- | ------------- |
| /id/1                  | 1             |
| /id/123                | 123           |
| /id/anything           | anything      |
| /id/anything?name=salt | anything      |
| /id                    | 未找到     |
| /id/anything/rest      | anything/rest |

通配符非常适合捕获达到特定点的路径。

::: tip
你可以将通配符与路径参数一起使用。
:::

## HTTP 动词

HTTP 定义了一组请求方法，以指示对给定资源要执行的操作。

有几个 HTTP 动词，但最常见的包括：

### GET

使用 GET 的请求应该仅用于检索数据。

### POST

将有效负载提交到指定资源，通常导致状态更改或副作用。

### PUT

使用请求的有效负载替换目标资源的所有当前表示。

### PATCH

对资源进行部分修改。

### DELETE

删除指定的资源。

---

为了处理每个不同的动词，Elysia 具有内置 API 可用于多个 HTTP 动词，与 `Elysia.get` 类似。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', '你好')
    .post('/hi', '嗨')
    .listen(3000)
```

<Playground :elysia="demo2" />

Elysia HTTP 方法接受以下参数：

-   **path**: 路径名
-   **function**: 对客户端响应的函数
-   **hook**: 额外的元数据

你可以在 [HTTP 请求方法](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) 中阅读更多关于 HTTP 方法的信息。

## 自定义方法

我们可以使用 `Elysia.route` 接受自定义 HTTP 方法。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/get', 'hello')
    .post('/post', 'hi')
    .route('M-SEARCH', '/m-search', 'connect') // [!code ++]
    .listen(3000)
```

<Playground :elysia="demo8" />

**Elysia.route** 接受以下内容：

-   **method**: HTTP 动词
-   **path**: 路径名
-   **function**: 对客户端响应的函数
-   **hook**: 额外的元数据

导航到每个方法时，你应该看到以下结果：
| 路径 | 方法 | 结果 |
| --------- | -------- | ------- |
| /get      | GET      | hello   |
| /post     | POST     | hi      |
| /m-search | M-SEARCH | connect |

::: tip
基于 [RFC 7231](https://www.rfc-editor.org/rfc/rfc7231#section-4.1)，HTTP 动词是区分大小写的。

建议使用大写约定为 Elysia 定义自定义 HTTP 动词。
:::

## Elysia.all

Elysia 提供了一个 `Elysia.all`，用于处理指定路径的任何 HTTP 方法，通过与 **Elysia.get** 和 **Elysia.post** 使用相同的 API。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .all('/', '嗨')
    .listen(3000)
```

<Playground :elysia="demo4" />

任何与该路径匹配的 HTTP 方法，将被处理如下：
| 路径 | 方法 | 结果 |
| ---- | -------- | ------ |
| / | GET | 嗨 |
| / | POST | 嗨 |
| / | DELETE | 嗨 |

## 处理

大多数开发人员使用 REST 客户端，如 Postman、Insomnia 或 Hoppscotch 测试他们的 API。

然而，Elysia 可以使用 `Elysia.handle` 通过编程方式进行测试。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', '你好')
    .post('/hi', '嗨')
    .listen(3000)

app.handle(new Request('http://localhost/')).then(console.log)
```

**Elysia.handle** 是处理发送到服务器的实际请求的函数。

::: tip
与单元测试的 mock 不同，**你可以期望它表现得像发送到服务器的实际请求**。

但也有助于模拟或创建单元测试。
:::

## 404

如果没有路径与定义的路由匹配，Elysia 将在返回 **"NOT_FOUND"** 和 HTTP 状态码 404 之前将请求传递给 [error](/essential/life-cycle.html#on-error) 生命周期。

我们可以通过从 `error` 生命周期返回一个值来处理自定义的 404 错误，如下所示：

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', '嗨')
    .onError(({ code }) => {
        if (code === 'NOT_FOUND') {
            return '路由未找到 :('
        }
    })
    .listen(3000)
```

<Playground :elysia="demo5" />

当导航到你的 web 服务器时，你应该看到以下结果：

| 路径 | 方法 | 结果              |
| ---- | ------ | ------------------- |
| /    | GET    | 嗨                  |
| /    | POST   | 路由未找到 :\( |
| /hi  | GET    | 路由未找到 :\( |

你可以在 [生命周期事件](/essential/life-cycle#events) 和 [错误处理](/essential/life-cycle.html#on-error) 中了解更多关于生命周期和错误处理的信息。

::: tip
HTTP 状态用于指示响应的类型。 默认情况下，如果一切正确，服务器将返回 '200 OK' 状态码（如果路由匹配且没有错误，Elysia 将默认返回 200）。

如果服务器未能找到任何可处理的路由，在这种情况下，服务器将返回 '404 NOT FOUND' 状态码。
:::

## 组

在创建 web 服务器时，你通常会有多个路由共享相同的前缀：

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .post('/user/sign-in', '登录')
    .post('/user/sign-up', '注册')
    .post('/user/profile', '个人资料')
    .listen(3000)
```

<Playground :elysia="demo11" />

这可以通过 `Elysia.group` 改进，允许我们通过将它们分组一起应用前缀到多个路由：

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .group('/user', (app) =>
        app
            .post('/sign-in', '登录')
            .post('/sign-up', '注册')
            .post('/profile', '个人资料')
    )
    .listen(3000)
```

<Playground :elysia="demo12" />

这段代码的行为与我们的第一个示例相同，结构如下：

| 路径          | 结果  |
| ------------- | ------- |
| /user/sign-in | 登录 |
| /user/sign-up | 注册 |
| /user/profile | 个人资料 |

`.group()` 还可以接受一个可选的保护参数，以减少同时使用组和保护的样板代码：

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group(
        '/user',
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app
            .post('/sign-in', '登录')
            .post('/sign-up', '注册')
            .post('/profile', '个人资料')
    )
    .listen(3000)
```

你可以在 [作用域](/essential/plugin.html#scope) 中找到有关分组保护的更多信息。

### 前缀

我们可以通过为构造函数提供 **前缀** 将一组分离到一个单独的插件实例，以减少嵌套。

```typescript
import { Elysia } from 'elysia'

const users = new Elysia({ prefix: '/user' })
    .post('/sign-in', '登录')
    .post('/sign-up', '注册')
    .post('/profile', '个人资料')

new Elysia()
    .use(users)
    .get('/', '你好，世界')
    .listen(3000)
```

<Playground :elysia="demo13" />
