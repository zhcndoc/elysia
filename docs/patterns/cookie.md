---
title: 响应式 Cookie
head:
  - - meta
    - property: 'og:title'
      content: 响应式 Cookie - Elysia 中文文档

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
```ts
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { name } }) => {
        // Get
        name.value

        // Set
        name.value = "New Value"
    })
```

默认情况下，响应式 Cookie 可以自动编码/解码对象类型，使我们能够将 Cookie 视为一个对象，无需担心编码/解码。**它只是起作用**。

## 响应式
Elysia Cookie 是具有响应式的。这意味着当你更改 Cookie 值时，基于信号的方法会自动更新 Cookie。

Elysia Cookie 提供了处理 Cookie 的单一事实来源，它具有自动设置标头和同步 Cookie 值的能力。

由于默认情况下 Cookie 是依赖代理的对象，提取的值永远不会是 **undefined**；而是始终是一个 `Cookie<unknown>` 的值，可以通过调用**。value** 属性来获取。

我们可以将 Cookie 存储库视为常规对象，迭代它只会迭代已存在的 Cookie 值。

## Cookie 属性
要使用 Cookie 属性，你可以使用以下其中之一：

1. 直接设置属性
2. 使用 `set` 或 `add` 更新 Cookie 属性。

有关更多信息，请参阅 [cookie attribute config](/patterns/cookie-signature#config)。

### 分配属性
你可以像操作普通对象一样获取/设置 Cookie 的属性，响应式模型会自动同步 Cookie 值。

```ts
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

**set** 允许通过**重置所有属性**并使用新值覆盖属性来同时更新多个 Cookie 属性。

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
与 **set** 类似，**add** 允许我们一次性更新多个 Cookie 属性，但只会覆盖已定义的属性，而不是重置所有属性。

## remove
要删除一个 Cookie，你可以使用以下方法之一：
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
通过引入 Cookie Schema 和 `t.Cookie` 类型，我们能够创建一个统一类型来自动处理签发/验证 cookie 签名。

Cookie 签名是一种加密哈希，它附加到 cookie 的值上，使用密钥和 cookie 的内容生成，通过在 cookie 上添加签名来增强安全性。

这确保了 cookie 值没有被恶意行为者修改，有助于验证 cookie 数据的真实性和完整性。

## 使用 Cookie 签名
通过提供一个 cookie 密钥，以及 `sign` 属性来指示哪些 cookie 应该进行签名验证。
```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ cookie: { profile } }) => {
        profile.value = {
            id: 617,
            name: 'Summoning 101'
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

然后 Elysia 自动签名字符串和取消签名 cookie 值。

## Constructor
你可以使用 Elysia 构造器来设置全局 Cookie `secret`，并将 `sign` 值应用于所有全局路由，而不是内联到每个需要的路由中。

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
            name: 'Summoning 101'
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

## Cookie Rotation
Elysia 自动处理 Cookie 的秘密轮换。

Cookie 轮换是一种迁移技术，使用较新的秘密对 Cookie 进行签名，同时也能验证 Cookie 的旧签名。

```ts
import { Elysia } from 'elysia'

new Elysia({
    cookie: {
        secrets: ['Vengeance will be mine', 'Fischl von Luftschloss Narfidort']
    }
})
```

## Config
下面是被 Elysia 接受的 cookie 配置。

### secret
用于签名/取消签名的 cookie 的密钥。

如果传递了一个数组，将使用密钥轮换。

密钥轮换是在加密密钥退役并被生成的新密码密钥替换时。

---
下面是一个从 [cookie](https://npmjs.com/package/cookie) 扩展的配置

### domain
指定 [Domain Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.3)的值。

默认情况下，不设置域，大多数客户端将认为 cookie 只适用于当前域。


### encode
@default `encodeURIComponent`

指定一个函数，该函数将用于编码 cookie 的值。

由于 cookie 的值具有有限的字符集（并且必须是一个简单的字符串），因此可以使用此函数将值编码为适合 cookie 值的字符串。

默认函数是全局的 `encodeURIComponent`，它将编码一个 JavaScript 字符串为 UTF-8 字节序列，然后对超出 cookie 范围的任何字节序列进行 URL 编码。

### expires
指定 Date 对象作为 [Expires Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.1) 的值。

默认情况下，不设置过期时间，大多数客户端会将这视为一个 "非持久性 cookie"，并在退出网络浏览器应用程序等条件下删除它。

::: tip
[cookie 存储模型规范](https://tools.ietf.org/html/rfc6265#section-5.3)指出，如果同时设置了 `expires` 和 `maxAge`，那么 `maxAge` 将优先考虑，但并非所有客户端都遵守这一点，因此如果同时设置了两者，它们应该指向相同的日期和时间。
:::

### httpOnly
@default `false`

指定 [HttpOnly Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.6)的布尔值。

当值为真时，设置 HttpOnly 属性，否则不设置。

默认情况下，HttpOnly 属性不设置。

::: tip
在设置为 true 时请小心，因为合规客户端不允许客户端 JavaScript 在 `document.cookie` 中看到 cookie。
:::

### maxAge
@default `undefined`

指定秒数（秒）作为 [Max-Age Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.2)的值。

给出的数字将被转换为整数，向下取整。默认情况下，不设置最大年龄。

::: tip
[cookie 存储模型规范](https://tools.ietf.org/html/rfc6265#section-5.3)指出，如果同时设置了 `expires` 和 `maxAge`，那么 `maxAge` 将优先考虑，但并非所有客户端都遵守这一点，因此如果同时设置了两者，它们应该指向相同的日期和时间。
:::

### 路径
指定 [Path Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.4) 的值。

默认情况下，路径处理程序被视为默认路径。

### 优先级
指定字符串作为[优先级 Set-Cookie 属性](https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1)的值。
`low` 将设置优先级属性为 Low。
`medium` 将设置优先级属性为 Medium，未设置时的默认优先级。
`high` 将设置优先级属性为 High。

有关不同优先级级别的更多信息，请参阅[规范](https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1)。

::: tip
这是一个尚未完全标准化的属性，将来可能会发生变化。这也意味着许多客户端可能会忽略这个属性，直到他们理解它。
:::

### sameSite
指定布尔值或字符串作为 [SameSite Set-Cookie 属性](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7)的值。
true 将把 SameSite 属性设置为 Strict，以进行严格的相同站点强制执行。
false 将不会设置 SameSite 属性。
'lax' 将设置 SameSite 属性为 Lax，以实现宽松的同站策略执行。
'none' 将会为显式跨站 cookie 设置 SameSite 属性为 None。
'strict' 将设置 SameSite 属性为 Strict，以进行严格的相同站点强制执行。
关于不同执行级别的更多信息，可以参阅[规范](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7)。

::: tip
这是一个尚未完全标准化的属性，将来可能会发生变化。这也意味着许多客户端可能会忽略这个属性，直到他们理解它。
:::

### 安全
指定 [RFC 6265 第 5.2.5 节中提到的安全 Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.5)的布尔值。当值为真时设置安全属性，否则不设置。默认情况下不设置安全属性。

::: tip
在设置为 true 时请小心，因为合规的客户端如果浏览器没有 HTTPS 连接，将来将不会将 cookie 发送回服务器。
:::
