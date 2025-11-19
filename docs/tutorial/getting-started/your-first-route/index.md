---
title: 你的第一条路由 - Elysia 教程
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: 你的第一条路由 - Elysia 教程

    - - meta
      - name: 'description'
        content: Elysia 中有 3 种路径。静态路径、动态路径和通配符。了解如何使用它们来创建你的第一条路由。

    - - meta
      - property: 'og:description'
        content: Elysia 中有 3 种路径。静态路径、动态路径和通配符。了解如何使用它们来创建你的第一条路由。
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'

const demo3 = new Elysia()
	  .get('/id', () => `id: undefined`)
    .get('/id/:id', ({ params: { id } }) => `id: ${id}`)

const demo6 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/anything/test', ({ status }) => status(404))

const demo9 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/:id/:name', ({ params: { id, name } }) => id + '/' + name)
</script>

<Editor :code="code" :testcases="testcases" doc="/essential/route">

# 你的第一条路由

当我们访问一个网站时，它会接收
1. **路径**，例如 `/`、`/about` 或 `/contact`
2. **方法**，例如 `GET`、`POST` 或 `DELETE`

以确定要显示的资源，这被简单称为 **"路由"**。

在 Elysia 中，我们可以通过以下方式定义路由：
1. 调用以 HTTP 方法命名的方法
2. 路径作为第一个参数
3. 处理程序作为第二个参数

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', '你好，世界！')
	.listen(3000)
```

## 路由
Elysia 中的路径可以分为 3 种类型：

1. 静态路径 - 硬编码字符串以定位服务器上的资源
2. 动态路径 - 段可以是任何值
3. 通配符 - 路径直到特定点可以是任何内容

查看 <DocLink href="/essential/route">路由</DocLink>。

## 静态路径

静态路径是一个硬编码字符串，用于定位服务器上的资源。

```ts
import { Elysia } from 'elysia'

new Elysia()
	.get('/hello', '你好')
	.get('/hi', '嗨')
	.listen(3000)
```

查看 <DocLink href="/essential/route#static-path">静态路径</DocLink>。

## 动态路径

动态路径匹配某些部分并捕获值以提取额外信息。

要定义动态路径，我们可以使用冒号 `:` 之后跟名称。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .listen(3000)
```

在这里，动态路径通过 `/id/:id` 创建。这告诉 Elysia 捕获值为 `:id` 的段，例如 **/id/1**、**/id/123**、**/id/anything**。

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

查看 <DocLink href="/essential/route#dynamic-path">动态路径</DocLink>。

### 可选路径参数
我们可以通过在参数名称后添加问号 `?` 来使路径参数变为可选。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id?', ({ params: { id } }) => `id ${id}`)
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

查看 <DocLink href="/essential/route#optional-path-parameters">可选路径参数</DocLink>。

## 通配符

动态路径允许捕获单个段，而通配符允许捕获路径的其余部分。

要定义通配符，我们可以使用星号 `*`。

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/*', ({ params }) => params['*'])
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

查看 <DocLink href="/essential/route#wildcards">通配符</DocLink>。

## 任务

让我们回顾一下，并创建 3 条具有不同类型的路径：

<template #answer>

1. 静态路径 `/elysia`，响应为 `"Hello Elysia!"`
2. 动态路径 `/friends/:name?`，响应为 `"Hello {name}!"`
3. 通配符路径 `/flame-chasers/*`，响应为路径其余部分。

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/elysia', '你好 Elysia！')
	.get('/friends/:name?', ({ params: { name } }) => `你好 ${name}！`)
	.get('/flame-chasers/*', ({ params }) => params['*'])
	.listen(3000)
```

</template>

</Editor>