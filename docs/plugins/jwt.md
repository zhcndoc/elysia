---
title: JWT Plugin
head:
    - - meta
      - property: 'og:title'
        content: JWT Plugin - Elysia 中文文档

    - - meta
      - name: 'description'
        content: Elysia 插件，为 Elysia 服务器添加 JWT（JSON Web Token）支持。首先使用 "bun add @elysiajs/jwt" 安装该插件。

    - - meta
      - name: 'og:description'
        content: Elysia 插件，为 Elysia 服务器添加 JWT（JSON Web Token）支持。首先使用 "bun add @elysiajs/jwt" 安装该插件。
---

# JWT Plugin
该插件为 Elysia handler 添加了对 JWT 的支持。

安装方式：
```bash
bun add @elysiajs/jwt
```

使用方法：
```typescript
import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

const app = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: 'Fischl von Luftschloss Narfidort'
        })
    )
    .get('/sign/:name', async ({ jwt, cookie: { auth }, params }) => {
        auth.set({
            value: await jwt.sign(params),
            httpOnly: true,
            maxAge: 7 * 86400,
            path: '/profile',
        })

        return `以 ${auth.value} 的身份登录`
    })
    .get('/profile', async ({ jwt, set, cookie: { auth } }) => {
        const profile = await jwt.verify(auth.value)

        if (!profile) {
            set.status = 401
            return '未经授权'
        }

        return `你好，${profile.name}`
    })
    .listen(3000)
```

## 配置
该插件扩展了来自 [jose](https://github.com/panva/jose) 的配置。

下方是该插件接受的配置。

### name
用于注册 `jwt` 函数的名称。

例如，你可以使用自定义名称注册 `jwt` 函数。
```typescript
app
    .use(
        jwt({
            name: 'myJWTNamespace',
            secret: process.env.JWT_SECRETS!
        })
    )
    .get('/sign/:name', ({ myJWTNamespace, params }) => {
        return myJWTNamespace.sign(params)
    })
```

由于可能需要在单个服务器中使用多个具有不同配置的 `jwt` 函数，因此需要显式地使用不同的名称注册 JWT 函数。

### secret
用于使用私钥对 JWT 负载进行签名。

### schema
用于 JWT 负载的类型严格验证。

---
以下是扩展自 [cookie](https://npmjs.com/package/cookie) 的配置。

### alg
@default `HS256`

用于对 JWT 负载进行签名的签名算法。

jose 可能的属性有：
HS256
HS384
HS512
PS256
PS384
PS512
RS256
RS384
RS512
ES256
ES256K
ES384
ES512
EdDSA

### iss
发布者声明标识 JWT 的发布者，根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1)。

TLDR；通常是签名者的 (域) 名称。

### sub
主体声明标识 JWT 的主体。

JWT 中的声明通常是关于主题的陈述，根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)。

### aud
接收方声明标识 JWT 的预期接收方。

每个预期处理 JWT 的主体都必须在接收方声明中使用一个值来标识自己，根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3)。

### jtit
用于提供 JWT 的唯一标识符的 JWT ID 声明，根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7)。

### nbf
“不早于” 声明标识 JWT 不应在此之前接受处理的时间，根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5)。

### exp
过期时间声明标识 JWT 在此时间之后或之后不得接受处理，根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)。

### iat
“发布于” 声明标识 JWT 的发布时间。

此声明可用于确定 JWT 的年龄，根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6)。

### b64
此 JWS 扩展头部参数修改了 JWS 负载的表示方式和 JWS 签名输入计算，根据 [RFC7797](https://www.rfc-editor.org/rfc/rfc7797)。

### kid
提示指示用于保护 JWS 的密钥。

此参数允许发送方显式地向接收方发出密钥更改信号，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.4)。

### x5t
(X.509 证书 SHA-1 摘要) 头部参数是对用于数字签名 JWS 的密钥所对应的 X.509 证书的 DER 编码的 base64url 编码的 SHA-1 摘要，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.7)。

### x5c
(X.509 证书链) 头部参数包含与用于数字签名 JWS 的密钥对应的 X.509 公钥证书或证书链 [RFC5280](https://www.rfc-editor.org/rfc/rfc5280)，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.6)。

### x5u
(X.509 URL) 头部参数是一个指向用于数字签名 JWS 的密钥所对应的 X.509 公钥证书或证书链 [RFC5280] 资源的 URI [RFC3986](https://www.rfc-editor.org/rfc/rfc3986)，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.5)。

### jwk
“jku” (JWK 集 URL) 头部参数是一个指向用于数字签名 JWS 的密钥所对应的 JSON 编码的公钥集资源的 URI [RFC3986]。

密钥必须编码为 JWK Set [JWK]，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.2)。

### typ
“type” (类型) 头部参数由 JWS 应用程序用于声明此完整 JWS 的媒体类型 [IANA.MediaTypes]。

当应用程序数据结构中可能存在多种类型的对象且其中可以包含 JWS 时，该参数是应用程序使用的，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.9)。

### ctr
Content-Type 参数由 JWS 应用程序用于声明受保护内容 (负载) 的媒体类型 [IANA.MediaTypes]。

当 JWS 负载中可以包含多种对象时，该参数是应用程序使用的，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.9)。

## Handler
下方是添加到 handler 中的新增值。

### jwt.sign
与 JWT 相关的动态对象集合，由 JWT 插件注册。

类型：
```typescript
sign: (payload: JWTPayloadSpec) => Promise<string>
```

`JWTPayloadSpec` 接受与 [JWT 配置](#config)相同的值。

### jwt.verify
使用提供的 JWT 配置验证负载。

类型：
```typescript
verify: (payload: string) => Promise<JWTPayloadSpec | false>
```

`JWTPayloadSpec` 接受与 [JWT 配置](#config)相同的值。

## Pattern
下方是使用该插件的常见模式。

## 设置 JWT 过期日期
默认情况下，配置会传递给 `setCookie` 并继承其值。

```typescript
const app = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: 'kunikuzushi',
            exp: '7d'
        })
    )
    .get('/sign/:name', async ({ jwt, params }) => jwt.sign(params))
```

这将使用未来 7 天设置 JWT 的过期日期。