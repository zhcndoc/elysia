---
title: 响应式 Cookie - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: 响应式 Cookie - ElysiaJS

  - - meta
    - name: 'description'
      content: 响应式 Cookie 采用更现代化的方法，类似信号，使用人性化的 API 来处理 Cookie。没有 'getCookie' 和 'setCookie'，一切都是一个 Cookie 对象。当你想使用 Cookie 时，可以直接提取名称和值。

  - - meta
    - property: 'og:description'
      content: 响应式 Cookie 采用更现代化的方法，类似信号，使用人性化的 API 来处理 Cookie。没有 'getCookie' 和 'setCookie'，一切都是一个 Cookie 对象。当你想使用 Cookie 时，可以直接提取名称和值。
---

# Cookie
要使用 Cookie，您可以提取 Cookie 属性并直接访问其名称和值。

没有 get/set，您可以直接提取 Cookie 名称并检索或更新其值。
```ts
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        // 获取
        name.value

        // 设置
        name.value = "新值"
    })
```

默认情况下，响应式 Cookie 可以自动编码/解码对象类型，使我们能够将 Cookie 视为对象，而无需担心编码/解码。**它就是这样工作的**。

## 响应性
Elysia 的 Cookie 是响应式的。这意味着当您更改 Cookie 值时，Cookie 会根据类似信号的方式自动更新。

Elysia Cookies 提供了处理 Cookies 的单一真实来源，能够自动设置头部并同步 Cookie 值。

由于 Cookies 默认是基于 Proxy 的对象，提取的值永远不会是 **undefined**；相反，它将始终是一个 `Cookie<unknown>` 的值，可以通过调用 **.value** 属性获取。

我们可以将 Cookie 罐视为常规对象，对其进行迭代只会迭代已经存在的 Cookie 值。

## Cookie 属性
要使用 Cookie 属性，您可以使用以下任一方法：

1. 直接设置属性
2. 使用 `set` 或 `add` 来更新 Cookie 属性。

有关更多信息，请参见 [Cookie 属性配置](/patterns/cookie.html#config)。

### 分配属性
您可以像对待任何普通对象一样获取/设置 Cookie 的属性，响应性模型会自动同步 Cookie 值。

```ts
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        // 获取
        name.domain

        // 设置
        name.domain = 'millennium.sh'
        name.httpOnly = true
    })
```

## set
**set** 允许一次更新多个 Cookie 属性，通过 **重置所有属性** 并用新值覆盖该属性。

```ts
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
与 **set** 相似，**add** 允许我们一次更新多个 Cookie 属性，但只会覆盖已定义的属性，而不是重置。

## remove
要移除 Cookie，您可以使用以下任一方法：
1. name.remove
2. delete cookie.name

```ts
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ cookie, cookie: { name } }) => {
        name.remove()

        delete cookie.name
    })
```

## Cookie 模式
您可以通过使用 `t.Cookie` 的 Cookie 模式严格验证 Cookie 类型，并提供 Cookie 的类型推断。

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        // 设置
        name.value = {
            id: 617,
            name: '召唤 101'
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
要处理可空 Cookie 值，您可以在您希望可空的 Cookie 名称上使用 `t.Optional`。

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        // 设置
        name.value = {
            id: 617,
            name: '召唤 101'
        }
    }, {
        cookie: t.Cookie({
            name: t.Optional(
                t.Object({
                    id: t.Numeric(),
                    name: t.String()
                })
            )
        })
    })
```

## Cookie 签名
通过引入 Cookie Schema，和 `t.Cookie` 类型，我们可以创建一个统一的类型来处理签名/验证 Cookie 签名。

Cookie 签名是附加到 Cookie 值的加密哈希，是使用秘密密钥和 Cookie 的内容生成的，以通过向 Cookie 添加签名来增强安全性。

这确保了 Cookie 值未被恶意行为者修改，有助于验证 Cookie 数据的真实性和完整性。

## 使用 Cookie 签名
通过提供 Cookie 密钥，以及 `sign` 属性来指示哪些 Cookie 应具有签名验证。
```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { profile } }) => {
        profile.value = {
            id: 617,
            name: '召唤 101'
        }
    }, {
        cookie: t.Cookie({
            profile: t.Object({
                id: t.Numeric(),
                name: t.String()
            })
        }, {
            secrets: 'Fischl von Luftschloss Narfidort',
            sign: ['profile']
        })
    })
```

Elysia 然后会自动签名和验证 Cookie 值。

