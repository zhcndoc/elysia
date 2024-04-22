---
title: Cookie 签名
head:
  - - meta
    - property: 'og:title'
      content: Cookie 签名 - ElysiaJS 中文文档

  - - meta
    - name: 'description'
      content: Cookie 签名是附加在 cookie 值上的密码哈希，使用一个秘钥和 cookie 内容生成，通过向 cookie 添加签名来增强安全性。

  - - meta
    - property: 'og:description'
      content: Cookie 签名是附加在 cookie 值上的密码哈希，使用一个秘钥和 cookie 内容生成，通过向 cookie 添加签名来增强安全性。
---

# Cookie 签名

最后，通过引入 Cookie Schema 和 `t.Cookie` 类型，我们能够创建一个统一的类型，用于自动处理签名/验证 Cookie 签名。

Cookie 签名是一个加密哈希，附加在 Cookie 的值上，使用秘密密钥和 Cookie 的内容生成，通过为 Cookie 添加签名来增强安全性。

这确保了 Cookie 值不会被恶意操作者修改，有助于验证 Cookie 数据的真实性和完整性。

## 使用 Cookie 签名

通过提供一个 Cookie 密钥和 `sign` 属性来指示哪些 Cookie 应该进行签名验证。
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

Elysia 会自动对 Cookie 值进行签名和取消签名。

## 构造函数

你可以使用 Elysia 构造函数设置全局 Cookie `secret` 和 `sign` 值，以便在需要的每个路由中内联应用。

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

## Cookie 轮换

Elysia 会自动处理 Cookie 的密钥轮换。

Cookie 轮换是一种迁移技术，用于使用较新的密钥对 Cookie 进行签名，同时能够验证 Cookie 的旧签名。

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
    cookie: {
        secrets: ['Vengeance will be mine', 'Fischl von Luftschloss Narfidort']
    }
})
```

## 配置

以下是 Elysia 接受的 Cookie 配置。

### secret

用于签名/取消签名 Cookie 的密钥。

如果传递了一个数组，将使用密钥轮换。

密钥轮换是一种将加密密钥退役并通过生成新的加密密钥来替换的过程。

---
以下是从 [cookie](https://npmjs.com/package/cookie) 扩展的配置。

### domain

指定 [Domain Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.3)的值。

默认情况下，不设置域，大多数客户端将只将Cookie应用于当前域。

### encode
@default `encodeURIComponent`

指定用于编码 Cookie 值的函数。

由于 Cookie 的值具有有限的字符集（必须是简单字符串），该函数可用于将值编码为适用于 Cookie 值的字符串。

默认函数是全局的 `encodeURIComponent`，它将 JavaScript 字符串编码为 UTF-8 字节序列，然后对超出 Cookie 范围的字节进行 URL 编码。

### expires

指定用于 [Expires Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.1)的 Date 对象的值。

默认情况下，不设置过期时间，大多数客户端将将其视为“非持久性 Cookie”，并在条件（例如退出 Web 浏览器应用程序）下将其删除。

::: tip
[Cookie 存储模型规范](https://tools.ietf.org/html/rfc6265#section-5.3)规定，如果同时设置了 `expires` 和 `maxAge`，则 `maxAge` 优先，但并非所有客户端都遵守此规定，因此如果同时设置了两者，它们应该指向相同的日期和时间。
:::

### httpOnly
@default `false`

指定 [HttpOnly Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.6)的布尔值。

当为真时，设置 HttpOnly 属性，否则不设置。

默认情况下，不设置 HttpOnly 属性。

::: tip
将其设置为 true 时要小心，因为符合规范的客户端将不允许客户端 JavaScript 查看 `document.cookie` 中的 Cookie。
:::

### maxAge

@default `undefined`

指定用于 [Max-Age Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.2)的秒数。

给定的数字将被四舍五入转换为整数。默认情况下，不设置最大年龄。

::: tip
[Cookie 存储模型规范](https://tools.ietf.org/html/rfc6265#section-5.3)规定，如果同时设置了 `expires` 和 `maxAge`，则 `maxAge` 优先，但并非所有客户端都遵守此规定，因此如果同时设置了两者，它们应该指向相同的日期和时间。
:::

### path

指定 [Path Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.4)的值。

默认情况下，路径处理程序被视为默认路径。

### priority

指定要用于 [Priority Set-Cookie 属性](https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1)的字符串值。

- `low` 将 Priority 属性设置为 Low。
- `medium` 将Priority 属性设置为 Medium，这是默认优先级。
- `high` 将 Priority 属性设置为 High。

有关不同优先级级别的更多信息，请参阅[规范](https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1)。

::: tip
这是一个尚未完全标准化的属性，可能会在将来发生变化。这也意味着许多客户端可能会忽略此属性，直到他们理解它为止。
:::

### sameSite

指定要用于 [SameSite Set-Cookie 属性](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7)的布尔值或字符串。

- `true` 将 SameSite 属性设置为 Strict，以进行严格的同站点执行。
- `false` 不设置 SameSite 属性。
- `lax` 将 SameSite 属性设置为 Lax，以进行宽松的同站点执行。
- `none` 将 SameSite 属性设置为 None，以进行显式的跨站点 Cookie。
- `strict` 将 SameSite 属性设置为 Strict，以进行严格的同站点执行。

有关不同执行级别的更多信息，请参阅[规范](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7)。

::: tip
这是一个尚未完全标准化的属性，可能会在将来发生变化。这也意味着许多客户端可能会忽略此属性，直到他们理解它为止。
:::

### secure

指定 [Secure Set-Cookie 属性](https://tools.ietf.org/html/rfc6265#section-5.2.5)的布尔值。

当为真时，设置 Secure 属性，否则不设置。

默认情况下，不设置 Secure 属性。

::: tip
将其设置为 true 时要小心，因为符合规范的客户端将不会在未来将 Cookie 发送回服务器，如果浏览器没有 HTTPS 连接。
:::
