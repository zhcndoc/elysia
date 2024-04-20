---
title: 路径 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: 路径 - ElysiaJS

    - - meta
      - name: 'description'
        content: 路径或路径名是用于定位服务器资源的标识符。Elysia 使用路径和方法来查找正确的资源。Elysia 中的路径可分为 3 种类型。静态、动态和通配符。

    - - meta
      - property: 'og:description'
        content: 路径或路径名是用于定位服务器资源的标识符。Elysia 使用路径和方法来查找正确的资源。Elysia 中的路径可分为 3 种类型。静态、动态和通配符。
---

<script setup>
import Playground from '../../components/nearl/playground.vue'

import { Elysia } from 'elysia'

const demo1 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ error }) => error(404))
    .get('/id/anything/test', ({ error }) => error(404))

const demo2 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ error }) => error(404))
    .get('/id/:id/:name', ({ params: { id, name } }) => id + ' ' + name)

const demo3 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ error }) => error(404))
    .get('/id/:id/:name', ({ params: { id, name } }) => id + '/' + name)

const demo4 = new Elysia()
    .get('/id/1', () => 'static path')
    .get('/id/:id', () => 'dynamic path')
    .get('/id/*', () => 'wildcard path')
</script>

# 路径

路径或路径名是从服务器查找资源的标识符。

```bash
http://localhost:/path/page
```

Elysia 使用路径和方法来查找正确的资源。

<div class="bg-white rounded-lg">
    <img src="/essential/url-object.svg" alt="URL Representation" />
</div>

路径从原点后开始，前缀为 `/`，在 `serach` 查询 **（?）**

我们可以将 URL 和路径分类如下：

| URL                             | Path         |
| ------------------------------- | ------------ |
| http://site.com/                | /            |
| http://site.com/hello           | /hello       |
| http://site.com/hello/world     | /hello/world |
| http://site.com/hello?name=salt | /hello       |
| http://site.com/hello#title     | /hello       |

::: tip
如果未指定路径，浏览器和网络服务器将把路径默认为 "/"。
:::

Elysia 将使用[处理](/essential/handler)函数查找每个请求的[路由](/essential/route)和响应。

## 动态路径

URL 可以是静态的也可以是动态的。

静态路径意味着可以使用硬编码字符串从服务器定位资源，而动态路径则匹配某些部分并捕获该值以提取额外信息。

例如，我们可以从路径名中提取用户 ID，我们可以执行以下操作：

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
                      // ^?
    .listen(3000)
```

我们用 `/id/:id` 创建了一个动态路径，它告诉 Elysia 匹配 `/id` 之前的任何路径，而 `/id`之 后的路径可以是任何值，然后将其存储为 **params** 对象。

<Playground
  :elysia="demo1"
  :alias="{
    '/id/:id': '/id/1'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    }
  }" 
/>

当请求时，服务器应返回如下响应：

| Path                   | Response  |
| ---------------------- | --------- |
| /id/1                  | 1         |
| /id/123                | 123       |
| /id/anything           | anything  |
| /id/anything?name=salt | anything  |
| /id                    | Not Found |
| /id/anything/rest      | Not Found |

动态路径非常适合强制 URL 包含重要信息（例如 ID），以便以后使用。

我们将命名变量路径称为**路径参数**或简称为 **params** 。

## 分段

URL 段是组成完整路径的每个路径。

段之间用 `/` 分隔。

![Representation of URL segments](/essential/url-segment.webp)

Elysia 中的路径参数通过在段前面加上 `:` 前缀后跟名称来表示。

![Representation of path parameter](/essential/path-parameter.webp)

路径参数允许 Elysia 捕获 URL 的特定段。

命名的路径参数将存储在 `Context.params`.

| Route     | Path   | Params  |
| --------- | ------ | ------- |
| /id/:id   | /id/1  | id=1    |
| /id/:id   | /id/hi | id=hi   |
| /id/:name | /id/hi | name=hi |

## 多路径参数

你可以拥有任意数量的路径参数，然后这些参数将存储到 `params`。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/:id/:name', ({ params: { id, name } }) => id + ' ' + name)
                             // ^?
    .listen(3000)
```

<Playground
  :elysia="demo2"
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

向服务器发出请求应返回如下响应：

| Path                   | Response      |
| ---------------------- | ------------- |
| /id/1                  | 1             |
| /id/123                | 123           |
| /id/anything           | anything      |
| /id/anything?name=salt | anything      |
| /id                    | Not Found     |
| /id/anything/rest      | anything rest |

## 通配符

动态路径允许我们捕捉 URL 的某些部分。

但是，如果需要路径值更加动态，并捕获 URL 段的其余部分，则可以使用通配符。

通配符可以通过使用 `*` 来捕获段后的值，而不管其数量多少。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/*', ({ params }) => params['*'])
                    // ^?
    .listen(3000)
```

<Playground
  :elysia="demo3"
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

向服务器发送请求应返回如下响应：

| Path                   | Response      |
| ---------------------- | ------------- |
| /id/1                  | 1             |
| /id/123                | 123           |
| /id/anything           | anything      |
| /id/anything?name=salt | anything      |
| /id                    | Not Found     |
| /id/anything/rest      | anything/rest |

通配符对于捕获直到特定点的路径很有用。

::: tip
你可以将通配符与路径参数一起使用。
:::

## 总结

总结一下，Elysia 中的路径可以分为 3 种类型：

- **静态路径** - 用于定位资源的静态字符串
- **动态路径** - 段可以是任何值
- **通配符** - 直到特定点的路径可以是任何值


你可以同时使用所有路径类型，为你的网络服务器创建一个行为。

路径的优先级排列如下：

1. 静态路径
2. 动态路径
3. 通配符

如果路径解析为静态通配符动态路径，Elysia 将解析静态路径而非动态路径

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/1', () => 'static path')
    .get('/id/:id', () => 'dynamic path')
    .get('/id/*', () => 'wildcard path')
    .listen(3000)
```

<Playground
  :elysia="demo4"
    :alias="{
    '/id/:id': '/id/2',
    '/id/*': '/id/2/a'
  }"
  :mock="{
    '/id/*': {
      GET: 'wildcard path'
    }
  }" 
/>

向服务器发送请求应返回如下响应：

| Path    | Response      |
| ------- | ------------- |
| /id/1   | static path   |
| /id/2   | dynamic path  |
| /id/2/a | wildcard path |
