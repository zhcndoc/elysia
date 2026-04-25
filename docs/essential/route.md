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
import TutorialBadge from '../components/arona/badge.vue'

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
    .get('/', () => 'hello')
    .get('/hi', ({ status }) => status(404, 'Route not found :('))

const demo6 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/anything/test', ({ status }) => status(404))

const demo7 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/:id/:name', ({ params: { id, name } }) => id + ' ' + name)

const demo8 = new Elysia()
    .get('/get', () => 'hello')
    .post('/post', () => 'hi')
    .route('M-SEARCH', '/m-search', () => 'connect')

const demo9 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
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

# 路由 <TutorialBadge href="/tutorial/getting-started/your-first-route" />

Web 服务器使用请求的**路径和方法**来查找正确的资源，这一过程称为**“路由”**。

We can define a route with **an HTTP verb method**, a path and a function to execute when matched.

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

Paths in Elysia can be grouped into 3 types:

-   **static paths** - static strings to locate the resource
-   **dynamic paths** - segments can be any value
-   **wildcards** - path until a specific point can be anything

你可以将所有这些路径类型组合起来，为你的 web 服务器设计行为。

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

## 静态路径

静态路径是硬编码的字符串，用于定位服务器上的资源。

```ts
import { Elysia } from 'elysia'

new Elysia()
	.get('/hello', 'hello')
	.get('/hi', 'hi')
	.listen(3000)
```

## 动态路径

动态路径匹配某部分内容并捕获该值得到额外信息。

定义动态路径时，可以使用冒号 `:` 后跟名称。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
                      // ^?
    .listen(3000)
```

<br>

这里，动态路径 `/id/:id` 会让 Elysia 捕获 `:id` 这个段的值，例如 **/id/1**、**/id/123**、**/id/anything**。

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

请求时，服务器会返回以下响应：

| 路径                   | 响应  |
| ---------------------- | ------- |
| /id/1                  | 1       |
| /id/123                | 123     |
| /id/anything           | anything  |
| /id/anything?name=salt | anything  |
| /id                    | 未找到  |
| /id/anything/rest      | 未找到  |

动态路径非常适合包含如 ID 这类稍后可用的变量。

我们将命名变量路径称为**路径参数**，简称**params**。

### 多个路径参数

你可以有多个路径参数，它们会存储在一个 `params` 对象中。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/:id/:name', ({ params: { id, name } }) => id + ' ' + name)
                             // ^?
    .listen(3000)
```

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

有时我们想让静态路径与动态路径解析到相同的处理程序。

可以通过在参数名称后加问号 `?` 来使路径参数可选。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id?', ({ params: { id } }) => `id ${id}`)
                          // ^?
    .listen(3000)
```

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

## 通配符

动态路径只捕获单个段，而通配符路径可捕获剩余路径。

定义通配符使用星号 `*`。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/*', ({ params }) => params['*'])
                    // ^?
    .listen(3000)
```

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

## 路径优先级

Elysia 的路径优先级如下：

## Path priority
Elysia has path priorities as follows:

1. static paths
2. dynamic paths
3. wildcards

If both a static and a dynamic path are present, Elysia will resolve the static path rather than the dynamic path.

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

## HTTP 动词

HTTP 定义了一组请求方法，指示对给定资源执行的操作。

常见的 HTTP 动词包括：

### GET

GET 请求仅用于获取数据。

### POST

提交负载到指定资源，通常导致状态更改或副作用。

### PUT

用请求负载替换目标资源的所有当前表示。

### PATCH

对资源进行部分修改。

### DELETE

删除指定资源。

---

为了支持不同动词，Elysia 内置多个 HTTP 动词API，与 `Elysia.get` 类似。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', '你好')
    .post('/hi', '嗨')
    .listen(3000)
```

<Playground :elysia="demo2" />

The Elysia HTTP method accepts the following parameters:

-   **path**: 路径名
-   **function**: 响应客户端的函数
-   **hook**: 额外元数据

你可以在 [HTTP 请求方法](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) 阅读更多关于 HTTP 方法的内容。

## 自定义方法

我们可以使用 `Elysia.route` 定义自定义 HTTP 方法。

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/get', 'hello')
    .post('/post', 'hi')
    .route('M-SEARCH', '/m-search', 'connect') // [!code ++]
    .listen(3000)
```

