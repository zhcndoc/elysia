---
title: JWT 插件 - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: JWT 插件 - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia 的插件，增加在 Elysia 服务器中使用 JWT (JSON Web Token) 的支持。开始安装插件使用 "bun add @elysiajs/jwt"。

    - - meta
      - name: 'og:description'
        content: Elysia 的插件，增加在 Elysia 服务器中使用 JWT (JSON Web Token) 的支持。开始安装插件使用 "bun add @elysiajs/jwt"。
---

# JWT 插件
该插件增强了在 Elysia 处理程序中使用 JWT 的支持。

安装命令：
```bash
bun add @elysiajs/jwt
```

然后使用它：

::: code-group

```typescript [cookie]
import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

const app = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: 'Fischl von Luftschloss Narfidort'
        })
    )
    .get('/sign/:name', async ({ jwt, params: { name }, cookie: { auth } }) => {
    	const value = await jwt.sign({ name })

        auth.set({
            value,
            httpOnly: true,
            maxAge: 7 * 86400,
            path: '/profile',
        })

        return `以 ${value} 登入`
    })
    .get('/profile', async ({ jwt, status, cookie: { auth } }) => {
        const profile = await jwt.verify(auth.value)

        if (!profile)
            return status(401, '未授权')

        return `你好 ${profile.name}`
    })
    .listen(3000)
```

```typescript [headers]
import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

const app = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: 'Fischl von Luftschloss Narfidort'
        })
    )
    .get('/sign/:name', ({ jwt, params: { name } }) => {
    	return jwt.sign({ name })
    })
    .get('/profile', async ({ jwt, error, headers: { authorization } }) => {
        const profile = await jwt.verify(authorization)

        if (!profile)
            return status(401, '未授权')

        return `你好 ${profile.name}`
    })
    .listen(3000)
```

:::

## 配置
该插件扩展了 [jose](https://github.com/panva/jose) 的配置。

以下是插件接受的配置。

### name
注册 `jwt` 函数的名称。

例如，`jwt` 函数将以自定义名称注册。
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

因为有些人可能需要在同一服务器中使用多个具有不同配置的 `jwt`，因此显式使用不同名称注册 JWT 函数是必要的。

### secret
用于签署 JWT 负载的私钥。

### schema
对 JWT 负载进行严格的类型验证。

---
以下是扩展自 [cookie](https://npmjs.com/package/cookie) 的配置

### alg
@default `HS256`

用于签署 JWT 负载的签名算法。

可供 jose 使用的属性有：
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
发行者声明标识根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1) 签发 JWT 的主体。

简而言之：通常是签名者（域名）的名称。

### sub
主体声明标识 JWT 的主题。

JWT 中的声明通常是关于主题的语句，根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)

### aud
受众声明标识 JWT 预期的接收者。

每个预期处理 JWT 的主体必须在受众声明中以一个值标识自己，根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3)

### jti
JWT ID 声明提供 JWT 的唯一标识符，根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7)

### nbf
“未生效”声明标识 JWT 在处理之前不得被接受的时间，根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5)

### exp
过期时间声明标识在该时间之后不得被接受处理的 JWT，根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)

### iat
“签发时间”声明标识 JWT 被签发的时间。

该声明可用于确定 JWT 的年龄，根据 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6)

### b64
此 JWS 扩展头参数修改 JWS 负载表示和 JWS 签名输入计算，根据 [RFC7797](https://www.rfc-editor.org/rfc/rfc7797)。

### kid
指示用于保护 JWS 的密钥的提示。

该参数允许创建者显式信号向接收方变化密钥，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.4)

### x5t
(X.509 证书 SHA-1 指纹) 头参数是 X.509 证书的 DER 编码的 base64url 编码 SHA-1 摘要 [RFC5280](https://www.rfc-editor.org/rfc/rfc5280)，与用于数字签名 JWS 的密钥对应，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.7)

### x5c
(X.509 证书链) 头参数包含与用于数字签名 JWS 的密钥对应的 X.509 公钥证书或证书链 [RFC5280](https://www.rfc-editor.org/rfc/rfc5280)，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.6)

### x5u
(X.509 URL) 头参数是指向 X.509 公钥证书或证书链的 URI [RFC3986](https://www.rfc-editor.org/rfc/rfc3986)，其对应于用于数字签名 JWS 的密钥，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.5)

### jwk
“jku”（JWK 集 URL）头参数是一个 URI [RFC3986]，指向 JSON 编码公钥集合的资源，其中之一与用于数字签名 JWS 的密钥对应。

这些密钥必须作为 JWK 集 [JWK] 编码，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.2)

### typ
`typ`（类型）头参数由 JWS 应用程序用于声明该完整 JWS 的媒体类型 [IANA.MediaTypes]。

当应用程序中可能出现多种对象时，可以使用此内容，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.9)

### ctr
Content-Type 参数由 JWS 应用程序用于声明被保护内容（负载）的媒体类型 [IANA.MediaTypes]。

当 JWS 负载中可能存在多种对象时，这一内容用于该应用程序，根据 [RFC7515](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.9)

## 处理程序
以下是添加到处理程序中的值。

### jwt.sign
与 JWT 使用相关的动态对象集合，由 JWT 插件注册。

类型：
```typescript
sign: (payload: JWTPayloadSpec): Promise<string>
```

`JWTPayloadSpec` 接受与 [JWT 配置](#config) 相同的值。

### jwt.verify
使用提供的 JWT 配置验证负载。

类型：
```typescript
verify(payload: string) => Promise<JWTPayloadSpec | false>
```

`JWTPayloadSpec` 接受与 [JWT 配置](#config) 相同的值。

## 模式
以下是使用该插件的常见模式。

## 设置 JWT 过期时间
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

这将签署一个过期时间为接下来的 7 天的 JWT。