## 构造函数
您可以使用 Elysia 构造函数设置全局 Cookie `secret` 和 `sign` 值，以适用于所有路由，而不是在每个需要的路由中内联。

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({
    cookie: {
        secrets: 'Fischl von Luftschloss Narfidort',
        sign: ['profile']
    }
})
    .get('/', ({ cookie: { profile } }) => {
        profile.value = {
            id: 617,
            name: '召唤 101'
        }
    }, {
        cookie: t.Cookie({
            profile: t.Object({
                id: t.Numeric(),
                name: t.String()
            })
        })
    })
```

## Cookie 轮换
Elysia 会自动处理 Cookie 的密钥轮换。

Cookie 轮换是一种迁移技术，用于使用较新的密钥对 Cookie 进行签名，同时也能够验证旧的 Cookie 签名。

```ts
import { Elysia } from 'elysia'

new Elysia({
    cookie: {
        secrets: ['复仇将属于我', 'Fischl von Luftschloss Narfidort']
    }
})
```

## 配置
以下是 Elysia 接受的 Cookie 配置。

### secret
用于签名/取消签名 Cookie 的密钥。

如果传递了一个数组，则将使用密钥轮换。

密钥轮换是指将加密密钥退役并通过生成新的加密密钥进行替换。

---
以下是从 [cookie](https://npmjs.com/package/cookie) 扩展的配置。

### domain
指定 [Domain Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.3) 的值。

默认情况下，没有设置域，大多数客户端将只考虑当前域的 Cookie。


### encode
@default `encodeURIComponent`

指定将用于编码 Cookie 值的函数。

由于 Cookie 的值具有有限的字符集（并且必须是简单字符串），因此可以使用此函数将值编码为适合 Cookie 值的字符串。

默认函数是全局的 `encodeURIComponent`，它会将 JavaScript 字符串编码为 UTF-8 字节序列，然后对落在 Cookie 范围外的进行 URL 编码。

### expires
指定作为 [Expires Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.1) 值的日期对象。

默认情况下，没有设置过期时间，大多数客户端将视其为“非持久性 Cookie”，并将在退出 Web 浏览器应用程序等条件下删除它。

::: tip
[Cookie 存储模型规范](https://tools.ietf.org/html/rfc6265#section-5.3) 规定，如果同时设置了 `expires` 和 `maxAge`，则 `maxAge` 优先，但并不是所有客户端都可能遵守，因此如果同时设置了它们，则应指向同一日期和时间。
:::

### httpOnly
@default `false`

指定布尔值作为 [HttpOnly Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.6) 的值。

当为真时，会设置 HttpOnly 属性，否则不会设置。

默认情况下，不设置 HttpOnly 属性。

::: tip
设置为 true 时要小心，因为符合规范的客户端将不允许客户端 JavaScript 在 `document.cookie` 中查看该 Cookie。
:::

### maxAge
@default `undefined`

指定作为 [Max-Age Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.2) 的值的数字（以秒为单位）。

给定的数字将通过向下取整进行转换。默认情况下，不设置最大年龄。

::: tip
[Cookie 存储模型规范](https://tools.ietf.org/html/rfc6265#section-5.3) 规定，如果同时设置了 `expires` 和 `maxAge`，则 `maxAge` 优先，但并不是所有客户端都可能遵守，因此如果同时设置了它们，则应指向同一日期和时间。
:::

### path
指定作为 [Path Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.4) 的值。

默认情况下，路径处理器被视为默认路径。

### priority
指定字符串作为 [Priority Set-Cookie 属性](https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1) 的值。
`low` 将把优先级属性设置为低。
`medium` 将把优先级属性设置为中，未设置时的默认优先级。
`high` 将把优先级属性设置为高。

有关不同优先级级别的更多信息，请参见 [规范](https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1)。

::: tip
这是一个尚未完全标准化的属性，未来可能会有所更改。这也意味着许多客户端可能会在理解之前忽略此属性。
:::

### sameSite
指定布尔值或字符串作为 [SameSite Set-Cookie 属性](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7) 的值。
`true` 将 SameSite 属性设置为严格的同站强制。
`false` 不会设置 SameSite 属性。
`'lax'` 将 SameSite 属性设置为宽松同站强制。
`'none'` 将 SameSite 属性设置为无以示明确的跨站 Cookie。
`'strict'` 将 SameSite 属性设置为严格的同站强制。
有关不同强制级别的更多信息，请参见 [规范](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7)。

::: tip
这是一个尚未完全标准化的属性，未来可能会有所更改。这也意味着许多客户端可能会在理解之前忽略此属性。
:::

### secure
指定布尔值作为 [Secure Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.5) 的值。当为真时，设置 Secure 属性，否则不设置。默认情况下，不设置 Secure 属性。

::: tip
设置为 true 时要小心，因为符合规范的客户端将在未来如果浏览器没有 HTTPS 连接时，不会将该 Cookie 发送回服务器。
:::
