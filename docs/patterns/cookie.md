---
title: 响应式 Cookie
head:
  - - meta
    - property: 'og:title'
      content: 响应式 Cookie - ElysiaJS 中文文档

  - - meta
    - name: 'description'
      content: 响应式 Cookie 采用类似信号的现代方法来处理 Cookie，并提供了人性化的 API。没有 "getCookie"、"setCookie"，一切都是一个 Cookie 对象。当你想要使用 Cookie 时，你只需直接提取名称和值。

  - - meta
    - property: 'og:description'
      content: 响应式 Cookie 采用类似信号的现代方法来处理 Cookie，并提供了人性化的 API。没有 "getCookie"、"setCookie"，一切都是一个 Cookie 对象。当你想要使用 Cookie 时，你只需直接提取名称和值。
---

# Cookie

要使用 Cookie，你可以提取 cookie 属性并直接访问其名称和值。

没有获取/设置的操作，你可以提取 cookie 名称并直接检索或更新其值。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        // Get
        name.value

        // Set
        name.value = "New Value"
        name.value = {
            hello: 'world'
        }
    })
```

默认情况下，响应式 Cookie 可以自动编码/解码对象类型，使我们能够将 Cookie 视为一个对象，无需担心编码/解码。**它只是起作用**。

## 响应式

Elysia Cookie 是具有响应式的。这意味着当你更改 Cookie 值时，基于信号的方法会自动更新 Cookie。

Elysia Cookie 提供了处理 Cookie 的单一事实来源，它具有自动设置标头和同步 Cookie 值的能力。

由于默认情况下 Cookie 是依赖代理的对象，提取的值永远不会是 **undefined**；而是始终是一个 `Cookie<unknown>` 的值，可以通过调用 **.value** 属性来获取。

我们可以将 Cookie 存储库视为常规对象，迭代它只会迭代已存在的 Cookie 值。

## Cookie 属性

要使用 Cookie 属性，你可以使用以下其中之一：

1. 直接设置属性
2. 使用 `set` 或 `add` 更新 Cookie 属性。

有关更多信息，请参阅 [cookie attribute config](/patterns/cookie-signature#config)。

### 分配属性

你可以像操作普通对象一样获取/设置 Cookie 的属性，响应式模型会自动同步 Cookie 值。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        // get
        name.domain

        // set
        name.domain = 'millennium.sh'
        name.httpOnly = true
    })
```

## set

**set** 允许通过 **重置所有属性** 并使用新值覆盖属性来同时更新多个 Cookie 属性。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        name.set({
            domain: 'millennium.sh',
            httpOnly: true
        })
    })
```

## add

与 **set** 类似，**add** 允许我们一次性更新多个 Cookie 属性，但只会覆盖已定义的属性，而不是重置所有属性。

## remove

要删除一个 Cookie，你可以使用以下方法之一：
1. name.remove
2. delete cookie.name

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ cookie, cookie: { name } }) => {
        name.remove()

        delete cookie.name
    })
```

## Cookie 架构

你可以使用 `t.Cookie` 和 Cookie 架构严格验证 Cookie 类型，并为 Cookie 提供类型推断。

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        // Set
        name.value = {
            id: 617,
            name: 'Summoning 101'
        }
    }, {
        cookie: t.Cookie({
            name: t.Object({
                id: t.Numeric(),
                name: t.String()
            })
        })
    })
```

## 可空 Cookie

要处理可空的 Cookie 值，你可以在要设置为可空的 Cookie 名称上使用 `t.Optional`。

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        // Set
        name.value = {
            id: 617,
            name: 'Summoning 101'
        }
    }, {
        cookie: t.Cookie({
            value: t.Optional(
                t.Object({
                    id: t.Numeric(),
                    name: t.String()
                })
            )
        })
    })
```