<Playground :elysia="demo8" />

**Elysia.route** 接受以下参数：

-   **method**: HTTP 动词
-   **path**: 路径名
-   **function**: 响应客户端的函数
-   **hook**: 额外元数据

<!--When navigating to each method, you should see the results as the following:
| Path      | Method   | Result  |
| --------- | -------- | ------- |
| /get      | GET      | hello   |
| /post     | POST     | hi      |
| /m-search | M-SEARCH | connect |-->

::: tip
基于 [RFC 7231](https://www.rfc-editor.org/rfc/rfc7231#section-4.1)，HTTP 动词是区分大小写的。

建议为 Elysia 自定义 HTTP 动词使用大写命名。
:::

### ALL 方法

Elysia 提供了 `Elysia.all`，用于处理指定路径的任意 HTTP 方法，API 与 **Elysia.get** 和 **Elysia.post** 一致。

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .all('/', '嗨')
    .listen(3000)
```

<Playground :elysia="demo4" />

所有匹配该路径的 HTTP 方法都将如下处理：
| 路径 | 方法 | 结果 |
| ---- | ---- | ---- |
| /    | GET  | 嗨   |
| /    | POST | 嗨   |
| /    | DELETE | 嗨 |

## 处理

大多数开发者使用 REST 客户端如 Postman、Insomnia 或 Hoppscotch 测试 API。

However, Elysia can be programmatically tested using `Elysia.handle`.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', '你好')
    .post('/hi', '嗨')
    .listen(3000)

app.handle(new Request('http://localhost/')).then(console.log)
```

**Elysia.handle** 是处理发送给服务器的真实请求的函数。

::: tip
与单元测试中的 mock 不同，**你可以期望它表现得像发送到服务器的真实请求**。

同时，也方便模拟或编写单元测试。
:::

## 组

If no path matches the defined routes, Elysia will pass the request to [error](/essential/life-cycle.html#on-error) life cycle before returning a **"NOT_FOUND"** with an HTTP status of 404.

We can handle a custom 404 error by returning a value from `error` life cycle like this:

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'hi')
    .onError(({ code }) => {
        if (code === 'NOT_FOUND') {
            return 'Route not found :('
        }
    })
    .listen(3000)
```

<Playground :elysia="demo5" />

When navigating to your web server, you should see the result as follows:

| Path | Method | Result              |
| ---- | ------ | ------------------- |
| /    | GET    | hi                  |
| /    | POST   | Route not found :\( |
| /hi  | GET    | Route not found :\( |

You can learn more about life cycle and error handling in [Life Cycle Events](/essential/life-cycle#events) and [Error Handling](/essential/life-cycle.html#on-error).

::: tip
HTTP 状态码用于指示响应的类型。默认情况下，如果一切正常，服务器会返回 ‘200 OK’ 状态码（如果路由匹配且无错误，Elysia 默认返回 200）

如果服务器未能找到任何处理该请求的路由，例如本例中，则服务器将返回 ‘404 NOT FOUND’ 状态码。
:::-->

## 分组

创建 Web 服务器时，通常会有多个路由共享相同的前缀：

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .post('/user/sign-in', '登录')
    .post('/user/sign-up', '注册')
    .post('/user/profile', '个人资料')
    .listen(3000)
```

<Playground :elysia="demo11" />

这可以用 `Elysia.group` 优化，将它们分组并统一添加前缀：

```typescript
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

这段代码行为与之前示例相同，路径结构：

| 路径          | 结果  |
| ------------- | ------- |
| /user/sign-in | 登录 |
| /user/sign-up | 注册 |
| /user/profile | 个人资料 |

`.group()` 还可接受可选保护参数，减少同时应用组和保护层的样板代码：

```typescript
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

更多分组和保护信息见 [作用域](/essential/plugin.html#scope)。

### 前缀

还可以给构造函数传入 **prefix**，将一组路由分离到单独的插件实例，避免嵌套：

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